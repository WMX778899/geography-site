# 折叠状态逻辑修复说明

## 📋 需求

- **首次访问**：默认全部折叠
- **刷新页面**：全部恢复折叠（不管之前是否展开）
- **切换页面**：保持当前页面的展开/折叠状态

## ❌ 之前的逻辑问题

### 问题1：状态保存不准确
```javascript
// 每次点击都保存到 localStorage
point.classList.toggle('collapsed');
if (point.classList.contains('collapsed')) {
    saved.add(key);  // 保存"已折叠"状态
} else {
    saved.delete(key);  // 删除 = "已展开"
}
```

**问题**：localStorage 中存储的是"已折叠"的 key，但逻辑不够清晰。

### 问题2：刷新页面和页面切换逻辑混淆
```javascript
// 之前的逻辑
if (saved.has(key)) {
    point.classList.add('collapsed');  // 如果保存过，就折叠
}
```

**问题**：
- 首次访问：saved 为空，不应该折叠
- 刷新页面：saved 有数据，应该全部折叠（不读取 saved）
- 页面切换：saved 有数据，应该保持状态（读取 saved）

三种场景无法用同一个逻辑处理。

## ✅ 最终解决方案

### 核心思路：区分"页面切换"和"页面刷新"

使用全局标记 `__isPageTransition` 区分两种场景：

```javascript
// 全局标记
let __isPageTransition = false;

// 页面切换时
__isPageTransition = true;
// ... 处理状态
__isPageTransition = false;

// initCollapse() 中
if (!__isPageTransition) {
    // 首次访问或刷新 → 全部折叠
    point.classList.add('collapsed');
}
// 页面切换 → 不修改（状态已由 initPageTransitions 处理）
```

### 完整流程

#### 场景1：首次访问
```
1. 页面加载
2. __isPageTransition = false
3. initCollapse() 执行
4. 所有知识点折叠 ✓
```

#### 场景2：刷新页面
```
1. 页面刷新
2. __isPageTransition = false
3. initCollapse() 执行
4. 所有知识点折叠 ✓
5. localStorage 数据未清除，但不读取
```

#### 场景3：页面切换
```
1. 点击链接
2. __isPageTransition = true
3. 解析新页面HTML
4. 全部折叠
5. 根据 localStorage 恢复展开
6. 插入DOM
7. initAllFeatures() → initCollapse() 执行
8. 检测到 __isPageTransition = true
9. 不修改状态（保持步骤5的结果）
10. __isPageTransition = false
```

## 🔧 代码实现

### 1. 全局标记
```javascript
// 用于区分页面切换和页面刷新
let __isPageTransition = false;
```

### 2. 页面切换时设置标记
```javascript
// initPageTransitions() 中
__isPageTransition = true;

// 处理状态
if (url.includes('knowledge/')) {
    const saved = getCollapsedState(pageKey);
    const allPoints = newBody.querySelectorAll('.knowledge-point');

    // 先全部折叠
    allPoints.forEach(point => point.classList.add('collapsed'));

    // 再根据localStorage恢复展开状态
    if (saved.size > 0) {
        allPoints.forEach((point, index) => {
            if (!saved.has(key)) {
                point.classList.remove('collapsed');
            }
        });
    }
}

// 初始化功能
initAllFeatures();

// 重置标记
__isPageTransition = false;
```

### 3. initCollapse() 检查标记
```javascript
function initCollapse() {
    sections.forEach(section => {
        const points = section.querySelectorAll('.knowledge-point');

        // 如果不是页面切换，则全部折叠
        if (!__isPageTransition) {
            points.forEach(point => {
                point.classList.add('collapsed');
            });
        }
        // 页面切换时，不修改DOM状态

        // 添加事件监听（无论哪种场景都需要）
        points.forEach(point => {
            point.addEventListener('click', (e) => {
                point.classList.toggle('collapsed');

                // 保存状态
                const pageKey = location.pathname.split('/').pop().replace('.html', '');
                const saved = getCollapsedState(pageKey);
                const sectionId = section.id || null;
                const idx = [...points].indexOf(point);
                const key = `${pageKey}:${sectionId}:${idx}`;

                if (point.classList.contains('collapsed')) {
                    saved.add(key);
                } else {
                    saved.delete(key);
                }
                saveCollapsedState(saved, pageKey);
            });
        });
    });
}
```

## 📊 三种场景对比

| 场景 | __isPageTransition | 行为 | 结果 |
|------|-------------------|------|------|
| **首次访问** | `false` | initCollapse() 全部折叠 | ✅ 全部折叠 |
| **刷新页面** | `false` | initCollapse() 全部折叠 | ✅ 全部折叠 |
| **页面切换** | `true` | initPageTransitions 处理状态 | ✅ 保持状态 |

## 💾 localStorage 的作用

localStorage 只在**页面切换**时使用，用于保持展开状态。

**存储逻辑**：
```javascript
// 点击折叠 → 保存 key
saved.add(key);

// 点击展开 → 删除 key
saved.delete(key);
```

**读取逻辑**：
```javascript
// 页面切换时
if (saved.has(key)) {
    // 之前是折叠的 → 继续折叠
    point.classList.add('collapsed');
} else {
    // 之前是展开的 → 保持展开
    point.classList.remove('collapsed');
}
```

**关键点**：
- 刷新页面时，虽然 localStorage 数据还在，但不读取
- 只有页面切换时才读取 localStorage
- 这样实现了"刷新重置，切换保持"的需求

## 🎯 优势

1. **逻辑清晰**：三种场景有明确的分支
2. **性能优化**：页面切换时只修改必要的DOM
3. **用户体验**：刷新重置，切换保持，符合预期
4. **代码简洁**：不需要复杂的条件判断

## 📝 注意事项

1. **标记重置**：确保 `__isPageTransition` 在 initAllFeatures() 调用后重置
2. **事件监听**：initCollapse() 始终添加事件监听，无论哪种场景
3. **状态隔离**：四个页面的折叠状态互不干扰（通过 pageKey 区分）
4. **首次访问**：localStorage 为空，默认全部折叠
