# 背景图片快速使用

## 三步启用背景图片

### 1️⃣ 放置图片
将背景图片 (推荐 1080x1920) 放到 `public` 目录:
```
public/background.jpg
```

### 2️⃣ 优化图片
```bash
cd baby-integrity-app
npm run optimize-images
```
自动生成 `public/background.webp`

### 3️⃣ 启用背景
编辑 `src/config/background.ts`:
```typescript
enabled: true,  // 改为 true
```

完成! 🎉

---

## 配置说明

### 图片路径
```typescript
backgroundImage: '/background.webp',  // WebP 格式
fallbackImage: '/background.jpg',     // 降级图片
```

### 背景样式
```typescript
style: {
  size: 'cover',      // 覆盖整个区域
  position: 'center', // 居中显示
}
```

### 切换渐变色
```typescript
enabled: false,  // 禁用图片,使用渐变色
gradient: {
  from: '#FFC7E3',
  via: '#FFB6D9',
  to: '#FFC7E3',
}
```

---

详细文档: [BACKGROUND_GUIDE.md](./BACKGROUND_GUIDE.md)
