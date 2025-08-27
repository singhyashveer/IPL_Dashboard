import { NextApiRequest, NextApiResponse } from 'next';
import { scrapeIPLData } from '../../utils/scraping';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await scrapeIPLData();
    
    // Set caching headers (1 minute cache, 1 minute stale while revalidating)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=60');
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}