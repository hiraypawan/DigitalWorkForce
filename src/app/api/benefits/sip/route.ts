import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle SIP logic
    res.status(200).json({ message: 'SIP created successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}