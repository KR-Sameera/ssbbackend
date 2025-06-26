import cron from 'node-cron';
import axios from 'axios';
import CurrentAffair from '../models/caModels.js';

export const startDailyNewsJob = () => {
  // Daily at 7:00 AM IST (1:30 AM UTC)
  cron.schedule('30 1 * * *', async () => {
    const today = new Date().toISOString().split('T')[0];
    console.log(`🗓️ [${today}] Starting scheduled news fetch...`);

    try {
      const { data } = await axios.get('https://gnews.io/api/v4/top-headlines', {
        params: {
          token: process.env.GNEWS_API_KEY,
          lang: 'en',
          country: 'in',
          max: 10,
        },
      });

      const articles = data.articles.map((article) => ({
        title: article.title,
        content: article.description || article.content,
        category: article.source.name || 'General',
        image: article.image,
        url: article.url,
      }));

      await CurrentAffair.findOneAndUpdate(
        { date: today },
        { date: today, articles },
        { upsert: true, new: true }
      );

      console.log('✅ Daily news stored successfully in MongoDB.');
    } catch (err) {
      console.error('❌ Cron fetch failed:', err.message);
    }
  });

  console.log('🕒 Daily news cron job scheduled (7:00 AM IST).');
};
