// 清空並填充純 Demo 數據
const https = require('https');

const DEMO_API_URL = 'https://rainbow-gantt-demo.vercel.app/api';

// Demo Tasks（POC 使用 isPoc: true，不使用 type）
const demoTasks = [
  // === ACTIVE PROJECTS (4個) - isPoc: false ===
  {
    id: 'demo-task-1',
    name: '客戶需求分析系統',
    owner: 'Janus',
    category: 'AI驅能',
    priority: 'urgent',
    status: 'in_progress',
    progress: 75,
    startDate: '2025-12-01',
    endDate: '2025-12-20',
    isPoc: false
  },
  {
    id: 'demo-task-2',
    name: '產品原型設計',
    owner: 'Joseph',
    category: '品牌行銷',
    priority: 'medium',
    status: 'in_progress',
    progress: 45,
    startDate: '2025-12-05',
    endDate: '2025-12-25',
    isPoc: false
  },
  {
    id: 'demo-task-7',
    name: '數據可視化儀表板',
    owner: 'Janus',
    category: 'AI驅能',
    priority: 'high',
    status: 'in_progress',
    progress: 60,
    startDate: '2025-12-10',
    endDate: '2025-12-28',
    isPoc: false
  },
  {
    id: 'demo-task-8',
    name: '移動端適配',
    owner: 'Joseph',
    category: '品牌行銷',
    priority: 'low',
    status: 'pending',
    progress: 0,
    startDate: '2025-12-20',
    endDate: '2026-01-10',
    isPoc: false
  },

  // === COMPLETED LOG (5個) - status: completed, isPoc: false ===
  {
    id: 'demo-task-c1',
    name: '平台官網上線',
    owner: 'Janus',
    category: 'AI驅能',
    priority: 'urgent',
    status: 'completed',
    progress: 100,
    startDate: '2025-11-01',
    endDate: '2025-11-20',
    isPoc: false
  },
  {
    id: 'demo-task-c2',
    name: 'SEO 優化實施',
    owner: 'Joseph',
    category: '品牌行銷',
    priority: 'high',
    status: 'completed',
    progress: 100,
    startDate: '2025-11-05',
    endDate: '2025-11-18',
    isPoc: false
  },
  {
    id: 'demo-task-c3',
    name: '支付系統整合',
    owner: 'Janus',
    category: '客戶開發',
    priority: 'urgent',
    status: 'completed',
    progress: 100,
    startDate: '2025-10-15',
    endDate: '2025-11-08',
    isPoc: false
  },
  {
    id: 'demo-task-c4',
    name: '用戶反饋收集系統',
    owner: 'Joseph',
    category: 'AI驅能',
    priority: 'medium',
    status: 'completed',
    progress: 100,
    startDate: '2025-10-20',
    endDate: '2025-11-15',
    isPoc: false
  },
  {
    id: 'demo-task-c5',
    name: 'Email 通知功能',
    owner: 'Janus',
    category: '客戶開發',
    priority: 'medium',
    status: 'completed',
    progress: 100,
    startDate: '2025-11-08',
    endDate: '2025-11-22',
    isPoc: false
  },

  // === POC PROTOCOLS (5個) - isPoc: true ===
  {
    id: 'demo-task-p1',
    name: 'AI 圖片生成引擎測試',
    owner: 'Janus',
    category: 'AI驅能',
    priority: 'urgent',
    status: 'in_progress',
    progress: 65,
    startDate: '2025-12-08',
    endDate: '2025-12-25',
    description: '評估 DALL-E 3 和 Midjourney API 的整合可行性，測試生成速度、品質和成本效益。',
    isPoc: true,
    stakeholders: [
      { id: '1', name: '產品經理 Alex', role: '產品團隊' },
      { id: '2', name: '技術主管 Bob', role: '技術團隊' }
    ]
  },
  {
    id: 'demo-task-p2',
    name: 'WebSocket 即時通訊驗證',
    owner: 'Joseph',
    category: 'POC測試',
    priority: 'high',
    status: 'pending',
    progress: 0,
    startDate: '2025-12-15',
    endDate: '2025-12-30',
    description: '驗證 WebSocket 在高併發場景下的穩定性，對比 Socket.io 和原生 WebSocket 方案。',
    isPoc: true,
    stakeholders: [
      { id: '3', name: '後端工程師 Carol', role: '後端團隊' },
      { id: '4', name: 'DevOps David', role: 'DevOps' }
    ]
  },
  {
    id: 'demo-task-p3',
    name: 'Redis 緩存策略評估',
    owner: 'Janus',
    category: 'POC測試',
    priority: 'medium',
    status: 'in_progress',
    progress: 40,
    startDate: '2025-12-10',
    endDate: '2025-12-28',
    description: '測試 LRU、LFU、FIFO 三種緩存淘汰策略的性能表現，找出最適合的方案。',
    isPoc: true,
    stakeholders: [
      { id: '5', name: '架構師 Eric', role: '技術團隊' },
      { id: '6', name: 'DBA Frank', role: 'DevOps' }
    ]
  },
  {
    id: 'demo-task-p4',
    name: 'GraphQL vs REST 性能對比',
    owner: 'Joseph',
    category: 'POC測試',
    priority: 'low',
    status: 'pending',
    progress: 0,
    startDate: '2025-12-18',
    endDate: '2026-01-05',
    description: '針對複雜查詢場景，對比 GraphQL 和 REST API 的響應時間、開發效率和維護成本。',
    isPoc: true,
    stakeholders: [
      { id: '7', name: '前端工程師 Grace', role: '前端團隊' },
      { id: '8', name: '後端工程師 Henry', role: '後端團隊' }
    ]
  },
  {
    id: 'demo-task-p5',
    name: '區塊鏈數據存儲可行性',
    owner: 'Janus',
    category: 'POC測試',
    priority: 'low',
    status: 'pending',
    progress: 0,
    startDate: '2025-12-20',
    endDate: '2026-01-10',
    description: '探索使用 IPFS 和 Filecoin 進行去中心化數據存儲的可行性，評估成本和技術風險。',
    isPoc: true,
    stakeholders: [
      { id: '9', name: '研發總監 Iris', role: '研發團隊' },
      { id: '10', name: '安全專家 Jack', role: '資安團隊' }
    ]
  }
];

