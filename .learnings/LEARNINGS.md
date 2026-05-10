# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260510-005] correction

**Logged**: 2026-05-10T08:40:00Z
**Priority**: critical
**Status**: resolved
**Area**: infra

### Summary
GitHub Actions 环境抓取 `github.com/users/{user}/contributions` HTML 页面返回的 HTML 里没有 `data-count` 属性，导致抓到的 `REAL_CONTRIB_DATA` 为空，整个热力图所有格子都是灰色。

### Details
工作流的 `fetchContribData()` 函数用正则 `/data-date="..."\s+data-count="..."/` 去匹配 GitHub 贡献页 HTML。但 GitHub 的贡献页在服务器端渲染，数据并不嵌入在 HTML 的 `data-count` 属性里——这些格子可能是 JavaScript 动态渲染的，或者 HTML 里根本没有这些属性。结果是 `REAL_CONTRIB_DATA = {}`，所有格子 level 都是 0，热力图完全空白。

**根因**：GitHub 贡献页的 HTML 在非浏览器环境下（Node.js fetch）不会包含动态渲染的格子数据。

**正确方案**：使用第三方 API `https://github-contributions-api.jogruber.de/v4/{username}`，这个 API 返回 JSON 格式的真实贡献数据，不依赖浏览器渲染。

### Suggested Action
抓取 GitHub 贡献数据不要用 `github.com/users/.../contributions` HTML 页面解析，直接用 `github-contributions-api.jogruber.de` 或 GitHub GraphQL API。

### Metadata
- Source: error_recovery
- Related Files: .github/workflows/update-data.yml, index.html
- Tags: github-actions, web-scraping, api
- Pattern-Key: infra.github_contrib_scraping
- Recurrence-Count: 1

---

## [LRN-20260510-004] correction

**Logged**: 2026-05-10T08:30:00Z
**Priority**: critical
**Status**: resolved
**Area**: frontend

### Summary
CSS `min-height: 100vh` 导致弹性布局（flex/grid）中元素之间出现无法消除的大空白。

### Details
`.hero` 设置了 `min-height: 100vh` + `display: flex` + `flex-direction: column`，子元素用 `margin` 控制间距。在这种组合下，`min-height: 100vh` 强制 hero 容器撑到至少一整屏高度，即使实际内容远小于 100vh。子元素的 `margin-bottom` 无法改变这个基线——底部空白由容器自身 `min-height` 决定，而非子元素的间距。

**症状**：访客计数器（hero 的最后一个子元素）离 Language Distribution（hero 外的下一个区块）之间出现超大空白（约 40vh）。

**错误修复路径**：
- 第一次：加 `.hero-visitor-counter { margin-bottom: 48px }` → 无效
- 第二次：改 `.hero { justify-content: flex-start }` + 改 `padding-bottom` → 无效（容器基线不变）
- 第三次：改 `.hero { justify-content: center }` → 空白移到访客计数器下方（因为居中了）
- **正确修复**：移除 `.hero { min-height: 100vh }`，让容器自适应内容高度

### Suggested Action
当 flex 容器用 `margin` 控制子元素间距时，如果出现无法解释的大空白，先检查容器是否有 `min-height` / `height` 的固定值限制。这些固定高度会覆盖弹性布局的正常流动。

### Metadata
- Source: user_feedback
- Related Files: /workspace/index.html
- Tags: css, flexbox, layout, min-height
- Pattern-Key: frontend.css_min_height_flex_gap
- Recurrence-Count: 3
- See Also: LRN-20260509-002

---

## [LRN-20260509-002] correction

**Logged**: 2026-05-09T08:10:00Z
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
`element.focus()` 在页面加载后自动调用会导致浏览器滚动到该元素，覆盖 `scrollIntoView` 的效果。

### Details
`termInput.focus()` 在 boot 动画结束后（4秒后）自动执行，会让浏览器自动将视口滚动到 terminal 输入框位置，覆盖之前 `hero.scrollIntoView()` 保持的顶部效果。用户反映"有时候进入界面后没操作时，自己跳到 terminal 输入框"。

