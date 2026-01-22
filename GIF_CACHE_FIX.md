# GIF 缓存问题修复方案

## 问题描述

### 问题1：送花/扣花叠加层动画 GIF 缓存
在测试中发现一个规律：
- **第1次操作**：动画正常播放 ✅
- **第2次操作**：GIF 卡在静态帧不播放 ❌
- **第3次操作**：动画正常播放 ✅
- **第4次操作**：GIF 卡在静态帧不播放 ❌
- 依此类推...

### 问题2：送花/扣花动画循环播放
需求要求送花、扣花动画只播放1次，但 GIF 默认会循环播放。

### 问题3：人物庆祝/打击动画 GIF 缓存
人物庆祝/打击动画偶尔会卡在第一帧不播放，同样是 GIF 缓存问题。

## 根本原因

### 问题1和问题3原因（GIF 缓存）
这是典型的 **GIF 缓存问题**：

1. 浏览器会缓存 GIF 文件
2. 当第二次加载相同 URL 的 GIF 时，浏览器从缓存中读取
3. 缓存的 GIF 停留在上次播放结束的位置（最后一帧或第一帧）
4. 浏览器不会重新播放已经播放过的 GIF

### 问题2原因（循环播放）
生成 GIF 时未指定循环次数，FFmpeg 默认使用 `-loop 0`（无限循环）。

## 解决方案

### 解决方案1：强制重新加载送花/扣花叠加层 GIF

在 `AnimationOverlay.tsx` 中实现了三重保障：

### 1. 递增的动画计数器
```typescript
let animationCounter = 0;

useEffect(() => {
  if (!type) return;
  
  // 每次播放动画时递增计数器
  animationCounter++;
  const newId = animationCounter;
  setAnimationId(newId);
  
  // ...
}, [type, ...]);
```

### 2. 使用 key 强制重新渲染
```typescript
<img 
  key={animationId} // 每次 animationId 变化，React 会销毁旧元素并创建新元素
  src={uniqueImageSrc}
  // ...
/>
```

### 3. URL 添加唯一查询参数
```typescript
// 添加时间戳和随机数，确保 URL 唯一
const uniqueImageSrc = `${config.path}?t=${animationId}&r=${Math.random()}`;
```

这样每次播放动画时：
- `animationId` 递增（1, 2, 3, 4...）
- React 的 `key` 变化，强制重新创建 DOM 元素
- URL 包含唯一参数，浏览器认为是新资源，不使用缓存
- GIF 从头开始播放

### 解决方案2：设置 GIF 循环次数

在 `scripts/convert-animations.js` 中，使用 FFmpeg 的 `-loop` 参数控制循环：

```javascript
// -loop 0: 无限循环（常态动画）
// -loop -1: 不循环，只播放1次（送花/扣花/庆祝/打击动画）
const loopValue = anim.loop ? '0' : '-1';
const command = `ffmpeg -y -framerate 24 -i "${anim.input}" -vf "..." -loop ${loopValue} "${outputPath}"`;
```

动画配置：
- **常态动画**（优秀/良好/要加油）：`loop: true` → `-loop 0` 无限循环
- **送花/扣花动画**：`loop: false` → `-loop -1` 只播放1次
- **庆祝/打击动画**：`loop: false` → `-loop -1` 只播放1次

### 解决方案3：强制重新加载人物动画 GIF

在 `GirlAnimation.tsx` 中应用同样的 GIF 缓存修复方案：

```typescript
// 1. 添加动画 ID 状态
const [animationId, setAnimationId] = useState(0);

// 2. 每次切换动画时更新 ID
const newId = Date.now();
setAnimationId(newId);

// 3. 在 URL 中添加唯一查询参数
<img 
  key={imageKey}
  src={`${imageSrc}?t=${animationId}&r=${Math.random()}`}
  alt="小女孩"
/>
```

这样确保：
- 每次播放临时动画（庆祝/打击）时，URL 都是唯一的
- 切换回常态动画时，URL 也是唯一的
- 浏览器不会使用缓存，GIF 从头开始播放

## 测试步骤

### 1. 基础功能测试
- [ ] 点击"送花"，选择一个项目
- [ ] 观察：模态框关闭 → 随机数字滚动1秒 → 送花动画播放 → 人物庆祝动画 → 恢复常态动画
- [ ] 点击"扣花"，选择一个项目
- [ ] 观察：模态框关闭 → 随机数字滚动1秒 → 扣花动画播放 → 人物打击动画 → 恢复常态动画

### 2. GIF 缓存问题测试（重点）
- [ ] 连续点击"送花" 10次，每次观察送花动画和人物庆祝动画是否正常播放
- [ ] 连续点击"扣花" 10次，每次观察扣花动画和人物打击动画是否正常播放
- [ ] 交替点击"送花"和"扣花"，观察动画切换是否正常
- [ ] **关键**：确认人物庆祝/打击动画不会卡在第一帧

### 3. GIF 循环次数测试（新增）
- [ ] 点击"送花"，观察送花动画是否只播放1次（不循环）
- [ ] 点击"扣花"，观察扣花动画是否只播放1次（不循环）
- [ ] 观察人物庆祝/打击动画是否只播放1次（不循环）
- [ ] 观察常态动画是否循环播放（无限循环）

