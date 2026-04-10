# Railway.app 部署指南

## 快速部署步骤

### 1. 访问 Railway.app
- 打开浏览器访问：https://railway.app
- 使用 GitHub 账号登录（推荐）

### 2. 创建新项目
- 点击 `New Project`
- 选择 `Deploy from GitHub repo`
- 搜索并选择你的 IPD 平台仓库

### 3. 配置环境
- 点击 `Variables` 标签页
- 添加以下环境变量：
  - `PORT`: 3001
  - `NODE_ENV`: production

### 4. 添加持久化存储
- 点击 `Volumes` 标签页
- 点击 `New Volume`
- 名称：`ipd-database`
- 挂载路径：`/data`
- 点击 `Create Volume`

### 5. 更新数据库配置
- 回到 `Variables` 标签页
- 添加环境变量：
  - `DATABASE_URL`: `/data/ipd_platform.db`

### 6. 部署应用
- Railway 会自动检测代码并开始部署
- 等待部署完成（通常需要1-2分钟）

### 7. 访问应用
- 部署完成后，点击 `Settings` 标签页
- 找到 `Domain` 部分
- 点击生成的域名（如 `ipd-platform-xxxx.railway.app`）
- 应用将在新窗口中打开

## 测试功能

1. **验证数据加载**
   - 打开应用后，确认项目数据正确显示
   - 检查看板是否显示所有项目

2. **测试新建项目**
   - 点击 "新建项目" 按钮
   - 填写项目信息并提交
   - 确认项目显示在看板上

3. **测试数据持久化**
   - 刷新页面
   - 确认新项目仍然存在
   - 重新部署应用
   - 确认数据保留

## 常见问题

### 1. 端口冲突
- **问题**：部署后无法访问
- **解决方案**：确保 `PORT` 环境变量设置为 3001

### 2. 数据库连接失败
- **问题**：应用启动但无数据
- **解决方案**：检查 `DATABASE_URL` 环境变量是否正确设置

### 3. 部署失败
- **问题**：部署过程出错
- **解决方案**：查看部署日志，检查依赖安装是否成功

## 扩展功能

### 添加自定义域名
- 点击 `Settings` → `Domains`
- 点击 `Add Domain`
- 输入你的自定义域名
- 按照提示更新 DNS 记录

### 设置自动部署
- 在 Railway 项目中，点击 `Settings` → `Git Integration`
- 启用 `Auto Deploy` 选项
- 每次推送代码到 GitHub 时，Railway 会自动重新部署

### 监控和日志
- 点击 `Logs` 标签页查看应用日志
- 点击 `Metrics` 标签页查看性能指标

## 技术支持

如果遇到部署问题，请：
1. 查看 Railway 文档：https://docs.railway.app
2. 检查应用日志获取详细错误信息
3. 确保所有环境变量正确设置
4. 验证数据库卷已正确挂载

---

**部署完成后，你的 IPD 研发管理平台将可以通过互联网访问，所有数据都会持久化存储在数据库中！**