**正确做法**：删除自动 `focus()`，只保留点击 terminal 时的聚焦：
```javascript
// ✓ 正确：只在用户点击时才聚焦
document.getElementById('termEl').addEventListener('click', () => termInput.focus());
// ✗ 错误：页面加载时自动聚焦，会覆盖 scrollIntoView
termInput.focus(); // 不要在 initAll() 里调用
```

### Metadata
- Source: user_feedback
- Related Files: /workspace/index.html
- Tags: javascript, focus, scroll, ui-bug
- Pattern-Key: frontend.focus_scroll_conflict
- Recurrence-Count: 1

---

## [LRN-20260510-003] best_practice

**Logged**: 2026-05-10T00:00:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
访客计数器优化：先显示缓存值，再异步更新，避免阻塞页面加载。

### Details
用户反映页面加载卡顿，原因是访客计数器等待 Cloudflare Worker API 返回后才显示。优化方案：
1. 页面加载时立即显示 localStorage 中保存的上次数字（`wh_last_count`）
2. 同时异步请求 API
3. API 返回后更新显示并保存新值到 localStorage

**实现代码**：
```javascript
const savedCount = parseInt(localStorage.getItem('wh_last_count') || '1', 10);
updateUI(savedCount);  // 立即显示
counterEl.style.display = '';

// 后台更新
fetch(workerUrl, { method: 'POST' })
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('wh_last_count', data.count);
    updateUI(data.count);  // API 返回后更新
  });
```

### Metadata
- Source: user_feedback
- Related Files: /workspace/index.html
- Tags: performance, api, caching, ui
- Pattern-Key: frontend.async_ui_update
- Recurrence-Count: 1

---

## [LRN-20260510-002] best_practice

**Logged**: 2026-05-10T00:00:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Summary
打字机效果优化：使用 `requestAnimationFrame` 替代 `setTimeout`，避免阻塞主线程。

### Details
原来的打字机效果使用 `setTimeout(tick, 18)` 递归调用，虽然看起来是异步的，但密集的 setTimeout 调用会抢占主线程时间片，导致页面加载卡顿。

**优化前**：
```javascript
function tick() {
  bioEl.textContent = BIO_TEXT.slice(0, ++i);
  setTimeout(tick, 18);  // 密集调用阻塞主线程
}
```

**优化后**：
```javascript
function tick(currentTime) {
  if (!lastTime) lastTime = currentTime;
  if (currentTime - lastTime >= speed) {
    bioEl.textContent = BIO_TEXT.slice(0, ++i);
    lastTime = currentTime;
  }
  requestAnimationFrame(tick);  // 与浏览器渲染同步，不阻塞
}
```

### Metadata
- Source: user_feedback
- Related Files: /workspace/index.html
- Tags: animation, performance, requestAnimationFrame
- Pattern-Key: frontend.animation_performance
- Recurrence-Count: 1

---

## [LRN-20260510-001] best_practice

**Logged**: 2026-05-10T00:00:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Summary
热力图自动滚动到最新数据：使用 `requestAnimationFrame` 确保 DOM 渲染完成后再滚动。

### Details
移动端热力图默认显示最左边（最早数据），用户需要手动滑动才能看到最新贡献。解决方案：在 `renderContribGraph()` 完成后，使用 `requestAnimationFrame` 将容器滚动到最右侧。

**实现代码**：
```javascript
function renderContribGraph() {
  // ... 渲染逻辑
  requestAnimationFrame(() => {
    const container = document.getElementById('contrib-wrapper');
    if (container) container.scrollLeft = container.scrollWidth;
  });
}
```

### Metadata
- Source: user_feedback
- Related Files: /workspace/index.html
- Tags: mobile, scroll, visualization
- Pattern-Key: frontend.scroll_to_end
- Recurrence-Count: 1

---

## [LRN-20260509-001] best_practice

**Logged**: 2026-05-09T00:00:00Z
**Priority**: critical
**Status**: pending
**Area**: frontend

### Summary
JavaScript module-level DOM refs (`const x = document.getElementById(...)`) run BEFORE the functions that USE them are defined, causing silent failures when elements are missing from static HTML.

### Details
In `/workspace/index.html`, `const termBody = document.getElementById('termBody')` and `const termInput = document.getElementById('termInput')` are module-level. When the script executes, these are evaluated immediately — if the elements don't exist in the static HTML yet (e.g. `<section id="terminal">` is below `<script>`), they silently become `null`. Later, `termInput.focus()` in `initAll()` does nothing (no-op on null). This pattern is dangerous because it fails silently without any error thrown.

