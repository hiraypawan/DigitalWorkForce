# Google Gemini AI Setup

## Quick Setup Instructions

1. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API key"
   - Copy the generated key

2. **Add the API key to your environment:**
   - Open `.env.local` in your project root
   - Find the line `GEMINI_API_KEY=`
   - Add your key: `GEMINI_API_KEY=your_api_key_here`

3. **For Production (Vercel):**
   - Go to your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key value
   - Redeploy your application

## Testing the Chatbot

After setting up the API key:
1. Start your development server: `npm run dev`
2. Go to your profile setup page
3. Try chatting with the AI assistant
4. The bot should now respond properly and extract profile information

## Troubleshooting

- If you see "AI assistant is currently not configured", the API key is missing
- If you get API errors, check your Gemini API quota/billing in Google Cloud Console
- Make sure to redeploy after adding environment variables in production
