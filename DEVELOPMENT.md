# 开发文档

## 📊 开发进度

### ✅ 已完成（第一阶段）

#### 核心功能
- [x] 信用分系统（0-100分，三个等级）
- [x] 加分/扣分机制（随机分值）
- [x] 权益系统（根据分段显示）
- [x] 本地数据持久化（localStorage）
- [x] 历史记录功能
- [x] Toast 通知系统

#### UI/UX
- [x] 主界面设计
- [x] 加分模态框
- [x] 扣分模态框
- [x] 权益模态框
- [x] 历史记录模态框
- [x] 动态进度条颜色
- [x] 响应式设计

#### 配置系统
- [x] 加分扣分项配置文件
- [x] 信用分段与权益配置文件
- [x] 配置文件读取和解析

#### 数据管理
- [x] localStorage 封装
- [x] 数据管理器
- [x] 历史记录存储

### 🚧 待完成（第二阶段）

#### 动画效果
- [ ] 小红花飞舞动画
- [ ] 小红花凋谢动画
- [ ] 人物表情变化
- [ ] 分数滚动动画
- [ ] 页面过渡动画

#### 云端功能
- [ ] Supabase 集成
- [ ] 用户认证
- [ ] 数据云端同步
- [ ] 多设备支持

#### 高级功能
- [ ] 家长管理后台
- [ ] 密码保护
- [ ] 多账号支持
- [ ] 统计报表
- [ ] 数据导出

## 🏗️ 架构设计

### 组件层次结构
```
App.tsx (主应用)
├── Toast (通知组件)
├── HistoryModal (历史记录)
├── RewardsModal (权益展示)
├── AddFlowerModal (加分)
│   └── Button (UI组件)
└── SubtractFlowerModal (扣分)
    └── Button (UI组件)
```

### 数据流
```
用户操作
  ↓
Modal 组件
  ↓
data-manager (业务逻辑)
  ↓
storage (数据持久化)
  ↓
localStorage
```

### 配置系统
```
config.ts (配置读取)
  ↓
score-items.json (加分扣分项)
score-ranges.json (分段权益)
```

## 🔧 技术细节

### 状态管理
使用 React Hooks 进行状态管理：
- `useState`: 组件状态
- `useEffect`: 副作用处理

### 数据持久化
使用 localStorage 存储：
- `baby-integrity-current-score`: 当前分数
- `baby-integrity-score-history`: 历史记录

### 类型系统
完整的 TypeScript 类型定义：
- `ScoreItem`: 加分扣分项
- `ScoreRange`: 信用分段
- `Reward`: 权益
- `ScoreHistoryItem`: 历史记录

### 样式系统
使用 Tailwind CSS：
- 响应式设计
- 自定义颜色
- 动画效果
- 工具类优先

## 📝 代码规范

### 命名规范
- 组件：PascalCase（如 `AddFlowerModal`）
- 函数：camelCase（如 `getCurrentScore`）
- 常量：UPPER_SNAKE_CASE（如 `STORAGE_KEYS`）
- 文件：kebab-case 或 PascalCase

### 组件规范
- 使用函数组件
- Props 使用 interface 定义
- 导出使用 named export 或 default export

### 代码组织
```
组件文件结构：
1. Import 语句
2. Interface 定义
3. 组件函数
4. 辅助函数
5. Export 语句
```

## 🧪 测试策略

### 手动测试清单
- [ ] 加分功能正常
- [ ] 扣分功能正常
- [ ] 权益显示正确
- [ ] 历史记录准确
- [ ] 进度条颜色正确
- [ ] Toast 通知显示
- [ ] 数据持久化
- [ ] 边界情况（0分、100分）

### 自动化测试（计划）
- [ ] 单元测试（Vitest）
- [ ] 组件测试（React Testing Library）
- [ ] E2E 测试（Playwright）

## 🚀 部署计划

### 本地开发
```bash
npm install
npm run dev
```

### 生产构建
```bash
npm run build
npm run preview
```

### 云端部署（计划）
1. **Supabase 设置**
   - 创建项目
   - 创建数据库表
   - 配置 API 密钥

2. **Vercel 部署**
   - 连接 GitHub 仓库
   - 配置环境变量
   - 自动部署

## 📈 性能优化

### 已实现
- 组件懒加载（模态框按需渲染）
- 状态最小化（避免不必要的重渲染）
- 事件处理优化

### 待优化
- 图片懒加载
- 代码分割
- 缓存策略
- 虚拟滚动（历史记录）

## 🔐 安全考虑

### 当前版本
- 本地存储，无网络请求
- 无敏感数据

### 云端版本（计划）
- 用户认证
- 数据加密
- API 安全
- XSS 防护
- CSRF 防护

## 📚 依赖说明

### 核心依赖
- `react`: UI 框架
- `react-dom`: DOM 渲染
- `typescript`: 类型系统

### UI 依赖
- `tailwindcss`: 样式框架
- `lucide-react`: 图标库
- `class-variance-authority`: 样式变体
- `clsx`: 类名合并
- `tailwind-merge`: Tailwind 类名合并

### 开发依赖
- `vite`: 构建工具
- `eslint`: 代码检查
- `typescript-eslint`: TS 检查

## 🐛 已知问题

### 当前版本
- 无

### 待解决
- 无

## 💡 未来规划

### 短期（1-2周）
- 添加简单动画效果
- 优化移动端体验
- 添加音效

### 中期（1-2月）
- Supabase 集成
- 云端部署
- 多设备同步

### 长期（3-6月）
- 家长管理后台
- 多账号支持
- 统计分析
- 社交功能

## 📞 技术支持

### 开发环境
- Node.js: v18+
- npm: v9+
- 浏览器: Chrome/Edge/Safari 最新版

### 常见问题
参考 USAGE.md 中的故障排除部分

## 📄 相关文档
- [README.md](./README.md) - 项目介绍
- [USAGE.md](./USAGE.md) - 使用指南
- [CHANGELOG.md](./CHANGELOG.md) - 更新日志
