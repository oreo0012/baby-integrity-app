# Lottie JSON 文件问题诊断

## 问题发现

当前的 `girl-animation.json` 文件**不是真正的 Lottie 矢量动画**，而是一个引用外部视频的 After Effects 导出文件。

### 文件内容分析

```json
{
  "assets": [{
    "id": "video_0",
    "w": 704,
    "h": 1248,
    "u": "images/",
    "p": "vid_0.mp4",  // ❌ 引用了外部视频文件
    "e": 0
  }]
}
```

### 问题说明

1. **引用了外部视频**: 文件中包含 `"p":"vid_0.mp4"`，表示需要 `images/vid_0.mp4` 视频文件
2. **视频文件缺失**: `public/images/vid_0.mp4` 不存在
3. **不是矢量动画**: 这不是真正的 Lottie 矢量动画，只是视频的包装器
4. **无法播放**: 因为缺少视频文件，所以动画无法显示

## 解决方案

### 方案 1: 获取真正的 Lottie 矢量动画（推荐）

你需要重新导出动画，确保是**纯矢量**的 Lottie JSON，不包含视频引用。

#### 从 After Effects 正确导出

1. 打开 After Effects 项目
2. 确保合成中**没有视频图层**，只有形状、路径、文本等矢量元素
3. 使用 Bodymovin 插件导出时：
   - ✅ 勾选 "Glyphs" (如果有文本)
   - ✅ 勾选 "Compress JSON"
   - ❌ 不要包含视频或图片图层
4. 导出后检查 JSON 文件，确保 `assets` 数组为空或只包含形状数据

#### 使用在线工具转换

如果原始动画确实包含视频：

1. **LottieFiles**: https://lottiefiles.com/
   - 上传你的 MP4 视频
   - 使用 AI 转换为矢量动画
   - 下载纯 Lottie JSON

2. **Lottie Creator**: https://lottiecreator.com/
   - 上传视频
   - AI 自动转换为矢量
   - 注意：复杂动画可能效果不佳

### 方案 2: 提供缺失的视频文件（临时方案）

如果你有原始的 `vid_0.mp4` 文件：

1. 创建文件夹：
   ```bash
   mkdir public/images
   ```

2. 将 `vid_0.mp4` 放到 `public/images/` 目录

3. 但这样做的缺点：
   - ❌ 文件会很大（视频通常几 MB）
   - ❌ 失去了 Lottie 的优势（小文件、矢量、可编程）
   - ❌ 可能有兼容性问题

### 方案 3: 使用 GIF 或静态图片（降级方案）

如果无法获取真正的 Lottie 动画：

1. **使用 GIF**:
   - 将 MP4 转换为 GIF
   - 放到 `public/girl-animation.gif`
   - 组件会自动降级使用 GIF

2. **使用静态图片**:
   - 当前已有 `public/girl.webp`
   - 组件会最终降级到静态图片

## 如何验证 Lottie JSON 是否正确

### 检查点 1: 文件大小
- ✅ 真正的 Lottie: 通常 10KB - 500KB
- ❌ 包含视频引用: 通常很小（< 10KB），因为只是引用

### 检查点 2: assets 数组
```json
// ✅ 正确的 Lottie (无外部资源)
"assets": []

// ✅ 正确的 Lottie (内嵌图片，base64)
"assets": [{
  "id": "image_0",
  "w": 100,
  "h": 100,
  "p": "data:image/png;base64,iVBORw0KG..."
}]

// ❌ 错误的 Lottie (引用外部视频)
"assets": [{
  "id": "video_0",
  "p": "vid_0.mp4"  // 外部文件引用
}]
```

### 检查点 3: 在线验证

访问 https://lottiefiles.com/preview 上传你的 JSON 文件：
- ✅ 如果能正常预览，说明文件正确
- ❌ 如果显示错误或空白，说明文件有问题

## 推荐的工作流程

1. **最佳方案**: 从 AE 重新导出纯矢量 Lottie
2. **次选方案**: 使用 LottieFiles AI 转换视频为矢量
3. **临时方案**: 使用 GIF 格式（支持透明背景）
4. **降级方案**: 使用静态图片

## 当前状态

- ❌ Lottie JSON 无法播放（缺少视频文件）
- ✅ 组件会自动降级到静态图片 `girl.webp`
- ✅ 页面仍然可以正常显示

## 下一步行动

请选择以下之一：

1. **提供真正的 Lottie JSON 文件**（推荐）
   - 从 AE 重新导出
   - 或使用在线工具转换

2. **提供 vid_0.mp4 视频文件**（临时）
   - 创建 `public/images/` 文件夹
   - 放入视频文件

3. **使用 GIF 格式**（简单）
   - 转换 MP4 为 GIF
   - 放到 `public/girl-animation.gif`

4. **保持当前状态**（降级）
   - 使用静态图片 `girl.webp`
   - 无动画效果
