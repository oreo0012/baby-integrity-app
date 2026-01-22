# 背景图片使用指南

## 快速开始

### 1. 准备背景图片

推荐尺寸: **1080 x 1920 像素** (9:16 比例)

支持格式:
- JPG/JPEG
- PNG
- WebP (推荐)

### 2. 放置图片

将背景图片放到 `public` 目录:
```
baby-integrity-app/
  └── public/
      ├── background.jpg    # 原始图片
      └── background.webp   # 优化后的图片 (自动生成)
```

### 3. 自动优化图片

运行优化脚本,自动将 JPG/PNG 转换为 WebP:

```bash
cd baby-integrity-app
npm run optimize-images
```

脚本会:
- ✅ 扫描 `public` 目录下的所有图片
- ✅ 自动转换为 WebP 格式
- ✅ 保持原文件不变
- ✅ 显示文件大小对比和节省比例

**首次使用需要安装 FFmpeg:**
```bash
# Windows
winget install FFmpeg

# 或从官网下载
https://ffmpeg.org/download.html
```

### 4. 启用背景图片

编辑 `src/config/background.ts`:

```typescript
export const backgroundConfig = {
  // 启用图片背景
  enabled: true,  // 改为 true
  
  // 背景图片路径
  backgroundImage: '/background.webp',
  
  // 降级图片 (如果浏览器不支持 WebP)
  fallbackImage: '/background.jpg',
  
  // ... 其他配置
};
```

### 5. 完成!

重启开发服务器即可看到新背景:
```bash
cd baby-integrity-app
npm run dev
```

## 配置选项

### 背景样式

在 `src/config/background.ts` 中调整:

```typescript
style: {
  // 背景大小
  size: 'cover',     // 'cover' | 'contain' | 'auto'
  
  // 背景位置
  position: 'center', // 'center' | 'top' | 'bottom' | 'left' | 'right'
  
  // 背景重复
  repeat: 'no-repeat', // 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  
  // 背景固定
  fixed: false,      // true | false
}
```

### 渐变色背景

如果不想使用图片,可以使用渐变色:

```typescript
export const backgroundConfig = {
  enabled: false,  // 禁用图片背景
  
  gradient: {
    from: '#FFC7E3',  // 起始颜色
    via: '#FFB6D9',   // 中间颜色
    to: '#FFC7E3',    // 结束颜色
  },
};
```

## 优化建议

### 图片尺寸

| 用途 | 推荐尺寸 | 说明 |
|-----|---------|------|
| 标准 | 1080 x 1920 | 适配大多数手机 |
| 高清 | 1284 x 2778 | 适配高端手机 |
| 轻量 | 750 x 1334 | 文件更小 |

### 文件大小

- **WebP**: 200-500 KB (推荐)
- **JPG**: 300-800 KB
- **PNG**: 避免使用 (文件太大)

### 质量设置

编辑 `scripts/optimize-images.js`:

```javascript
const CONFIG = {
  quality: 85,  // 调整质量 (1-100)
  // 85: 平衡质量和大小 (推荐)
  // 90: 高质量
  // 75: 更小文件
};
```

## 常见问题

### Q: 图片显示模糊?
A: 使用更高分辨率的图片 (1080x1920 或更高)

### Q: 文件太大?
A: 
1. 运行 `npm run optimize-images` 转换为 WebP
2. 降低质量设置 (75-80)
3. 使用更小的尺寸 (750x1334)

### Q: 背景不显示?
A: 
1. 检查 `background.ts` 中 `enabled: true`
2. 确认图片路径正确
3. 检查浏览器控制台错误

### Q: 如何使用多张背景?
A: 可以根据分数或时间切换背景,修改 `AppBackground.tsx`:

```typescript
const backgroundImage = score >= 90 
  ? '/background-happy.webp'
  : '/background-normal.webp';
```

## 高级用法

### 响应式背景

根据屏幕大小加载不同图片:

```typescript
const getBackgroundImage = () => {
  const width = window.innerWidth;
  if (width >= 1920) return '/background-large.webp';
  if (width >= 1080) return '/background-medium.webp';
  return '/background-small.webp';
};
```

### 动态背景

根据时间或分数动态切换:

```typescript
// 根据时间
const hour = new Date().getHours();
const backgroundImage = hour >= 18 || hour < 6
  ? '/background-night.webp'
  : '/background-day.webp';

// 根据分数
const backgroundImage = score >= 90
  ? '/background-excellent.webp'
  : score >= 60
  ? '/background-good.webp'
  : '/background-normal.webp';
```

### 预加载背景

提升加载速度:

```typescript
useEffect(() => {
  const img = new Image();
  img.src = '/background.webp';
}, []);
```

## 文件结构

```
baby-integrity-app/
├── public/
│   ├── background.jpg       # 原始图片
│   └── background.webp      # 优化后的图片
├── src/
│   ├── components/
│   │   └── AppBackground.tsx  # 背景组件
│   └── config/
│       └── background.ts      # 背景配置
└── scripts/
    └── optimize-images.js     # 优化脚本
```

## 性能优化

1. **使用 WebP 格式** - 比 JPG 小 30-50%
2. **懒加载** - 背景图片延迟加载
3. **CDN** - 生产环境使用 CDN
4. **缓存** - 设置合理的缓存策略

## 部署注意事项

确保 `public` 目录下的图片被正确部署:

```bash
cd baby-integrity-app

# 构建前优化图片
npm run optimize-images

# 构建项目
npm run build

# dist 目录会包含优化后的图片
```
