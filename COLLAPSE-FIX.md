# 折叠状态闪烁问题修复

## ❌ 问题描述

**现象**：在四个子页面（自然/人文/区域/选修）之间切换时，知识点偶尔会先显示为展开状态，然后才开始收缩折叠。

**原因**：
1. 页面切换使用 AJAX 加载新页面HTML
2. 新HTML插入到DOM时，知识点是展开状态（没有 `.collapsed` 类）
3. `initCollapse()` 函数才开始执行，添加 `.collapsed` 类
4. 用户看到了"展开 → 折叠"的过渡动画

## ✅ 修复方案

### 方案：预加载时应用折叠状态

**核心思路**：在HTML插入DOM之前，就预先应用好正确的折叠状态。

### 修改位置
`js/app.js` - `initPageTransitions()` 函数

### 具体步骤

```javascript
// 1. 解析新页面HTML
const doc = new DOMParser().parseFromString(req.responseText, 'text/html');
const newBody = doc.body;

// 2. 如果是知识页面，预先处理折叠状态
if (url.includes('knowledge/')) {
    const pageKey = url.split('/').pop().replace('.html', '');
    const saved = getCollapsedState(pageKey);
    const allPoints = newBody.querySelectorAll('.knowledge-point');

    // 先全部折叠
    allPoints.forEach(point => point.classList.add('collapsed'));

    // 再根据 localStorage 恢复展开状态
    if (saved.size > 0) {
        allPoints.forEach((point, index) => {
            const section = point.closest('.content-section');
            const sectionId = section ? section.id : null;
            const key = `${pageKey}:${sectionId}:${index}`;

            if (!saved.has(key)) {
                point.classList.remove('collapsed');
            }
        });
    }
}

// 3. 此时HTML已经带有正确的collapsed类
// 4. 插入到DOM
document.body.innerHTML = newBody.innerHTML;

// 5. 初始化功能（包括折叠事件监听）
initAllFeatures();
```

### 配合修改

同时优化了 `initCollapse()` 函数的逻辑：

```javascript
function initCollapse() {
    // ...
    points.forEach(point => {
        // 确保状态正确（双重保险）
        if (saved.size > 0 && saved.has(key)) {
            point.classList.add('collapsed');
        } else if (saved.size === 0) {
            // 默认折叠
            point.classList.add('collapsed');
        }

        // 添加点击事件监听
        point.addEventListener('click', (e) => {
            // ...
        });
    });
}
```

## 📊 修复效果

### 修复前
```
页面切换 → HTML插入DOM（知识点展开）
         → initCollapse() 执行
         → 添加 collapsed 类
         → ❌ 用户看到收缩动画
```

### 修复后
```
页面切换 → 解析HTML
         → 预先应用折叠状态
         → HTML插入DOM（知识点已折叠/展开）
         → initCollapse() 执行（状态已正确）
         → ✅ 用户直接看到最终状态
```

## 🔄 状态同步逻辑

### localStorage 存储规则
- `saved.add(key)` → 该知识点已折叠
- `saved.delete(key)` → 该知识点已展开

### 初始化状态判断
```javascript
if (saved.size > 0 && saved.has(key)) {
    // 折叠
    point.classList.add('collapsed');
} else if (saved.size === 0) {
    // 默认折叠（首次访问）
    point.classList.add('collapsed');
}
// else: 保持展开
```

### 三种场景

| 场景 | localStorage | 最终状态 |
|------|--------------|----------|
| 首次访问 | 空 | ✅ 全部折叠 |
| 上次折叠 | 有key | ✅ 保持折叠 |
| 上次展开 | 无key | ✅ 保持展开 |

## 🎯 修复范围

- ✅ **自然地理页面**（nature.html）
- ✅ **人文地理页面**（humanity.html）
- ✅ **区域地理页面**（region.html）
- ✅ **选修专题页面**（elective.html）
- ✅ **首页**（不受影响，因为没有知识点折叠）

## 🧪 测试建议

### 测试场景1：首次访问
1. 清除浏览器缓存和 localStorage
2. 访问任意知识页面
3. ✅ 所有知识点应该都是折叠的

### 测试场景2：状态保持
1. 展开"地球运动"章节的某个知识点
2. 切换到"人文地理"页面
3. 再切换回"自然地理"页面
4. ✅ "地球运动"的知识点应该保持展开

### 测试场景3：页面切换
1. 快速在四个知识页面之间切换
2. ✅ 每次切换后，知识点应该是正确的折叠/展开状态
3. ✅ 不应该出现收缩动画

### 测试场景4：刷新页面
1. 展开某些知识点
2. 刷新页面（F5）
3. ✅ 展开的知识点应该保持展开

## 💡 技术细节

### 关键点1：在DOM插入前处理
```javascript
// 在 document.body.innerHTML = newBody.innerHTML 之前
// 就修改 newBody 中的 DOM
allPoints.forEach(point => point.classList.add('collapsed'));
```

### 关键点2：双重保险
```javascript
// initCollapse() 中再次确保状态正确
if (saved.size > 0 && saved.has(key)) {
    point.classList.add('collapsed');
}
```

### 关键点3：区分"未保存"和"已展开"
```javascript
// saved.size === 0 → 首次访问 → 默认折叠
// saved.size > 0 && saved.has(key) → 保存了折叠状态 → 折叠
// saved.size > 0 && !saved.has(key) → 保存了展开状态 → 展开
```

## 📝 注意事项

1. **性能优化**：在XMLHttpRequest回调中处理，不阻塞主线程
2. **兼容性**：使用标准的DOM API，兼容所有现代浏览器
3. **状态隔离**：四个页面的折叠状态互不干扰
4. **事件监听**：initCollapse()只添加事件监听，不修改DOM状态
