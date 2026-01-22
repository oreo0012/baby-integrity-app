# 🚀 Supabase 快速开始

## 当前状态

✅ **Supabase 后端已 100% 部署完成**

- 数据库表已创建
- 初始数据已插入
- 安全策略已配置
- 代码文件已创建
- 文档已完善

## 立即开始

### 1️⃣ 验证部署（可选）

```bash
cd baby-integrity-app
node scripts/verify-supabase.js
```

应该看到：`✅ 所有检查通过！`

### 2️⃣ 查看集成指南

```bash
# 查看详细的集成步骤
cat SUPABASE_INTEGRATION_GUIDE.md

# 或在编辑器中打开
code SUPABASE_INTEGRATION_GUIDE.md
```

### 3️⃣ 核心集成步骤

#### 在 App.tsx 中添加（3 步）

**步骤 1：导入组件**
```tsx
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import { Settings } from 'lucide-react';
import { getStorageMode } from './lib/storage-adapter';
```

**步骤 2：添加 state**
```tsx
const [showSettings, setShowSettings] = useState(false);
const [showAuth, setShowAuth] = useState(false);
```

**步骤 3：添加 UI**
```tsx
{/* 设置按钮 - 放在右上角 */}
<button
  onClick={() => setShowSettings(true)}
  className="fixed top-4 right-4 z-40 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
>
  <Settings className="w-5 h-5 text-gray-700" />
</button>

{/* 模态框 - 放在组件末尾 */}
<SettingsModal
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  onOpenAuth={() => setShowAuth(true)}
/>
<AuthModal
  isOpen={showAuth}
  onClose={() => setShowAuth(false)}
/>
```

### 4️⃣ 更新数据操作为异步

所有数据操作需要加 `async/await`：

```tsx
// 之前
const score = getCurrentScoreData();

// 现在
const score = await getCurrentScoreData();
```

需要更新的函数：
- `getCurrentScoreData()`
- `addScore()`
- `subtractScore()`
- `getCurrentRewards()`
- `getScoreRangeName()`
- `getScoreHistory()`

### 5️⃣ 启动测试

```bash
npm run dev
```

打开 http://localhost:5173

## 测试流程

### 测试本地模式
1. ✅ 应用正常启动
2. ✅ 点击设置，确认是"本地存储"模式
3. ✅ 加分扣分正常工作

### 测试云端模式
1. ✅ 点击设置，切换到"云端同步"
2. ✅ 刷新页面
3. ✅ 点击"登录/注册"
4. ✅ 注册新账号（test@example.com）
5. ✅ 登录成功后进行加分扣分
6. ✅ 查看历史记录和权益

### 测试多设备同步
1. ✅ 在浏览器 A 登录
2. ✅ 进行操作
3. ✅ 在浏览器 B（无痕模式）登录同一账号
4. ✅ 数据同步正确

## 文档导航

| 文档 | 用途 |
|------|------|
| **SUPABASE_SUMMARY.md** | 📊 完整总结（推荐先看） |
| **SUPABASE_INTEGRATION_GUIDE.md** | 📖 详细集成步骤 |
| **SUPABASE_DEPLOYMENT.md** | 🔧 部署技术细节 |
| **SUPABASE_CHECKLIST.md** | ✅ 完整检查清单 |
| **SUPABASE_README.md** | 📚 功能说明文档 |
| **SUPABASE_QUICK_START.md** | 🚀 本文档 |

## 关键文件位置

```
src/
├── lib/
│   ├── supabase.ts              # Supabase 客户端
│   ├── supabase-storage.ts      # 云端存储
│   ├── supabase-config.ts       # 云端配置
│   ├── storage-adapter.ts       # 存储适配器 ⭐
│   ├── config-adapter.ts        # 配置适配器 ⭐
│   └── data-manager.ts          # 数据管理器（已更新）
├── contexts/
│   └── AuthContext.tsx          # 认证上下文
├── components/
│   ├── AuthModal.tsx            # 登录注册
│   └── SettingsModal.tsx        # 设置界面
└── main.tsx                     # 已添加 AuthProvider
```

## 环境变量

`.env` 文件已配置：
```
VITE_SUPABASE_URL=https://ncprkzllhobcpecpfggu.supabase.co
VITE_SUPABASE_ANON_KEY=***
```

⚠️ **注意**：`.env` 已添加到 `.gitignore`，不会提交到 Git

## 数据库信息

### Supabase Dashboard
https://supabase.com/dashboard

### 表结构
- `profiles` - 用户档案（1 个用户 = 1 个档案）
- `score_history` - 分数历史（所有加分扣分记录）
- `score_items` - 配置项（10 条：6 加分 + 4 扣分）
- `score_ranges` - 分段配置（3 条：优秀/良好/待提高）

## 常见问题速查

**Q: 现在能用吗？**
A: 后端完成，需要在 App.tsx 中添加设置按钮和更新数据操作为异步。

**Q: 要改多少代码？**
A: 主要是 App.tsx（添加设置按钮）+ 数据操作加 async/await。

**Q: 会影响现有功能吗？**
A: 不会。默认使用本地存储，现有功能完全兼容。

**Q: 数据会丢失吗？**
A: 不会。本地和云端数据独立存储。

**Q: 需要多久？**
A: 熟悉的话 15-30 分钟即可完成集成。

## 获取帮助

1. 查看 **SUPABASE_INTEGRATION_GUIDE.md** 了解详细步骤
2. 查看 **SUPABASE_SUMMARY.md** 了解完整信息
3. 运行 `node scripts/verify-supabase.js` 验证部署
4. 检查浏览器控制台错误信息

## 下一步

1. ✅ 阅读 SUPABASE_INTEGRATION_GUIDE.md
2. ✅ 更新 App.tsx 添加设置功能
3. ✅ 更新数据操作为异步
4. ✅ 测试本地和云端模式
5. ✅ 享受云端同步功能！

---

**准备好了吗？开始集成吧！** 🎉

```bash
# 查看详细指南
cat SUPABASE_INTEGRATION_GUIDE.md

# 启动开发服务器
npm run dev
```
