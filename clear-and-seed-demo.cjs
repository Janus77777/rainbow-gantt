// 清空並填充純 Demo 數據
const https = require('https');

const DEMO_API_URL = 'https://rainbow-gantt-demo.vercel.app/api';

// Demo 假數據
const demoTasks = [
  // === ACTIVE PROJECTS (4個) ===
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
    type: 'active'
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
    type: 'active'
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
    type: 'active'
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
    type: 'active'
  },

  // === COMPLETED LOG (5個) ===
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
    type: 'completed'
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
    type: 'completed'
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
    type: 'completed'
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
    type: 'completed'
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
    type: 'completed'
  },

  // === POC PROTOCOLS (5個) ===
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
    type: 'poc'
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
    type: 'poc'
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
    type: 'poc'
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
    type: 'poc'
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
    type: 'poc'
  },

  // === KNOWLEDGE BASE (6個) ===
  {
    id: 'demo-task-l1',
    name: 'React 18 新特性學習',
    owner: 'Janus',
    category: 'AI驅能',
    priority: 'medium',
    status: 'completed',
    progress: 100,
    startDate: '2025-10-01',
    endDate: '2025-10-15',
    type: 'learning'
  },
  {
    id: 'demo-task-l2',
    name: 'TypeScript 進階技巧',
    owner: 'Joseph',
    category: 'AI驅能',
    priority: 'high',
    status: 'completed',
    progress: 100,
    startDate: '2025-10-08',
    endDate: '2025-10-22',
    type: 'learning'
  },
  {
    id: 'demo-task-l3',
    name: 'Tailwind CSS 最佳實踐',
    owner: 'Janus',
    category: '品牌行銷',
    priority: 'medium',
    status: 'in_progress',
    progress: 70,
    startDate: '2025-11-15',
    endDate: '2025-12-05',
    type: 'learning'
  },
  {
    id: 'demo-task-l4',
    name: 'Framer Motion 動畫設計',
    owner: 'Joseph',
    category: '品牌行銷',
    priority: 'low',
    status: 'in_progress',
    progress: 50,
    startDate: '2025-11-20',
    endDate: '2025-12-10',
    type: 'learning'
  },
  {
    id: 'demo-task-l5',
    name: 'Node.js 性能優化',
    owner: 'Janus',
    category: 'AI驅能',
    priority: 'high',
    status: 'pending',
    progress: 0,
    startDate: '2025-12-15',
    endDate: '2025-12-30',
    type: 'learning'
  },
  {
    id: 'demo-task-l6',
    name: 'Vercel Serverless 深入研究',
    owner: 'Joseph',
    category: 'POC測試',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    startDate: '2025-12-18',
    endDate: '2026-01-05',
    type: 'learning'
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

  // 直接 PUT 覆蓋所有 tasks
  console.log('📋 覆蓋 Tasks 數據...');
  try {
    await putData(`${DEMO_API_URL}/tasks`, demoTasks);
    console.log(`  ✓ 已寫入 ${demoTasks.length} 個 Demo Tasks`);

    // 列出所有 tasks
    demoTasks.forEach((task, i) => {
      console.log(`    ${i + 1}. ${task.name} (${task.owner}) - ${task.status}`);
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
