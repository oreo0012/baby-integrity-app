# 移动端模态框适配优化

## 问题描述
在微信浏览器中，送花/扣花模态框显示不完整：
- 顶部被裁剪，看不到关闭按钮和标题
- 固定高度 `h-[844px]` 不适合不同屏幕尺寸
- 布局使用 `absolute` 定位，不够灵活

## 解决方案

### 1. 响应式高度
将固定高度改为响应式高度：

```tsx
// 修改前
<div className="relative w-full max-w-[390px] h-[844px]">

// 修改后
<div className="relative w-full max-w-[390px] max-h-[90vh] h-full">
```

- `max-h-[90vh]`: 最大高度为视口高度的90%
- `h-full`: 高度自适应内容
- 添加 `p-4`: 外层容器添加内边距，避免贴边

### 2. Flexbox 布局
将 `absolute` 定位改为 Flexbox 布局：

```tsx
// 修改前
<div className="absolute inset-0 bg-[#8B7E8F] rounded-3xl overflow-hidden">

// 修改后
<div className="absolute inset-0 bg-[#8B7E8F] rounded-3xl overflow-hidden flex flex-col">
```

### 3. 组件区域划分

#### 标题区域（flex-shrink-0）
```tsx
<div className="pt-6 pb-4 px-6 flex-shrink-0">
  <h2 className="text-white text-2xl font-bold text-center">赠送红花</h2>
</div>
```
- `flex-shrink-0`: 不收缩，保持固定高度
- 减小标题字号：`text-3xl` → `text-2xl`

#### 选项列表区域（flex-1）
```tsx
<div className="flex-1 px-6 overflow-y-auto">
  <div className="space-y-3 pb-4">
    {/* 选项按钮 */}
  </div>
</div>
```
- `flex-1`: 占据剩余空间
- `overflow-y-auto`: 内容过多时可滚动
- 减小按钮内边距和字号

#### 底部信息卡片（flex-shrink-0）
```tsx
<div className="flex-shrink-0 p-4 z-10">
  <div className="bg-[#6B6570]/80 backdrop-blur-sm rounded-3xl p-3 shadow-xl">
    {/* 分数和进度条 */}
  </div>
</div>
```
- `flex-shrink-0`: 不收缩，保持固定高度
- 减小内边距和字号

### 4. 尺寸优化

| 元素 | 修改前 | 修改后 | 说明 |
|------|--------|--------|------|
| 关闭按钮 | `w-12 h-12` | `w-10 h-10` | 减小尺寸 |
| 关闭图标 | `w-6 h-6` | `w-5 h-5` | 减小尺寸 |
| 标题字号 | `text-3xl` | `text-2xl` | 减小字号 |
| 按钮内边距 | `py-5` | `py-4` | 减小内边距 |
| 按钮字号 | `text-lg` | `text-base` | 减小字号 |
| 底部卡片内边距 | `p-4` | `p-3` | 减小内边距 |
| 分数文字 | `text-base` | `text-sm` | 减小字号 |
| 进度条高度 | `h-3` | `h-2` | 减小高度 |

### 5. 背景图片优化
```tsx
// 修改前
<div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-64 h-[380px] opacity-30 pointer-events-none">

// 修改后
<div className="absolute inset-0 flex items-end justify-center pb-32 opacity-30 pointer-events-none">
  <img className="w-64 h-auto max-h-[380px] object-contain" />
</div>
```
- 使用 Flexbox 居中对齐
- `h-auto`: 高度自适应
- `max-h-[380px]`: 限制最大高度

## 优化效果

### 修改前
- ❌ 固定高度，不适配不同屏幕
- ❌ 顶部被裁剪
- ❌ 布局不灵活

### 修改后
- ✅ 响应式高度，适配所有屏幕
- ✅ 完整显示所有内容
- ✅ Flexbox 布局，灵活自适应
- ✅ 减小元素尺寸，更紧凑
- ✅ 内容过多时可滚动

## 测试步骤

### 桌面浏览器测试
1. 打开 http://localhost:5174/
2. 点击"送花"或"扣花"
3. 验证模态框完整显示
4. 调整浏览器窗口大小，验证响应式效果

### 移动端测试
1. 在微信浏览器中打开应用
2. 点击"送花"或"扣花"
3. 验证：
   - ✅ 关闭按钮可见
   - ✅ 标题完整显示
   - ✅ 所有选项可见
   - ✅ 底部信息卡片可见
   - ✅ 内容过多时可滚动

### 不同屏幕尺寸测试
- iPhone SE (375x667)
- iPhone 12 (390x844)
- iPhone 14 Pro Max (430x932)
- Android 小屏 (360x640)
- Android 大屏 (412x915)

## 相关文件
- `src/components/AddFlowerModal.tsx` - 送花模态框
- `src/components/SubtractFlowerModal.tsx` - 扣花模态框

## 注意事项
1. 使用 `max-h-[90vh]` 而不是 `100vh`，留出顶部和底部空间
2. 使用 Flexbox 而不是 `absolute` 定位，更灵活
3. 所有可滚动区域使用 `overflow-y-auto`
4. 固定区域使用 `flex-shrink-0`，防止被压缩
