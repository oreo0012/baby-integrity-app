# 动画播放时机修复

## 问题描述
在随机分值滚动过程中，送花/扣花动画就开始播放，导致：
- 数字每跳动一次，动画就播放一次
- 动画应该在随机分值确定后才播放

## 根本原因
`AnimationOverlay` 组件在渲染时就加载了动画图片（`<img>` 标签），导致 GIF 在随机数滚动的同时就开始播放。

## 解决方案
添加 `showAnimation` 状态，控制动画图片的显示时机：

```typescript
// 添加状态
const [showAnimation, setShowAnimation] = useState(false);

// 初始不显示动画
setShowAnimation(false);

// 随机数滚动结束后，才显示动画图片
const rollTimer = setTimeout(() => {
  clearInterval(rollInterval);
  setDisplayScore(targetScore);
  setIsRolling(false);
  
  // 关键：滚动结束后才显示动画
  setShowAnimation(true);
}, 1000);

// 渲染时条件显示
{showAnimation && (
  <div className="w-full max-w-[390px]">
    <img src={uniqueImageSrc} ... />
  </div>
)}
```

## 修复效果

### 修复前
```
点击送花 → 模态框关闭
  ↓
随机数滚动开始（同时送花动画就开始播放）❌
  ↓
数字每跳动一次，GIF 就播放一次 ❌
```

### 修复后
```
点击送花 → 模态框关闭
  ↓
只显示随机数字滚动（1秒）✅
  ↓
数字停止，显示最终分值
  ↓
送花动画图片开始显示和播放（1.4秒，只播放1次）✅
  ↓
定格在最后一帧（1秒）
  ↓
渐隐（0.5秒）
  ↓
人物庆祝动画（4秒）
  ↓
恢复常态动画
```

## 测试验证

1. 打开应用：http://localhost:5174/
2. 点击"送花"，选择一个项目
3. **观察重点**：
   - ✅ 随机数字滚动期间，下方没有动画图片
   - ✅ 数字停止后，送花动画才开始显示
   - ✅ 送花动画只播放1次，不循环
4. 重复测试"扣花"流程

## 相关文件
- `src/components/AnimationOverlay.tsx` - 修复文件
- `ANIMATION_LOOP_FIX.md` - 完整修复文档