// Demo Notes（Learning 頁面使用）
const demoNotes = [
  {
    id: 'demo-note-1',
    title: 'React 18 新特性深度解析',
    content: `# React 18 核心更新

## 1. Concurrent Rendering（並發渲染）
- 允許 React 中斷渲染過程以處理更高優先級的更新
- useTransition 和 useDeferredValue 兩個新 Hook

## 2. Automatic Batching
- 所有更新默認批處理，包括 Promise、setTimeout 等
- 大幅提升性能

## 3. Suspense 改進
- 支持 SSR 場景
- 更好的 Loading 狀態管理

## 實踐心得
- 在大型列表場景下，useTransition 可以顯著提升用戶體驗
- 需要注意 Concurrent Mode 下的狀態管理
`,
    relatedTaskIds: [],
    materials: [
      {
        id: '1',
        type: 'link',
        name: 'React 18 官方文檔',
        url: 'https://react.dev/blog/2022/03/29/react-v18',
        note: '官方發布文章'
      }
    ],
    createdAt: new Date('2025-10-15').toISOString(),
    updatedAt: new Date('2025-10-15').toISOString()
  },
  {
    id: 'demo-note-2',
    title: 'TypeScript 5.0 新特性筆記',
    content: `# TypeScript 5.0 重點更新

## Decorators 穩定版
- 終於不再是實驗性功能
- 遵循 ECMAScript 標準提案

## const 型別參數
\`\`\`typescript
function foo<const T>(arr: T[]) {
  // T 會被推斷為 readonly
}
\`\`\`

## 性能優化
- 編譯速度提升 20-30%
- 記憶體使用降低

## 實戰建議
- 在 ORM 和依賴注入場景積極使用 Decorators
- const 型別參數適合工具函數庫
`,
    relatedTaskIds: [],
    materials: [],
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString()
  },
  {
    id: 'demo-note-3',
    title: 'Tailwind CSS 最佳實踐整理',
    content: `# Tailwind CSS 項目經驗總結

## 1. 組件化策略
- 使用 @apply 提取重複樣式到 base layer
- 避免過度抽象，保持 utility-first 理念

## 2. 性能優化
- PurgeCSS 配置要涵蓋所有動態類名
- 使用 JIT mode 加速開發

## 3. 響應式設計
- Mobile-first 策略
- 善用 container queries（Tailwind 3.4+）

## 4. 暗黑模式
\`\`\`html
<div class="bg-white dark:bg-gray-900">
  <!-- content -->
</div>
\`\`\`

## 踩坑記錄
- 動態類名不會被 JIT 編譯，需要使用完整類名
- 與 CSS Modules 混用時要小心權重問題
`,
    relatedTaskIds: [],
    materials: [
      {
        id: '2',
        type: 'link',
        name: 'Tailwind CSS 官方文檔',
        url: 'https://tailwindcss.com/docs',
        note: '官方文檔'
      }
    ],
    createdAt: new Date('2025-11-20').toISOString(),
    updatedAt: new Date('2025-12-05').toISOString()
  },
  {
    id: 'demo-note-4',
    title: 'Framer Motion 動畫設計心得',
    content: `# Framer Motion 實戰技巧

## 基礎動畫
\`\`\`tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
/>
\`\`\`

## Layout Animations
- layoutId 實現共享元素動畫
- layout prop 自動處理佈局變化

## 性能優化
- 使用 will-change CSS 屬性
- 避免動畫 width/height，改用 scale
- 使用 useReducedMotion 尊重用戶偏好設置

## 進階技巧
- AnimatePresence 處理組件退出動畫
- useAnimation hook 程式化控制動畫
- useDragControls 自定義拖放行為
`,
    relatedTaskIds: [],
    materials: [],
    createdAt: new Date('2025-11-25').toISOString(),
    updatedAt: new Date('2025-12-10').toISOString()
  }
];

