// IPD研发管理平台 - 项目看板数据与交互

// 项目数据（从API获取）
let projectsData = [];

// API基础URL
const API_BASE_URL = '/api';

// 从API获取项目数据
async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        console.log('API响应状态:', response.status);
        console.log('API响应URL:', response.url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API错误响应:', errorText);
            throw new Error(`获取项目数据失败 (${response.status}): ${errorText}`);
        }
        const rawData = await response.json();
        console.log('原始API数据:', rawData);
        
        // 转换小写列名为驼峰命名
        projectsData = rawData.map(project => ({
            id: project.id,
            name: project.name,
            phase: project.phase,
            priority: project.priority,
            manager: project.manager,
            startDate: project.startdate || project.startDate,
            endDate: project.enddate || project.endDate,
            members: project.members,
            progress: project.progress,
            latitude: project.latitude,
            longitude: project.longitude,
            createdAt: project.createdat || project.createdAt
        }));
        
        console.log('转换后的数据:', projectsData);
        renderKanban();
    } catch (error) {
        console.error('获取项目数据错误:', error);
        // 加载失败时使用默认数据
        loadDefaultProjects();
    }
}

// 加载默认项目数据（当API不可用时）
function loadDefaultProjects() {
    projectsData = [
        {
            id: 'PRJ-2024-001',
            name: '智能家居中控系统开发',
            phase: 'charter-dcp',
            priority: 'high',
            manager: '张伟',
            startDate: '2024-01-15',
            endDate: '2024-06-30',
            progress: 15,
            members: 8,
            latitude: 30.2741,
            longitude: 120.1551
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
            members: 12,
            latitude: 29.8683,
            longitude: 121.5440
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
            members: 6,
            latitude: 27.9947,
            longitude: 120.6994
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
            members: 10,
            latitude: 30.0277,
            longitude: 120.5853
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
            members: 7,
            latitude: 30.8682,
            longitude: 119.8610
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
            members: 15,
            latitude: 30.7460,
            longitude: 120.7691
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
            members: 11,
            latitude: 29.1246,
            longitude: 119.6469
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
            members: 9,
            latitude: 28.9116,
            longitude: 118.8742
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
            members: 5,
            latitude: 28.6688,
            longitude: 121.4200
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
            members: 14,
            latitude: 28.4555,
            longitude: 119.9216
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
            members: 8,
            latitude: 30.0166,
            longitude: 122.2078
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
            members: 3,
            latitude: 30.2741,
            longitude: 120.1551
        }
    ];
    renderKanban();
    console.log('使用默认项目数据');
}

// DCP阶段配置
const dcpConfig = {
    'charter-dcp': {
        name: 'Charter DCP',
        color: '#f59e0b',
        description: '立项决策评审'
    },
    'cdcp': {
        name: 'CDCP',
        color: '#10b981',
        description: '概念决策评审'
    },
    'pdcp': {
        name: 'PDCP',
        color: '#3b82f6',
        description: '计划决策评审'
    },
    'adcp': {
        name: 'ADCP',
        color: '#8b5cf6',
        description: '可获得性决策评审'
    },
    'ldcp': {
        name: 'LDCP',
        color: '#ef4444',
        description: '生命周期终止决策评审'
    }
};

// 优先级配置
const priorityConfig = {
    'high': { label: '高', class: 'priority-high' },
    'medium': { label: '中', class: 'priority-medium' },
    'low': { label: '低', class: 'priority-low' }
};

// 创建项目卡片HTML
function createProjectCard(project) {
    const config = dcpConfig[project.phase];
    const priority = priorityConfig[project.priority];
    
    return `
        <div class="project-card" data-project-id="${project.id}">
            <div class="project-header">
                <span class="project-code">${project.id}</span>
                <span class="project-priority ${priority.class}">${priority.label}</span>
            </div>
            <div class="project-name">${project.name}</div>
            <div class="project-info">
                <div class="info-item">
                    <span class="info-icon">👤</span>
                    <span>项目经理: ${project.manager}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">👥</span>
                    <span>团队: ${project.members}人</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">📅</span>
                    <span>${formatDate(project.startDate)} - ${formatDate(project.endDate)}</span>
                </div>
            </div>
            <div class="project-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%; background-color: ${config.color};"></div>
                </div>
                <div class="progress-text">${project.progress}%</div>
            </div>
        </div>
    `;
}

// 格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

// 渲染看板
function renderKanban() {
    const phases = ['charter-dcp', 'cdcp', 'pdcp', 'adcp', 'ldcp'];
    
    phases.forEach(phase => {
        const container = document.getElementById(phase);
        if (container) {
            const phaseProjects = projectsData.filter(p => p.phase === phase);
            container.innerHTML = phaseProjects.map(project => createProjectCard(project)).join('');
        }
    });
    
    // 更新列计数
    updateColumnCounts();
    
    // 添加卡片点击事件
    addCardClickEvents();
}

