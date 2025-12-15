// 為 rainbow-gantt-demo 創建假數據
const https = require('https');

const DEMO_API_URL = 'https://rainbow-gantt-demo.vercel.app/api';

// 假數據
const demoTasks = [
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
    id: 'demo-task-3',
    name: 'API 整合測試',
    owner: 'Janus',
    category: 'POC測試',
    priority: 'urgent',
    status: 'pending',
    progress: 0,
    startDate: '2025-12-15',
    endDate: '2025-12-30',
    type: 'poc'
  },
  {
    id: 'demo-task-4',
    name: '用戶體驗優化',
    owner: 'Joseph',
    category: '客戶開發',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    startDate: '2025-12-18',
    endDate: '2026-01-05',
    type: 'active'
  },
  {
    id: 'demo-task-5',
    name: 'React 最佳實踐研究',
    owner: 'Janus',
    category: 'AI驅能',
    priority: 'low',
    status: 'completed',
    progress: 100,
    startDate: '2025-11-01',
    endDate: '2025-11-15',
    type: 'learning'
  },
  {
    id: 'demo-task-6',
    name: 'Vercel 部署流程優化',
    owner: 'Joseph',
    category: 'POC測試',
    priority: 'medium',
    status: 'completed',
    progress: 100,
    startDate: '2025-11-10',
    endDate: '2025-11-25',
    type: 'completed'
  }
];

const demoCalendarEntries = {
  'ja': {
    '2025-12-09': {
      content: '1. 完成客戶需求訪談\n2. 整理需求文檔\n3. 規劃 API 架構\n4. 研究 Redis 緩存策略',
      images: []
    },
    '2025-12-15': {
      content: '開始 API 整合測試，預計需要 2 週時間完成核心功能驗證',
      images: []
    },
    '2025-12-20': {
      content: '客戶需求分析系統交付日，準備 Demo 演示',
      images: []
    }
  },
  'jo': {
    '2025-12-05': {
      content: '啟動產品原型設計，focus on UI/UX',
      images: []
    },
    '2025-12-12': {
      content: '與設計團隊 sync，討論 Retro-futurism 風格實現',
      images: []
    },
    '2025-12-18': {
      content: '開始用戶體驗優化項目，收集用戶反饋',
      images: []
    }
  }
};

// HTTP POST helper
function postData(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
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
  console.log('🌱 開始填充 Demo 數據...\n');

  // 1. 上傳 Tasks
  console.log('📋 上傳 Tasks...');
  for (const task of demoTasks) {
    try {
      await postData(`${DEMO_API_URL}/tasks`, task);
      console.log(`  ✓ ${task.name} (${task.owner})`);
    } catch (error) {
      console.error(`  ✗ 失敗: ${task.name} - ${error.message}`);
    }
  }

  // 2. 上傳 Calendar Entries
  console.log('\n📅 上傳 Calendar Entries...');

  // Janus 的日曆
  for (const [date, entry] of Object.entries(demoCalendarEntries.ja)) {
    try {
      await putData(`${DEMO_API_URL}/calendar/ja/${date}`, entry);
      console.log(`  ✓ Janus - ${date}`);
    } catch (error) {
      console.error(`  ✗ 失敗: Janus ${date} - ${error.message}`);
    }
  }

  // Joseph 的日曆
  for (const [date, entry] of Object.entries(demoCalendarEntries.jo)) {
    try {
      await putData(`${DEMO_API_URL}/calendar/jo/${date}`, entry);
      console.log(`  ✓ Joseph - ${date}`);
    } catch (error) {
      console.error(`  ✗ 失敗: Joseph ${date} - ${error.message}`);
    }
  }

  console.log('\n✅ Demo 數據填充完成！');
  console.log('\n🌐 訪問地址:');
  console.log('  https://rainbow-gantt-demo.vercel.app');
}

// 執行
seedData().catch(err => {
  console.error('❌ 錯誤:', err);
  process.exit(1);
});
