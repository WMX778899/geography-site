# 恢复原始样式指南

由于改动涉及多个文件且内容较多，我为你准备了恢复方案。你可以选择以下方式之一：

## 🎯 推荐方案：手动恢复关键部分

### 方案一：使用 Git（如果你之前有提交）

```bash
# 查看当前状态
git status

# 恢复到初始状态
git checkout -- css/style.css js/app.js knowledge/*.html

# 或者恢复到最后一次提交
git reset --hard HEAD
```

### 方案二：手动恢复关键代码

#### 1. 恢复侧边栏样式 (css/style.css)

**找到并删除**以下内容：
- 第 1250-1680 行左右的"智慧树风格优化"部分
- 包括：
  - `.sidebar__progress` 及其所有子元素
  - `.sidebar__toc-item`
  - `.sidebar__toc-link`
  - `.sidebar__toc-badge`
  - `.chapter-status`
  - `.sidebar::-webkit-scrollbar` 滚动条样式
  - `.importance-badge` 及其变体
  - `.knowledge-point::before` 阅读状态标记
  - `.knowledge-point.read`
  - `.page--* .sidebar__title` 主题色适配

**替换为原始样式**：
```css
/* ===== Knowledge Page Layout ===== */
.knowledge-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
}

/* Sidebar */
.sidebar {
    position: sticky;
    top: 120px;
    align-self: start;
}

.sidebar__title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-nature-dk);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--color-nature);
}

.sidebar__toc {
    background: rgba(255, 255, 255, 0.90);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-border);
    overflow: hidden;
}

.sidebar__toc a {
    display: block;
    padding: 10px 16px;
    font-size: 0.9rem;
    color: var(--color-text);
    border-left: 3px solid transparent;
    transition: var(--transition);
}

.sidebar__toc a:hover,
.sidebar__toc a.active {
    background: var(--color-bg);
    border-left-color: var(--color-nature);
    color: var(--color-nature);
}

.sidebar__channel {
    margin-top: 20px;
    background: var(--grad-region);
    border-radius: var(--radius-md);
    padding: 20px;
    color: var(--color-white);
    text-align: center;
}

.sidebar__channel p {
    font-size: 0.85rem;
    margin-bottom: 12px;
    opacity: 0.9;
}

.sidebar__channel a {
    display: inline-block;
    padding: 8px 20px;
    background: var(--color-white);
    color: var(--color-region-dk);
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.9rem;
    transition: var(--transition);
}

.sidebar__channel a:hover {
    background: #f0f7ff;
}
```

#### 2. 恢复知识点样式 (css/style.css)

**替换** `.knowledge-point` 相关样式为：
```css
.knowledge-point {
    margin-bottom: 16px;
    padding: 12px 16px;
    background: rgba(247, 248, 250, 0.85);
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--color-nature-lt);
    cursor: pointer;
    transition: background var(--transition), padding var(--transition), margin var(--transition);
    user-select: none;
}

.knowledge-point:hover {
    background: #f0fdf4;
}

.knowledge-point.collapsed {
    padding: 8px 16px;
}

.knowledge-point__title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color var(--transition);
}

.knowledge-point__title::after {
    content: "▸";
    font-size: 0.8rem;
    color: var(--color-text-light);
    transition: transform 0.25s ease, content 0.25s ease;
    flex-shrink: 0;
}

.knowledge-point:not(.collapsed) .knowledge-point__title::after {
    content: "▾";
    transform: rotate(180deg);
}

.knowledge-point.collapsed .knowledge-point__title::after {
    transform: rotate(0deg);
}

.knowledge-point__text {
    font-size: 0.9rem;
    color: var(--color-text);
    line-height: 1.7;
    max-height: 2000px;
    overflow: hidden;
    transition: max-height 0.35s ease, opacity 0.3s ease;
    opacity: 1;
}

.knowledge-point.collapsed .knowledge-point__text {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
}

.knowledge-point__text strong {
    color: var(--color-nature);
}
```

#### 3. 恢复侧边栏链接动画部分

