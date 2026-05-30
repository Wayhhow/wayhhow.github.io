# 修复 Action 自动更新贡献热力图问题

## 问题概述

GitHub Actions 定时任务 (`update-data.yml`) 每次运行时，贡献热力图数据没有正确自动更新。当前 `data.json` 中的贡献数据最新日期停留在 `2026-05-29`，但用户感觉 action 没有自动更新热力图。

## 根因分析

### 1. 数据流追踪

贡献数据的获取流程：
1. `fetchContribData()` 调用 `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}` 获取原始贡献数据
2. 对原始数据进行完整性检查：`recentDays < 300` 则返回 `{}`
3. 主逻辑中 `contribData` 被过滤：`date >= cutoffDate && date <= updated`
4. 如果 `filteredContrib` 为空，则保留旧的 `data.json` 中的贡献数据

### 2. 发现的关键 Bug

**Bug 1: 主 API 数据完整性检查过于严格（最可能原因）**

```javascript
// update-data.yml 第 89-101 行
const recentDays = Object.keys(contrib).filter(d => d >= cutoffDate).length;
if (recentDays < 300) {
  console.warn('Primary API data appears incomplete (< 300 days), falling back to GraphQL');
  return {};
}
```

问题：第三方 API `github-contributions-api.jogruber.de` 返回的数据可能不包含完整的 365 天数据（比如只返回有贡献的日期，没有贡献的日期不返回）。`recentDays < 300` 这个检查会把很多正常情况误判为"数据不完整"，导致返回 `{}`。

当 `fetchContribData()` 返回 `{}` 时：
- `filteredContrib` 为空
- 触发保留旧数据的逻辑（第 226-235 行）
- **结果：贡献数据永远不会更新！**

**Bug 2: 日期范围过滤逻辑问题**

```javascript
// 第 192-199 行
const oneYearAgo = new Date();
oneYearAgo.setDate(oneYearAgo.getDate() - 365);
const cutoffDate = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth()+1).padStart(2,'0')}-${String(oneYearAgo.getDate()).padStart(2,'0')}`;
const filteredContrib = {};
Object.entries(contribData)
  .filter(([date]) => date >= cutoffDate && date <= updated)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([date, count]) => { filteredContrib[date] = count; });
```

问题：
- `cutoffDate` 和 `updated` 的日期格式是 `YYYY-M-D` 或 `YYYY-MM-DD`，字符串比较在月份/日期补零时才能正确排序
- 如果 `contribData` 为空（Bug 1 导致），过滤后也是空的

**Bug 3: 前端渲染逻辑与数据不匹配**

```javascript
// index.html 第 1462-1479 行
function renderContribGraph() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 364);
  // ...
  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = `${year}-${month}-${day}`;  // 格式: YYYY-M-D (没有补零!)
    const count = (siteData && siteData.contributions && siteData.contributions[dateStr]) || 0;
  }
}
```

问题：
- 前端生成日期字符串时**没有补零**（例如 `2026-1-1`）
- 但 `data.json` 中的日期键是**补零的**（例如 `2026-01-01`）
- **这导致前端永远找不到匹配的贡献数据！**

对比：
- 前端生成的键：`"2026-5-30"`
- data.json 中的键：`"2026-05-30"`
- 这两个字符串不相等，所以 `siteData.contributions[dateStr]` 永远是 `undefined`

### 3. 为什么用户觉得"每次都不自动更新"

1. Action 运行时，`fetchContribData()` 可能因 API 数据格式问题返回 `{}`
2. 空数据触发保留旧数据逻辑
3. 即使 data.json 有数据，前端由于日期格式不匹配也渲染不出来
4. 所以热力图看起来永远是空的/不更新的

## 修复方案

### 修复 1: 放宽数据完整性检查（update-data.yml）

将 `recentDays < 300` 的检查改为更合理的逻辑。第三方 API 只返回有贡献的日期，所以不能用返回的键数量来判断完整性。

```javascript
// 修改前
const recentDays = Object.keys(contrib).filter(d => d >= cutoffDate).length;
console.log(`Primary API returned ${recentDays} days of contribution data`);
if (recentDays < 300) {
  console.warn('Primary API data appears incomplete (< 300 days), falling back to GraphQL');
  return {};
}

// 修改后
const totalDays = Object.keys(contrib).length;
console.log(`Primary API returned ${totalDays} total days of contribution data`);
// 只要 API 返回了数据就使用，不再强制要求 300 天
if (totalDays === 0) {
  console.warn('Primary API returned no contribution data, falling back to GraphQL');
  return {};
}
```

### 修复 2: 统一日期格式（index.html）

前端生成日期字符串时必须补零，与 data.json 格式一致。

```javascript
// 修改前
const dateStr = `${year}-${month}-${day}`;

// 修改后
const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
```

### 修复 3: 增强日志输出（update-data.yml）

添加更详细的日志，方便排查问题：
- 输出 API 返回的数据样本
- 输出过滤前后的数据量
- 输出是否保留了旧数据

## 实施步骤

1. 修改 `.github/workflows/update-data.yml`：
   - 放宽 `fetchContribData()` 中的数据完整性检查
   - 添加更详细的日志

2. 修改 `index.html`：
   - 修复 `renderContribGraph()` 中的日期格式生成逻辑，确保补零

3. 验证修复：
   - 本地测试前端渲染逻辑
   - 确认日期键能正确匹配
