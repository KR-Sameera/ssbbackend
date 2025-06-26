import axios from 'axios';
import CurrentAffair from '../models/caModels.js';

const CATEGORY_KEYWORDS = {
  national: ['parliament', 'election', 'government', 'policy', 'pm modi', 'state government'],
  international: ['UN', 'global', 'foreign', 'bilateral', 'US', 'china', 'pakistan', 'diplomatic'],
  economics: ['RBI', 'GDP', 'inflation', 'budget', 'finance', 'economy', 'tax', 'stock market'],
  geopolitics: ['conflict', 'sanction', 'treaty', 'border', 'geopolitical', 'diplomacy'],
  sports: ['cricket', 'olympics', 'football', 'sports', 'athlete'],
  external_affairs: ['MEA', 'foreign ministry', 'external affairs'],
  defence: ['DRDO', 'army', 'navy', 'air force', 'missile', 'defence', 'military', 'operation'],
  space_research: ['ISRO', 'NASA', 'satellite', 'space mission', 'launch'],
};

const BLACKLIST_KEYWORDS = ['celebrity', 'movie', 'entertainment', 'bollywood', 'gossip', 'tv', 'film'];

function isBlacklisted(text) {
  return BLACKLIST_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
}

function categorizeArticle(article) {
  const text = (article.title + ' ' + (article.description || '')).toLowerCase();

  if (isBlacklisted(text)) return null;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      const pattern = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
      if (pattern.test(text)) {
        matchCount++;
      }
    }
    if (matchCount >= 2) return category;
  }

  return 'general'; // assign as general if no strong match
}

export const fetchAndStoreTodayNews = async (req, res) => {
  console.log('✅ /fetch route hit');
  try {
    const today = new Date().toISOString().split('T')[0];
    const apiKey = process.env.GNEWS_API_KEY;

    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        token: apiKey,
        lang: 'en',
        country: 'in',
        max: 50,
      },
    });

    const newArticles = response.data.articles
      .map(article => {
        const category = categorizeArticle(article);
        if (!category) return null;
        return {
          title: article.title,
          content: article.description || article.content,
          category,
          image: article.image,
          url: article.url,
        };
      })
      .filter(Boolean);

    if (newArticles.length === 0) {
      return res.status(404).json({ error: 'No relevant articles found' });
    }

    let existingEntry = await CurrentAffair.findOne({ date: today });

    if (existingEntry) {
      const existingUrls = new Set(existingEntry.articles.map(a => a.url));
      const uniqueNewArticles = newArticles.filter(a => !existingUrls.has(a.url));

      if (uniqueNewArticles.length === 0) {
        return res.status(200).json({ message: 'No new unique articles to add.' });
      }

      existingEntry.articles.push(...uniqueNewArticles);
      await existingEntry.save();

      return res.status(200).json({
        message: 'New articles appended.',
        added: uniqueNewArticles.length,
        total: existingEntry.articles.length,
      });
    } else {
      await CurrentAffair.create({
        date: today,
        articles: newArticles,
      });

      return res.status(200).json({
        message: 'Articles stored for today.',
        added: newArticles.length,
      });
    }
  } catch (error) {
    console.error('❌ Error fetching/storing news:', error.message);
    return res.status(500).json({ error: 'Failed to fetch and store news' });
  }
};

export const getAllAffairs = async (req, res) => {
  try {
    const affairs = await CurrentAffair.find().sort({ date: -1 });
    res.json(affairs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAffairByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const affair = await CurrentAffair.findOne({ date });
    if (!affair) return res.status(404).json({ error: 'No data found for this date' });
    res.json(affair);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
