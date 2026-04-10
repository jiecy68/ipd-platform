// IPD研发管理平台后端服务
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://xxxxxxxx.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const supabase = createClient(supabaseUrl, supabaseKey);

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 初始化数据库（检查连接）
async function initDatabase() {
    try {
        // 测试连接
        const { data, error } = await supabase
            .from('projects')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('数据库连接失败:', error.message);
        } else {
            console.log('数据库连接成功');
        }
    } catch (error) {
        console.error('初始化数据库错误:', error.message);
    }
}

// 生成项目ID
async function generateProjectId() {
    try {
        const year = new Date().getFullYear();
        const prefix = `PRJ-${year}`;
        
        const { data, error } = await supabase
            .from('projects')
            .select('id')
            .like('id', `${prefix}%`);
        
        if (error) {
            console.error('生成项目ID失败:', error.message);
            // 回退方案
            return `${prefix}-001`;
        }
        
        const existingIds = data.map(row => {
            const parts = row.id.split('-');
            return parseInt(parts[2]) || 0;
        });
        const nextId = Math.max(...existingIds, 0) + 1;
        return `${prefix}-${String(nextId).padStart(3, '0')}`;
    } catch (error) {
        console.error('生成项目ID错误:', error.message);
        const year = new Date().getFullYear();
        return `PRJ-${year}-001`;
    }
}

// API路由

// 检查数据库表结构
app.get('/api/debug/schema', async (req, res) => {
    try {
        // 查询表结构
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .limit(1);
        
        if (error) {
            // 如果查询失败，尝试获取表信息
            console.error('查询表结构失败:', error);
            res.status(500).json({ error: error.message, message: '表结构查询失败' });
        } else {
            // 获取表结构信息
            const columns = data.length > 0 ? Object.keys(data[0]) : [];
            res.json({ 
                message: '表结构查询成功',
                columns: columns,
                sample: data[0] || {} 
            });
        }
    } catch (error) {
        console.error('调试API错误:', error);
        res.status(500).json({ error: error.message });
    }
});

// 重新创建数据库表
app.post('/api/debug/reset-db', async (req, res) => {
    try {
        // 首先删除表（如果存在）
        const { error: dropError } = await supabase
            .rpc('execute_sql', {
                sql: `DROP TABLE IF EXISTS projects;`
            });
        
        if (dropError) {
            console.error('删除表失败:', dropError);
        }
        
        // 创建新表
        const { error: createError } = await supabase
            .rpc('execute_sql', {
                sql: `
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
                `
            });
        
        if (createError) {
            console.error('创建表失败:', createError);
            res.status(500).json({ error: createError.message, message: '创建表失败' });
        } else {
            res.json({ message: '数据库表重置成功' });
        }
    } catch (error) {
        console.error('重置数据库错误:', error);
        res.status(500).json({ error: error.message });
    }
});

// 获取所有项目
app.get('/api/projects', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*');
        
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 根据阶段获取项目
app.get('/api/projects/phase/:phase', async (req, res) => {
    try {
        const phase = req.params.phase;
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('phase', phase);
        
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 创建新项目
app.post('/api/projects', async (req, res) => {
    try {
        const project = req.body;
        
        // 验证数据
        if (!project.name || !project.phase || !project.priority || !project.manager || 
            !project.startDate || !project.endDate || !project.members) {
            return res.status(400).json({ error: '缺少必填字段' });
        }
        
        // 验证日期
        if (new Date(project.endDate) < new Date(project.startDate)) {
            return res.status(400).json({ error: '结束日期不能早于开始日期' });
        }
        
        // 生成项目ID
        const projectId = await generateProjectId();
        
        // 插入项目 - 使用camelCase列名
        const { data, error } = await supabase
            .from('projects')
            .insert({
                id: projectId,
                name: project.name,
                phase: project.phase,
                priority: project.priority,
                manager: project.manager,
                startDate: project.startDate,
                endDate: project.endDate,
                members: project.members,
                progress: project.progress || 0
            })
            .select();
        
        if (error) {
            console.error('插入项目错误:', error);
            res.status(500).json({ error: error.message });
        } else {
            res.status(201).json(data[0]);
        }
    } catch (error) {
        console.error('创建项目错误:', error);
        res.status(500).json({ error: error.message });
    }
});

// 更新项目
app.put('/api/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const project = req.body;
        
        const { data, error } = await supabase
            .from('projects')
            .update({
                name: project.name,
                phase: project.phase,
                priority: project.priority,
                manager: project.manager,
                startDate: project.startDate,
                endDate: project.endDate,
                members: project.members,
                progress: project.progress
            })
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('更新项目错误:', error);
            res.status(500).json({ error: error.message });
        } else if (data.length === 0) {
            res.status(404).json({ error: '项目不存在' });
        } else {
            res.json(data[0]);
        }
    } catch (error) {
        console.error('更新项目错误:', error);
        res.status(500).json({ error: error.message });
    }
});

// 删除项目
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const { data, error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json({ message: '项目删除成功' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 静态文件服务
app.use(express.static(path.join(__dirname, '.')));

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    initDatabase();
});
