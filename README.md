# 繽紛七彩酷炫甘特圖 (Gantt Manager)

> 一個現代化、全功能的專案管理與甘特圖視覺化應用程式

[![部署狀態](https://img.shields.io/badge/部署-Vercel-black)](https://dist-taupe-delta.vercel.app)
[![技術棧](https://img.shields.io/badge/技術棧-React%20%7C%20TypeScript%20%7C%20Express-blue)](https://github.com)

## 📢 更新日誌

### 2025-11-21
- **修復部署問題**：修正根目錄 `index.html` 檔案，解決訪問根路徑導向錯誤項目的問題
- **專案遷移**：將專案從 `~/claude-artifact-build/` 移動至 `~/Documents/coding_projects/專案/甘特圖專案管理/`
- **備份檔案**：舊版 Strategy Inc. 頁面已備份至 `index-strategy-inc-backup.html`

## 🎯 專案簡介

繽紛七彩酷炫甘特圖是一個功能完善的專案管理系統，提供視覺化的甘特圖介面、多工作區支援、即時統計分析，以及強大的任務管理功能。無論是個人專案追蹤或團隊協作規劃，都能輕鬆上手。

**核心特色：**
- 🎨 直觀的拖曳式任務管理介面
- 📊 即時統計儀表板與進度分析
- 🗂️ 多工作區獨立管理
- 📱 完全響應式設計，支援各種裝置
- ☁️ 雲端資料同步（支援 Redis / Vercel KV）
- 📄 一鍵匯出 PDF 報告
- 🎓 獨立的學習與成長追蹤區

## 🚀 快速開始

### 線上體驗

| 入口 | URL |
|------|-----|
| 預設工作區 | [https://dist-taupe-delta.vercel.app/?workspace=default](https://dist-taupe-delta.vercel.app/?workspace=default) |
| 管理後台 | [https://dist-taupe-delta.vercel.app/management](https://dist-taupe-delta.vercel.app/management) |
| 後端 API | [https://backend-janus-projects-f12c2f60.vercel.app](https://backend-janus-projects-f12c2f60.vercel.app) |

### 本地開發環境設定

#### 前置需求
- Node.js 16.x 或更高版本
- npm 或 yarn 套件管理工具

#### 1. 安裝依賴

**前端：**
```bash
npm install
```

**後端：**
```bash
cd backend
npm install
```

#### 2. 啟動後端服務

在 `backend` 目錄下執行：
```bash
npm run dev
```
後端服務將在 `http://localhost:3001` 啟動。

#### 3. 啟動前端開發伺服器

返回專案根目錄執行：
```bash
npx run-claude-artifact dev my-app.tsx
```
前端應用將在瀏覽器中自動開啟（預設 `http://localhost:5173`）。

## ✨ 主要功能

### 📅 甘特圖工作區

#### 互動式時間軸
- 視覺化呈現任務的起始日期、結束日期與完成進度
- 智慧型時間軸縮放：自動調整或自訂日期範圍
- 週/日標記與今日指示線
- 固定表頭設計，捲動時保持可見

#### 完整任務管理
- **CRUD 操作**：建立、編輯、刪除任務
- **任務屬性**：
  - 名稱、起訖日期、完成進度（0-100%）
  - 狀態：待處理、進行中、已完成、未發布、阻塞等
  - 自訂分類標籤
  - 詳細描述
- **拖曳排序**：直覺的拖放介面重新排列任務順序

#### 多類型附件支援
每個任務支援多種補充材料：
- 🔗 連結（含自訂名稱與備註）
- 🖼️ 圖片（支援預覽）
- 📎 檔案附件
- 📝 文字備註

#### 智慧分類系統
- **預設分類**：AI賦能、流程優化、產品行銷、品牌行銷、客戶開發、學習與成長
- **自訂分類**：編輯任務時即可新增
- **自動配色**：8 種色彩循環配置
- **特殊處理**："學習與成長" 分類獨立顯示，無需設定日期

### 📊 統計儀表板

#### 整體進度視覺化
- **圓環圖**：顯示專案整體完成百分比
- **分類配色**：依任務分類比例自動著色

#### 任務統計面板
- 總任務數量
- 已完成 / 進行中任務數
- 即時更新

#### 分類分布圖表
- 橫向長條圖展示各分類任務數量
- 百分比分析
- 色彩編碼分類識別

### 🗂️ 管理後台

#### 多工作區管理
- **集中介面**：統一管理所有專案工作區
- **工作區資訊**：
  - 專案名稱、負責人
  - 狀態（進行中 / 已結案）
  - 任務數量、日期範圍
  - 最後更新時間
  - 視覺化色彩標籤

#### 工作區操作
- ➕ 建立新工作區（含名稱、負責人、日期範圍設定）
- ✏️ 編輯工作區資訊
- 🗑️ 刪除工作區（預設工作區除外）
- 👁️ 即時預覽工作區內容（模態視窗展示）

### 📄 PDF 匯出

- 一鍵匯出完整儀表板與甘特圖
- 自動偵測方向（橫向 / 直向）
- 高解析度渲染（2-3x DPR）
- 匯出進度指示

## 🛠️ 技術架構

### 前端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **React** | 18.x | UI 框架 |
| **TypeScript** | Latest | 型別安全 |
| **Tailwind CSS** | - | 樣式系統 |
| **Lucide React** | Latest | 圖示元件庫 |
| **html2canvas** | ^1.4.1 | Canvas 渲染 |
| **jsPDF** | ^3.0.3 | PDF 產生 |
| **run-claude-artifact** | ^2.0.0 | 開發工具 |

### 後端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **Node.js** | 16+ | JavaScript 執行環境 |
| **Express.js** | ^4.19.2 | Web 框架 |
| **CORS** | ^2.8.5 | 跨域請求處理 |
| **Redis** | ^4.7.1 | 資料儲存客戶端 |

### 資料持久化

三層儲存策略，自動降級：

1. **Redis**（優先）
   - 環境變數：`REDIS_URL`
   - 適用於自架 Redis 伺服器

2. **Vercel KV**（備援）
   - 環境變數：`KV_REST_API_URL`, `KV_REST_API_TOKEN`
   - Vercel 原生 Redis 相容服務

3. **本地 JSON**（開發）
   - 路徑：`backend/tasks.json`
   - 無雲端配置時啟用

## 📁 專案結構

```
claude-artifact-build/
├── my-app.tsx              # 前端主應用程式（3554 行）
├── index.html              # HTML 入口
├── package.json            # 前端依賴
├── vercel.json             # 前端部署配置
├── .env.local              # 前端環境變數（需自行建立）
│
├── backend/
│   ├── server.js           # Express API 伺服器
│   ├── storage.js          # 資料持久化抽象層
│   ├── tasks.json          # 預設種子資料
│   ├── package.json        # 後端依賴
│   ├── vercel.json         # 後端部署配置
│   └── .env.local          # 後端環境變數（需自行建立）
│
├── assets/
│   ├── rainbow-cat.jpg     # 專案標誌
│   └── rainbow-cat-128.jpg # 專案圖示（壓縮版）
│
└── dist/                   # 編譯輸出目錄
```

## 🔌 API 端點文件

### 健康檢查
```
GET /health
```
回應：`{ status: 'ok', source: 'gantt-manager-api' }`

### 任務操作
```
GET /tasks?workspaceId=<id>
```
- 取得指定工作區的任務與設定
- 回應：`{ tasks: [], settings: {}, meta: {} }`

```
PUT /tasks?workspaceId=<id>
```
- 更新工作區任務
- 請求體：`{ tasks: [], settings: {} }`
- 回應：`{ success: true, count: <number> }`

### 工作區管理
```
GET /workspaces
```
- 列出所有工作區
- 回應：`{ workspaces: [...] }`

```
POST /workspaces
```
- 建立新工作區
- 請求體：`{ name?, owner?, range?: { start?, end? } }`

```
PATCH /workspaces/:workspaceId
```
- 更新工作區資訊
- 請求體：`{ status?, owner?, name? }`

```
DELETE /workspaces/:workspaceId
```
- 刪除工作區（預設工作區無法刪除）
- 回應：`{ success: true }`

## ⚙️ 環境變數配置

### 前端 `.env.local`
```bash
VITE_API_BASE_URL=http://localhost:3001  # 本地開發
# VITE_API_BASE_URL=https://your-backend-api.vercel.app  # 生產環境
```

### 後端 `backend/.env.local`

**選項 1：使用 Redis**
```bash
REDIS_URL=redis://username:password@host:port
PORT=3001
```

**選項 2：使用 Vercel KV**
```bash
KV_REST_API_URL=https://your-kv-instance.vercel.app
KV_REST_API_TOKEN=your_token_here
PORT=3001
```

**選項 3：僅本地開發（無雲端）**
```bash
PORT=3001
# 不設定 REDIS_URL 或 KV_* 變數，將使用 tasks.json
```

## 🚢 部署指南

### Vercel 部署（推薦）

#### 前端部署

1. 在 Vercel 建立新專案，連接此 Git 儲存庫
2. 設定環境變數：
   - `VITE_API_BASE_URL`：後端 API 完整網址
3. 部署設定已包含在 `vercel.json` 中，無需額外配置

#### 後端部署

1. 在 Vercel 建立另一個專案，連接相同儲存庫
2. 設定 Root Directory 為 `backend`
3. 設定環境變數（擇一）：
   - **Vercel KV**：`KV_REST_API_URL`, `KV_REST_API_TOKEN`
   - **外部 Redis**：`REDIS_URL`
4. 部署

### 手動部署

#### 編譯前端
```bash
npx run-claude-artifact build my-app.tsx --deploy-dir dist
```
將 `dist/` 目錄內容部署至任何靜態託管服務。

#### 後端部署
後端是標準的 Node.js Express 應用，可部署至：
- Heroku
- Railway
- DigitalOcean App Platform
- 任何支援 Node.js 的雲端平台

確保設定正確的環境變數。

## 🧪 測試建議

1. **任務 CRUD**
   - 建立任務並驗證儲存
   - 編輯任務資訊並確認更新
   - 刪除任務並驗證移除

2. **拖曳排序**
   - 拖曳任務改變順序
   - 驗證排序是否持久化

3. **分類管理**
   - 新增自訂分類
   - 驗證分類顏色自動分配
   - 刪除分類標籤

4. **同步機制**
   - 關閉後端服務測試離線模式
   - 重新連線後驗證資料同步

5. **工作區管理**
   - 建立、編輯、刪除工作區
   - 切換工作區狀態
   - 驗證工作區預覽功能

6. **時間軸顯示**
   - 測試短期範圍（數日）
   - 測試長期範圍（跨月）
   - 驗證今日標記位置

7. **PDF 匯出**
   - 匯出並檢查內容完整性
   - 驗證多頁面處理

## 🎨 資料模型

### Task（任務）
```typescript
{
  id: string | number,
  name: string,
  startDate: string,        // YYYY-MM-DD
  endDate: string,          // YYYY-MM-DD
  status: 'pending' | 'in-progress' | 'completed' | 'unpublished' | 'blocked' | string,
  category: string,
  progress: number,         // 0-100
  description?: string,
  materials: Material[]
}
```

### Material（附件）
```typescript
{
  id: string | number,
  type: 'link' | 'image' | 'file' | 'note',
  name: string,
  url?: string,
  dataUrl?: string,         // Base64 for images
  note?: string
}
```

### Workspace（工作區）
```typescript
{
  id: string,
  name: string,
  owner?: string,
  status: 'active' | 'closed',
  color?: string,
  tasks: Task[],
  settings: {
    projectTitle: string,
    rangeMode: 'auto' | 'custom',
    viewRange: { start: string, end: string }
  },
  createdAt: string,
  updatedAt: string,
  lastSyncedAt: string
}
```

## 🔧 開發指南

### 新增前端功能

主要邏輯集中在 `my-app.tsx`。建議未來複雜功能可模組化：

```typescript
// 範例：提取元件
function NewFeatureComponent({ props }) {
  // 元件邏輯
  return <div>...</div>
}
```

### 新增後端端點

在 `backend/server.js` 中新增路由：

```javascript
app.get('/new-endpoint', async (req, res) => {
  try {
    // 處理邏輯
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 修改資料模型

1. 更新 TypeScript 介面定義
2. 在 `backend/storage.js` 中更新骨架函式
3. 更新前端元件以處理新欄位
4. 測試資料遷移邏輯

## ⚠️ 已知限制與改進方向

### 目前限制
- **PDF 匯出解析度**：使用 html2canvas 截圖方式，非向量格式
- **程式碼組織**：前端邏輯集中於單一檔案（3554 行）
- **無自動化測試**：目前依賴手動測試
- **大範圍時間軸效能**：跨年度範圍可能有效能問題
- **無虛擬捲動**：大量任務時可能影響效能

### 未來改進建議
- [ ] 實作真向量 PDF 匯出（Playwright / Puppeteer）
- [ ] 模組化前端元件架構
- [ ] 新增自動化測試套件
- [ ] 實作虛擬捲動以優化大列表效能
- [ ] 新增使用者認證與授權
- [ ] 支援即時多人協作
- [ ] 新增任務依賴關係視覺化
- [ ] 實作搜尋與篩選功能
- [ ] 新增通知與提醒系統

## 📄 授權

此專案由 **Janus_澈行** 開發維護。


## 📞 聯絡方式

如有問題或建議，請透過 GitHub Issues 聯繫。

---

**版本**: v1.1
**最後更新**: 2025-11-07
**作者**: Janus_澈行

## 📚 相關文件

- 詳細開發歷程請參考 `.specstory/` 目錄下的歷史紀錄檔案
- Vercel 部署文件：[https://vercel.com/docs](https://vercel.com/docs)
- React 官方文件：[https://react.dev](https://react.dev)
- Express.js 文件：[https://expressjs.com](https://expressjs.com)
