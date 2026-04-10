#!/bin/bash

# Node.js 安装脚本 for macOS
# 运行方式: chmod +x install-node.sh && ./install-node.sh

echo "开始安装 Node.js..."

# 检查系统架构
if [[ $(uname -m) == 'arm64' ]]; then
    echo "检测到 Apple Silicon Mac"
    NODE_URL="https://nodejs.org/dist/v20.11.0/node-v20.11.0-arm64.pkg"
else
    echo "检测到 Intel Mac"
    NODE_URL="https://nodejs.org/dist/v20.11.0/node-v20.11.0.pkg"
fi

echo "下载 Node.js..."
cd ~

# 如果已经下载了pkg文件，直接安装
if [ -f "node-v20.11.0.pkg" ]; then
    echo "找到已下载的安装包，正在安装..."
    sudo installer -pkg node-v20.11.0.pkg -target /
elif [ -f "node-v20.11.0-arm64.pkg" ]; then
    echo "找到已下载的安装包，正在安装..."
    sudo installer -pkg node-v20.11.0-arm64.pkg -target /
else
    echo "下载 Node.js 安装包..."
    curl -O "$NODE_URL"

    echo "正在安装 Node.js..."
    sudo installer -pkg node-*.pkg -target /
fi

# 验证安装
echo ""
echo "验证安装..."
node --version
npm --version

echo ""
echo "Node.js 安装完成！"
echo "现在可以运行以下命令启动IPD平台："
echo "cd /Users/dingjie/Documents/trae_projects/ipd-platform"
echo "npm install"
echo "npm start"
