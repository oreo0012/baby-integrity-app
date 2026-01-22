# 动画闪烁问题修复

## 问题描述

在人物动画切换时，会出现多次闪烁（通常是2-3次），影响用户体验。

## 问题原因

### 触发流程分析

当播放临时动画（庆祝/打击）时，会发生以下事件序列：

1. **第一次触发**：`tempAnimation` 从 `null` 变为 `'celebrate'` 或 `'sad'`
   - 触发临时动画 `useEffect`
   - 加载临时动画（第一次渐隐渐现）

2. **第二次触发**：临时动画播放完成
   - `complete` 事件触发
   - 在事件处理中调用 `loadAnimation` 加载常态动画（第二次渐隐渐现）

3. **第三次触发**：`tempAnimation` 变回 `null`
   - 触发常态动画 `useEffect`
   - 再次尝试加载常态动画（第三次渐隐渐现）❌

**问题**：第2步和第3步都尝试加载相同的常态动画，导致重复闪烁！

## 解决方案

### 1. 路径缓存机制

使用 `currentPathRef` 记录当前加载的动画路径：

```typescript
const currentPathRef = useRef<string>('');

// 在加载动画前检查
if (currentPathRef.current === path && animationRef.current) {
  console.log(`动画已加载，跳过: ${path}`);
  return;
}
```

**作用**：防止加载相同的动画文件。

### 2. 状态标记机制

使用 `isLoadingFromTempRef` 标记是否从临时动画切换回来：

```typescript
const isLoadingFromTempRef = useRef(false);

// 在临时动画完成时设置标记
animationRef.current.addEventListener('complete', () => {
  isLoadingFromTempRef.current = true;
  loadAnimation(statePath, true, true);
  
  // 延迟重置标记
  setTimeout(() => {
    isLoadingFromTempRef.current = false;
  }, 500);
});

// 在常态动画 useEffect 中检查标记
if (isLoadingFromTempRef.current) {
  console.log('从临时动画切换回来，跳过重复加载');
  return;
}
```

**作用**：防止 `tempAnimation` 变回 `null` 时重复加载。

## 修复效果

### 修复前
```
送花按钮点击
  ↓
临时动画加载 (闪烁1次)
  ↓
临时动画完成 → 加载常态动画 (闪烁2次)
  ↓
tempAnimation=null → 再次加载常态动画 (闪烁3次) ❌
```

### 修复后
```
送花按钮点击
  ↓
临时动画加载 (渐隐渐现1次)
  ↓
临时动画完成 → 加载常态动画 (渐隐渐现1次)
  ↓
tempAnimation=null → 检测到已加载，跳过 ✅
```

## 技术细节

### 路径检查逻辑

```typescript
// 如果路径相同且动画实例存在，跳过加载
if (currentPathRef.current === path && animationRef.current) {
  return;
}

// 加载新动画时更新路径
currentPathRef.current = path;
```

### 标记重置时机

```typescript
// 在临时动画完成后延迟500ms重置标记
setTimeout(() => {
  isLoadingFromTempRef.current = false;
}, 500);
```

**为什么是500ms？**
- 确保常态动画的 `useEffect` 已经执行完毕
- 给渐隐渐现效果留出足够时间（300ms + 缓冲）

### 防止竞态条件

使用 `isTransitioning` 标志防止在过渡期间重复触发：

```typescript
if (withFade && !isTransitioning) {
  setIsTransitioning(true);
  // ... 执行过渡
}
```

## 测试场景

### 场景1：送花操作
1. 点击送花按钮
2. 观察动画切换
3. **预期**：只有2次平滑过渡（临时动画进入 + 常态动画返回）

### 场景2：扣花操作
1. 点击扣花按钮
2. 观察动画切换
3. **预期**：只有2次平滑过渡（临时动画进入 + 常态动画返回）

### 场景3：分数变化
1. 送花使分数从60变到70（良好状态不变）
2. 观察动画切换
3. **预期**：只有2次平滑过渡，不会因为路径相同而重复加载

### 场景4：快速操作
1. 快速连续点击送花按钮
2. 观察动画切换
3. **预期**：每次操作都正常，不会出现卡顿或闪烁

## 调试日志

修复后的日志输出示例：

```
播放临时动画: celebrate
加载 Lottie 动画: /animations/girl-celebrate.json
临时动画播放完成
加载 Lottie 动画: /animations/girl-good.json
从临时动画切换回来，跳过重复加载 ✅
```

## 相关代码

### 关键变量
- `currentPathRef`: 当前动画路径
- `isLoadingFromTempRef`: 是否从临时动画切换
- `isTransitioning`: 是否正在过渡

### 关键函数
- `loadAnimation()`: 加载动画（带路径检查）
- 临时动画 `useEffect`: 处理临时动画
- 常态动画 `useEffect`: 处理常态动画（带标记检查）

## 性能优化

### 减少不必要的加载
- ✅ 路径相同时跳过加载
- ✅ 从临时动画切换时跳过重复加载
- ✅ 过渡期间防止重复触发

### 内存管理
- ✅ 加载新动画前销毁旧动画
- ✅ 组件卸载时清理资源
- ✅ 清理定时器

## 故障排除

### 如果仍然闪烁
1. 检查浏览器控制台日志
2. 确认是否有重复的"加载 Lottie 动画"日志
3. 检查 `currentPathRef` 是否正确更新

### 如果动画不切换
1. 检查路径是否正确
2. 确认 `currentPathRef` 没有被错误缓存
3. 尝试清除浏览器缓存

### 如果过渡不流畅
1. 调整 `setTimeout` 的延迟时间
2. 检查 CSS `transition-opacity` 是否生效
3. 确认没有其他 CSS 冲突

## 相关文档

- [动画过渡效果](./ANIMATION_TRANSITION.md)
- [Lottie 质量优化](./LOTTIE_QUALITY_OPTIMIZATION.md)
- [动画系统文档](./ANIMATION_SYSTEM.md)