// HTTP PUT helper
function putData(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: responseData });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function seedData() {
  console.log('🌱 清空並填充 Demo 數據...\n');

  // 1. 覆蓋 Tasks 數據
  console.log('📋 覆蓋 Tasks 數據...');
  try {
    await putData(`${DEMO_API_URL}/tasks`, demoTasks);
    console.log(`  ✓ 已寫入 ${demoTasks.length} 個 Demo Tasks`);

    const pocCount = demoTasks.filter(t => t.isPoc).length;
    const activeCount = demoTasks.filter(t => !t.isPoc && t.status !== 'completed').length;
    const completedCount = demoTasks.filter(t => !t.isPoc && t.status === 'completed').length;

    console.log(`    - Active Projects: ${activeCount} 個`);
    console.log(`    - Completed Log: ${completedCount} 個`);
    console.log(`    - POC Protocols: ${pocCount} 個`);
  } catch (error) {
    console.error(`  ✗ 失敗: ${error.message}`);
    process.exit(1);
  }

  // 2. 覆蓋 Notes 數據（Learning 頁面）
  console.log('\n📝 覆蓋 Notes 數據（Learning 頁面）...');
  try {
    await putData(`${DEMO_API_URL}/notes`, demoNotes);
    console.log(`  ✓ 已寫入 ${demoNotes.length} 個 Demo Notes`);

    demoNotes.forEach((note, i) => {
      console.log(`    ${i + 1}. ${note.title}`);
    });
  } catch (error) {
    console.error(`  ✗ 失敗: ${error.message}`);
    process.exit(1);
  }

  console.log('\n✅ Demo 數據填充完成！');
  console.log('\n🌐 訪問地址:');
  console.log('  https://rainbow-gantt-demo.vercel.app');
  console.log('\n📝 注意: Calendar 數據存在 localStorage，首次訪問時為空');
}

// 執行
seedData().catch(err => {
  console.error('❌ 錯誤:', err);
  process.exit(1);
});
