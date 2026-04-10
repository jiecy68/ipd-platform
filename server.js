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
        
        // 插入项目
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
            res.status(500).json({ error: error.message });
        } else {
            res.status(201).json(data[0]);
        }
    } catch (error) {
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
            res.status(500).json({ error: error.message });
        } else if (data.length === 0) {
            res.status(404).json({ error: '项目不存在' });
        } else {
            res.json(data[0]);
        }
    } catch (error) {
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
