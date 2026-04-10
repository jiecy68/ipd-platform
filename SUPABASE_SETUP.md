# Supabase配置

## 项目信息
- **项目名称**: IPD研发管理平台
- **数据库**: Supabase (PostgreSQL)
- **部署平台**: Vercel

## Supabase设置步骤

### 1. 创建Supabase项目
1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 登录或注册账号
4. 创建新项目:
   - 项目名称: `ipd-platform`
   - 数据库密码: 设置一个安全的密码
   - 区域: 选择离你最近的区域

### 2. 获取API密钥
1. 进入项目设置
2. 点击 "API"
3. 复制以下信息:
   - Project URL: `https://xxxx.supabase.co`
   - Anon Key: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Service Role Key: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. 创建数据库表
1. 进入 "SQL Editor"
2. 运行以下SQL语句创建projects表:

```sql
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phase TEXT NOT NULL,
    priority TEXT NOT NULL,
    manager TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    members INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始数据
INSERT INTO projects (id, name, phase, priority, manager, startDate, endDate, members, progress)
VALUES
('PRJ-2024-001', '智能家居中控系统开发', 'charter-dcp', 'high', '张伟', '2024-01-15', '2024-06-30', 8, 15),
('PRJ-2024-002', '新能源汽车电池管理系统', 'charter-dcp', 'high', '李明', '2024-02-01', '2024-08-31', 12, 10),
('PRJ-2023-015', '工业物联网网关平台', 'cdcp', 'medium', '王芳', '2023-10-10', '2024-04-30', 6, 35),
('PRJ-2023-018', 'AI视觉检测系统', 'cdcp', 'high', '刘强', '2023-11-01', '2024-05-15', 10, 42),
('PRJ-2023-020', '5G通信模块研发', 'cdcp', 'medium', '陈静', '2023-12-01', '2024-06-15', 7, 28),
('PRJ-2023-008', '智能仓储机器人系统', 'pdcp', 'high', '赵磊', '2023-08-15', '2024-03-31', 15, 65),
('PRJ-2023-010', '医疗影像诊断设备', 'pdcp', 'high', '孙丽', '2023-09-01', '2024-04-15', 11, 58),
('PRJ-2023-012', '无人机飞控系统', 'pdcp', 'medium', '周杰', '2023-09-20', '2024-05-01', 9, 52),
('PRJ-2023-005', '智能穿戴设备二代', 'pdcp', 'low', '吴敏', '2023-07-01', '2024-02-28', 5, 78),
('PRJ-2023-003', '边缘计算服务器', 'adcp', 'high', '郑华', '2023-06-01', '2024-01-31', 14, 88),
('PRJ-2023-001', '智能安防监控系统', 'adcp', 'medium', '黄涛', '2023-05-15', '2024-01-15', 8, 92),
('PRJ-2022-025', '上一代智能家居产品', 'ldcp', 'low', '林峰', '2022-09-01', '2023-12-31', 3, 100);
```

### 4. 配置Vercel环境变量
1. 进入Vercel项目控制台
2. 点击 "Settings" → "Environment Variables"
3. 添加以下环境变量:
   - `SUPABASE_URL`: 你的Supabase Project URL
   - `SUPABASE_ANON_KEY`: 你的Supabase Anon Key
   - `SUPABASE_SERVICE_KEY`: 你的Supabase Service Role Key

## 技术说明

### 为什么选择Supabase
- **持久化存储**: 数据存储在PostgreSQL数据库中，不会丢失
- **易于集成**: 提供完整的JavaScript SDK
- **免费计划**: 适合小型应用
- **安全性**: 内置认证和权限控制
- **可扩展性**: 支持大型应用

### 数据迁移
- 所有数据将存储在Supabase中
- 初始数据已包含在SQL语句中
- 新建项目会自动保存到数据库

### 故障排除
- **API连接失败**: 检查环境变量是否正确设置
- **数据不显示**: 检查Supabase数据库中的数据
- **创建项目失败**: 检查API密钥权限

---

**完成设置后，你的IPD研发管理平台将拥有持久化的数据库存储，所有项目数据都会安全保存。**
