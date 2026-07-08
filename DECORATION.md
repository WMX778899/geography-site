# 地理网站实景照片装饰说明

## 📸 实景照片装饰方案（2026-06-26）

### 图片来源
所有实景照片来自 **Unsplash**，采用 Unsplash License（免费可商用）
- 高质量摄影作品
- 支持 HTTPS CDN 加速
- 无需强制署名（推荐署名）

---

## 🎨 装饰元素清单

### 1. Hero 横幅（首页顶部）

**背景**：地球夜景 + 白色渐变叠加
- **图片**：Earth from space at night
- **Unsplash ID**：`photo-1451187580459-43490279c0fa`
- **URL**：`https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80`
- **效果**：92-95% 白色半透明渐变叠加，确保文字清晰可读
- **附加**：右侧发光地球 SVG 动画（缓慢浮动效果）

**CSS 位置**：`css/style.css` 第417行

---

### 2. 四大模块卡片

每个卡片顶部 120px 高度区域展示对应主题的实景照片

| 模块 | 图片主题 | Unsplash ID | 透明度 |
|------|---------|-------------|--------|
| 🌋 自然地理 | 山峰山脉 | `photo-1464822759023-fed622ff2c3b` | 15% (hover 25%) |
| 🏙️ 人文地理 | 城市夜景 | `photo-1519501025264-65ba15a82390` | 15% (hover 25%) |
| 🗺️ 区域地理 | 世界地图 | `photo-1526778548025-fa2f459cd5c1` | 15% (hover 25%) |
| 🌱 选修专题 | 阳光森林 | `photo-1441974231531-c6227db76b6e` | 15% (hover 25%) |

**CSS 位置**：`css/style.css` 第563-578行

---

### 3. 知识页面章节标题装饰

每个知识页面的内容章节标题左侧有微妙的实景照片背景

| 页面 | 图片主题 | Unsplash ID | 透明度 |
|------|---------|-------------|--------|
| 自然地理 | 雪山山脉全景 | `photo-1506905925346-21bda4d32df4` | 6% |
| 人文地理 | 城市街景 | `photo-1449824913935-59a10b8d2000` | 6% |
| 区域地理 | 世界地图 | `photo-1526778548025-fa2f459cd5c1` | 6% |
| 选修专题 | 森林阳光 | `photo-1441974231531-c6227db76b6e` | 6% |

**CSS 位置**：`css/style.css` 第1138-1183行

---

## 🔧 技术实现

### 透明度控制策略

```css
/* Hero 横幅：强烈叠加确保可读性 */
background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%),
            url('https://images.unsplash.com/...');

/* 模块卡片：适度展示 */
.module-card::before {
    background-image: url('https://images.unsplash.com/...');
    opacity: 0.15;  /* hover 时 0.25 */
}

/* 章节标题：极其微妙 */
.content-section .content-section__header::before {
    background-image: url('https://images.unsplash.com/...');
    opacity: 0.06;
}
```

### 图片优化参数

- **Hero 大图**：`?w=1600&q=80`（1600px 宽度，80% 质量）
- **模块卡片**：`?w=800&q=80`（800px 宽度，80% 质量）
- **章节标题**：`?w=400&q=80`（400px 宽度，80% 质量）

---

## ✨ 设计原则

1. **主题呼应**：每个模块的照片与其地理主题紧密相关
2. **层次分明**：
   - Hero：明显的实景背景
   - 卡片：顶部适度装饰
   - 章节：几乎透明的纹理
3. **淡雅不张扬**：透明度严格控制在 6-25%
4. **性能友好**：Unsplash CDN + 图片尺寸优化
5. **可维护性**：所有图片 URL 集中在 CSS，易于更换

---

## 🌐 备选图片源

如需更换图片，推荐以下免费可商用网站：
- **[Unsplash](https://unsplash.com)** - 高质量摄影 ⭐ 推荐
- **[Pexels](https://www.pexels.com)** - 免费图库
- **[Pixabay](https://pixabay.com)** - 免费图片
- **[Burst by Shopify](https://burst.shopify.com)** - 商业友好

**更换注意事项**：
1. 确认许可证（推荐 CC0 或 Unsplash License）
2. 测试加载速度
3. 调整透明度以适应新图片
4. 在移动端测试可读性

---

**更新日期**：2026-06-26
**技术支持**：Claude Code
**图片源**：Unsplash (https://unsplash.com)
