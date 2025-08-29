import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle insurance logic
    res.status(200).json({ message: 'Insurance created successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}