# 动画集成指南

## 小女孩动画实现方案

### 使用的技术方案
- **格式**: WebM (VP9 编码 + Alpha 透明通道)
- **优势**: 支持透明背景、文件小、浏览器原生支持、循环播放流畅

### 视频转换步骤

#### 方法 1: 使用 FFmpeg (推荐)

1. **安装 FFmpeg**
   ```bash
   # Windows
   winget install FFmpeg
   
   # 或从官网下载: https://ffmpeg.org/download.html
   ```

2. **转换命令**
   ```bash
   ffmpeg -i input.mp4 -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 girl-animation.webm
   ```

   参数说明:
   - `-c:v libvpx-vp9`: 使用 VP9 编码器
   - `-pix_fmt yuva420p`: 启用 Alpha 透明通道
   - `-auto-alt-ref 0`: 禁用自动参考帧(避免播放问题)

3. **优化文件大小** (可选)
   ```bash
   ffmpeg -i input.mp4 -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 1M girl-animation.webm
   ```
   `-b:v 1M` 设置比特率为 1Mbps,可根据需要调整

#### 方法 2: 在线转换工具

如果不想安装 FFmpeg,可以使用:
- https://cloudconvert.com/mp4-to-webm
- https://convertio.co/mp4-webm/

**注意**: 在线工具可能不支持透明通道,建议使用 FFmpeg

### 文件放置

将转换后的 `girl-animation.webm` 文件放到:
```
baby-integrity-app/public/girl-animation.webm
```

### 组件使用

已创建 `GirlAnimation` 组件,在 `App.tsx` 中自动循环播放:

```tsx
import GirlAnimation from './components/GirlAnimation';

<GirlAnimation className="w-full h-full drop-shadow-lg" />
```

### 浏览器兼容性

- ✅ Chrome/Edge: 完全支持
- ✅ Firefox: 完全支持
- ✅ Safari 14.1+: 支持
- ⚠️ 旧版浏览器: 自动降级显示静态图片

### 性能优化建议

1. **文件大小**: 建议控制在 500KB - 2MB
2. **分辨率**: 建议 720p 或更低(当前显示区域为 288x500px)
3. **帧率**: 24-30fps 即可
4. **时长**: 2-5秒循环动画最佳

### 故障排查

**问题: 视频不自动播放**
- 确保视频有 `muted` 属性(浏览器限制)
- 检查浏览器控制台错误信息

**问题: 背景不透明**
- 确认源视频有透明通道
- 检查 FFmpeg 转换参数是否正确

**问题: 文件太大**
- 降低比特率: `-b:v 800K`
- 降低分辨率: `-vf scale=720:-1`
- 减少帧率: `-r 24`

### 备选方案

如果 WebM 遇到问题,可以考虑:

1. **Lottie JSON** (需要 AE 源文件)
   ```bash
   npm install lottie-react
   ```

2. **APNG** (PNG 序列动画)
   - 兼容性好但文件较大

3. **CSS Sprite Animation** (帧序列)
   - 完全控制但实现复杂