**Root cause of Featured Projects empty bug**: When `fetchGitHubData()` had an unhandled rejection path that wasn't caught by `.catch()`, the entire `.then()` chain was skipped. Adding `.catch()` with the same render calls fixed it — but the debugging was extremely time-consuming because JS errors in GitHub Pages served via GitHub's CDN can be harder to trace.

**Key insight**: Module-level DOM refs evaluated before element existence is checked. Pattern: always verify elements exist before use.

### Suggested Action
1. Move all `document.getElementById` calls inside the functions that need them, OR
2. Use `document.addEventListener('DOMContentLoaded', ...)` wrapper for all module-level refs
3. Always add `console.log` / `console.error` at entry points of async chains
4. For GitHub Pages debugging: check browser console (F12) since network/CDN errors don't show in terminal

### Metadata
- Source: conversation
- Related Files: /workspace/index.html
- Tags: javascript, dom, async, github-pages
- Pattern-Key: frontend.dom_safety
- Recurrence-Count: 4

---

## [LRN-20260510-006] correction

**Logged**: 2026-05-10T09:10:00Z
**Priority**: high
**Status**: resolved
**Area**: infra

### Summary
GitHub Actions 无认证 API 速率限制导致语言统计数据不完整，工作流只抓到了 3 种语言而非真实的所有语言。

### Details
工作流在 GitHub Actions CI 环境中用无认证的 GitHub REST API（60 req/hour）获取所有非 fork 仓库的语言字节数据。当 CI 环境 IP 已经被限速时，`fetchJSON(repo.languages_url)` 返回 `null`（网络错误或 403），这些仓库的语言数据被静默跳过。结果：4 个非 fork 仓库中只有 2 个成功获取到语言数据，导致语言分布只有 3 种（HTML/JavaScript/CSS），Java/Dockerfile/Shell 等语言完全缺失。

**错误代码**：
```javascript
const langs = await fetchJSON(repo.languages_url);
if (!langs) continue;  // 静默跳过，不记录日志
```

**真实仓库语言字节统计**（直接查询，非 CI 环境）：
| 仓库 | 语言 | 字节 |
|------|------|------|
| wayhhow.github.io | HTML | 64928 |
| wayhhow.github.io | JavaScript | 513 |
| survey-map | JavaScript | 34702 |
| survey-map | CSS | 24561 |
| survey-map | HTML | 6963 |
| electric-bike-system-for-display | HTML | 50398 |
| NewBingGoGo-MagicURL-java | Java | 12367 |
| NewBingGoGo-MagicURL-java | Dockerfile | 173 |
| NewBingGoGo-MagicURL-java | Shell | 91 |

**正确结果**：HTML 56%, JavaScript 21%, CSS 13%, Java 6%, Dockerfile 1%, Shell 2% — 共 6 种语言。

### Suggested Action
1. 工作流中添加日志记录每个 `fetchJSON` 的成功/失败状态，便于事后排查
2. 对于语言统计这类重要数据，可以考虑增加重试逻辑（延迟 1-2 秒后重试 1-2 次）
3. 工作流正则改为包含注释行的完整块，避免多行匹配问题

### Metadata
- Source: user_feedback
- Related Files: index.html, .github/workflows/update-data.yml
- Tags: github-actions, api, rate-limit, regex
- Pattern-Key: infra.github_api_rate_limit_ci
- Recurrence-Count: 1

---

## [LRN-20260510-008] correction

**Logged**: 2026-05-10T09:30:00Z
**Priority**: critical
**Status**: resolved
**Area**: infra

### Summary
工作流正则和 HTML 注释文本不一致，导致 PROJECTS 数据从未被自动更新过。

### Details
工作流中 PROJECTS 的替换正则是 `/\/\/ Featured Projects data[\s\S]*?\];/`，但 HTML 中的实际注释是 `// Projects`（简短注释，没有 "Featured Projects data"）。正则完全不匹配，导致每次 GitHub Actions 运行，PROJECTS 数组始终是旧的静态数据，只有手动编辑才会改变。

