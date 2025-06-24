// cron/fetchNewsCron.js
import cron from 'node-cron';
import axios from 'axios';
import News from '../models/newsModels.js';

cron.schedule('55 23 * * *', async () => {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'general',
        country: 'in',
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const newsItems = response.data.articles.slice(0, 10); // Choose top 10

    await Promise.all(newsItems.map(async item => {
      await News.create({
        title: item.title,
        description: item.description,
        content: item.content,
        url: item.url,
        imageUrl: item.urlToImage,
        publishedAt: item.publishedAt,
        category: 'daily-current-affairs',
      });
    }));

    console.log("News updated successfully");
  } catch (error) {
    console.error("Error fetching news:", error.message);
  }
});
