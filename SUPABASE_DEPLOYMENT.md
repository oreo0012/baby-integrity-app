# Supabase 部署完成指南

## 已完成的部署步骤

### 1. 数据库表创建 ✅

已创建以下表：

- **profiles** - 用户档案表
  - 存储用户信息和当前分数
  - 与 auth.users 关联
  
- **score_history** - 分数历史记录表
  - 记录所有加分扣分操作
  - 包含操作类型、分数变化、时间戳等
  
- **score_items** - 加分扣分项配置表
  - 存储可配置的加分扣分项
  - 支持启用/禁用和排序
  
- **score_ranges** - 信用分段和权益配置表
  - 定义不同分数段的权益
  - 包含时间、金钱、游戏等权益配置

### 2. 初始数据插入 ✅

已插入：
- 6个加分项配置
- 4个扣分项配置
- 3个信用分段配置（优秀、良好、待提高）

### 3. 安全策略配置 ✅

已启用 Row Level Security (RLS) 并配置策略：
- 用户只能访问自己的档案和历史记录
- 所有认证用户可以读取配置数据
- 自动更新时间戳触发器

### 4. 代码集成 ✅

已创建文件：
- `src/lib/supabase.ts` - Supabase 客户端配置
- `src/lib/supabase-storage.ts` - Supabase 存储层
- `src/lib/supabase-config.ts` - Supabase 配置管理
- `src/lib/supabase-data-manager.ts` - Supabase 数据管理器
- `src/lib/storage-adapter.ts` - 存储适配器（支持本地/云端切换）
- `src/lib/config-adapter.ts` - 配置适配器
- `src/contexts/AuthContext.tsx` - 认证上下文
- `src/components/AuthModal.tsx` - 登录注册模态框
- `src/components/SettingsModal.tsx` - 设置模态框
- `.env` - 环境变量配置
- `.env.example` - 环境变量示例

## 项目配置信息

```
Supabase URL: https://ncprkzllhobcpecpfggu.supabase.co
Anon Key: 已配置在 .env 文件中
```

## 使用方式

### 双模式支持

应用支持两种存储模式：

1. **本地存储模式**（默认）
   - 数据保存在浏览器 localStorage
   - 无需登录
   - 适合单设备使用

2. **云端同步模式**
   - 数据保存在 Supabase
   - 需要登录账号
   - 支持多设备同步

### 切换存储模式

用户可以在设置中切换存储模式：
1. 点击设置按钮
2. 选择"本地存储"或"云端同步"
3. 如果选择云端同步，需要登录或注册账号

## 下一步集成步骤

### 1. 更新 main.tsx

需要添加 AuthProvider：

```tsx
import { AuthProvider } from '@/contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

### 2. 更新 App.tsx

需要添加：
- 设置按钮和模态框
- 认证模态框
- 初始化存储模式

### 3. 更新现有组件

需要将所有同步函数调用改为异步：
- `getCurrentScoreData()` → `await getCurrentScoreData()`
- `addScore()` → `await addScore()`
- `subtractScore()` → `await subtractScore()`
- `getCurrentRewards()` → `await getCurrentRewards()`
- `getScoreRangeName()` → `await getScoreRangeName()`

## 数据库管理

### 查看数据

```sql
-- 查看所有用户档案
SELECT * FROM profiles;

-- 查看分数历史
SELECT * FROM score_history ORDER BY created_at DESC;

-- 查看配置
SELECT * FROM score_items;
SELECT * FROM score_ranges;
```

### 修改配置

可以直接在 Supabase Dashboard 中修改配置表，或使用 SQL：

```sql
-- 添加新的加分项
INSERT INTO score_items (id, type, name, min_score, max_score, sort_order)
VALUES ('add-7', 'add', '新的加分项', 1, 3, 7);

-- 修改权益配置
UPDATE score_ranges 
SET free_time_value = 25 
WHERE name = '优秀';
```

## 安全注意事项

1. **.env 文件已添加到 .gitignore**，不会被提交到 Git
2. 使用 Anon Key 是安全的，因为已配置 RLS 策略
3. 用户只能访问自己的数据
4. 配置数据对所有认证用户只读

## 故障排查

### 连接问题
- 检查 .env 文件是否正确配置
- 确认 Supabase 项目是否正常运行

### 认证问题
- 确认用户已登录
- 检查 AuthContext 是否正确包裹应用

### 数据访问问题
- 检查 RLS 策略是否正确
- 确认用户有正确的权限

## 部署到生产环境

1. 在生产环境设置环境变量：
   ```
   VITE_SUPABASE_URL=your_production_url
   VITE_SUPABASE_ANON_KEY=your_production_key
   ```

2. 构建应用：
   ```bash
   npm run build
   ```

3. 部署 dist 目录到服务器

## 后续优化建议

1. 添加邮箱验证功能
2. 实现密码重置功能
3. 添加数据导入导出功能
4. 实现多孩子档案管理
5. 添加家长控制面板
