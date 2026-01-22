# 分值更新问题修复

## 问题描述
进行送花、扣花操作后，分值没有变化。

## 根本原因
在 `AddFlowerModal` 和 `SubtractFlowerModal` 中，点击项目后只是播放动画，但没有实际调用分数更新逻辑。

原代码注释中提到"在动画流程中会处理分数更新"，但实际上并没有实现这个逻辑。

## 解决方案

### 1. 添加待更新分数状态
在 `App.tsx` 中添加 `pendingScoreUpdate` 状态，保存待更新的分数信息：

```typescript
const [pendingScoreUpdate, setPendingScoreUpdate] = useState<{
  type: 'add' | 'subtract',
  score: number,
  itemName: string
} | null>(null);
```

### 2. 在动画开始时保存分数信息
修改 `playAnimation` 函数，接收并保存项目名称和分值：

```typescript
const playAnimation = (
  type: AnimationType,
  targetScore: number,
  minScore: number,
  maxScore: number,
  itemName: string  // 新增参数
) => {
  // 保存待更新的分数信息
  setPendingScoreUpdate({
    type: type === 'flower-add' ? 'add' : 'subtract',
    score: targetScore,
    itemName: itemName
  });
};
```

### 3. 在人物动画结束后更新分数
修改 `handleTempAnimationEnd` 函数，在人物动画结束后更新分数：

```typescript
const handleTempAnimationEnd = () => {
  if (pendingScoreUpdate) {
    const { type, score: scoreValue, itemName } = pendingScoreUpdate;
    const scoreBefore = getCurrentScore();
    let scoreAfter: number;
    
    if (type === 'add') {
      scoreAfter = Math.min(scoreBefore + scoreValue, 100);
      setCurrentScore(scoreAfter);
      
      // 添加历史记录
      const historyItem: ScoreHistoryItem = {
        id: `history-${Date.now()}`,
        type: 'add',
        itemName: itemName,
        scoreChange: scoreValue,
        scoreBefore,
        scoreAfter,
        timestamp: Date.now(),
      };
      addScoreHistoryItem(historyItem);
      
      showToast(`送花成功！+${scoreValue}分`, 'success');
    } else {
      // 扣分逻辑类似
    }
    
    loadScore();
    setPendingScoreUpdate(null);
  }
};
```

### 4. 更新模态框组件
修改 `AddFlowerModal` 和 `SubtractFlowerModal`，传递项目名称：

```typescript
// AddFlowerModal.tsx
onPlayAnimation('flower-add', targetScore, item.minScore, item.maxScore, item.name);

// SubtractFlowerModal.tsx
onPlayAnimation('flower-subtract', targetScore, item.minScore, item.maxScore, item.name);
```

## 完整流程

```
用户点击送花/扣花项目
  ↓
模态框计算随机分值
  ↓
调用 playAnimation，保存待更新的分数信息到 pendingScoreUpdate
  ↓
模态框关闭
  ↓
随机数字滚动（1秒）
  ↓
送花/扣花动画播放（1.4秒）
  ↓
人物庆祝/打击动画播放（4秒）
  ↓
handleTempAnimationEnd 被调用
  ↓
从 pendingScoreUpdate 读取分数信息
  ↓
更新 localStorage 中的分数
  ↓
添加历史记录
  ↓
刷新 UI（loadScore）
  ↓
显示通知（Toast）
  ↓
清空 pendingScoreUpdate
```

## 测试步骤

1. 打开应用：http://localhost:5174/
2. 记录当前分数（例如：100分）
3. 点击"送花"，选择一个项目（例如："主动做家务"）
4. 观察动画流程：
   - 随机数字滚动
   - 送花动画播放
   - 人物庆祝动画播放
5. **验证**：动画结束后，分数应该增加（例如：100 → 105）
6. **验证**：显示成功通知"送花成功！+5分"
7. 点击"扣花"，选择一个项目
8. **验证**：动画结束后，分数应该减少
9. **验证**：显示成功通知"扣花成功！-X分"
10. 点击历史记录按钮，查看记录是否正确添加

## 修复文件
- `src/App.tsx` - 添加分数更新逻辑
- `src/components/AddFlowerModal.tsx` - 传递项目名称
- `src/components/SubtractFlowerModal.tsx` - 传递项目名称

## 相关问题
- ✅ 分值更新问题（本次修复）
- ✅ 动画循环播放问题（已修复）
- ✅ 动画播放时机问题（已修复）
- ✅ GIF 缓存问题（已修复）
