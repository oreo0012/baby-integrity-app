# 微信浏览器动画修复指南

## 问题
微信浏览器对 WebM 格式支持不好,导致动画无法显示。

## 解决方案

### 1. 准备 MP4 视频文件

将你的原始 MP4 动画视频放到:
```
baby-integrity-app/public/girl-animation.mp4
```

### 2. 优化 MP4 文件 (可选)

如果 MP4 文件太大,可以使用 FFmpeg 压缩:

```bash
# 基础压缩 (推荐)
ffmpeg -i girl-animation.mp4 -c:v libx264 -crf 23 -preset medium -c:a copy girl-animation-optimized.mp4

# 更小文件 (质量稍低)
ffmpeg -i girl-animation.mp4 -c:v libx264 -crf 28 -preset medium -vf scale=720:-1 girl-animation-optimized.mp4
```

参数说明:
- `-crf 23`: 质量控制 (18-28,数字越小质量越高)
- `-preset medium`: 编码速度
- `-vf scale=720:-1`: 缩放到 720p

### 3. 如果需要透明背景

MP4 不支持透明背景,但有两个方案:

#### 方案 A: 使用 PNG 序列 + Canvas (最佳质量)
将视频转为 PNG 序列,用 Canvas 播放

#### 方案 B: 使用 APNG (简单)
```bash
# 转换为 APNG
ffmpeg -i girl-animation.mp4 -plays 0 girl-animation.apng
```

#### 方案 C: 使用 GIF (兼容性最好)
```bash
# 转换为 GIF
ffmpeg -i girl-animation.mp4 -vf "fps=24,scale=400:-1:flags=lanczos" -loop 0 girl-animation.gif
```

然后更新组件使用 GIF:
```typescript
<img src="/girl-animation.gif" alt="小女孩" />
```

### 4. 当前实现

组件已更新为:
1. ✅ 优先尝试 MP4 (微信浏览器支持最好)
2. ✅ 降级到 WebM (现代浏览器)
3. ✅ 最终降级到静态图片
4. ✅ 添加微信浏览器特殊属性

### 5. 测试

在微信浏览器中访问:
```
http://192.168.31.227:5173
```

## 浏览器兼容性

| 格式 | 微信浏览器 | Chrome | Safari | 透明背景 | 文件大小 |
|------|-----------|--------|--------|---------|---------|
| MP4  | ✅ 完美   | ✅     | ✅     | ❌      | 中等    |
| WebM | ⚠️ 不稳定 | ✅     | ⚠️     | ✅      | 小      |
| GIF  | ✅ 完美   | ✅     | ✅     | ✅      | 大      |
| APNG | ✅ 良好   | ✅     | ✅     | ✅      | 较大    |

## 推荐方案

### 如果不需要透明背景
使用 **MP4** (当前方案)

### 如果需要透明背景
使用 **GIF** 或 **APNG**

## 故障排查

### 问题: 视频仍然不显示
1. 检查文件是否存在: `public/girl-animation.mp4`
2. 检查浏览器控制台错误
3. 尝试使用 GIF 格式

### 问题: 视频不自动播放
微信浏览器限制自动播放,这是正常的。用户点击屏幕后会开始播放。

### 问题: 视频全屏
已添加 `x5-video-player-fullscreen="false"` 防止全屏

## 文件大小参考

- MP4 (H.264, CRF 23): 500KB - 2MB
- WebM (VP9): 200KB - 800KB
- GIF: 1MB - 5MB
- APNG: 800KB - 3MB

## 快速命令

```bash
# 查看视频信息
ffmpeg -i girl-animation.mp4

# 转换为优化的 MP4
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium girl-animation.mp4

# 转换为 GIF (如果需要透明背景)
ffmpeg -i input.mp4 -vf "fps=24,scale=400:-1:flags=lanczos" -loop 0 girl-animation.gif
```


---

## 问题 3: Lottie 组件报错 "Element type is invalid"

### 症状
浏览器控制台报错：
```
Error: Element type is invalid: expected a string (for built-in components) 
or a class/function (for composite components) but got: object.
Check the render method of `GirlAnimation`.
```

### 原因
`lottie-react` 组件的 props 使用方式不正确，导致 React 无法正确识别组件类型。

### 解决方案

修改 Lottie 组件的 props 写法：

❌ **错误写法**:
```tsx
<Lottie
  animationData={animationData}
  loop={true}
  autoplay={true}
  style={{ width: '100%', height: '100%' }}
/>
```

✅ **正确写法**:
```tsx
<Lottie
  animationData={animationData}
  loop
  autoplay
  rendererSettings={{
    preserveAspectRatio: 'xMidYMid slice'
  }}
/>
```

### 关键修改点

1. **布尔属性简写**: `loop` 和 `autoplay` 应该使用简写形式，不需要 `={true}`
2. **渲染设置**: 使用 `rendererSettings` 而不是 `style` 来控制渲染行为
3. **尺寸控制**: 让外层容器 div 控制尺寸，而不是直接在 Lottie 组件上设置 style

### 完整示例

```tsx
// 方案 1: Lottie 动画 (最佳)
if (animationData) {
  return (
    <div className={`relative ${className}`}>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </div>
  );
}
```

### 验证修复

1. 保存文件后，浏览器会自动刷新
2. 检查控制台是否还有错误
3. 确认 Lottie 动画正常显示

---

## 最佳实践：Lottie JSON 方案

经过测试，**Lottie JSON 是最佳的动画解决方案**，完美解决了所有问题：

### 优势对比

| 特性 | Lottie JSON | GIF | MP4 | WebM |
|------|------------|-----|-----|------|
| 文件大小 | ⭐⭐⭐⭐⭐ 最小 | ⭐⭐ 较大 | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐ 小 |
| 透明背景 | ✅ 完美 | ✅ 支持 | ❌ 不支持 | ✅ 支持 |
| 循环播放 | ✅ 完美 | ✅ 完美 | ✅ 支持 | ✅ 支持 |
| 微信兼容 | ✅ 优秀 | ✅ 优秀 | ✅ 良好 | ❌ 不支持 |
| 加载速度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 可控性 | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐ |

### 推荐使用 Lottie 的原因

1. **文件最小**: 通常只有几十 KB，比视频小 10-100 倍
2. **完美透明**: 原生支持 Alpha 通道
3. **无缝循环**: 不会有任何闪烁或停顿
4. **跨平台**: 在所有浏览器（包括微信）中表现一致
5. **可编程**: 可以通过代码控制播放、暂停、速度等

### 如何获取 Lottie JSON

#### 方法 1: 从 After Effects 导出（最佳质量）
1. 安装 [Bodymovin](https://aescripts.com/bodymovin/) 插件
2. 在 AE 中选择你的合成
3. Window → Extensions → Bodymovin
4. 选择合成并导出为 JSON

#### 方法 2: 使用在线工具
- [LottieFiles](https://lottiefiles.com/) - 上传视频或 AE 文件转换
- [Lottie Editor](https://edit.lottiefiles.com/) - 在线编辑和优化

#### 方法 3: 从视频转换（质量一般）
- [Lottie Creator](https://lottiecreator.com/) - AI 视频转 Lottie
- 注意：复杂动画转换效果可能不理想

### 当前实现的智能降级

组件已实现三层降级策略：

```
1. Lottie JSON (最佳) → 
2. GIF (降级) → 
3. 静态图片 (最终降级)
```

只需将文件放到对应位置，组件会自动选择最佳方案：
- `public/girl-animation.json` - Lottie 动画
- `public/girl-animation.gif` - GIF 动画（可选）
- `public/girl.webp` 或 `public/girl.png` - 静态图片（必需）
