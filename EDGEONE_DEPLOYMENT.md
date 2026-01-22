# EdgeOne Pages 部署指南

## 🎯 部署目标

将"宝贝信用计划"应用部署到腾讯云 EdgeOne Pages，实现国内快速访问。

## ✅ 已完成的准备工作

1. ✅ 验证文件已创建：`public/f4eaf7bfac1081fa2a39feb8116c0d04.txt`
2. ✅ 项目已构建：`dist` 目录包含所有静态文件
3. ✅ GitHub 仓库已创建：https://github.com/oreo0012/baby-integrity-app

## 📋 部署方式

### 方式 1：通过 GitHub 自动部署（推荐）

#### 步骤 1：登录 EdgeOne Pages 控制台

访问：https://console.cloud.tencent.com/edgeone/pages

#### 步骤 2：创建新项目

1. 点击"新建项目"
2. 选择"连接 Git 仓库"
3. 选择 GitHub 作为代码源
4. 授权 EdgeOne Pages 访问你的 GitHub 账号

#### 步骤 3：选择仓库

1. 在仓库列表中找到 `oreo0012/baby-integrity-app`
2. 点击"导入"

#### 步骤 4：配置构建设置

```
项目名称: baby-integrity-app
框架预设: Vite
根目录: baby-integrity-app
构建命令: npm run build
输出目录: dist
Node 版本: 18.x 或 20.x
```

#### 步骤 5：配置环境变量

点击"环境变量"，添加以下变量：

```
变量名: VITE_SUPABASE_URL
值: https://ncprkzllhobcpecpfggu.supabase.co

变量名: VITE_SUPABASE_ANON_KEY
值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcHJremxsaG9iY3BlY3BmZ2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTAzNjAsImV4cCI6MjA4NDU2NjM2MH0.bViB4Z9E46OB6zIJgMfAAAVFngrBGeWA6LvoYdcpZiE
```

#### 步骤 6：开始部署

1. 点击"开始部署"
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后会获得一个访问 URL

---

### 方式 2：手动上传（快速部署）

#### 步骤 1：确认构建完成

项目已经构建完成，构建输出在 `baby-integrity-app/dist` 目录。

#### 步骤 2：登录控制台

访问：https://console.cloud.tencent.com/edgeone/pages

#### 步骤 3：创建项目

1. 点击"新建项目"
2. 选择"直接上传"
3. 输入项目名称：`baby-integrity-app`

#### 步骤 4：上传文件

1. 点击"上传文件夹"
2. 选择 `D:\AiPorject\BabyIntegrityPlan\baby-integrity-app\dist` 目录
3. 等待上传完成

#### 步骤 5：配置环境变量（可选）

如果需要云端功能，在项目设置中添加 Supabase 环境变量。

---

## 🔍 验证部署

### 1. 检查验证文件

部署完成后，访问：
```
https://你的域名/f4eaf7bfac1081fa2a39feb8116c0d04.txt
```

应该看到内容：`63fe1a405a1f6963bc64594b3cb069f92249fa5a`

### 2. 测试应用功能

访问你的 EdgeOne Pages 域名，测试：

- ✅ 页面正常加载
- ✅ 背景图片显示
- ✅ 人物动画播放
- ✅ 加分扣分功能
- ✅ 历史记录查看
- ✅ 权益查看

---

## 🔄 自动部署配置

### GitHub 自动部署

如果选择了 GitHub 集成，每次推送代码都会自动触发部署：

```bash
cd baby-integrity-app

# 修改代码后
git add .
git commit -m "Update: 更新说明"
git push

# EdgeOne Pages 会自动检测并部署
```

### 手动重新部署

1. 本地构建：
   ```bash
   cd baby-integrity-app
   npm run build
   ```

2. 在 EdgeOne Pages 控制台上传新的 `dist` 目录

---

## 📱 域名配置

### 使用默认域名

EdgeOne Pages 会自动分配一个域名，格式类似：
```
baby-integrity-app.edgeone.app
```

### 绑定自定义域名

1. 进入项目设置
2. 点击"自定义域名"
3. 添加你的域名（需要已备案）
4. 配置 CNAME 记录指向 EdgeOne Pages

---

## 🚀 性能优化

### CDN 加速

EdgeOne Pages 自动启用 CDN，无需额外配置。

### 缓存策略

静态资源会自动缓存，包括：
- HTML 文件：短期缓存
- JS/CSS 文件：长期缓存（带版本号）
- 图片/动画：长期缓存

### HTTPS

EdgeOne Pages 自动配置 HTTPS 证书，无需手动操作。

---

## 🔧 故障排查

### 构建失败

1. 检查 Node 版本是否正确（18.x 或 20.x）
2. 确认构建命令：`npm run build`
3. 确认输出目录：`dist`
4. 查看构建日志获取详细错误信息

### 页面空白

1. 打开浏览器开发者工具（F12）
2. 查看 Console 错误信息
3. 检查 Network 请求状态
4. 确认环境变量是否正确配置

### 验证文件访问失败

1. 确认文件在 `public` 目录中
2. 重新构建项目
3. 检查 `dist` 目录是否包含该文件
4. 重新上传或部署

### Supabase 连接问题

1. 检查环境变量配置
2. 确认 Supabase 项目状态
3. 测试 Supabase API 是否可访问

---

## 📊 对比：EdgeOne Pages vs Vercel

| 特性 | EdgeOne Pages | Vercel |
|------|---------------|--------|
| 国内访问速度 | ⭐⭐⭐⭐⭐ 快 | ⭐⭐ 需要外网 |
| 免费额度 | 充足 | 充足 |
| 自动部署 | ✅ 支持 | ✅ 支持 |
| 自定义域名 | ✅ 需备案 | ✅ 无需备案 |
| HTTPS | ✅ 自动 | ✅ 自动 |
| 构建速度 | 快 | 快 |
| 环境变量 | ✅ 支持 | ✅ 支持 |

---

## 📚 相关资源

- **EdgeOne Pages 控制台**: https://console.cloud.tencent.com/edgeone/pages
- **EdgeOne Pages 文档**: https://cloud.tencent.com/document/product/1552
- **GitHub 仓库**: https://github.com/oreo0012/baby-integrity-app
- **Supabase 控制台**: https://supabase.com/dashboard/project/ncprkzllhobcpecpfggu

---

## 💡 提示

1. **验证文件**: 已创建在 `public` 目录，构建后会自动复制到 `dist` 根目录
2. **环境变量**: 以 `VITE_` 开头的变量会在构建时注入到前端代码
3. **自动部署**: 推荐使用 GitHub 集成，代码更新会自动部署
4. **域名备案**: 使用自定义域名需要完成 ICP 备案

---

## 🎉 下一步

1. 访问 EdgeOne Pages 控制台开始部署
2. 选择 GitHub 自动部署或手动上传
3. 配置环境变量启用 Supabase 功能
4. 测试应用功能
5. （可选）绑定自定义域名

**立即开始**: https://console.cloud.tencent.com/edgeone/pages
