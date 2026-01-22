# 🚀 Vercel 部署指南

## 概述

本指南将帮助你将"宝贝信用计划"部署到 Vercel，实现在线访问。

## 前提条件

- ✅ GitHub 账号
- ✅ Vercel 账号（可以用 GitHub 登录）
- ✅ 项目代码已推送到 GitHub
- ✅ Supabase 已配置完成

## 部署步骤

### 方法一：通过 Vercel Dashboard（推荐）

#### 1. 准备 GitHub 仓库

```bash
# 如果还没有 Git 仓库，先初始化
cd baby-integrity-app
git init

# 添加所有文件（.env 会被 .gitignore 忽略）
git add .
git commit -m "Initial commit with Supabase integration"

# 创建 GitHub 仓库后，推送代码
git remote add origin https://github.com/你的用户名/baby-integrity-app.git
git branch -M main
git push -u origin main
```

#### 2. 登录 Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub"
4. 授权 Vercel 访问你的 GitHub

#### 3. 导入项目

1. 点击 "Add New..." → "Project"
2. 选择你的 GitHub 仓库 `baby-integrity-app`
3. 点击 "Import"

#### 4. 配置项目

**Build & Development Settings**
- Framework Preset: `Vite`（自动检测）
- Root Directory: `./` 或留空
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables（重要！）**

点击 "Environment Variables"，添加以下变量：

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://ncprkzllhobcpecpfggu.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | 你的 Supabase Anon Key |

⚠️ **注意**：从你的 `.env` 文件中复制这些值

#### 5. 部署

1. 点击 "Deploy"
2. 等待构建完成（通常 1-3 分钟）
3. 部署成功后，你会看到：
   - 🎉 Congratulations!
   - 你的应用 URL（如 `https://baby-integrity-app.vercel.app`）

### 方法二：通过 Vercel CLI

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录

```bash
vercel login
```

#### 3. 部署

```bash
cd baby-integrity-app

# 首次部署
vercel

# 按照提示操作：
# - Set up and deploy? Yes
# - Which scope? 选择你的账号
# - Link to existing project? No
# - What's your project's name? baby-integrity-app
# - In which directory is your code located? ./
# - Want to override the settings? No
```

#### 4. 配置环境变量

```bash
# 添加 Supabase URL
vercel env add VITE_SUPABASE_URL

# 添加 Supabase Anon Key
vercel env add VITE_SUPABASE_ANON_KEY

# 选择环境：Production, Preview, Development（建议全选）
```

#### 5. 重新部署

```bash
vercel --prod
```

## 配置文件

### vercel.json（可选）

创建 `vercel.json` 来自定义配置：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### package.json 检查

确保 `package.json` 中有正确的脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 环境变量管理

### 在 Vercel Dashboard 中管理

1. 进入项目设置：`Settings` → `Environment Variables`
2. 可以为不同环境设置不同的值：
   - **Production**: 生产环境
   - **Preview**: 预览环境（PR 部署）
   - **Development**: 开发环境

### 本地开发

本地开发时使用 `.env` 文件：

```bash
# .env（不要提交到 Git）
VITE_SUPABASE_URL=https://ncprkzllhobcpecpfggu.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 自动部署

### 设置自动部署

Vercel 会自动监听 GitHub 仓库的变化：

- **Push to main**: 自动部署到生产环境
- **Pull Request**: 自动创建预览部署
- **Push to other branches**: 自动创建预览部署

### 禁用自动部署（可选）

在 `vercel.json` 中：

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "preview": false
    }
  }
}
```

## 自定义域名

### 添加自定义域名

1. 进入项目设置：`Settings` → `Domains`
2. 点击 "Add"
3. 输入你的域名（如 `baby-integrity.com`）
4. 按照提示配置 DNS 记录

### DNS 配置

在你的域名提供商处添加：

**A 记录**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 记录**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 性能优化

### 1. 启用压缩

Vercel 自动启用 Gzip 和 Brotli 压缩。

### 2. 图片优化

使用 Vercel Image Optimization（可选）：

```tsx
// 如果需要，可以使用 next/image 的替代方案
// 或者继续使用现有的 webp 格式图片
```

### 3. 缓存策略

在 `vercel.json` 中配置缓存：

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).webp",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 监控和分析

### Vercel Analytics

1. 进入项目设置：`Analytics`
2. 点击 "Enable Analytics"
3. 在代码中添加（可选）：

```bash
npm install @vercel/analytics
```

```tsx
// src/main.tsx
import { inject } from '@vercel/analytics';

inject();
```

### 查看部署日志

1. 进入项目 Dashboard
2. 点击 "Deployments"
3. 选择一个部署查看详细日志

## 故障排查

### 构建失败

**问题：TypeScript 错误**
```bash
# 本地检查类型错误
npm run build
```

**问题：依赖安装失败**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

**问题：环境变量未生效**
- 确保变量名以 `VITE_` 开头
- 在 Vercel Dashboard 中检查环境变量
- 重新部署项目

### 运行时错误

**问题：Supabase 连接失败**
- 检查环境变量是否正确配置
- 确认 Supabase URL 和 Key 有效
- 查看浏览器控制台错误

**问题：路由 404**
- 确保 `vercel.json` 中有正确的 rewrites 配置
- 检查 `dist` 目录是否包含 `index.html`

### 查看日志

```bash
# 使用 Vercel CLI 查看日志
vercel logs [deployment-url]
```

## 回滚部署

### 通过 Dashboard

1. 进入 "Deployments"
2. 找到之前的成功部署
3. 点击 "..." → "Promote to Production"

### 通过 CLI

```bash
# 列出所有部署
vercel ls

# 回滚到指定部署
vercel promote [deployment-url]
```

## 安全建议

### 1. 保护环境变量

- ✅ 不要在代码中硬编码密钥
- ✅ 使用 Vercel 环境变量
- ✅ 不要提交 `.env` 到 Git

### 2. 配置 CORS（如果需要）

在 Supabase Dashboard 中配置允许的域名：
- `https://your-app.vercel.app`
- `https://your-custom-domain.com`

### 3. 启用 HTTPS

Vercel 自动为所有部署启用 HTTPS。

## 成本

### Vercel 免费计划

- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 预览部署

### 升级选项

如果需要更多资源，可以升级到 Pro 计划（$20/月）。

## 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] 在 Vercel 中配置环境变量
- [ ] 构建命令正确（`npm run build`）
- [ ] 输出目录正确（`dist`）
- [ ] 部署成功
- [ ] 测试生产环境功能
- [ ] 测试 Supabase 连接
- [ ] 测试本地和云端存储模式
- [ ] 配置自定义域名（可选）

## 快速命令参考

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod

# 查看部署列表
vercel ls

# 查看日志
vercel logs

# 查看环境变量
vercel env ls

# 添加环境变量
vercel env add VARIABLE_NAME

# 删除环境变量
vercel env rm VARIABLE_NAME
```

## 下一步

1. ✅ 完成部署
2. ✅ 测试所有功能
3. ✅ 配置自定义域名（可选）
4. ✅ 启用 Analytics（可选）
5. ✅ 分享给用户使用！

## 获取帮助

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Supabase 文档](https://supabase.com/docs)

---

**祝你部署顺利！** 🚀
