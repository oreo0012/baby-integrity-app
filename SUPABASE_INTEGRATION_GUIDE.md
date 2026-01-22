# Supabase 集成指南

## 快速开始

Supabase 已经部署完成！现在需要在应用中集成设置和认证功能。

## 第一步：在 App.tsx 中添加设置按钮

在 App.tsx 的顶部导入新组件：

```tsx
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import { Settings } from 'lucide-react';
import { getStorageMode } from './lib/storage-adapter';
```

在 App 组件的 state 中添加：

```tsx
const [showSettings, setShowSettings] = useState(false);
const [showAuth, setShowAuth] = useState(false);
```

在 App 组件的 useEffect 中初始化存储模式：

```tsx
useEffect(() => {
  // 初始化存储模式
  getStorageMode();
}, []);
```

在返回的 JSX 中添加设置按钮（建议放在右上角）：

```tsx
{/* 设置按钮 */}
<button
  onClick={() => setShowSettings(true)}
  className="fixed top-4 right-4 z-40 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
  aria-label="设置"
>
  <Settings className="w-5 h-5 text-gray-700" />
</button>

{/* 设置模态框 */}
<SettingsModal
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  onOpenAuth={() => setShowAuth(true)}
/>

{/* 认证模态框 */}
<AuthModal
  isOpen={showAuth}
  onClose={() => setShowAuth(false)}
/>
```

## 第二步：更新所有数据操作为异步

由于现在支持 Supabase，所有数据操作都需要改为异步。

### 在 App.tsx 中：

1. 加载初始分数时：

```tsx
useEffect(() => {
  const loadScore = async () => {
    const score = await getCurrentScoreData();
    setCurrentScore(score);
  };
  loadScore();
}, []);
```

2. 处理加分时：

```tsx
const handleAddScore = async (item: ScoreItem) => {
  setIsAddModalOpen(false);
  
  const result = await addScore(item);
  // ... 其余逻辑
};
```

3. 处理扣分时：

```tsx
const handleSubtractScore = async (item: ScoreItem) => {
  setIsSubtractModalOpen(false);
  
  const result = await subtractScore(item);
  // ... 其余逻辑
};
```

### 在 HistoryModal.tsx 中：

```tsx
useEffect(() => {
  const loadHistory = async () => {
    const history = await getScoreHistory();
    setHistory(history);
  };
  
  if (isOpen) {
    loadHistory();
  }
}, [isOpen]);
```

### 在 RewardsModal.tsx 中：

```tsx
useEffect(() => {
  const loadRewards = async () => {
    const rewards = await getCurrentRewards();
    setRewards(rewards);
  };
  
  if (isOpen) {
    loadRewards();
  }
}, [isOpen]);
```

## 第三步：测试功能

### 测试本地存储模式（默认）

1. 启动应用：`npm run dev`
2. 应用应该正常工作，数据保存在 localStorage
3. 打开设置，确认当前是"本地存储"模式

### 测试云端同步模式

1. 打开设置，切换到"云端同步"
2. 刷新页面
3. 点击"登录/注册"按钮
4. 注册一个新账号（邮箱 + 密码 + 宝贝昵称）
5. 登录后，进行加分扣分操作
6. 数据应该保存到 Supabase

### 测试多设备同步

1. 在第一个浏览器登录账号
2. 进行一些加分扣分操作
3. 在第二个浏览器（或无痕模式）登录同一账号
4. 应该能看到相同的分数和历史记录

## 完整的 App.tsx 修改示例

```tsx
import { useState, useEffect } from 'react';
import { getCurrentScoreData, addScore, subtractScore, type ScoreItem } from './lib/data-manager';
import { getStorageMode } from './lib/storage-adapter';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import { Settings } from 'lucide-react';
// ... 其他导入

function App() {
  const [currentScore, setCurrentScore] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  // ... 其他 state

  // 初始化
  useEffect(() => {
    getStorageMode();
    
    const loadScore = async () => {
      const score = await getCurrentScoreData();
      setCurrentScore(score);
    };
    loadScore();
  }, []);

  // 处理加分
  const handleAddScore = async (item: ScoreItem) => {
    setIsAddModalOpen(false);
    
    try {
      const result = await addScore(item);
      // ... 动画和通知逻辑
    } catch (error) {
      console.error('加分失败:', error);
      showToast('操作失败，请重试', 'error');
    }
  };

  // 处理扣分
  const handleSubtractScore = async (item: ScoreItem) => {
    setIsSubtractModalOpen(false);
    
    try {
      const result = await subtractScore(item);
      // ... 动画和通知逻辑
    } catch (error) {
      console.error('扣分失败:', error);
      showToast('操作失败，请重试', 'error');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 设置按钮 */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-4 right-4 z-40 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Settings className="w-5 h-5 text-gray-700" />
      </button>

      {/* 其他组件 */}
      
      {/* 设置模态框 */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onOpenAuth={() => setShowAuth(true)}
      />

      {/* 认证模态框 */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </div>
  );
}
```

## 常见问题

### Q: 切换存储模式后数据会丢失吗？

A: 是的，本地存储和云端存储的数据是独立的。建议用户在切换前了解这一点。

### Q: 如何迁移本地数据到云端？

A: 目前需要手动操作。未来可以添加数据导出导入功能。

### Q: 忘记密码怎么办？

A: 目前需要在 Supabase Dashboard 中手动重置。建议后续添加密码重置功能。

### Q: 可以支持多个孩子吗？

A: 当前一个账号对应一个孩子档案。如需支持多孩子，需要修改数据库结构。

## 下一步优化

1. 添加加载状态指示器
2. 添加错误处理和重试机制
3. 实现离线支持（本地缓存 + 同步）
4. 添加数据导入导出功能
5. 实现密码重置功能
6. 支持多孩子档案管理
