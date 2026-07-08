# 知识点重要性标记使用指南

## 快速开始

### 1. 基础用法

在知识点的标题中添加重要性徽章：

```html
<div class="knowledge-point">
    <div class="knowledge-point__title">
        一、地球自转
        <span class="importance-badge importance-badge--high">必考</span>
    </div>
    <div class="knowledge-point__text">
        <!-- 知识点内容 -->
    </div>
</div>
```

### 2. 三个等级说明

#### 🔴 高频考点 (importance-badge--high)
**适用场景**：
- 历年高考必考知识点
- 综合性强的核心概念
- 与其他知识点关联紧密的内容

**示例**：
```html
<span class="importance-badge importance-badge--high">必考</span>
<span class="importance-badge importance-badge--high">高频考点</span>
<span class="importance-badge importance-badge--high">核心</span>
```

#### 🟡 重要知识点 (importance-badge--medium)
**适用场景**：
- 常见考点但不是每次必考
- 理解其他知识点的基础
- 需要掌握但难度较低的内容

**示例**：
```html
<span class="importance-badge importance-badge--medium">重要</span>
<span class="importance-badge importance-badge--medium">常考</span>
<span class="importance-badge importance-badge--medium">基础</span>
```

#### ⚪ 了解即可 (importance-badge--low)
**适用场景**：
- 补充性知识
- 拓展阅读内容
- 难度较高但考察较少的内容

**示例**：
```html
<span class="importance-badge importance-badge--low">了解</span>
<span class="importance-badge importance-badge--low">拓展</span>
<span class="importance-badge importance-badge--low">选学</span>
```

## 完整示例

### 自然地理示例

```html
<!-- 必考知识点 -->
<div class="knowledge-point">
    <div class="knowledge-point__title">
        三、晨昏线
        <span class="importance-badge importance-badge--high">必考</span>
    </div>
    <div class="knowledge-point__text">
        <strong>定义：</strong>昼半球和夜半球的分界线...
    </div>
</div>

<!-- 重要知识点 -->
<div class="knowledge-point">
    <div class="knowledge-point__title">
        四、地转偏向力
        <span class="importance-badge importance-badge--medium">重要</span>
    </div>
    <div class="knowledge-point__text">
        <strong>规律：</strong>北半球向右偏...
    </div>
</div>

<!-- 了解即可 -->
<div class="knowledge-point">
    <div class="knowledge-point__title">
        五、地方时计算
        <span class="importance-badge importance-badge--low">了解</span>
    </div>
    <div class="knowledge-point__text">
        <strong>计算公式：</strong>所求地方时 = 已知地方时 ± 经度差×4分钟...
    </div>
</div>
```

### 人文地理示例

```html
<div class="knowledge-point">
    <div class="knowledge-point__title">
        三、城市内部空间结构
        <span class="importance-badge importance-badge--high">高频考点</span>
    </div>
    <div class="knowledge-point__text">
        <strong>主要功能区：</strong><br>
        · 商业区：位于市中心，交通便利，付租能力强<br>
        · 住宅区：城市中最广泛的土地利用方式
    </div>
</div>
```

## 样式定制

### 修改徽章颜色

在 `css/style.css` 中添加自定义样式：

```css
/* 自定义徽章颜色 */
.importance-badge--custom {
    background: rgba(255, 99, 71, 0.15);
    color: #dc143c;
    border: 1px solid rgba(255, 99, 71, 0.3);
}
```

使用：
```html
<span class="importance-badge importance-badge--custom">真题</span>
```

### 修改徽章大小

```css
.importance-badge {
    font-size: 0.65rem;      /* 默认值 */
    padding: 2px 6px;
}

/* 大号徽章 */
.importance-badge--large {
    font-size: 0.75rem;
    padding: 3px 8px;
}
```

### 添加图标

```css
.importance-badge--high::before {
    content: "🔥 ";
}

.importance-badge--medium::before {
    content: "⭐ ";
}

.importance-badge--low::before {
    content: "📌 ";
}
```

## 最佳实践

### 1. 标记策略

**建议标记比例**：
- 高频考点：20-30%（核心重点）
- 重要知识点：40-50%（必须掌握）
- 了解即可：20-30%（拓展内容）

**标记原则**：
- ✅ 真正的高频考点才标记为"必考"
- ✅ 每个章节至少有一个"必考"知识点
- ✅ 不要过度标记，保持重点突出
- ❌ 避免所有知识点都标记为"必考"
- ❌ 避免完全不标记重要性

### 2. 页面标记示例

#### 自然地理（5章，22个知识点）

**第一章 地球运动（4个知识点）**
```
一、地球自转          [必考] 🔴
二、地球公转          [必考] 🔴
三、晨昏线            [必考] 🔴
四、地转偏向力        [重要] 🟡
```

