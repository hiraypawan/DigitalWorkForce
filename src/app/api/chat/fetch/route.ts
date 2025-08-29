import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle message fetching logic
    res.status(200).json({ messages: [] });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}