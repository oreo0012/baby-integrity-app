# Lottie 动画集成指南

## 什么是 Lottie?

Lottie 是 Airbnb 开源的动画库,可以将 After Effects 动画导出为 JSON 格式,在 Web/移动端完美播放。

## 为什么选择 Lottie?

✅ **文件极小** - 通常只有 20-100KB (视频是 500KB-5MB)
✅ **透明背景** - 完美支持
✅ **矢量动画** - 任意缩放不失真
✅ **完美循环** - 无缝循环播放
✅ **加载极快** - JSON 文本,瞬间加载
✅ **微信兼容** - 完美支持所有浏览器
✅ **可控制** - 播放、暂停、速度、方向等

## 如何获取 Lottie 动画?

### 方案 1: 从 After Effects 导出 (推荐)

如果你有 AE 源文件:

1. **安装 Bodymovin 插件**
   - 在 AE 中: Window > Extensions > Bodymovin
   - 或从 https://aescripts.com/bodymovin/ 下载

2. **导出动画**
   - 选择你的合成
   - Bodymovin > Render
   - 选择保存位置
   - 点击 Render

3. **放置文件**
   ```
   baby-integrity-app/public/girl-animation.json
   ```

### 方案 2: 使用在线工具转换

#### 2.1 从视频转换 (质量一般)
- https://lottiefiles.com/tools/video-to-lottie
- 上传 MP4 视频
- 下载 JSON 文件

#### 2.2 使用 AI 生成
- https://lottiefiles.com/ai
- 描述你想要的动画
- 生成并下载

### 方案 3: 从 LottieFiles 下载

1. 访问 https://lottiefiles.com/
2. 搜索类似的动画
3. 下载免费动画
4. 放到 `public/girl-animation.json`

### 方案 4: 使用 GIF (临时方案)

如果暂时无法获取 Lottie JSON,可以先使用 GIF:

```bash
cd baby-integrity-app

# 从视频转换为 GIF
ffmpeg -i public/你的视频.mp4 -vf "fps=24,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 public/girl-animation.gif
```

## 文件放置

```
baby-integrity-app/
  └── public/
      ├── girl-animation.json  # Lottie JSON (优先)
      ├── girl-animation.gif   # GIF 降级
      ├── girl.webp           # 静态图片降级
      └── girl.png            # 最终降级
```

## 组件使用

组件已自动实现智能降级:

1. ✅ 优先尝试加载 Lottie JSON
2. ✅ 如果失败,尝试 GIF
3. ✅ 最后使用静态图片

无需修改代码,只需放置文件即可!

## Lottie 文件优化

### 减小文件大小

1. **简化路径**
   - 在 AE 中减少关键帧
   - 简化形状和路径

2. **使用 Lottie 优化工具**
   ```bash
   npm install -g @lottiefiles/lottie-cli
   lottie-cli optimize girl-animation.json girl-animation-optimized.json
   ```

3. **在线优化**
   - https://lottiefiles.com/tools/lottie-optimizer
   - 上传 JSON,下载优化版本

### 推荐设置

- **帧率**: 24-30 FPS
- **时长**: 2-5 秒
- **尺寸**: 512x512 或更小
- **文件大小**: < 100KB

## 高级用法

### 控制播放

```tsx
import { useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

const lottieRef = useRef<LottieRefCurrentProps>(null);

// 暂停
lottieRef.current?.pause();

// 播放
lottieRef.current?.play();

// 设置速度
lottieRef.current?.setSpeed(0.5); // 慢速

// 跳转到特定帧
lottieRef.current?.goToAndStop(30, true);
```

### 响应用户交互

```tsx
<Lottie
  animationData={animationData}
  loop={false}
  autoplay={false}
  onComplete={() => console.log('动画完成')}
  onClick={() => lottieRef.current?.play()}
/>
```

### 根据分数切换动画

```tsx
const getAnimationData = (score: number) => {
  if (score >= 90) return happyAnimation;
  if (score >= 60) return normalAnimation;
  return sadAnimation;
};

<Lottie animationData={getAnimationData(score)} />
```

## 性能对比

### 文件大小
- Lottie JSON: **50KB**
- GIF: 2MB (40x 更大)
- MP4: 1MB (20x 更大)
- WebM: 500KB (10x 更大)

### 加载时间 (4G 网络)
- Lottie: **0.1秒**
- GIF: 4秒
- MP4: 2秒
- WebM: 1秒

### 内存占用
- Lottie: **5MB**
- GIF: 20MB
- Video: 30MB

## 常见问题

### Q: 我没有 After Effects 怎么办?
A: 
1. 使用在线转换工具 (视频转 Lottie)
2. 从 LottieFiles 下载免费动画
3. 临时使用 GIF (组件会自动降级)

### Q: Lottie 文件太大怎么办?
A: 
1. 使用优化工具压缩
2. 减少动画复杂度
3. 降低帧率到 24 FPS

### Q: 动画不流畅?
A: 
1. 检查 JSON 文件大小 (应 < 100KB)
2. 降低帧率
3. 简化动画效果

### Q: 如何确保透明背景?
A: Lottie 天然支持透明背景,无需特殊设置

## 推荐工具

1. **LottieFiles** - https://lottiefiles.com/
   - 免费动画库
   - 在线编辑器
   - 优化工具

2. **Bodymovin** - AE 导出插件
   - https://aescripts.com/bodymovin/

3. **Lottie Editor** - 在线编辑
   - https://lottiefiles.com/editor

4. **Video to Lottie** - 视频转换
   - https://lottiefiles.com/tools/video-to-lottie

## 快速开始

### 最简单的方法 (使用 GIF)

如果你现在就想看到效果:

```bash
cd baby-integrity-app

# 转换视频为 GIF
ffmpeg -i public/你的视频.mp4 -vf "fps=24,scale=400:-1:flags=lanczos" -loop 0 public/girl-animation.gif

# 刷新浏览器即可
```

组件会自动检测并使用 GIF!

### 最佳方法 (使用 Lottie)

1. 将视频上传到 https://lottiefiles.com/tools/video-to-lottie
2. 下载 JSON 文件
3. 放到 `public/girl-animation.json`
4. 刷新浏览器

完成! 🎉

## 总结

| 需求 | 推荐方案 |
|------|---------|
| 最佳质量 | Lottie JSON |
| 快速实现 | GIF |
| 临时方案 | 静态图片 |
| 有 AE 源文件 | Bodymovin 导出 |
| 只有视频 | 在线转换工具 |

**强烈推荐使用 Lottie!** 文件小、加载快、效果好、兼容性完美。
