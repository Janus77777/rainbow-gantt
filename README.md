# 繽紛七彩酷炫甘特圖 (Gantt Manager)

這是一個功能完善的甘特圖 (Gantt Chart) 管理應用程式。它提供了一個視覺化、互動式的介面來規劃和追蹤專案進度，並支援多個獨立的專案工作區。

本應用包含一個 React 前端、一個 Node.js 後端，並設定為在 Vercel 上部署。

## ✨ 主要功能

### 甘特圖工作區 (Gantt Workspace)
- **互動式時間軸**：視覺化呈現任務的開始、結束日期與進度。
- **任務管理**：支援新增、編輯、刪除任務，並可設定任務的描述、狀態、進度、分類等。
- **附件與材料**：每個任務可以附加多種類型的補充材料（連結、圖片、文件、備註）。
- **拖曳排序**：可透過拖曳方式輕鬆調整任務的順序。
- **儀表板 (Dashboard)**：提供專案的整體進度、任務狀態分佈、以及各分類任務佔比的統計圖表。
- **學習與成長專區**：獨立的區塊來追蹤與專案相關的學習項目。
- **PDF 匯出**：一鍵將整個專案儀表板與甘特圖匯出為 PDF 檔案，方便報告與分享。

### 管理後台 (Management Dashboard)
- **集中管理**：提供一個獨立的管理介面，統一查看所有建立的甘特圖專案。
- **工作區操作**：支援建立新的工作區、刪除現有工作區。
- **狀態變更**：可將專案標示為「進行中」或「已結案」。
- **即時預覽**：在不離開管理介面的情況下，可即時預覽任何一個甘特圖專案的內容。

## 🛠️ 技術架構 (Tech Stack)

