// IPD研发管理平台后端服务
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// 初始化数据库
function initDatabase() {
    // 创建项目表
    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
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
        )
    `, (err) => {
        if (err) {
            console.error('创建项目表失败:', err.message);
        } else {
            console.log('项目表创建成功');
            // 插入初始数据
            insertInitialData();
        }
    });
}

// 插入初始数据
function insertInitialData() {
    const initialProjects = [
        {
            id: 'PRJ-2024-001',
            name: '智能家居中控系统开发',
            phase: 'charter-dcp',
            priority: 'high',
            manager: '张伟',
            startDate: '2024-01-15',
            endDate: '2024-06-30',
            progress: 15,
            members: 8
        },
        {
            id: 'PRJ-2024-002',
            name: '新能源汽车电池管理系统',
            phase: 'charter-dcp',
            priority: 'high',
            manager: '李明',
            startDate: '2024-02-01',
            endDate: '2024-08-31',
            progress: 10,
            members: 12
        },
        {
            id: 'PRJ-2023-015',
            name: '工业物联网网关平台',
            phase: 'cdcp',
            priority: 'medium',
            manager: '王芳',
            startDate: '2023-10-10',
            endDate: '2024-04-30',
            progress: 35,
            members: 6
        },
        {
            id: 'PRJ-2023-018',
            name: 'AI视觉检测系统',
            phase: 'cdcp',
            priority: 'high',
            manager: '刘强',
            startDate: '2023-11-01',
            endDate: '2024-05-15',
            progress: 42,
            members: 10
        },
        {
            id: 'PRJ-2023-020',
            name: '5G通信模块研发',
            phase: 'cdcp',
            priority: 'medium',
            manager: '陈静',
            startDate: '2023-12-01',
            endDate: '2024-06-15',
            progress: 28,
            members: 7
        },
        {
            id: 'PRJ-2023-008',
            name: '智能仓储机器人系统',
            phase: 'pdcp',
            priority: 'high',
            manager: '赵磊',
            startDate: '2023-08-15',
            endDate: '2024-03-31',
            progress: 65,
            members: 15
        },
        {
            id: 'PRJ-2023-010',
            name: '医疗影像诊断设备',
            phase: 'pdcp',
            priority: 'high',
            manager: '孙丽',
            startDate: '2023-09-01',
            endDate: '2024-04-15',
            progress: 58,
            members: 11
        },
        {
            id: 'PRJ-2023-012',
            name: '无人机飞控系统',
            phase: 'pdcp',
            priority: 'medium',
            manager: '周杰',
            startDate: '2023-09-20',
            endDate: '2024-05-01',
            progress: 52,
            members: 9
        },
        {
            id: 'PRJ-2023-005',
            name: '智能穿戴设备二代',
            phase: 'pdcp',
            priority: 'low',
            manager: '吴敏',
            startDate: '2023-07-01',
            endDate: '2024-02-28',
            progress: 78,
            members: 5
        },
        {
            id: 'PRJ-2023-003',
            name: '边缘计算服务器',
            phase: 'adcp',
            priority: 'high',
            manager: '郑华',
            startDate: '2023-06-01',
            endDate: '2024-01-31',
            progress: 88,
            members: 14
        },
        {
            id: 'PRJ-2023-001',
            name: '智能安防监控系统',
            phase: 'adcp',
            priority: 'medium',
            manager: '黄涛',
            startDate: '2023-05-15',
            endDate: '2024-01-15',
            progress: 92,
            members: 8
        },
        {
            id: 'PRJ-2022-025',
            name: '上一代智能家居产品',
            phase: 'ldcp',
            priority: 'low',
            manager: '林峰',
            startDate: '2022-09-01',
            endDate: '2023-12-31',
            progress: 100,
            members: 3
        }
    ];

    // 检查是否已有数据
    db.get('SELECT COUNT(*) as count FROM projects', (err, row) => {
        if (err) {
            console.error('查询数据失败:', err.message);
        } else if (row.count === 0) {
            // 插入初始数据
            initialProjects.forEach(project => {
                db.run(
                    `INSERT INTO projects (id, name, phase, priority, manager, startDate, endDate, members, progress)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [project.id, project.name, project.phase, project.priority, project.manager, 
                     project.startDate, project.endDate, project.members, project.progress],
                    (err) => {
                        if (err) {
                            console.error('插入数据失败:', err.message);
                        }
                    }
                );
            });
            console.log('初始数据插入成功');
        }
    });
}

// 生成项目ID
function generateProjectId(callback) {
    const year = new Date().getFullYear();
    const prefix = `PRJ-${year}`;
    
    db.all(`SELECT id FROM projects WHERE id LIKE ?`, [`${prefix}%`], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            const existingIds = rows.map(row => {
                const parts = row.id.split('-');
                return parseInt(parts[2]) || 0;
            });
            const nextId = Math.max(...existingIds, 0) + 1;
            const projectId = `${prefix}-${String(nextId).padStart(3, '0')}`;
            callback(null, projectId);
        }
    });
}

// API路由

// 获取所有项目
app.get('/api/projects', (req, res) => {
    db.all('SELECT * FROM projects', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 根据阶段获取项目
app.get('/api/projects/phase/:phase', (req, res) => {
    const phase = req.params.phase;
    db.all('SELECT * FROM projects WHERE phase = ?', [phase], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 创建新项目
app.post('/api/projects', (req, res) => {
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
    generateProjectId((err, projectId) => {
        if (err) {
            return res.status(500).json({ error: '生成项目ID失败' });
        }
        
        // 插入项目
        db.run(
            `INSERT INTO projects (id, name, phase, priority, manager, startDate, endDate, members, progress)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [projectId, project.name, project.phase, project.priority, project.manager, 
             project.startDate, project.endDate, project.members, project.progress || 0],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    // 返回创建的项目
                    db.get('SELECT * FROM projects WHERE id = ?', [projectId], (err, row) => {
                        if (err) {
                            res.status(500).json({ error: err.message });
                        } else {
                            res.status(201).json(row);
                        }
                    });
                }
            }
        );
    });
});

// 更新项目
app.put('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    const project = req.body;
    
    db.run(
        `UPDATE projects SET name = ?, phase = ?, priority = ?, manager = ?, 
         startDate = ?, endDate = ?, members = ?, progress = ?
         WHERE id = ?`,
        [project.name, project.phase, project.priority, project.manager, 
         project.startDate, project.endDate, project.members, project.progress, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: '项目不存在' });
            } else {
                // 返回更新后的项目
                db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.json(row);
                    }
                });
            }
        }
    );
});

// 删除项目
app.delete('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    
    db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: '项目不存在' });
        } else {
            res.json({ message: '项目删除成功' });
        }
    });
});

// 静态文件服务
app.use(express.static(path.join(__dirname, '.')));

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
