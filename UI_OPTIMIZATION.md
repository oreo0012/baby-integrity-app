# UI优化更新

## 更新时间
2026年1月21日

## 优化内容

### 1. 主界面卡片优化
- 调整布局，分数和评级分开显示
- 添加分段评级显示：
  - **优秀**（绿色）：90-100分
  - **良好**（蓝色）：60-89分
  - **要努力**（红色）：0-59分
- 进度条颜色与评级对应

### 2. 弹窗样式统一
所有二级弹窗（我的权益、赠送红花、扣除红花、历史记录）统一为：
- 白色背景
- 标题栏带底部边框
- 关闭按钮在标题栏右侧
- 内容区域可滚动

### 3. 赠送/扣除红花列表优化
- 文字左对齐
- 添加图标显示（送花icon.png / 扣花icon.png）
- 右侧显示真实配置的分值范围（如：1~3）
- 布局更清晰，信息更直观

### 4. 图标素材
- 赠送红花图标：`/add-flower-icon.png`
- 扣除红花图标：`/subtract-flower-icon.png`
- 图标已复制到 `public` 目录

## 修改文件
- `src/App.tsx` - 主界面卡片布局和评级显示
- `src/components/RewardsModal.tsx` - 权益弹窗白底样式
- `src/components/AddFlowerModal.tsx` - 赠送红花弹窗优化
- `src/components/SubtractFlowerModal.tsx` - 扣除红花弹窗优化
- `src/components/HistoryModal.tsx` - 历史记录弹窗白底样式
