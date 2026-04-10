# Railway部署配置

## 项目信息
- **项目名称**: IPD研发管理平台
- **技术栈**: Node.js + Express + SQLite
- **部署平台**: Railway.app

## 部署步骤

### 1. 准备工作
1. **注册Railway账号**
   - 访问 https://railway.app
   - 使用GitHub账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 连接你的GitHub仓库

### 2. 配置文件

#### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install",
    "startCommand": "npm start"
  },
  "deploy": {
    "numReplicas": 1,
    "healthcheckPath": "/api/projects"
  },
  "env": {
    "PORT": "3001"
  }
}
```

#### .gitignore
```gitignore
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
ipd_platform.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity
```

### 3. 环境变量
在Railway控制台中设置以下环境变量：
- `PORT`: 3001
- `NODE_ENV`: production

### 4. 数据库配置
由于使用SQLite，需要确保数据库文件存储在持久化存储中。Railway的文件系统在部署时会重置，所以需要：

1. **修改server.js**
   将数据库路径改为使用环境变量：
   ```javascript
   // 数据库连接
   const dbPath = process.env.DATABASE_URL || './ipd_platform.db';
   const db = new sqlite3.Database(dbPath, (err) => {
       if (err) {
           console.error('数据库连接失败:', err.message);
       } else {
           console.log('数据库连接成功');
           initDatabase();
       }
   });
   ```

2. **在Railway中添加卷**
   - 进入项目设置
   - 点击 "Volumes"
   - 创建新卷，挂载到 `/data`
   - 更新 `DATABASE_URL` 环境变量为 `/data/ipd_platform.db`

### 5. 部署流程
1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Add deployment config"
   git push origin main
   ```

2. **在Railway中部署**
   - Railway会自动检测代码变更并部署
   - 查看部署日志确保成功

3. **访问应用**
   - Railway会提供一个唯一的域名
   - 访问类似 `https://ipd-platform-xxxx.railway.app` 的地址

### 6. 测试功能
1. **访问应用** - 确认页面正常加载
2. **创建项目** - 测试数据持久化
3. **刷新页面** - 确认数据保存
4. **重启服务** - 测试数据库持久化

### 7. 扩展建议
- **添加自定义域名**
- **设置CI/CD流程**
- **添加监控和日志**
- **设置自动备份**

## 注意事项
- Railway的免费计划有使用限制，适合测试和小型应用
- 对于生产环境，建议使用付费计划或其他云平台
- SQLite适合小型应用，如需扩展可考虑PostgreSQL或MySQL
