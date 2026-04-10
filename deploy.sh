#!/bin/bash

# IPD研发管理平台部署脚本
# 运行方式: chmod +x deploy.sh && ./deploy.sh

echo "=================================="
echo "IPD研发管理平台部署脚本"
echo "=================================="

echo "\n1. 检查项目结构..."

# 检查必要文件
if [ ! -f "package.json" ]; then
    echo "错误: 缺少package.json文件"
    exit 1
fi

if [ ! -f "server.js" ]; then
    echo "错误: 缺少server.js文件"
    exit 1
fi

if [ ! -f "index.html" ]; then
    echo "错误: 缺少index.html文件"
    exit 1
fi

echo "✓ 项目结构检查通过"

echo "\n2. 检查依赖..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装"
    echo "请先安装Node.js 16.0或更高版本"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装"
    echo "请先安装Node.js 16.0或更高版本"
    exit 1
fi

echo "✓ Node.js 检查通过"
node --version
npm --version

echo "\n3. 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

echo "✓ 依赖安装成功"

echo "\n4. 本地测试..."

# 启动测试服务器
node server.js &
SERVER_PID=$!

# 等待服务器启动
sleep 3

# 测试API
curl -s http://localhost:3001/api/projects > test_response.json

if [ $? -ne 0 ]; then
    echo "错误: 服务器启动失败"
    kill $SERVER_PID
    exit 1
fi

# 检查响应
if [ -s test_response.json ]; then
    echo "✓ API测试通过"
    echo "✓ 本地服务器运行正常"
else
    echo "错误: API响应异常"
    kill $SERVER_PID
    exit 1
fi

# 停止测试服务器
kill $SERVER_PID
rm test_response.json

echo "\n5. 部署选项..."
echo "请选择部署平台:"
echo "1. Railway.app (推荐)"
echo "2. Heroku"
echo "3. Vercel"
echo "4. 本地运行"

read -p "输入选项编号: " DEPLOY_OPTION

echo "\n6. 部署到选择的平台..."

case $DEPLOY_OPTION in
    1)
        echo "部署到 Railway.app..."
        echo "\n部署步骤:"
        echo "1. 访问 https://railway.app"
        echo "2. 登录或注册账号"
        echo "3. 点击 'New Project'"
        echo "4. 选择 'Deploy from GitHub repo'"
        echo "5. 连接你的GitHub仓库"
        echo "6. 等待自动部署完成"
        echo "7. 访问 Railway 提供的域名"
        ;;
    2)
        echo "部署到 Heroku..."
        echo "\n部署步骤:"
        echo "1. 访问 https://heroku.com"
        echo "2. 登录或注册账号"
        echo "3. 点击 'New' -> 'Create new app'"
        echo "4. 输入应用名称"
        echo "5. 选择 'GitHub' 作为部署方法"
        echo "6. 连接你的GitHub仓库"
        echo "7. 点击 'Deploy Branch'"
        echo "8. 访问 Heroku 提供的域名"
        ;;
    3)
        echo "部署到 Vercel..."
        echo "\n部署步骤:"
        echo "1. 访问 https://vercel.com"
        echo "2. 登录或注册账号"
        echo "3. 点击 'New Project'"
        echo "4. 选择 'Import Git Repository'"
        echo "5. 连接你的GitHub仓库"
        echo "6. 等待自动部署完成"
        echo "7. 访问 Vercel 提供的域名"
        ;;
    4)
        echo "本地运行..."
        echo "\n启动服务器:"
        echo "npm start"
        echo "\n访问地址: http://localhost:3001"
        ;;
    *)
        echo "无效选项"
        exit 1
        ;;
esac

echo "\n=================================="
echo "部署指南已生成"
echo "=================================="
echo "\n部署完成后，你的IPD研发管理平台将可以通过互联网访问！"
