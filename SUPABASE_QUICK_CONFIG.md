# Supabase MCP 快速配置

## 🎯 你的项目信息

- **Project Ref**: `ncprkzllhobcpecpfggu`
- **MCP URL**: `https://mcp.supabase.com/mcp?project_ref=ncprkzllhobcpecpfggu`

## ⚡ 快速配置步骤

### 步骤 1：获取 Access Token

**方法 A：使用 Supabase CLI（推荐）**

```bash
# 1. 安装 Supabase CLI（如果还没有）
npm install -g supabase

# 2. 登录
supabase login

# 3. 获取 token
supabase access-token
```

**方法 B：从 Dashboard 获取**

1. 访问 https://supabase.com/dashboard/account/tokens
2. 点击 "Generate new token"
3. 输入名称（如 "Kiro MCP"）
4. 复制生成的 token

### 步骤 2：更新配置文件

编辑 `.kiro/settings/mcp.json`，将 `你的_SUPABASE_ACCESS_TOKEN` 替换为你的实际 token：

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=ncprkzllhobcpecpfggu",
      "headers": {
        "Authorization": "Bearer sbp_xxxxxxxxxxxxxxxxxxxxx"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 步骤 3：重新连接 MCP

保存文件后，MCP 会自动重新连接。或者：
- 按 `Ctrl+Shift+P` 打开命令面板
- 搜索 "MCP: Reconnect"
- 选择 "Reconnect MCP Servers"

### 步骤 4：测试连接

在 Kiro 中询问 AI：
```
"请列出我的 Supabase 数据库中的所有表"
```

如果配置成功，AI 将能够访问你的数据库。

## 📊 为项目创建数据库表

在 Supabase SQL Editor 中运行以下 SQL：

```sql
-- 1. 创建用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  current_score INTEGER DEFAULT 100 CHECK (current_score >= 0 AND current_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建分数历史表
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

-- 3. 创建索引
CREATE INDEX idx_score_history_user_id ON score_history(user_id);
CREATE INDEX idx_score_history_created_at ON score_history(created_at DESC);

-- 4. 启用行级安全（RLS）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;

-- 5. 创建策略（允许所有操作）
CREATE POLICY "Enable all operations" ON users FOR ALL USING (true);
CREATE POLICY "Enable all operations" ON score_history FOR ALL USING (true);

-- 6. 插入测试数据
INSERT INTO users (name, current_score) VALUES ('测试宝贝', 100);
```

## ✅ 验证配置

运行以下查询验证表已创建：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

应该看到：
- `users`
- `score_history`

## 🔧 常见问题

### Q: Token 无效或过期？
**A**: 重新生成 Access Token 并更新配置文件

### Q: 无法连接到数据库？
**A**: 检查：
- Token 是否正确复制（包含 `sbp_` 前缀）
- Project Ref 是否正确
- 网络连接是否正常

### Q: 权限错误？
**A**: 确保：
- 使用的是 Personal Access Token
- RLS 策略已正确配置

## 🎉 下一步

配置完成后，你可以：

1. **测试 MCP 连接**：让 AI 查询数据库
2. **迁移数据**：将 localStorage 数据迁移到 Supabase
3. **更新代码**：修改 `src/lib/storage.ts` 使用 Supabase 客户端
4. **实现同步**：实现跨设备数据同步

## 📚 相关文档

- [完整配置指南](./SUPABASE_MCP_SETUP.md)
- [Supabase 官方文档](https://supabase.com/docs)
- [MCP 协议文档](https://modelcontextprotocol.io/)

---

**配置完成后，记得保存 Access Token 到安全的地方！**