// 更新列计数
function updateColumnCounts() {
    const phases = ['charter-dcp', 'cdcp', 'pdcp', 'adcp', 'ldcp'];
    
    phases.forEach(phase => {
        const count = projectsData.filter(p => p.phase === phase).length;
        const column = document.getElementById(phase)?.closest('.kanban-column');
        if (column) {
            const countElement = column.querySelector('.column-count');
            if (countElement) {
                countElement.textContent = count;
            }
        }
    });
}

// 添加卡片点击事件
function addCardClickEvents() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            const project = projectsData.find(p => p.id === projectId);
            if (project) {
                showProjectDetail(project);
            }
        });
    });
}

// 显示项目详情（模拟弹窗）
function showProjectDetail(project) {
    const config = dcpConfig[project.phase];
    const priority = priorityConfig[project.priority];
    
    const detailHtml = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        " id="project-modal">
            <div style="
                background: white;
                border-radius: 12px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 20px;">项目详情</h2>
                    <button onclick="closeModal()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #64748b;
                    ">×</button>
                </div>
                <div style="margin-bottom: 16px;">
                    <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">${project.id}</span>
                    <span style="
                        margin-left: 8px;
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 11px;
                        background: ${config.color}20;
                        color: ${config.color};
                    ">${config.name}</span>
                </div>
                <h3 style="margin: 0 0 16px 0; font-size: 18px;">${project.name}</h3>
                <div style="display: grid; gap: 12px; color: #475569;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>优先级:</span>
                        <span class="${priority.class}" style="padding: 2px 8px; border-radius: 12px; font-size: 12px;">${priority.label}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>项目经理:</span>
                        <span>${project.manager}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>团队成员:</span>
                        <span>${project.members}人</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>开始日期:</span>
                        <span>${project.startDate}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>结束日期:</span>
                        <span>${project.endDate}</span>
                    </div>
                    ${project.latitude && project.longitude ? `
                    <div style="display: flex; justify-content: space-between;">
                        <span>项目地址:</span>
                        <span style="font-size: 12px; color: #64748b; max-width: 200px; text-align: right;">
                            ${project.latitude.toFixed(4)}, ${project.longitude.toFixed(4)}
                        </span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>当前进度:</span>
                        <span style="font-weight: 600; color: ${config.color};">${project.progress}%</span>
                    </div>
                </div>
                <div style="margin-top: 24px;">
                    <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${project.progress}%; background: ${config.color}; border-radius: 4px;"></div>
                    </div>
                </div>
                <div style="margin-top: 24px; display: flex; gap: 12px;">
                    <button onclick="closeModal()" style="
                        flex: 1;
                        padding: 10px;
                        border: 1px solid #e2e8f0;
                        background: white;
                        border-radius: 6px;
                        cursor: pointer;
                    ">关闭</button>
                    <button onclick="alert('进入项目详情页面')" style="
                        flex: 1;
                        padding: 10px;
                        border: none;
                        background: #2563eb;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                    ">查看详情</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', detailHtml);
}

// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.remove();
    }
}

// 打开地图选择器
function openMapSelector() {
    const modalHtml = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
        " id="map-modal">
            <div style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                width: 90%;
                max-width: 800px;
                height: 600px;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 20px;">地图选点</h2>
                    <button onclick="closeMapModal()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #64748b;
                    ">×</button>
                </div>
                <div id="map-container" style="width: 100%; height: 500px;"></div>
                <div style="margin-top: 16px; display: flex; gap: 12px; justify-content: flex-end;">
                    <button onclick="closeMapModal()" style="
                        padding: 10px 20px;
                        border: 1px solid #e2e8f0;
                        background: white;
                        border-radius: 6px;
                        cursor: pointer;
                    ">取消</button>
                    <button onclick="confirmMapSelection()" style="
                        padding: 10px 20px;
                        border: none;
                        background: #2563eb;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                    ">确认选择</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 初始化地图
    setTimeout(() => {
        initMap();
    }, 100);
}

// 关闭地图弹窗
function closeMapModal() {
    const modal = document.getElementById('map-modal');
    if (modal) {
        modal.remove();
    }
}

// 地图实例
let map = null;
let marker = null;
let selectedPosition = null;

// 初始化地图
function initMap() {
    // 创建地图实例
    map = new AMap.Map('map-container', {
        zoom: 13,
        center: [116.397428, 39.90923], // 默认北京
        resizeEnable: true
    });
    
    // 添加点击事件
    map.on('click', function(e) {
        const position = e.lnglat;
        selectedPosition = position;
        
        // 移除旧标记
        if (marker) {
            marker.remove();
        }
        
        // 添加新标记
        marker = new AMap.Marker({
            position: position,
            map: map
        });
        
        // 移动地图到选中位置
        map.setCenter(position);
    });
    
    // 添加控件
    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar());
    map.addControl(new AMap.MapType());
}

// 确认地图选择
function confirmMapSelection() {
    if (selectedPosition) {
        // 获取地址信息
        AMap.plugin('AMap.Geocoder', function() {
            const geocoder = new AMap.Geocoder({
                city: '全国'
            });
            
            geocoder.getAddress(selectedPosition, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    const address = result.regeocode.formattedAddress;
                    
                    // 更新表单
                    const addressInput = document.querySelector('input[name="address"]');
                    const latitudeInput = document.getElementById('latitude');
                    const longitudeInput = document.getElementById('longitude');
                    
                    if (addressInput) addressInput.value = address;
                    if (latitudeInput) latitudeInput.value = selectedPosition.getLat();
                    if (longitudeInput) longitudeInput.value = selectedPosition.getLng();
                    
                    // 关闭地图弹窗
                    closeMapModal();
                }
            });
        });
    }
}

// 显示新建项目模态框
function showCreateProjectModal() {
    const modalHtml = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        " id="project-modal">
            <div style="
                background: white;
                border-radius: 12px;
                padding: 32px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="margin: 0; font-size: 20px;">新建项目</h2>
                    <button onclick="closeModal()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #64748b;
                    ">×</button>
                </div>
                <form id="create-project-form" style="display: grid; gap: 16px;">
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">项目名称 *</label>
                        <input type="text" name="name" required style="
                            width: 100%;
                            padding: 10px 12px;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">DCP阶段 *</label>
                            <select name="phase" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 14px;
                            ">
                                <option value="">请选择</option>
                                <option value="charter-dcp">Charter DCP - 立项决策</option>
                                <option value="cdcp">CDCP - 概念决策</option>
                                <option value="pdcp">PDCP - 计划决策</option>
                                <option value="adcp">ADCP - 可获得性决策</option>
                                <option value="ldcp">LDCP - 生命周期终止</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">优先级 *</label>
                            <select name="priority" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 14px;
                            ">
                                <option value="">请选择</option>
                                <option value="high">高</option>
                                <option value="medium">中</option>
                                <option value="low">低</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">项目经理 *</label>
                        <input type="text" name="manager" required style="
                            width: 100%;
                            padding: 10px 12px;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">开始日期 *</label>
                            <input type="date" name="startDate" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 14px;
                            ">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">结束日期 *</label>
                            <input type="date" name="endDate" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 14px;
                            ">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">团队成员数 *</label>
                            <input type="number" name="members" min="1" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 14px;
                            ">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">初始进度</label>
                            <input type="number" name="progress" min="0" max="100" value="0" style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 14px;
                            ">
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #475569;">项目地址</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" name="address" placeholder="点击地图选点" readonly style="
                                flex: 1;
                                padding: 10px 12px;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 14px;
                            ">
                            <button type="button" onclick="openMapSelector()" style="
                                padding: 10px 16px;
                                border: 1px solid #2563eb;
                                background: white;
                                color: #2563eb;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 14px;
                            ">地图选点</button>
                        </div>
                        <input type="hidden" name="latitude" id="latitude">
                        <input type="hidden" name="longitude" id="longitude">
                    </div>
                    <div style="margin-top: 24px; display: flex; gap: 12px;">
                        <button type="button" onclick="closeModal()" style="
                            flex: 1;
                            padding: 10px;
                            border: 1px solid #e2e8f0;
                            background: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">取消</button>
                        <button type="submit" style="
                            flex: 1;
                            padding: 10px;
                            border: none;
                            background: #2563eb;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">创建项目</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 添加表单提交事件
    const form = document.getElementById('create-project-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            createProject(this);
        });
    }
}

// 创建项目（通过API）
async function createProject(form) {
    const formData = new FormData(form);
    const projectData = {
        name: formData.get('name'),
        phase: formData.get('phase'),
        priority: formData.get('priority'),
        manager: formData.get('manager'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        members: parseInt(formData.get('members')),
        progress: parseInt(formData.get('progress')) || 0,
        latitude: formData.get('latitude') ? parseFloat(formData.get('latitude')) : null,
        longitude: formData.get('longitude') ? parseFloat(formData.get('longitude')) : null
    };
    
    // 验证日期
    if (new Date(projectData.endDate) < new Date(projectData.startDate)) {
        alert('结束日期不能早于开始日期');
        return;
    }
    
    try {
        console.log('正在创建项目...', projectData);
        
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        console.log('API响应状态:', response.status);
        console.log('API响应URL:', response.url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API错误响应:', errorText);
            throw new Error(`创建项目失败 (${response.status}): ${errorText}`);
        }
        
        const rawNewProject = await response.json();
        console.log('项目创建成功:', rawNewProject);
        
        // 转换小写列名为驼峰命名
        const newProject = {
            id: rawNewProject.id,
            name: rawNewProject.name,
            phase: rawNewProject.phase,
            priority: rawNewProject.priority,
            manager: rawNewProject.manager,
            startDate: rawNewProject.startdate || rawNewProject.startDate,
            endDate: rawNewProject.enddate || rawNewProject.endDate,
            members: rawNewProject.members,
            progress: rawNewProject.progress,
            createdAt: rawNewProject.createdat || rawNewProject.createdAt
        };
        
        // 重新获取项目数据
        await fetchProjects();
        
        // 关闭模态框
        closeModal();
        
        // 显示成功消息
        alert('项目创建成功！');
        
    } catch (error) {
        console.error('创建项目错误:', error);
        alert('创建项目失败: ' + error.message);
        
        // 失败时使用本地创建作为备选
        createProjectLocally(form);
    }
}

// 本地创建项目（当API不可用时）
function createProjectLocally(form) {
    const formData = new FormData(form);
    const year = new Date().getFullYear();
    const prefix = `PRJ-${year}`;
    const existingIds = projectsData
        .filter(p => p.id.startsWith(prefix))
        .map(p => parseInt(p.id.split('-')[2]) || 0);
    const nextId = Math.max(...existingIds, 0) + 1;
    
    const project = {
        id: `${prefix}-${String(nextId).padStart(3, '0')}`,
        name: formData.get('name'),
        phase: formData.get('phase'),
        priority: formData.get('priority'),
        manager: formData.get('manager'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        members: parseInt(formData.get('members')),
        progress: parseInt(formData.get('progress')) || 0,
        latitude: formData.get('latitude') ? parseFloat(formData.get('latitude')) : null,
        longitude: formData.get('longitude') ? parseFloat(formData.get('longitude')) : null
    };
    
    // 添加到项目数据
    projectsData.push(project);
    
    // 重新渲染看板
    renderKanban();
    
    // 关闭模态框
    closeModal();
    
    // 显示成功消息
    alert('项目创建成功！（本地模式）');
}

// 显示看板视图
function showKanbanView() {
    document.getElementById('kanban-view').style.display = 'block';
    document.getElementById('map-view').style.display = 'none';
}

// 显示地图视图
function showMapView() {
    document.getElementById('kanban-view').style.display = 'none';
    document.getElementById('map-view').style.display = 'block';
    
    // 初始化项目地图
    setTimeout(() => {
        initProjectMap();
    }, 100);
}

// 项目地图实例
let projectMap = null;
let projectMarkers = [];

// 初始化项目地图
function initProjectMap() {
    console.log('开始初始化项目地图');
    console.log('项目数据:', projectsData);
    
    // 清空旧标记
    if (projectMarkers.length > 0) {
        projectMarkers.forEach(marker => marker.remove());
        projectMarkers = [];
    }
    
    try {
        // 创建地图实例
        if (!projectMap) {
            console.log('创建新的地图实例');
            projectMap = new AMap.Map('project-map', {
                zoom: 8,
                center: [119.5313, 29.8773], // 默认浙江省中心
                resizeEnable: true
            });
            
            // 添加控件
            projectMap.addControl(new AMap.Scale());
            projectMap.addControl(new AMap.ToolBar());
            projectMap.addControl(new AMap.MapType());
            console.log('地图实例创建成功');
        }
        
        // 添加项目标记
        console.log('开始添加项目标记');
        let hasMarkers = false;
        projectsData.forEach(project => {
            if (project.latitude && project.longitude) {
                console.log('添加项目标记:', project.name, project.latitude, project.longitude);
                const marker = new AMap.Marker({
                    position: [project.longitude, project.latitude],
                    map: projectMap,
                    title: project.name
                });
                
                // 添加点击事件
                marker.on('click', function() {
                    showProjectDetail(project);
                });
                
                projectMarkers.push(marker);
                hasMarkers = true;
            }
        });
        
        if (hasMarkers) {
            console.log('项目标记添加成功，共添加', projectMarkers.length, '个标记');
        } else {
            console.log('没有找到带经纬度的项目');
        }
    } catch (error) {
        console.error('地图初始化错误:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从API获取项目数据
    fetchProjects();
    console.log('IPD研发管理平台 - 项目看板已加载');

});

// 添加一些交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 导航项点击效果
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 切换视图
            const viewText = this.textContent.trim();
            if (viewText === '项目看板') {
                showKanbanView();
            } else if (viewText === '项目地图') {
                showMapView();
            }
        });
    });
    
    // 按钮点击效果
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('新建项目')) {
                showCreateProjectModal();
            } else if (this.textContent.includes('导出报表')) {
                alert('导出报表功能开发中...');
            }
        });
    });
});
