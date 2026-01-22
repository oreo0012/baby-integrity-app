# Supabase MCP 配置指南

## 什么是 Supabase MCP？

Supabase MCP (Model Context Protocol) 允许 AI 助手直接与你的 Supabase 数据库交互，执行查询、插入、更新等操作。

## 配置方式选择

Supabase MCP 有两种配置方式：

### 方式 1：HTTP MCP（推荐，更简单）
- ✅ 无需安装额外工具
- ✅ 配置简单
- ✅ 使用 Supabase 官方 MCP 服务器
- ⚠️ 需要 Supabase Access Token

### 方式 2：本地 MCP（需要 uvx）
- 需要安装 uv/uvx
- 使用 Service Role Key
- 更多控制权

**本指南主要介绍方式 1（HTTP MCP）**

## 配置步骤（HTTP MCP）

### 1. 获取 Supabase Project Reference

你的项目引用（Project Ref）已经在配置中：`ncprkzllhobcpecpfggu`

如果需要查看或更改：
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 在 URL 中可以看到：`https://supabase.com/dashboard/project/[project-ref]`

### 2. 获取 Supabase Access Token

**获取 Access Token 的方法：**

#### 方法 1：使用 Supabase CLI（推荐）

1. 安装 Supabase CLI：
   ```bash
   npm install -g supabase
   ```

2. 登录 Supabase：
   ```bash
   supabase login
   ```

3. 获取 Access Token：
   ```bash
   supabase access-token
   ```

4. 复制输出的 token

#### 方法 2：从 Dashboard 获取

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击右上角头像 → **Account Settings**
3. 进入 **Access Tokens** 标签
4. 创建新的 Personal Access Token
5. 复制 token（只显示一次，请妥善保存）

⚠️ **安全提示**：Access Token 拥有完全访问权限，请妥善保管，不要提交到 Git！

### 3. 配置 MCP

编辑 `.kiro/settings/mcp.json` 文件（已经预配置好了）：

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=ncprkzllhobcpecpfggu",
      "headers": {
        "Authorization": "Bearer 你的_SUPABASE_ACCESS_TOKEN"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**只需替换：**
- `你的_SUPABASE_ACCESS_TOKEN` → 你在步骤 2 中获取的 Access Token

### 4. 重新连接 MCP

配置保存后，MCP 会自动重新连接。你也可以：
- 在 Kiro 中打开命令面板（Ctrl+Shift+P）
- 搜索 "MCP"
- 选择 "Reconnect MCP Servers"

### 5. 验证配置

配置成功后，你可以在 Kiro 中询问 AI：
```
"请列出我的 Supabase 数据库中的所有表"
```

AI 将能够访问你的 Supabase 数据库并返回结果。

## 为本项目创建数据库表

### 推荐的表结构

#### 1. users 表（用户/孩子信息）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  current_score INTEGER DEFAULT 100 CHECK (current_score >= 0 AND current_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. score_history 表（分数历史记录）
```sql
CREATE TABLE score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('add', 'subtract')),
  item_name TEXT NOT NULL,
  score_change INTEGER NOT NULL,
  score_before INTEGER NOT NULL,
  score_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_score_history_user_id ON score_history(user_id);
CREATE INDEX idx_score_history_created_at ON score_history(created_at DESC);
```

#### 3. 启用行级安全（RLS）

```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;

-- 创建策略（示例：允许所有操作，实际使用时应该根据需求调整）
CREATE POLICY "Enable all operations for authenticated users" ON users
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON score_history
  FOR ALL USING (true);
```

## 常用配置选项

### autoApprove（自动批准工具）

如果你信任某些操作，可以将它们添加到 `autoApprove` 列表：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "uvx",
      "args": ["mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "...",
        "SUPABASE_SERVICE_ROLE_KEY": "..."
      },
      "disabled": false,
      "autoApprove": [
        "supabase_select",
        "supabase_insert"
      ]
    }
  }
}
```

### 禁用 MCP 服务器

如果暂时不需要使用，可以设置 `disabled: true`：

```json
{
  "disabled": true
}
```

## 故障排除

### 问题 1: uvx 命令未找到

**解决方案**：
1. 确认 uv 已安装：`uv --version`
2. 重启终端
3. 检查环境变量 PATH 是否包含 uv 的安装路径

### 问题 2: 连接失败

**检查清单**：
- ✅ SUPABASE_URL 格式正确（包含 https://）
- ✅ Service Role Key 正确（不是 anon key）
- ✅ 网络连接正常
- ✅ Supabase 项目处于活动状态

### 问题 3: 权限错误

**解决方案**：
- 确保使用的是 `service_role` key，不是 `anon` key
- 检查 RLS 策略是否正确配置

## 下一步

配置完成后，你可以：

1. **迁移数据**：将 localStorage 数据迁移到 Supabase
2. **更新代码**：修改 `src/lib/storage.ts` 使用 Supabase 客户端
3. **实现同步**：实现跨设备数据同步功能
4. **添加认证**：集成 Supabase Auth 实现用户登录

## 参考资源

- [Supabase 官方文档](https://supabase.com/docs)
- [MCP 协议文档](https://modelcontextprotocol.io/)
- [uv 安装指南](https://docs.astral.sh/uv/getting-started/installation/)

## 安全建议

1. ❌ **不要**将 Service Role Key 提交到 Git
2. ✅ **使用**环境变量或配置文件（已在 .gitignore 中）
3. ✅ **配置** RLS 策略限制数据访问
4. ✅ **定期轮换** API 密钥
5. ✅ **使用** anon key 用于客户端，service_role key 仅用于服务端

---

配置完成后，你就可以让 AI 助手帮你管理 Supabase 数据库了！
