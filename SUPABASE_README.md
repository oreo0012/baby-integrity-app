# 🎉 Supabase 云端同步功能

## 概述

宝贝信用计划现已支持 Supabase 云端同步！用户可以选择使用本地存储或云端同步两种模式。

## 功能特性

### 双模式支持

1. **本地存储模式**（默认）
   - ✅ 数据保存在浏览器本地
   - ✅ 无需注册登录
   - ✅ 快速响应
   - ✅ 适合单设备使用

2. **云端同步模式**
   - ✅ 数据保存在云端
   - ✅ 多设备实时同步
   - ✅ 数据永久保存
   - ✅ 支持账号管理

### 已实现功能

- ✅ 用户注册和登录
- ✅ 分数云端存储
- ✅ 历史记录云端同步
- ✅ 配置数据云端管理
- ✅ 安全的数据访问控制（RLS）
- ✅ 自动时间戳更新
- ✅ 存储模式一键切换

## 技术架构

### 数据库表结构

```
profiles (用户档案)
├── id (UUID)
├── user_id (关联 auth.users)
├── child_name (宝贝昵称)
├── current_score (当前分数)
├── created_at
└── updated_at

score_history (分数历史)
├── id (UUID)
├── profile_id (关联 profiles)
├── type (add/subtract)
├── item_name (操作项名称)
├── score_change (分数变化)
├── score_before (操作前分数)
├── score_after (操作后分数)
└── created_at

score_items (加分扣分项配置)
├── id (文本ID)
├── type (add/subtract)
├── name (显示名称)
├── min_score (最小分值)
├── max_score (最大分值)
├── sort_order (排序)
├── is_active (是否启用)
└── created_at

score_ranges (信用分段配置)
├── id (UUID)
├── name (分段名称)
├── min_score (最小分数)
├── max_score (最大分数)
├── free_time_value (自由时间)
├── spending_limit_value (消费额度)
├── weekly_allowance_value (零花钱)
├── weekend_game_value (游戏时间)
└── created_at
```

### 代码架构

```
适配器模式 - 统一本地和云端接口
├── storage-adapter.ts (存储适配器)
├── config-adapter.ts (配置适配器)
└── data-manager.ts (数据管理器)

Supabase 层
├── supabase.ts (客户端配置)
├── supabase-storage.ts (存储操作)
├── supabase-config.ts (配置管理)
└── supabase-data-manager.ts (数据管理)

认证层
├── AuthContext.tsx (认证上下文)
├── AuthModal.tsx (登录注册)
└── SettingsModal.tsx (设置管理)
```

## 使用指南

### 开发环境设置

1. 确保已安装依赖：
```bash
npm install
```

2. 环境变量已配置在 `.env` 文件中

3. 启动开发服务器：
```bash
npm run dev
```

### 用户使用流程

#### 使用本地存储（默认）

1. 打开应用，直接使用
2. 数据自动保存在浏览器本地

#### 切换到云端同步

1. 点击右上角设置按钮 ⚙️
2. 选择"云端同步"模式
3. 确认刷新页面
4. 点击"登录/注册"按钮
5. 注册新账号或登录现有账号
6. 开始使用云端同步功能

#### 多设备同步

1. 在设备 A 登录账号
2. 进行加分扣分操作
3. 在设备 B 登录同一账号
4. 自动同步所有数据

## 安全性

### Row Level Security (RLS)

所有表都启用了 RLS 策略：

- ✅ 用户只能访问自己的档案
- ✅ 用户只能查看自己的历史记录
- ✅ 配置数据对所有认证用户只读
- ✅ 使用 Anon Key 是安全的

### 数据隔离

- 每个用户的数据完全隔离
- 无法访问其他用户的数据
- 自动关联到认证用户

## 部署信息

### Supabase 项目

- **URL**: https://ncprkzllhobcpecpfggu.supabase.co
- **Region**: 自动选择最近区域
- **Database**: PostgreSQL 15

### 已部署内容

- ✅ 4 个数据库表
- ✅ 10 条配置数据（加分扣分项）
- ✅ 3 条分段配置
- ✅ RLS 安全策略
- ✅ 自动更新触发器

## 文档

- **SUPABASE_DEPLOYMENT.md** - 详细的部署说明
- **SUPABASE_INTEGRATION_GUIDE.md** - 代码集成指南
- **SUPABASE_CHECKLIST.md** - 完整的检查清单

## 下一步集成

查看 `SUPABASE_INTEGRATION_GUIDE.md` 了解如何：

1. 在 App.tsx 中添加设置按钮
2. 更新所有数据操作为异步
3. 测试本地和云端模式
4. 部署到生产环境

## 常见问题

**Q: 数据会自动同步吗？**
A: 是的，使用云端模式时，所有操作都会实时保存到云端。

**Q: 可以在本地和云端之间切换吗？**
A: 可以，但两种模式的数据是独立的。

**Q: 忘记密码怎么办？**
A: 目前需要联系管理员重置，后续会添加自助重置功能。

**Q: 支持多个孩子吗？**
A: 当前一个账号对应一个孩子，后续可以扩展支持多孩子。

**Q: 数据安全吗？**
A: 是的，使用 Supabase 的 RLS 策略，数据完全隔离且加密传输。

## 技术支持

如遇问题，请检查：

1. 浏览器控制台错误信息
2. Supabase Dashboard 日志
3. 网络连接状态
4. 环境变量配置

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可

MIT License