- **前端 (Frontend)**:
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Lucide React](https://lucide.dev/) (for icons)
- **後端 (Backend)**:
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
- **數據儲存 (Data Storage)**:
  - 優先使用 [Vercel KV](https://vercel.com/storage/kv) 或 [Redis](https://redis.io/) 進行雲端持久化儲存。
  - 若未設定雲端資料庫，則會降級使用本地的 `backend/tasks.json` 檔案。
- **部署 (Deployment)**:
  - [Vercel](https://vercel.com/)

## 🔗 線上環境

| 類型 | URL |
| ---- | --- |
| 預設工作區（我的三個月） | `https://dist-taupe-delta.vercel.app/?workspace=default` |
| 管理介面 | `https://dist-taupe-delta.vercel.app/management` |
| 後端 API | `https://backend-janus-projects-f12c2f60.vercel.app` |

> 前端會依據 `VITE_API_BASE_URL` 環境變數切換 API。如果未設定，會 fallback 到上面的後端網址。

## 🚀 如何開始 (Getting Started)

要在你的本地端電腦上執行此專案，請依照以下步驟操作。

### 1. 安裝依賴套件

本專案分為前端和後端，兩者都需要安裝各自的依賴套件。

**前端:**
在專案根目錄 (`/`) 下執行：
```bash
npm install
```

**後端:**
進入 `backend` 目錄下執行：
```bash
cd backend
npm install
```

### 2. 執行後端伺服器

後端 API 伺服器需要在一個獨立的終端機視窗中執行。
```bash
# 位於 backend 目錄下
npm run dev
```
此指令會啟動後端伺服器 (預設在 `http://localhost:3001`)，並在程式碼變動時自動重啟。

### 3. 執行前端開發環境

前端應用程式由 `run-claude-artifact` 工具包提供服務。在專案根目錄 (`/`) 下執行：
```bash
npx run-claude-artifact dev my-app.tsx
```
這會啟動一個本地端開發伺服器，你可以在瀏覽器中開啟對應的網址來查看應用程式。

## 📡 後端 API 端點

後端伺服器提供了以下主要的 API 端點：

- `GET /health`: 檢查 API 服務狀態。
- `GET /tasks?workspaceId=<id>`: 獲取指定工作區的任務和設定。
- `PUT /tasks?workspaceId=<id>`: 更新指定工作區的任務和設定。
- `GET /workspaces`: 獲取所有工作區的列表。
- `POST /workspaces`: 建立一個新的工作區。
- `PATCH /workspaces/:workspaceId`: 更新特定工作區的元數據（如狀態、名稱）。
- `DELETE /workspaces/:workspaceId`: 刪除一個工作區。

## 部署 (Deployment)

這個專案已經設定好在 Vercel 上進行部署。

- **觸發方式**: 當程式碼被推送到與 Vercel 專案關聯的 Git 儲存庫時，將會自動觸發部署。
- **構建設定**: Vercel 會使用 `vercel.json` 中的設定來構建和部署專案。
  - `buildCommand`: `npx run-claude-artifact build my-app.tsx --deploy-dir dist`
  - `outputDirectory`: `dist`
- **後端部署**: `backend` 目錄同樣可以被部署為一個 Vercel Serverless Function。你需要將後端 API 的公開網址設定為前端的環境變數 `VITE_API_BASE_URL`，以便前端應用能夠正確地與之通訊。

### 部署後的網址

本專案的前端和後端是獨立部署在 Vercel 上的。

- **我的三個月工作區（前端主站）**: `https://dist-taupe-delta.vercel.app/?workspace=default`
- **甘特圖管理器**: `https://dist-taupe-delta.vercel.app/management`
- **後端 API**: 根據專案配置 (`my-app.tsx` 中的 `computeDefaultApiBase` 函數)，後端 API 是作為一個**獨立的 Vercel 專案**部署的。其預設的部署網址為 `https://backend-janus-projects-f12c2f60.vercel.app`。

**重要提示**: 前端應用會透過環境變數 `VITE_API_BASE_URL` 來決定後端 API 的位置。
  - 在本地開發時，`VITE_API_BASE_URL` 預設為 `http://localhost:3001`。
  - 在 Vercel 部署時，前端會優先使用 `VITE_API_BASE_URL` 環境變數的值。如果該變數未設定，則會使用 `https://backend-janus-projects-f12c2f60.vercel.app` 作為後端 API 的基礎 URL。請確保在前端專案的 Vercel 設定中，將 `VITE_API_BASE_URL` 設定為你的後端 API 實際部署的 URL。

## 🔍 驗收/測試建議

1. **任務操作**：建立一筆任務、拖曳排序、變更狀態與分類，確認會同步到管理器。
2. **分類自訂**：輸入新分類後按 Enter，確認下拉選單新增項目；點選 `×` 刪除時，任務分類會回到空白。
3. **同步狀態**：關閉後端服務或撤掉環境變數確認離線 fallback；重新啟動後應恢復雲端資料。
4. **管理器 CRUD**：新增／刪除工作區、切換狀態（進行中/已結案），列表立即更新。
5. **時間軸對齊**：變更日期範圍為短期（如 5 天）與長期（跨月）各測一次，確認週/月切分與今日定位準確。
6. **PDF 匯出**：點擊「匯出 PDF」，檢查輸出是否完整；目前仍採用 html2canvas 方案，解析度受限（見下方已知議題）。

## 🧬 擴充與維護 (Development and Maintenance)

這份指南旨在幫助未來的開發者了解如何在此專案的基礎上新增功能或進行維護。

### 專案結構

- **前端**: 主要的程式碼位於根目錄的 `my-app.tsx`。所有 UI 元件和前端邏輯都集中在此檔案。
- **後端**: 位於 `backend/` 目錄。
  - `server.js`: 定義了所有 API 端點 (Routes)。
  - `storage.js`: 處理所有與數據儲存相關的邏輯。

### 新增前端功能

1.  **元件化**: 雖然目前大部分 UI 都在 `my-app.tsx` 中，但建議未來新增複雜功能時，可以建立新的 React 元件檔案，並在 `my-app.tsx` 中引入，以保持程式碼的整潔。
2.  **樣式**: 專案使用類似 [Tailwind CSS](https://tailwindcss.com/) 的功能類別 (Utility Classes) 來處理樣式，直接在 JSX 元素上透過 `className` 添加。
3.  **與後端通訊**: 前端透過 `fetch` 函數與後端 API 進行通訊。API 的基礎 URL 是動態解析的，無需手動設定。

### 新增後端功能

1.  **新增 API 端點**: 在 `backend/server.js` 中，你可以仿照現有的 Express 路由 (例如 `app.get(...)`, `app.post(...)`) 來新增 API 端點。
2.  **修改資料模型**: 如果需要為任務 (task) 或工作區 (workspace) 新增欄位，你需要：
    - 在 `backend/storage.js` 中更新資料的正規化/骨架函式 (e.g., `createWorkspaceSkeleton`)。
    - 確保前端傳送的資料與後端預期的模型一致。

### 維護注意事項

- **依賴套件**: 如果需要新增依賴套件，請記得在對應的目錄 (`/` 或 `backend/`) 下使用 `npm install <package-name>`，並確保 `package.json` 有被更新。
- **數據持久層**: `storage.js` 的設計具有彈性。在本地開發時，它會依賴 `tasks.json`。在 Vercel 上部署時，它會自動切換到 Vercel KV 或 Redis。在進行資料庫相關的變更時，需要考慮到這兩種情況。

## ⚠️ 已知議題與後續建議

- **PDF 匯出解析度**：目前採用 html2canvas 截圖，因此在 A4 尺寸檢視時仍可能有些模糊。若要獲得真正的向量 PDF，可考慮改用 Playwright/Chromium 伺服器端匯出，或改寫為 PDF 模板產生。
- **自動化測試**：目前仍以手動測試為主，建議未來補上關鍵邏輯（時間軸計算、分類管理、後端儲存）的整合測試。
- **大範圍時間軸效能**：跨年度的時間軸在低階裝置上捲動時會有細微掉幀，後續可以考慮虛擬化或拆段渲染。

---

如需更多歷程或需求脈絡，請參考仓庫中的 `.specstory/` 歷史紀錄檔案。