**删除**以下代码块（约 1750-1770 行）：
```css
/* 侧边栏链接动画 */
.sidebar__toc a {
    display: block;
    padding: 10px 16px;
    font-size: 0.9rem;
    color: var(--color-text);
    border-left: 3px solid transparent;
    transition: var(--transition);
    animation: iconDropIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    animation-delay: 0.25s;
    opacity: 0;
}

.sidebar__toc a:nth-child(2) { animation-delay: 0.3s; }
.sidebar__toc a:nth-child(3) { animation-delay: 0.35s; }
.sidebar__toc a:nth-child(4) { animation-delay: 0.4s; }
.sidebar__toc a:nth-child(5) { animation-delay: 0.45s; }
.sidebar__toc a:nth-child(6) { animation-delay: 0.5s; }
```

#### 4. 恢复 JavaScript 代码 (js/app.js)

**删除**以下函数（约第 480-650 行）：
- 整个 `initReadingTracker()` 函数
- 包括内部的 `getReadPoints()`, `saveReadPoint()`, `updateProgress()`

**简化** `highlightSidebar()` 函数为：
```javascript
// ===== 侧边栏章节高亮 =====
function highlightSidebar() {
    const tocLinks = document.querySelectorAll('.sidebar__toc a');
    if (tocLinks.length === 0) return;

    // 如果有锚点，自动滚动到对应位置
    tocLinks.forEach(link => {
        link.addEventListener('click', () => {
            tocLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}
```

**恢复** `initAllFeatures()` 函数：
```javascript
/**
 * 初始化所有页面功能（移动端导航、搜索、折叠、侧边栏、锚点）
 * 可在页面切换后重新调用
 */
function initAllFeatures() {
    initMobileNav();
    initSearch();
    initCollapse();
    highlightSidebar();
    checkAnchor();
    triggerPageAnimations();
}
```

#### 5. 恢复 HTML 侧边栏结构

**对于每个知识页面** (nature.html, humanity.html, region.html, elective.html)：

**删除**侧边栏中的进度指示器部分：
```html
<!-- 学习进度 -->
<div class="sidebar__progress">
    ...
</div>
```

**简化**侧边栏导航为原始结构：
```html
<aside class="sidebar">
    <div class="sidebar__toc">
        <div class="sidebar__title">章节导航</div>
        <a href="#sec1">第一章 地球运动</a>
        <a href="#sec2">第二章 大气环境</a>
        ...
    </div>
    <div class="sidebar__channel">
        <p>📰 了解更多中国地理知识</p>
        <a href="https://www.dili360.com" target="_blank">访问中国国家地理</a>
    </div>
</aside>
```

## 🚀 快速恢复脚本

如果你熟悉命令行，可以使用以下 PowerShell 命令快速恢复：

```powershell
# 备份当前文件
Copy-Item "css/style.css" "css/style.css.backup"
Copy-Item "js/app.js" "js/app.js.backup"
Copy-Item "knowledge\nature.html" "knowledge\nature.html.backup"
Copy-Item "knowledge\humanity.html" "knowledge\humanity.html.backup"
Copy-Item "knowledge\region.html" "knowledge\region.html.backup"
Copy-Item "knowledge\elective.html" "knowledge\elective.html.backup"

Write-Host "备份完成！"
```

## 📝 保留的内容

以下优化**不需要恢复**（如果你想保留的话）：

### ✅ 页面切换优化
- 预加载机制
- 页面缓存
- 淡入淡出动画
- 加载进度条

### ✅ 文字清晰度修复
- `.page-header p` 背景色加深
- 四个页面的描述文字样式优化

## 🔄 完全恢复（推荐）

如果你想**彻底恢复**到最初始的状态（没有任何优化），最简单的方法是：

1. **从备份恢复**（如果你有备份）
2. **重新下载原始文件**（如果是从某个仓库克隆的）
3. **手动对照我提供的"恢复后关键代码"逐个替换**

## ⚠️ 注意事项

1. **备份重要**：恢复前务必备份当前文件
2. **分步恢复**：建议逐个文件恢复，测试无误后再处理下一个
3. **保留需要的优化**：页面切换优化和文字清晰度修复是有益的，可以考虑保留

## 🎯 下一步

恢复完成后，建议：
1. 清除浏览器缓存
2. 测试所有页面是否能正常显示
3. 测试导航、搜索、折叠功能是否正常
4. 检查移动端响应式

---

**提示**：如果你觉得手动恢复太复杂，我可以帮你准备一个完整的恢复脚本或提供一个更简洁的方案。请告诉我你的选择！
