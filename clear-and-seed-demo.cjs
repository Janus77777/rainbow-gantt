// 清空並填充純 Demo 數據
const https = require('https');

const DEMO_API_URL = 'https://rainbow-gantt-demo.vercel.app/api';

// Demo 假數據
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
