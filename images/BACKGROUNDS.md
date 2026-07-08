# 全屏淡色背景配置说明

## 📸 全屏背景图片

所有页面都使用全屏固定背景图，配合淡色渐变叠加，营造沉浸式学习氛围。

---

## 🎨 各页面背景配置

### 1. 首页 (index.html)
**图片**: `background-home-earth.jpg` (290 KB)
- **主题**: 地球夜景 - 城市灯光与地球弧线
- **叠加**: 白色渐变 97% → 94%
- **效果**: 知识平台氛围感

### 2. 自然地理 (knowledge/nature.html)
**图片**: `background-nature-mountains.jpg` (~500 KB)
- **主题**: 雪山山脉全景 - 壮丽的自然风光
- **叠加**: 淡绿色渐变 97% → 94%
- **效果**: 自然地理专业感

### 3. 人文地理 (knowledge/humanity.html)
**图片**: `background-humanity-city.jpg` (~500 KB)
- **主题**: 城市夜景 - 现代都市灯光
- **叠加**: 淡橙色渐变 97% → 94%
- **效果**: 人文地理城市感

### 4. 区域地理 (knowledge/region.html)
**图片**: `background-region-world.jpg` (~500 KB)
- **主题**: 世界地图 - 全球视角
- **叠加**: 淡蓝色渐变 97% → 94%
- **效果**: 区域地理全球感

### 5. 选修专题 (knowledge/elective.html)
**图片**: `background-elective-forest.jpg` (~500 KB)
- **主题**: 森林阳光 - 自然环境
- **叠加**: 淡紫色渐变 97% → 94%
- **效果**: 选修专题生态感

---

## 🔧 CSS 技术实现

### 多重背景叠加
```css
body {
    background:
        /* 图片层 */
        url('../images/background-home-earth.jpg'),
        /* 渐变叠加层 */
        linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.94) 100%),
        /* 降级背景色 */
        var(--color-bg);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
}
```

### 关键属性说明

| 属性 | 值 | 说明 |
|------|-----|------|
| `background-size` | `cover` | 全覆盖浏览器窗口 |
| `background-position` | `center` | 居中对齐 |
| `background-attachment` | `fixed` | 固定背景（滚动时不动） |
| `background-repeat` | `no-repeat` | 不重复平铺 |

### 透明度控制
- **图片**: 不透明，完整显示
- **渐变叠加**: 3-6% 不透明度，确保图片淡雅
- **效果**: 图片可见但不抢眼，文字清晰可读

---

## 📐 图片规格

| 参数 | 值 |
|------|-----|
| **分辨率** | 3840px 宽度（4K） |
| **质量** | 80% |
| **格式** | JPEG |
| **文件大小** | 约 290-500 KB |
| **加载优化** | `fit=crop` 裁剪 |

---

## 🎯 设计原则

1. **淡雅主题**: 3-6% 的白色渐变叠加，让图片呈现淡色效果
2. **主题呼应**: 每个模块的背景与其地理主题一致
3. **沉浸体验**: `fixed` 固定背景，滚动时营造视差效果
4. **性能平衡**: 4K 分辨率但通过 CDN 和压缩优化加载速度
5. **降级方案**: 最后一层使用 `var(--color-bg)` 作为降级背景

---

## 🌐 图片源

所有图片来自 **Unsplash**，采用 Unsplash License：
- ✅ 免费商用
- ✅ 无需署名
- ✅ 高质量摄影

---

## 💡 自定义替换

如需更换背景图片：

1. **准备图片**:
   - 推荐尺寸: 1920×1080 或更高
   - 格式: JPEG 或 WebP
   - 保持文件名或更新 CSS 路径

2. **调整透明度**:
   - 如果图片太亮: 增加渐变透明度至 98%
   - 如果图片太暗: 减少渐变透明度至 92%

3. **更新 CSS**:
   ```css
   body {
       background:
           url('../images/your-new-image.jpg'),
           linear-gradient(..., rgba(255,255,255,0.XX) ...);
   }
   ```

---

**更新日期**: 2026-06-26
**技术支持**: Claude Code
