# 动画系统文档

## 概述

项目实现了完整的动画系统，包括人物常态动画和加扣分动画流程。

## 动画文件

所有动画文件位于 `public/animations/` 目录：

| 文件名 | 大小 | 用途 | 循环 |
|--------|------|------|------|
| `girl-excellent.gif` | 5.30 MB | 优秀状态常态动画（90-100分） | 是 |
| `girl-good.gif` | 5.07 MB | 良好状态常态动画（60-89分） | 是 |
| `girl-needwork.gif` | 3.96 MB | 要加油状态常态动画（0-59分） | 是 |
| `flower-add.gif` | 0.23 MB | 送花动画 | 否 |
| `flower-subtract.gif` | 0.46 MB | 扣花动画 | 否 |
| `girl-celebrate.gif` | 2.88 MB | 人物庆祝动画（加分后） | 否 |
| `girl-sad.gif` | 2.57 MB | 人物打击动画（扣分后） | 否 |

**总大小**: 约 20 MB

## 动画参数

- **分辨率**: 352x624 (原始 704x1248 的 1/2)
- **帧率**: 12fps (原始 24fps 的 1/2)
- **格式**: GIF with transparency
- **优化**: 使用 FFmpeg 调色板优化

## 组件架构

### 1. GirlAnimation 组件

**文件**: `src/components/GirlAnimation.tsx`

**功能**: 显示人物常态动画，根据分数自动切换

**Props**:
- `score: number` - 当前分数
- `className?: string` - 样式类名

**逻辑**:
```typescript
if (score >= 90) → girl-excellent.gif
else if (score >= 60) → girl-good.gif
else → girl-needwork.gif
```

### 2. AnimationOverlay 组件

**文件**: `src/components/AnimationOverlay.tsx`

**功能**: 全屏动画叠加层，播放送花/扣花和人物加扣分动画

**Props**:
- `type: AnimationType | null` - 动画类型
- `onComplete: () => void` - 动画完成回调

**动画类型**:
- `flower-add` - 送花动画（1.4秒）
- `flower-subtract` - 扣花动画（1.4秒）
- `girl-celebrate` - 人物庆祝动画（4秒）
- `girl-sad` - 人物打击动画（4秒）

**播放流程**:
1. 显示动画
2. 播放完成后停留 1 秒
3. 渐隐 0.5 秒
4. 触发 `onComplete` 回调

### 3. AddFlowerModal 组件

**文件**: `src/components/AddFlowerModal.tsx`

**功能**: 送花选择界面，触发加分动画流程

**动画流程**:
1. 用户选择送花项
2. 显示随机分值滚动效果（1秒）
3. 关闭模态框
4. 播放送花动画（1.4秒 + 1秒停留）
5. 播放人物庆祝动画（4秒 + 1秒停留）
6. 更新分数（带进度条动画）
7. 显示成功通知

### 4. SubtractFlowerModal 组件

**文件**: `src/components/SubtractFlowerModal.tsx`

**功能**: 扣花选择界面，触发扣分动画流程

**动画流程**:
1. 用户选择扣花项
2. 显示随机分值滚动效果（1秒）
3. 关闭模态框
4. 播放扣花动画（1.4秒 + 1秒停留）
5. 播放人物打击动画（4秒 + 1秒停留）
6. 更新分数（带进度条动画）
7. 显示错误通知

## 使用方法

### 在 App.tsx 中集成

```typescript
import GirlAnimation from './components/GirlAnimation';
import AnimationOverlay, { type AnimationType } from './components/AnimationOverlay';

function App() {
  const [score, setScore] = useState(100);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType | null>(null);

  const playAnimation = (type: AnimationType) => {
    setCurrentAnimation(type);
  };

  const handleAnimationComplete = () => {
    setCurrentAnimation(null);
  };

  return (
    <>
      {/* 常态动画 */}
      <GirlAnimation score={score} />
      
      {/* 动画叠加层 */}
      <AnimationOverlay
        type={currentAnimation}
        onComplete={handleAnimationComplete}
      />
      
      {/* 模态框 */}
      <AddFlowerModal
        onPlayAnimation={playAnimation}
        // ... 其他 props
      />
    </>
  );
}
```

## 转换脚本

**文件**: `scripts/convert-animations.js`

**功能**: 批量转换 PNG 序列帧为 GIF

**使用方法**:
```bash
cd baby-integrity-app
node scripts/convert-animations.js
```

**FFmpeg 命令模板**:
```bash
ffmpeg -framerate 12 -i "frame_%05d.png" \
  -vf "scale=352:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" \
  -loop 0 output.gif
```

## 性能优化建议

### 当前状态
- ✅ 分辨率降低 50%
- ✅ 帧率降低 50%
- ✅ 使用调色板优化
- ✅ 透明背景保留

### 进一步优化选项

如果需要更小的文件：

1. **降低分辨率到 300px**:
   ```bash
   -vf "scale=300:-1:flags=lanczos,..."
   ```

2. **提高帧率到 18fps** (更流畅):
   ```bash
   -framerate 18
   ```

3. **使用 WebP 动画** (更小，但兼容性稍差):
   ```bash
   ffmpeg -framerate 12 -i "frame_%05d.png" \
     -vf "scale=352:-1" \
     -loop 0 -quality 80 output.webp
   ```

4. **按需加载**: 只加载当前需要的动画

## 时间线

### 送花流程总时长: 约 8.4 秒
- 随机分值: 1秒
- 送花动画: 1.4秒
- 停留: 1秒
- 人物庆祝: 4秒
- 停留: 1秒

### 扣花流程总时长: 约 8.4 秒
- 随机分值: 1秒
- 扣花动画: 1.4秒
- 停留: 1秒
- 人物打击: 4秒
- 停留: 1秒

## 故障排查

### 动画不显示
1. 检查文件是否存在: `public/animations/*.gif`
2. 检查浏览器控制台错误
3. 检查网络请求是否成功

### 动画卡顿
1. 文件太大，考虑降低分辨率
2. 帧率太低，考虑提高到 18fps
3. 网络慢，考虑预加载

### 透明背景丢失
1. 确认源 PNG 有透明通道
2. 检查 FFmpeg 命令是否正确
3. 使用 `palettegen` 和 `paletteuse` 滤镜

## 未来改进

1. **预加载**: 在应用启动时预加载所有动画
2. **WebP 支持**: 为现代浏览器提供 WebP 版本
3. **Lottie 动画**: 转换为 Lottie JSON 以获得更小的文件
4. **懒加载**: 按需加载动画文件
5. **缓存策略**: 使用 Service Worker 缓存动画
