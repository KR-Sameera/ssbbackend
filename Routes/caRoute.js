import express from 'express';
import { fetchAndStoreTodayNews, getAllAffairs, getAffairByDate } from '../Controllers/caControllers.js';

const router = express.Router();

router.get('/fetch', fetchAndStoreTodayNews);
router.get('/', getAllAffairs);
router.get('/:date', getAffairByDate);

export default router;
