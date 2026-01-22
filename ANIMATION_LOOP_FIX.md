# 送花/扣花动画循环问题修复

## 问题1：动画循环播放
根据 PRD 需求：
> 送花动画，动画播放1次，播放完毕后定格在最后一帧停留1秒后渐隐
> 扣花动画，动画播放1次，播放完毕后定格在最后一帧停留1秒后渐隐

但实际表现：送花、扣花动画会循环播放，不符合需求。

## 问题2：动画提前播放
在随机分值滚动过程中，送花/扣花动画就开始播放，导致：
- 数字每跳动一次，动画就播放一次
- 动画应该在随机分值确定后才播放

## 原因分析

### 问题1原因
生成 GIF 时未指定循环次数，FFmpeg 默认使用 `-loop 0`（无限循环）。

### 问题2原因
`AnimationOverlay` 组件在渲染时就加载了动画图片，导致 GIF 在随机数滚动的同时就开始播放。

## 解决方案

### 方案1：设置 GIF 循环次数
在 `scripts/convert-animations.js` 中，为不同类型的动画设置不同的循环参数：

```javascript
const animations = [
  // 常态动画（循环播放）
  { name: '优秀_常态', loop: true },  // -loop 0 无限循环
  { name: '良好_常态', loop: true },
  { name: '要加油_常态', loop: true },
  
  // 送花/扣花动画（播放1次）
  { name: '送花', loop: false },      // -loop -1 只播放1次
  { name: '扣花', loop: false },
  
  // 人物加扣分动画（播放1次）
  { name: '送花_庆祝', loop: false },
  { name: '扣花_打击', loop: false }
];

// FFmpeg 命令
const loopValue = anim.loop ? '0' : '-1';
const command = `ffmpeg ... -loop ${loopValue} "${outputPath}"`;
```

### 方案2：延迟显示动画图片
在 `AnimationOverlay.tsx` 中，添加 `showAnimation` 状态控制动画图片的显示时机：

```typescript
const [showAnimation, setShowAnimation] = useState(false);

// 随机数滚动结束后，才显示动画图片
const rollTimer = setTimeout(() => {
  clearInterval(rollInterval);
  setDisplayScore(targetScore);
  setIsRolling(false);
  
  // 滚动结束后，显示动画图片
  setShowAnimation(true);
  console.log(`[Overlay] 开始显示动画图片 #${newId}`);
}, 1000);

// 渲染时只在 showAnimation 为 true 时显示图片
{showAnimation && (
  <div className="w-full max-w-[390px]">
    <img src={uniqueImageSrc} ... />
  </div>
)}
```

这样确保：
1. 随机数滚动时，动画图片不渲染，GIF 不会加载
2. 滚动结束后，才开始加载和显示 GIF
3. GIF 从头开始播放，只播放1次

### 方案3：重新生成动画

#### FFmpeg 循环参数说明
- `-loop 0`: 无限循环（用于常态动画）
- `-loop -1`: 不循环，只播放1次（用于送花/扣花/庆祝/打击动画）
- `-loop N`: 循环 N 次

#### 执行转换
```bash
cd baby-integrity-app
node scripts/convert-animations.js
```

## 验证结果

所有动画已重新生成：

| 文件 | 大小 | 循环设置 | 状态 |
|------|------|---------|------|
| girl-excellent.gif | 5.30 MB | 无限循环 ✅ | ✅ |
| girl-good.gif | 5.07 MB | 无限循环 ✅ | ✅ |
| girl-needwork.gif | 3.96 MB | 无限循环 ✅ | ✅ |
| flower-add.gif | 0.23 MB | 只播放1次 ✅ | ✅ |
| flower-subtract.gif | 0.46 MB | 只播放1次 ✅ | ✅ |
| girl-celebrate.gif | 2.88 MB | 只播放1次 ✅ | ✅ |
| girl-sad.gif | 2.57 MB | 只播放1次 ✅ | ✅ |

总大小：20.47 MB

## 测试步骤

### 1. 验证动画只播放1次
1. 打开应用：http://localhost:5174/
2. 点击"送花"，选择一个项目
3. 观察送花动画是否只播放1次（不循环）
4. 观察人物庆祝动画是否只播放1次（不循环）
5. 观察恢复的常态动画是否循环播放
6. 重复测试"扣花"流程

### 2. 验证动画播放时机
1. 点击"送花"，选择一个项目
2. 观察随机数字滚动（1秒）
3. **关键**：确认在数字滚动期间，送花动画图片不显示
4. **关键**：确认数字停止后，送花动画才开始显示和播放
5. 观察送花动画只播放1次
6. 重复测试"扣花"流程

## 预期效果

### 送花流程（修正后）
1. 选择项目 → 模态框关闭
2. **只显示随机数字滚动**（1秒，动画图片不显示）
3. 数字停止，显示最终分值
4. **送花动画图片开始显示和播放**（1.4秒，只播放1次）
5. 定格在最后一帧（1秒）
6. 渐隐（0.5秒）
7. 人物庆祝动画播放1次（4秒）
8. 恢复常态动画（循环播放）

### 扣花流程（修正后）
1. 选择项目 → 模态框关闭
2. **只显示随机数字滚动**（1秒，动画图片不显示）
3. 数字停止，显示最终分值
4. **扣花动画图片开始显示和播放**（1.4秒，只播放1次）
5. 定格在最后一帧（1秒）
6. 渐隐（0.5秒）
7. 人物打击动画播放1次（4秒）
8. 恢复常态动画（循环播放）

## 修复记录

### 2025-01-21 修复1：GIF 循环次数
- 更新 `scripts/convert-animations.js`
- 使用 FFmpeg `-loop -1` 设置送花/扣花/庆祝/打击动画只播放1次
- 重新生成所有动画文件

### 2025-01-21 修复2：动画播放时机
- 更新 `src/components/AnimationOverlay.tsx`
- 添加 `showAnimation` 状态控制动画图片显示时机
- 确保随机数滚动结束后才显示和播放动画
- 避免动画在数字滚动时就开始播放

## 相关文件
- `scripts/convert-animations.js` - 动画转换脚本（修复1）
- `src/components/AnimationOverlay.tsx` - 动画叠加层组件（修复2）
- `public/animations/*.gif` - 所有动画文件
- `GIF_CACHE_FIX.md` - GIF 缓存问题修复文档