**排查方法**：用 Node.js 在本地对 HTML 文件逐个运行每个正则的 `.match()`，验证是否能正确匹配目标文本。

**正确做法**：让 HTML 注释文本与工作流正则完全对应，或将正则改为能匹配更宽泛模式的模式（例如 `/\/\/ Projects[\s\S]*?const PROJECTS/`）。

### Metadata
- Source: error_recovery
- Related Files: index.html, .github/workflows/update-data.yml
- Tags: regex, github-actions, data-stale
- Pattern-Key: infra.regex_comment_mismatch
- Recurrence-Count: 1

---

## [LRN-20260510-009] correction

**Logged**: 2026-05-10T10:15:00Z
**Priority**: critical
**Status**: resolved
**Area**: frontend

### Summary
访客计数器 catch 块使用本地 localStorage 累加作为降级方案，导致手机和电脑显示不同数字。

### Details
当 Cloudflare Worker 请求失败（网络问题或 Worker 不可用）时，catch 块执行：
```javascript
const local = (parseInt(localStorage.getItem('wh_local_count') || '0') + 1;
localStorage.setItem('wh_local_count', local);
updateUI(local);  // 每个设备各自累加，计数不一致！
```
`localStorage` 是每个设备独立的（手机 ≠ 电脑），导致降级时手机和电脑各自从 0 开始累加，结果完全不同。

### Suggested Action
请求失败时**不降级累加**，只保留上次缓存值即可：
```javascript
.catch(() => {
  // 不做任何事，保持显示上次的 cached count
});
```
云服务 Worker 通常稳定性很高，不需要本地降级计数。

### Metadata
- Source: user_feedback
- Related Files: index.html
- Tags: localStorage, counter, cross-device, bug
- Pattern-Key: frontend.local_counter_cross_device
- Recurrence-Count: 1

---

## [LRN-20260510-010] correction

**Logged**: 2026-05-10T11:00:00Z
**Priority**: critical
**Status**: resolved
**Area**: frontend

### Summary
访客计数器初始化时直接显示 localStorage 默认值 1，导致新设备访问时显示错误的计数（应该从 Cloudflare Worker 获取真实值）。

### Details
原代码：
```javascript
const savedCount = parseInt(localStorage.getItem('wh_last_count') || '1', 10);
updateUI(savedCount);  // 新设备显示 1，这是错误的！
```

问题在于：
1. `localStorage` 是每个设备独立的，新设备没有缓存值
2. 默认值设为 `'1'` 导致新设备显示 1
3. 计数器应该从远程 Worker 获取真实的全局计数

### 修复方案
```javascript
const savedCount = parseInt(localStorage.getItem('wh_last_count') || '0', 10);
if (savedCount > 0) {
  updateUI(savedCount);  // 有缓存值才显示
}
// 否则等待 Worker 返回真实值后再显示
fetch('https://wayhhow-visitors.wwh2972506943.workers.dev', { method: 'POST' })
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('wh_last_count', data.count);
    updateUI(data.count);
  });
```

同时静态 HTML 设置为 `style="display: none;"`，初始值为 0。

### Metadata
- Source: user_feedback
- Related Files: index.html
- Tags: localStorage, counter, initialization, bug
- Pattern-Key: frontend.cache_default_value_bug
- Recurrence-Count: 1

---

## [LRN-20260510-007] correction

**Logged**: 2026-05-10T09:10:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Summary
百分比取整（`Math.round`）导致语言分布总计不到 100%，最后一个语言应适当上取整补偿。

### Details
GitHub 语言字节数按百分比取整时，单独四舍五入会产生舍入误差累计，导致总计不是 100%。例如 174922 总字节，Shell 为 91 字节，`91/174922*100 = 0.052%`，`Math.round(0.052) = 0`，导致总和 = 56+21+13+6+1+0 = 97%。

**解决方案**：将百分比数组的总和与 100 的差值加到占比最小的最后一项上：
```javascript
const total = langStats.reduce((s, l) => s + l.pct, 0);  // 例如 97
if (total < 100) langStats[langStats.length - 1].pct += (100 - total);  // 最后一项补差
```

### Metadata
- Source: error_recovery
- Related Files: index.html
- Tags: javascript, percentage, rounding
- Pattern-Key: frontend.percent_rounding_sum
- Recurrence-Count: 1

---
