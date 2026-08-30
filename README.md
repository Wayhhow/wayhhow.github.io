# [Wayhhow](https://wayhhow.github.io)

> Systems developer · Map maker · Circuit tinkerer

Personal portfolio of **Weihao Wu (Wayhhow)** — redesigned as a riso-print editorial poster: warm paper, oversized ink typography, one hot accent, and hand-drawn graphic doodles. No neon, no particles.

## 站点

🔗 **https://wayhhow.github.io**

## 设计

- **方向**：Riso 印刷海报 × 编辑排版（参考 Awwwards Sites of the Year 与 chungiyoo.com 的插画驱动风格）
- **字体**：Anton（展示标题）· Instrument Serif（斜体点缀）· Space Grotesk（正文）· Space Mono（标注）
- **色彩**：暖纸色 `#f2ede3` / 墨黑 `#181510` / 橘红 `#e8492a`，辅以钴蓝与芥末黄
- **图形**：全部为内联 SVG 手绘涂鸦（箭头、星光、花朵、地球、旋转徽章）+ 按项目生成的 riso 风格封面
- **动效**：预加载器、逐字标题入场、无限 marquee、滚动显现、hover 反色 + 悬浮封面、自定义光标、点击星光迸发（尊重 `prefers-reduced-motion`）

## 技术

纯静态、零依赖：`index.html` + `style.css` + `script.js`，部署于 GitHub Pages。

- `data.json` 由 GitHub Actions 每小时自动拉取 GitHub API 更新（stars / repos / languages / contributions / projects），前端读取后渲染；拉取失败时使用内置快照兜底。
- `.github/workflows/update-data.yml`：定时更新数据并直接部署 Pages。

## 本地预览

```bash
python -m http.server 8123
# 打开 http://127.0.0.1:8123
```

---

*© 2025–2026 Weihao Wu · Designed on paper, shipped with code.*
