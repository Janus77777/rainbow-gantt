# 開發交接報告 (Handover Report)

## 專案狀態概述
本報告記錄從 2025-12-05 至今針對「甘特圖專案管理」系統進行的重構與 V2 開發過程。目前專案處於 V2 Beta 開發階段，但部署與預覽環境存在問題。

## 1. 初始狀態
- **原專案結構**：單一 `my-app.tsx` (約 3500 行) 的 React 應用。
- **技術棧**：React, Tailwind CSS (Inline), Express (Backend)。
- **目標**：保留原有業務邏輯，大幅重構 UI/UX，採用現代化架構 (Vite + 標準 Tailwind CSS)。

## 2. 執行操作記錄

### 階段一：架構重構 (Refactoring)
1.  **拆分單體檔案**：
    - 將 `my-app.tsx` 備份為 `my-app.tsx.bak`。
    - 建立 `src/` 目錄，將代碼拆解為元件 (`src/components/`)、Hooks (`src/hooks/`) 與工具函式 (`src/utils.ts`)。
    - 引入 `vite`, `typescript`, `tailwind-merge`, `clsx`, `lucide-react` 等現代化依賴。
2.  **建立 V2 分支結構**：
    - 為了不影響舊版 V1，建立了 `src-v2/` 目錄作為 V2 開發基地。
    - 建立了 V2 專屬入口 `index-v2.html` 與設定檔 `vite.config.v2.ts`。

### 階段二：UI/UX 設計與實作 (V2 Development)
1.  **風格定案**：
    - 採用 **「夢幻糖果 (Dreamy Candy)」** 風格（淺色模式、粉嫩 Mesh Gradient 背景、果凍質感元件）。
2.  **核心元件開發** (`src-v2/components/`)：
    - **導航**：`NavigationIsland.tsx` (底部懸浮導航)。
    - **甘特圖**：`GanttChart.tsx` (重寫，支援點擊、Jelly 質感任務條、Today 線)。
    - **日曆**：`CalendarView.tsx` (修正了 Grid 拉伸問題，改為自適應高度)。
    - **儀表板**：`AppV2.tsx` 中的 HUD 區域 (實作了大圓環圖表與關鍵數據卡片)。
    - **詳情面板**：`ContextPanel.tsx` (右側滑出面板，包含 Stakeholders 與媒體預覽)。
3.  **樣式設定**：
    - 在 `src-v2/index.css` 中定義了 `candy-bg` 動畫與 `custom-scrollbar`。
    - 修改 `tailwind.config.js` 加入 `src-v2` 路徑與 `safelist` (防止動態 class 被 purge)。

### 階段三：專案結構調整 (Migration)
1.  **獨立子專案**：
    - 為了這解決路徑與設定衝突，建立了 `rainbow-gantt-v2/` 子目錄。
    - 將 `src-v2/` 所有內容搬遷至 `rainbow-gantt-v2/src/`。
    - 在子目錄內初始化了獨立的 `package.json`, `vite.config.ts`, `tsconfig.json`。
    - **注意**：目前 V2 的完整源碼位於 `rainbow-gantt-v2/` 目錄下。

### 階段四：部署嘗試 (Deployment Attempts)
1.  **Vercel 部署**：
    - 嘗試使用 `vercel-v2.json` 指定設定部署，但遭遇路徑衝突。
    - 嘗試將根目錄 `vercel.json` 暫時改名以避開衝突。
    - 最後一次嘗試：進入 `rainbow-gantt-v2` 子目錄，手動編譯 (`npm run build`) 後，將生成的 `dist` 目錄作為純靜態網站部署。
    - **最後部署網址**：`https://rainbow-gantt-v2.vercel.app` (但用戶反饋內容未更新或顯示異常)。
    - **靜態部署網址**：`https://dist-czt5c5mt1-janus-projects-f12c2f60.vercel.app` (嘗試繞過 Vercel Build 的純靜態版本)。

## 3. 目前遺留問題 (Outstanding Issues)
1.  **多模態識別失效**：AI 無法正確解析用戶上傳的截圖，導致對畫面錯誤（如破版、樣式丟失）的判斷失準。
2.  **部署內容不一致**：雖然執行了部署，但用戶端看到的畫面與預期不符（顯示為舊版或樣式失效），懷疑是 Vercel 快取、路徑解析或 Build Process 未正確抓到最新檔案所致。
3.  **功能對接**：
    - `useTasks` Hook 已建立但尚未在 `AppV2` 中全面啟用（目前仍混用 Mock Data 用於 UI 展示）。
    - `ContextPanel` 表單尚未實作真實寫入邏輯 (`saveTasks`)。

## 4. 檔案位置指引 (File Map)
- **V2 源碼 (最新)**: `/Users/jill/Documents/coding_projects/專案/甘特圖專案管理/rainbow-gantt-v2/`
- **V1 源碼 (舊版備份)**: `/Users/jill/Documents/coding_projects/專案/甘特圖專案管理/my-app.tsx`
- **後端 API**: `/Users/jill/Documents/coding_projects/專案/甘特圖專案管理/backend/`

---
*報告生成時間: 2025-12-08*
