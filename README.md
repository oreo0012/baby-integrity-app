# 宝贝信用计划 - Baby Integrity App

一个用于管理孩子信用分和权益的应用，通过游戏化的方式鼓励孩子养成好习惯。

## 🎯 核心功能

### 信用分系统
- **分数范围**：0-100分，初始默认100分
- **三个等级**：
  - 优秀（90-100分）：绿色进度条
  - 良好（60-89分）：黄色进度条
  - 待提高（0-59分）：红色进度条

### 加分/扣分机制
- 点击"送花"按钮选择加分项
- 点击"扣花"按钮选择扣分项
- 系统自动在配置的分值区间随机取值
- 实时显示分数变化通知

### 权益系统
- 不同信用等级对应不同权益
- 包括：自由时间、消费额度、零花钱、游戏时间
- 点击"我的权益"查看当前可享受的权益

### 历史记录
- 点击右上角历史按钮查看所有加分/扣分记录
- 显示操作时间、分数变化、操作前后分数

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173/ 查看应用

### 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
baby-integrity-app/
├── src/
│   ├── components/          # UI组件
│   │   ├── AddFlowerModal.tsx      # 加分模态框
│   │   ├── SubtractFlowerModal.tsx # 扣分模态框
│   │   ├── RewardsModal.tsx        # 权益模态框
│   │   ├── HistoryModal.tsx        # 历史记录模态框
│   │   ├── Toast.tsx               # 通知组件
│   │   └── ui/                     # 基础UI组件
│   ├── config/              # 配置文件
│   │   ├── score-items.json        # 加分扣分项配置
│   │   └── score-ranges.json       # 信用分段与权益配置
│   ├── lib/                 # 工具函数
│   │   ├── config.ts               # 配置读取
│   │   ├── data-manager.ts         # 数据管理
│   │   ├── storage.ts              # 本地存储
│   │   └── utils.ts                # 工具函数
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 应用入口
├── public/
│   └── girl.png             # 人物形象
└── package.json
```

## ⚙️ 配置说明

### 修改加分/扣分项
编辑 `src/config/score-items.json`：
```json
{
  "addItems": [
    {
      "id": "add-1",
      "name": "积极完成学习任务",
      "minScore": 1,
      "maxScore": 3
    }
  ]
}
```

### 修改权益配置
编辑 `src/config/score-ranges.json`：
```json
{
  "ranges": [
    {
      "name": "优秀",
      "minScore": 90,
      "maxScore": 100,
      "rewards": {
        "freeTime": {
          "name": "每日自由支配时间",
          "value": 20,
          "unit": "分钟"
        }
      }
    }
  ]
}
```

## 💾 数据存储

当前版本使用 localStorage 本地存储：
- 信用分数据
- 历史记录

数据会持久化保存在浏览器中，清除浏览器数据会重置应用。

## 🎨 新增功能

### ✅ 已完成
- [x] 进度条颜色根据分段动态变化
- [x] Toast 通知显示分数变化
- [x] 历史记录功能
- [x] 优化用户交互体验
- [x] 完善视觉反馈

### 🔜 计划中
- [ ] 添加动画效果（小红花飞舞、人物动画）
- [ ] 集成 Supabase 实现云端同步
- [ ] 添加家长管理后台
- [ ] 支持多个孩子账号

## 🛠️ 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (图标)

## 📝 开发说明

### 本地开发
项目使用 localStorage 存储数据，无需配置数据库即可开发调试。

### 上线部署
计划使用 Supabase + Vercel 实现云端部署和跨设备同步。

## 📄 许可证

MIT
