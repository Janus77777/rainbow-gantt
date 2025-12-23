import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const CHANGELOG_KEY = 'gantt-v2:changelog';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'improvement' | 'breaking';
  title: string;
  description?: string;
  items?: string[];
  author?: string;
}

let redisClient: any = null;

async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }
  return redisClient;
}

// 預設 Changelog 數據
const defaultChangelog: ChangelogEntry[] = [
  {
    id: '1',
    version: '2.1.0',
    date: '2025-12-23',
    type: 'feature',
    title: '人員管理雲端持久化',
    items: [
      '新增 People API 使用 Redis 儲存人員列表',
      '新增 usePeople Hook 實現雲端同步',
      '設定面板人員管理現在支援跨裝置同步',
      '移除未使用的 Upstash 依賴',
    ],
    author: 'Claude Sonnet 4.5',
  },
  {
    id: '2',
    version: '2.0.0',
    date: '2025-12-21',
    type: 'feature',
    title: '合作類型標識功能',
    items: [
      '新增任務合作類型欄位（solo/team）',
      '任務編輯面板新增合作類型選擇器（🙋 獨立 / 👥 合作）',
      '甘特圖左側列表顯示合作類型圖標',
    ],
    author: 'Claude Sonnet 4.5',
  },
  {
    id: '3',
    version: '1.9.0',
    date: '2025-12-19',
    type: 'fix',
    title: 'Calendar View 雲端儲存修復',
    items: [
      '修復 Calendar View 雲端儲存功能',
      '整合 Redis Cloud，支援跨裝置同步',
      'Calendar API 使用與甘特圖任務相同的 Redis Cloud',
    ],
    author: 'Claude Sonnet 4.5',
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const db = await getRedis();

    switch (req.method) {
      case 'GET': {
        // 獲取 Changelog
        const data = await db.get(CHANGELOG_KEY);
        let changelog: ChangelogEntry[] = data ? JSON.parse(data) : null;

        // 如果雲端沒有數據，使用預設並保存
        if (!changelog) {
          changelog = defaultChangelog;
          await db.set(CHANGELOG_KEY, JSON.stringify(changelog));
        }

        return res.status(200).json({ changelog });
      }

      case 'PUT': {
        // 完整替換 Changelog
        const { changelog } = req.body;
        if (!Array.isArray(changelog)) {
          return res.status(400).json({ error: 'Changelog must be an array' });
        }

        await db.set(CHANGELOG_KEY, JSON.stringify(changelog));
        return res.status(200).json({ changelog });
      }

      case 'POST': {
        // 新增單一更新記錄
        const entry: ChangelogEntry = req.body;
        if (!entry.version || !entry.type || !entry.title) {
          return res.status(400).json({ error: 'Version, type, and title are required' });
        }

        const data = await db.get(CHANGELOG_KEY);
        const changelog: ChangelogEntry[] = data ? JSON.parse(data) : [];

        // 生成新 ID
        entry.id = Date.now().toString();
        entry.date = entry.date || new Date().toISOString().split('T')[0];

        // 添加到開頭（最新的在最上面）
        changelog.unshift(entry);

        await db.set(CHANGELOG_KEY, JSON.stringify(changelog));
        return res.status(200).json({ changelog });
      }

      case 'DELETE': {
        // 刪除單一更新記錄
        const { id } = req.query;
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'ID parameter is required' });
        }

        const data = await db.get(CHANGELOG_KEY);
        const changelog: ChangelogEntry[] = data ? JSON.parse(data) : [];
        const filtered = changelog.filter(entry => entry.id !== id);

        if (filtered.length === changelog.length) {
          return res.status(404).json({ error: 'Changelog entry not found' });
        }

        await db.set(CHANGELOG_KEY, JSON.stringify(filtered));
        return res.status(200).json({ changelog: filtered });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Changelog API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: String(error),
    });
  }
}
