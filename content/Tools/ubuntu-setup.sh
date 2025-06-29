#!/bin/bash

# Ubuntu 서버 초기 설정 스크립트
# 작성일: $(date +%Y-%m-%d)
# 대상 OS: Ubuntu (Debian 계열)

set -e  # 에러 발생 시 스크립트 중단

echo "🚀 Ubuntu 서버 초기 설정을 시작합니다..."

# 1. 시스템 업데이트
echo "📦 시스템 패키지 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# 2. 기본 개발 도구 설치
echo "🛠️ 기본 개발 도구 설치 중..."
sudo apt install -y \
    build-essential \
    git \
    curl \
    wget \
    unzip \
    vim \
    htop \
    net-tools \
    lsof \
    tmux

# 3. UV (Python Package Manager) 설치
echo "🐍 UV (Python Package Manager) 설치 중..."
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env

# 4. Docker 기존 패키지 제거 (충돌 방지)
echo "🗑️ 기존 Docker 패키지 제거 중..."
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do 
    sudo apt-get remove -y $pkg 2>/dev/null || true
done

# 5. Docker 공식 설치
echo "🐳 Docker 공식 버전 설치 중..."

# Docker GPG 키 추가
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Docker 레포지토리 추가
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 6. 현재 사용자를 docker 그룹에 추가 (sudo 없이 docker 사용 가능)
echo "👥 사용자를 docker 그룹에 추가 중..."
sudo usermod -aG docker $USER

echo "✅ 설치 완료!"
echo ""
echo "📋 설치된 버전 확인:"
echo "Git: $(git --version)"
echo "UV: $(uv --version 2>/dev/null || echo 'UV 설치 완료 (재로그인 필요)')"
echo "Docker: $(docker --version)"
echo ""
echo "⚠️ Docker를 sudo 없이 사용하려면 로그아웃 후 다시 로그인하세요."
echo "🎉 Ubuntu 서버 초기 설정이 완료되었습니다!" 