### 4. 分段切换测试
- [ ] 初始分数100分（优秀状态，绿色进度条）
- [ ] 扣花至89分以下，观察常态动画切换为"良好"，进度条变黄色
- [ ] 扣花至59分以下，观察常态动画切换为"要加油"，进度条变红色
- [ ] 送花至60分以上，观察常态动画切换为"良好"，进度条变黄色
- [ ] 送花至90分以上，观察常态动画切换为"优秀"，进度条变绿色

### 5. 快速点击测试
- [ ] 快速连续点击"送花"按钮，确认不会触发多次动画
- [ ] 在动画播放过程中点击按钮，确认被正确阻止

### 6. 控制台日志检查
打开浏览器控制台，观察日志输出：
```
[Overlay] 开始播放 #1: flower-add, 目标: 5
[Overlay] 滚动结束 #1: 5
[Overlay] 图片加载完成 #1
[Overlay] 动画完成 #1，开始渐隐
[Overlay] 完全结束 #1
[App] flower-add 动画完成
[App] 开始播放庆祝动画
播放临时动画: celebrate
[App] 人物动画结束
选择优秀动画 (分数: 100)
```

## 动画时长配置

所有动画均为 24fps：

| 动画类型 | 帧数 | 时长 | 循环 | 配置 |
|---------|------|------|------|------|
| 送花动画 | 33帧 | 1.4秒 | ❌ 只播放1次 | `flower-add.gif` |
| 扣花动画 | 33帧 | 1.4秒 | ❌ 只播放1次 | `flower-subtract.gif` |
| 人物庆祝 | 95帧 | 4秒 | ❌ 只播放1次 | `girl-celebrate.gif` |
| 人物打击 | 95帧 | 4秒 | ❌ 只播放1次 | `girl-sad.gif` |
| 优秀常态 | 168帧 | 7秒 | ✅ 无限循环 | `girl-excellent.gif` |
| 良好常态 | 168帧 | 7秒 | ✅ 无限循环 | `girl-good.gif` |
| 要加油常态 | 168帧 | 7秒 | ✅ 无限循环 | `girl-needwork.gif` |

## 完整动画流程

```
用户点击"送花/扣花"
    ↓
选择具体项目
    ↓
模态框关闭
    ↓
AnimationOverlay 显示
    ↓
随机数字滚动（1秒）
    ↓
显示最终分值
    ↓
播放送花/扣花动画（1.4秒）
    ↓
动画停留在最后一帧（1秒）
    ↓
AnimationOverlay 渐隐（0.5秒）
    ↓
GirlAnimation 播放庆祝/打击动画（4秒）
    ↓
恢复常态动画（根据最新分数选择）
    ↓
显示通知
```

## 已知问题

无

## 修复记录

### 2025-01-21
1. ✅ 修复 GIF 缓存问题（奇数次正常，偶数次卡住）
   - 添加递增的 `animationCounter`
   - 使用 `key={animationId}` 强制重新渲染
   - URL 添加唯一查询参数 `?t=${animationId}&r=${Math.random()}`

2. ✅ 修复送花/扣花动画循环播放问题
   - 更新 `convert-animations.js` 脚本
   - 使用 FFmpeg `-loop -1` 参数设置只播放1次
   - 重新生成所有动画文件

## 性能优化建议

1. **图片预加载**：已实现，在组件加载时预加载图片
2. **防止重复点击**：已实现，使用 `isProcessing` 状态
3. **内存管理**：已实现，组件卸载时清理所有定时器

## 相关文件

- `src/components/AnimationOverlay.tsx` - 送花/扣花动画叠加层
- `src/components/GirlAnimation.tsx` - 人物常态和临时动画
- `src/components/AddFlowerModal.tsx` - 送花模态框
- `src/components/SubtractFlowerModal.tsx` - 扣花模态框
- `src/App.tsx` - 主应用逻辑


## 修复记录

### 2025-01-21 修复1：送花/扣花叠加层 GIF 缓存
- 在 `AnimationOverlay.tsx` 中添加递增的 `animationCounter`
- 使用 `key={animationId}` 强制重新渲染
- URL 添加唯一查询参数 `?t=${animationId}&r=${Math.random()}`

### 2025-01-21 修复2：送花/扣花动画循环播放
- 更新 `convert-animations.js` 脚本
- 使用 FFmpeg `-loop -1` 参数设置只播放1次
- 重新生成所有动画文件

### 2025-01-21 修复3：人物庆祝/打击动画 GIF 缓存
- 在 `GirlAnimation.tsx` 中添加 `animationId` 状态
- 每次切换动画时使用 `Date.now()` 生成唯一 ID
- URL 添加唯一查询参数 `?t=${animationId}&r=${Math.random()}`
- 确保临时动画（庆祝/打击）和常态动画都能正常播放

## 相关文件
- `src/components/AnimationOverlay.tsx` - 送花/扣花动画叠加层（修复1）
- `src/components/GirlAnimation.tsx` - 人物常态和临时动画（修复3）
- `scripts/convert-animations.js` - 动画转换脚本（修复2）
- `src/components/AddFlowerModal.tsx` - 送花模态框
- `src/components/SubtractFlowerModal.tsx` - 扣花模态框
- `src/App.tsx` - 主应用逻辑
