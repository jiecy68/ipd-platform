# IPD研发管理平台部署指南

## 系统要求

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- 支持现代浏览器（Chrome、Firefox、Safari、Edge）

## 部署步骤

### 1. 安装Node.js和npm

如果您的系统尚未安装Node.js，请从官方网站下载并安装：
- [Node.js官方下载](https://nodejs.org/en/download/)

安装完成后，验证安装是否成功：

```bash
node --version
npm --version
```

### 2. 安装项目依赖

在项目目录中执行以下命令：

```bash
cd ipd-platform
npm install
```

### 3. 启动后端服务

```bash
# 生产模式
npm start

# 开发模式（支持热重载）
npm run dev
```

服务启动后，将在 http://localhost:3001 运行。

### 4. 访问应用

在浏览器中打开：
- **应用地址**: http://localhost:3001
- **API文档**: http://localhost:3001/api/projects

## 功能测试

### 1. 验证数据加载

- 打开应用后，系统会自动从数据库加载项目数据
- 查看控制台输出，确认数据加载成功
- 检查看板是否显示所有项目

### 2. 测试新建项目功能

1. 点击"新建项目"按钮
2. 填写项目信息：
   - 项目名称：测试项目
   - DCP阶段：Charter DCP - 立项决策
   - 优先级：高
   - 项目经理：测试经理
   - 开始日期：选择今天
   - 结束日期：选择一个月后
   - 团队成员数：5
   - 初始进度：0
3. 点击"创建项目"按钮
4. 验证：
   - 项目是否成功创建
   - 新创建的项目是否显示在Charter DCP列中
   - 刷新页面后项目是否仍然存在

### 3. 测试数据持久化

1. 创建多个测试项目
2. 停止后端服务
3. 重新启动后端服务
4. 验证所有项目是否仍然存在

## API接口测试

### 获取所有项目
```bash
curl http://localhost:3001/api/projects
```

### 根据阶段获取项目
```bash
curl http://localhost:3001/api/projects/phase/charter-dcp
```

### 创建项目
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试项目",
    "phase": "charter-dcp",
    "priority": "high",
    "manager": "测试经理",
    "startDate": "2024-04-10",
    "endDate": "2024-05-10",
    "members": 5,
    "progress": 0
  }'
```

## 故障排除

### 1. 数据库连接失败
- 检查SQLite数据库文件权限
- 确保项目目录可写

### 2. API请求失败
- 检查后端服务是否正在运行
- 验证API URL是否正确
- 查看控制台错误信息

### 3. 前端加载失败
- 检查网络连接
- 验证后端服务状态
- 查看浏览器控制台错误

## 系统架构

### 技术栈
- **前端**: 纯HTML/CSS/JavaScript
- **后端**: Node.js + Express
- **数据库**: SQLite
- **API**: RESTful API

### 核心功能
- ✅ 项目看板展示
- ✅ 新建项目功能
- ✅ 数据持久化存储
- ✅ 项目状态管理
- ✅ API接口支持

## 数据安全

- 所有数据存储在本地SQLite数据库中
- 无外部依赖
- 适合内部企业使用

## 扩展建议

1. 添加用户认证系统
2. 实现项目编辑功能
3. 添加项目删除功能
4. 增加数据导入/导出功能
5. 实现高级搜索和过滤

---

**注意**: 本系统设计为内部使用的研发管理工具，适合中小型团队使用。对于大型企业级应用，建议使用更强大的数据库和认证系统。
