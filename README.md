# 繽紛七彩酷炫甘特圖 (Rainbow Gantt)

> 現代化全功能專案管理與甘特圖視覺化應用程式

[![部署狀態](https://img.shields.io/badge/部署-Vercel-black)](https://rainbow-gantt.vercel.app)
[![技術棧](https://img.shields.io/badge/技術棧-React%20%7C%20TypeScript%20%7C%20Vite-blue)](https://github.com)

## 🎯 專案簡介

繽紛七彩酷炫甘特圖是一個功能完善的專案管理系統，提供視覺化的甘特圖介面、多工作區支援、即時統計分析，以及強大的任務管理功能。

**核心特色：**
- 🎨 直觀的拖曳式任務管理介面
- 📊 即時統計儀表板與進度分析
- 🗂️ 多工作區獨立管理
- 📅 TIMELINE // CALENDAR_VIEW 日曆視圖
- 📱 完全響應式設計，支援各種裝置
- ☁️ 雲端資料同步（Redis Cloud）
- 📄 一鍵匯出 PDF 報告
- 🎓 獨立的學習與成長追蹤區

## 🚀 快速開始

### 線上體驗

| 入口 | URL |
|------|-----|
| 甘特圖主頁 | [https://rainbow-gantt.vercel.app](https://rainbow-gantt.vercel.app) |
| 後端 API | [https://backend-janus-projects-f12c2f60.vercel.app](https://backend-janus-projects-f12c2f60.vercel.app) |

### 本地開發環境設定

#### 前置需求
- Node.js 16.x 或更高版本
- npm 套件管理工具

#### 1. 安裝依賴

```bash
npm install
```

#### 2. 設定環境變數

創建 `.env.local` 檔案：
```env
REDIS_URL=redis://your-redis-url
```

#### 3. 啟動開發伺服器

```bash
npm run dev
```

前端應用將在 `http://localhost:5173` 啟動。

#### 4. 構建生產版本

```bash
npm run build
```

## 📂 專案結構

```
甘特圖專案管理/
├── src/                    # 前端源碼
│   ├── components/         # React 組件
│   ├── hooks/              # 自定義 Hooks
│   ├── types/              # TypeScript 類型定義
│   └── utils/              # 工具函數
├── api/                    # Vercel Serverless Functions
│   ├── calendar.ts         # Calendar API
│   ├── notes.ts            # Notes API
│   ├── tasks.ts            # Tasks API
│   └── attachments.ts      # Attachments API
├── backend/                # 獨立後端服務（舊版，待整合）
│   ├── server.js           # Express 伺服器
│   └── storage.js          # Redis 存儲邏輯
├── public/                 # 靜態資源
├── dist/                   # 構建輸出
└── vercel.json             # Vercel 部署配置
```

## 🛠️ 技術棧

### 前端
- **框架**: React 18 + TypeScript
- **構建工具**: Vite
- **樣式**: Tailwind CSS
- **動畫**: Framer Motion
- **圖標**: Lucide React

### 後端
- **API**: Vercel Serverless Functions
- **數據庫**: Redis Cloud
- **部署**: Vercel

## ✨ 主要功能

### 📅 甘特圖工作區

#### 互動式時間軸
- 視覺化呈現任務的起始日期、結束日期與完成進度
- 智慧型時間軸縮放：自動調整或自訂日期範圍
- 週/日標記與今日指示線
- 固定表頭設計，捲動時保持可見

#### 完整任務管理
- **CRUD 操作**：建立、編輯、刪除任務
- **任務屬性**：名稱、起訖日期、完成進度、狀態、分類標籤、描述
- **拖曳排序**：直覺的拖放介面重新排列任務順序

#### 多類型附件支援
- 🔗 連結
- 🖼️ 圖片（支援預覽）
- 📄 文件
- 🎬 影片
- 📝 筆記

### 📆 TIMELINE // CALENDAR_VIEW

- **雙人員日曆**：JA / JO 獨立視圖
- **每日記錄**：文字內容 + 多媒體附件
- **雲端同步**：自動保存到 Redis Cloud
- **跨裝置存取**：資料即時同步

### 📊 統計儀表板

- 即時計算總任務數、已完成任務數、完成率
- 視覺化進度環形圖
- 按狀態分類統計（待處理、進行中、已完成等）

### 🗂️ 多工作區管理

- 創建、編輯、刪除、切換工作區
- 每個工作區獨立的任務、視圖範圍、配色
- 工作區狀態管理（活躍、已關閉）

## 🔧 開發指南

### 可用腳本

```bash
npm run dev          # 啟動開發伺服器
npm run build        # 構建生產版本
npm run preview      # 預覽生產版本
```

### 代碼規範

- 使用 TypeScript 嚴格模式
- 遵循 ESLint 規則
- 組件使用函數式組件 + Hooks
- 樣式使用 Tailwind CSS 工具類

## 📝 更新日誌

### 2025-12-19 (最新)
- **✅ 修復 Calendar View 雲端儲存**：整合 Redis Cloud，支援跨裝置同步
- **🧹 專案架構重構**：簡化目錄結構，只保留當前版本
- **🔧 API 整合**：Calendar API 使用與甘特圖任務相同的 Redis Cloud

### 2025-11-21
- **✨ 全新 Vercel 項目**：建立獨立項目 `rainbow-gantt`
- **🔓 自動化部署保護關閉**：使用 Vercel API 自動化配置
- **⚙️ 環境變量配置**：完成生產環境 API 端點配置
- **🎯 新域名**：https://rainbow-gantt.vercel.app

## 🌐 部署

專案已部署到 Vercel，支援自動部署：

1. 推送到 GitHub main 分支
2. Vercel 自動觸發構建
3. 部署完成後自動更新線上版本

### 環境變數

生產環境需要設定：
```env
REDIS_URL=redis://default:xxx@redis-11566.c294.ap-northeast-1-2.ec2.redns.redis-cloud.com:11566
```

## 📄 授權

本專案為私有專案，僅供內部使用。

## 👥 貢獻者

- Janus（開發者）

---

**最後更新**: 2025-12-19
