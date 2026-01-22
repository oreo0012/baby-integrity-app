# ⚡ Vercel 快速部署

## 最快部署方式（5 分钟）

### 步骤 1：准备代码

```bash
cd baby-integrity-app

# 确保所有更改已提交
git add .
git commit -m "Ready for Vercel deployment"
```

### 步骤 2：推送到 GitHub

如果还没有 GitHub 仓库：

1. 访问 https://github.com/new
2. 创建新仓库 `baby-integrity-app`
3. 不要初始化 README、.gitignore 或 license

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/baby-integrity-app.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 3：部署到 Vercel

#### 方式 A：通过网页（推荐新手）

1. 访问 https://vercel.com/new
2. 用 GitHub 账号登录
3. 点击 "Import Project"
4. 选择 `baby-integrity-app` 仓库
5. 配置环境变量：
   ```
   VITE_SUPABASE_URL = https://ncprkzllhobcpecpfggu.supabase.co
   VITE_SUPABASE_ANON_KEY = 你的密钥（从 .env 复制）
   ```
6. 点击 "Deploy"
7. 等待 1-3 分钟
8. 完成！🎉

#### 方式 B：通过命令行（推荐熟手）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 按提示操作，然后添加环境变量
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 重新部署到生产环境
vercel --prod
```

## 环境变量配置

⚠️ **重要**：必须配置这两个环境变量

从你的 `.env` 文件中复制：

```bash
# 查看你的 .env 文件
cat .env
```

复制这两个值到 Vercel：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 验证部署

部署完成后，访问你的 Vercel URL（如 `https://baby-integrity-app.vercel.app`）

测试以下功能：
- ✅ 页面正常加载
- ✅ 动画正常显示
- ✅ 可以加分扣分
- ✅ 可以查看历史记录
- ✅ 可以查看权益
- ✅ 设置按钮可以打开（如果已集成）
- ✅ 云端同步功能正常（如果已集成）

## 常见问题

### Q: 构建失败怎么办？

A: 检查 Vercel 的构建日志，通常是：
- TypeScript 类型错误
- 依赖安装失败
- 环境变量未配置

本地先运行 `npm run build` 确保能成功构建。

### Q: 页面空白怎么办？

A: 检查浏览器控制台错误，通常是：
- 环境变量未配置
- Supabase 连接失败
- 路由配置问题

### Q: 如何更新部署？

A: 只需推送代码到 GitHub：

```bash
git add .
git commit -m "Update"
git push
```

Vercel 会自动重新部署。

### Q: 如何回滚？

A: 在 Vercel Dashboard：
1. 进入 "Deployments"
2. 找到之前的部署
3. 点击 "Promote to Production"

## 下一步

- [ ] 测试所有功能
- [ ] 配置自定义域名（可选）
- [ ] 分享给用户使用
- [ ] 监控访问数据

## 获取帮助

查看完整文档：`VERCEL_DEPLOYMENT.md`

---

**就这么简单！** 🚀