**第二章 大气环境（8个知识点）**
```
一、大气受热过程      [必考] 🔴
二、热力环流          [必考] 🔴
三、三圈环流          [必考] 🔴
四、气压带风带移动    [必考] 🔴
五、季风环流          [必考] 🔴
六、气候类型的判读    [必考] 🔴
七、气候的形成因素    [重要] 🟡
八、气候变化          [了解] ⚪
```

#### 人文地理（4章，11个知识点）

**第一章 人口与城市（4个知识点）**
```
一、人口增长          [必考] 🔴
二、人口迁移          [重要] 🟡
三、城市内部空间结构  [必考] 🔴
四、城市化            [必考] 🔴
```

### 3. 视觉一致性

**统一用词建议**：
- 必考 / 高频考点 / 核心
- 重要 / 常考 / 基础
- 了解 / 拓展 / 选学

**保持一致性**：
- 同一页面使用相同的词汇
- 相似重要程度使用相同徽章
- 定期审查和调整标记

## 与学习进度结合

当用户展开带有重要性标记的知识点时：

1. **必考知识点**：
   - 展开时进度条更新
   - 左侧出现绿色已读标记
   - 侧边栏完成数量 +1

2. **查看已读知识点**：
   - 已读知识点背景为淡绿色
   - 左侧有完整的绿色进度条
   - 悬停时效果更明显

3. **进度追踪**：
   - 侧边栏顶部实时显示进度
   - 显示已完成/待学习数量
   - 进度条带光泽动画

## 进阶技巧

### 1. 为知识点添加标签

```html
<div class="knowledge-point__title">
    三、晨昏线
    <span class="importance-badge importance-badge--high">必考</span>
    <span style="font-size: 0.75rem; color: var(--color-nature); margin-left: 8px;">
        🕐 约10分钟
    </span>
</div>
```

### 2. 组合使用多个徽章

```html
<div class="knowledge-point__title">
    四、地转偏向力
    <span class="importance-badge importance-badge--high">必考</span>
    <span class="importance-badge importance-badge--medium">难点</span>
</div>
```

### 3. 添加自定义提示

```html
<div class="knowledge-point__text">
    <strong>💡 记忆口诀：</strong>北右南左赤不偏<br>
    <strong>规律：</strong>北半球向右偏...
</div>
```

## 浏览器调试

### 查看阅读状态

在浏览器控制台：

```javascript
// 查看自然地理已读知识点
JSON.parse(localStorage.getItem('geography-read-nature') || '[]')

// 查看人文地理已读知识点
JSON.parse(localStorage.getItem('geography-read-humanity') || '[]')

// 查看所有已读状态
Object.keys(localStorage)
    .filter(key => key.startsWith('geography-read-'))
    .reduce((obj, key) => {
        obj[key] = JSON.parse(localStorage.getItem(key));
        return obj;
    }, {});
```

### 手动标记为已读

```javascript
// 手动将自然地理第0个知识点标记为已读
const readPoints = new Set(JSON.parse(localStorage.getItem('geography-read-nature') || '[]'));
readPoints.add(0);
localStorage.setItem('geography-read-nature', JSON.stringify([...readPoints]));
location.reload();
```

## 常见问题

### Q1: 徽章不显示？
**检查**：
- 是否同时添加了两个 class：`importance-badge` 和 `importance-badge--high`
- CSS 文件是否正确加载
- 是否有多余的空格或拼写错误

### Q2: 进度条不更新？
**检查**：
- 是否正确触发了知识点的展开/折叠
- localStorage 是否被禁用
- 浏览器控制台是否有错误信息

### Q3: 阅读状态不持久化？
**检查**：
- 是否在隐私/无痕模式下（某些浏览器限制）
- localStorage 是否已满
- 是否清除了浏览器数据

### Q4: 如何批量添加徽章？
使用脚本批量处理：

```javascript
// 批量为第3个章节的所有知识点添加"必考"徽章
const points = document.querySelectorAll('#sec3 .knowledge-point__title');
points.forEach(title => {
    title.innerHTML += '<span class="importance-badge importance-badge--high">必考</span>';
});
```

## 更新日志

### v1.0 (2026-06-29)
- ✅ 实现三点重要性标记系统
- ✅ 实现阅读状态追踪
- ✅ 实现侧边栏进度指示
- ✅ 实现树形章节导航
- ✅ 四个页面全面适配
- ✅ 移动端响应式优化
- ✅ localStorage 持久化
- ✅ 滚动监听自动高亮

---

**提示**：合理使用重要性标记，可以显著提升学习效率，帮助学生快速定位重点内容！
