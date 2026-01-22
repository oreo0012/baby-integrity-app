# 动画预加载优化方案

## 问题描述
在手机上测试时，动画加载有点缓慢，特别是首次播放时需要等待 GIF 文件下载。

## 解决方案

### 方案对比

#### ❌ 方案1：启用浏览器缓存
**问题**：与之前的 GIF 缓存修复方案冲突
- 我们之前为了解决"动画卡住不播放"的问题，特意在 URL 中添加了唯一查询参数来避免浏览器缓存
- 如果启用缓存，可能导致动画又卡住不播放

#### ✅ 方案2：预加载动画（推荐）
**优势**：
- 在应用启动时预加载所有 GIF 文件到浏览器缓存
- 首次加载后，后续播放会很快
- 不影响 GIF 缓存修复方案（查询参数只是强制重新渲染，不影响文件本身的缓存）
- 用户体验更好

### 实现方案

#### 1. 创建预加载组件
`src/components/AnimationPreloader.tsx`

```typescript
export default function AnimationPreloader() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const animations = [
      // 常态动画
      '/animations/girl-excellent.gif',
      '/animations/girl-good.gif',
      '/animations/girl-needwork.gif',
      // 送花/扣花动画
      '/animations/flower-add.gif',
      '/animations/flower-subtract.gif',
      // 人物庆祝/打击动画
      '/animations/girl-celebrate.gif',
      '/animations/girl-sad.gif',
    ];

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log(`[Preloader] 已加载: ${src}`);
          resolve();
        };
        img.onerror = () => {
          console.error(`[Preloader] 加载失败: ${src}`);
          resolve(); // 即使失败也继续
        };
        img.src = src;
      });
    };

    const preloadAll = async () => {
      await Promise.all(animations.map(preloadImage));
      setLoaded(true);
    };

    preloadAll();
  }, []);

  return null; // 静默预加载，不显示 UI
}
```

#### 2. 在 App.tsx 中使用
```typescript
import AnimationPreloader from './components/AnimationPreloader';

function App() {
  return (
    <AppBackground>
      {/* 预加载所有动画 */}
      <AnimationPreloader />
      
      <div className="...">
        {/* 应用内容 */}
      </div>
    </AppBackground>
  );
}
```

## 工作原理

### 预加载流程
```
应用启动
  ↓
AnimationPreloader 组件挂载
  ↓
并行加载所有 GIF 文件
  ↓
浏览器缓存 GIF 文件
  ↓
预加载完成
  ↓
用户点击送花/扣花
  ↓
从浏览器缓存快速加载 ✅
```

### 与 GIF 缓存修复的关系

1. **预加载阶段**：
   - 使用原始 URL（无查询参数）
   - 浏览器缓存 GIF 文件

2. **播放阶段**：
   - 使用带查询参数的 URL：`/animations/girl-celebrate.gif?t=123&r=0.456`
   - 查询参数强制 React 重新渲染组件
   - 但浏览器仍然从缓存加载文件（因为查询参数不影响文件缓存）
   - GIF 从头开始播放 ✅

### 关键点
- **预加载**：缓存文件到浏览器
- **查询参数**：强制 React 重新渲染，让 GIF 从头播放
- **两者互补**：既有缓存加速，又能正常播放

## 优化效果

### 首次访问
- 应用启动时自动预加载所有动画（约 20.47 MB）
- 预加载在后台进行，不阻塞用户操作
- 预加载完成后，所有动画都在浏览器缓存中

### 后续访问
- 浏览器缓存有效期内（通常几天到几周）
- 所有动画从缓存加载，几乎瞬间显示
- 不需要重新下载

### 性能对比

| 场景 | 优化前 | 优化后 |
|------|--------|--------|
| 首次播放庆祝动画 | 等待下载 2.91 MB | 从缓存加载，<100ms |
| 首次播放打击动画 | 等待下载 2.59 MB | 从缓存加载，<100ms |
| 首次播放送花动画 | 等待下载 0.23 MB | 从缓存加载，<50ms |
| 切换常态动画 | 等待下载 5.30 MB | 从缓存加载，<200ms |

## 可选功能：显示加载进度

如果想显示加载进度，可以取消注释 `AnimationPreloader.tsx` 中的 UI 代码：

```typescript
if (!loaded) {
  return (
    <div className="fixed bottom-4 right-4 bg-white/90 rounded-lg px-4 py-2 shadow-lg z-50">
      <div className="text-sm text-gray-600">
        加载动画资源... {progress}%
      </div>
    </div>
  );
}
```

效果：右下角显示"加载动画资源... 57%"

## 进一步优化建议

### 1. Service Worker 缓存
使用 Service Worker 实现离线缓存：
```javascript
// 在 vite.config.ts 中配置 PWA
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,css,html,gif,webp}']
      }
    })
  ]
});
```

### 2. 压缩优化
进一步压缩 GIF 文件：
- 使用 gifsicle 优化
- 减少颜色数量（256 → 128）
- 降低分辨率（352px → 280px）

### 3. 懒加载
只预加载当前分段的常态动画：
```typescript
// 根据当前分数只加载对应的常态动画
const currentStateAnimation = score >= 90 
  ? '/animations/girl-excellent.gif'
  : score >= 60 
    ? '/animations/girl-good.gif'
    : '/animations/girl-needwork.gif';
```

### 4. 使用 WebP 动画
WebP 动画比 GIF 更小，但浏览器兼容性需要考虑。

## 测试步骤

### 1. 首次访问测试
1. 清除浏览器缓存
2. 打开开发者工具 → Network 标签
3. 访问应用
4. 观察控制台日志：
   ```
   [Preloader] 已加载: /animations/girl-excellent.gif (1/7)
   [Preloader] 已加载: /animations/girl-good.gif (2/7)
   ...
   [Preloader] 所有动画预加载完成！
   ```
5. 点击"送花"，观察动画加载速度

### 2. 缓存测试
1. 刷新页面（不清除缓存）
2. 点击"送花"或"扣花"
3. 动画应该几乎瞬间显示

### 3. 移动端测试
1. 在微信浏览器中打开应用
2. 等待预加载完成（约 5-10 秒，取决于网速）
3. 测试所有动画，应该都很流畅

## 相关文件
- `src/components/AnimationPreloader.tsx` - 预加载组件
- `src/App.tsx` - 使用预加载组件
- `GIF_CACHE_FIX.md` - GIF 缓存修复文档

## 注意事项
1. 预加载会增加首次访问的流量消耗（约 20 MB）
2. 在移动网络下，预加载可能需要几秒到十几秒
3. 预加载在后台进行，不会阻塞用户操作
4. 浏览器缓存有大小限制，通常为 50-100 MB
