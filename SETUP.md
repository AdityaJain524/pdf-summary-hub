# PDF Summarizer Setup Guide

## Prerequisites
1. **Lovable Cloud** (automatically enabled) for backend
2. **n8n Webhook** for PDF processing
3. **Email Service** (optional) for sending summaries

## Quick Start

The application is now ready to use with built-in authentication! Simply:
1. Click "Sign Up" to create an account
2. Sign in with your email and password
3. Start uploading and summarizing PDFs

## Features Included

✅ **Email/Password Authentication** (Lovable Cloud built-in)
✅ **PDF Upload & Summarization** (with n8n webhook)
✅ **AI Chatbot** (powered by Lovable AI - Google Gemini)
✅ **Multi-language Support** (23 Indian regional languages)
✅ **Text-to-Speech** for summaries and chatbot responses
✅ **User Dashboard** with history
✅ **Feedback Form** with star ratings
✅ **Dark/Light Mode** toggle
✅ **Fully Responsive** design

## n8n Webhook Setup

### 1. Create n8n Workflow

Create a workflow with these nodes:

**a. Webhook Trigger**
- Receives PDF data, wordCount, language, userEmail

**b. PDF Processing**
- Use a code node or PDF parser to extract text
- Example code node:
  ```javascript
  // Extract PDF text from base64
  const pdfBase64 = $json.pdfFile.replace(/^data:application\/pdf;base64,/, '');
  const pdfBuffer = Buffer.from(pdfBase64, 'base64');
  
  // Use a PDF library to extract text
  // Return: { pdfContent: "full text", summary: "generated summary" }
  ```

**c. AI Summarization**
- Use OpenAI, Anthropic, or Google AI node
- Generate summary based on wordCount and language
- System prompt: "Summarize the following PDF content in {wordCount} words in {language} language"

**d. Response**
- Return JSON:
  ```json
  {
    "summary": "Generated summary text...",
    "pdfContent": "Full extracted PDF text for chatbot..."
  }
  ```

### 2. Update Webhook URL

In `src/components/PDFUploader.tsx`, replace:
```typescript
const webhookUrl = "YOUR_N8N_WEBHOOK_URL";
```

With your actual n8n webhook URL.

## Feedback Form n8n Setup

### 1. Create Feedback Workflow

Simple webhook that receives:
```json
{
  "name": "User Name",
  "email": "user@email.com",
  "rating": 5,
  "comments": "Great app!",
  "timestamp": "2025-01-07T..."
}
```

### 2. Update Feedback Webhook

In `src/components/FeedbackForm.tsx`, replace:
```typescript
const webhookUrl = "YOUR_N8N_WEBHOOK_URL";
```

## AI Chatbot

The chatbot is powered by **Lovable AI** (Google Gemini 2.5 Flash):
- ✅ No API keys needed - automatically configured
- ✅ Answers questions about uploaded PDFs
- ✅ Streaming responses with typing animation
- ✅ Text-to-speech for responses
- ✅ Chat history within session
- ✅ Accesses the most recent PDF content automatically

**Usage:**
1. Upload and summarize a PDF
2. Click the floating chat button (bottom right)
3. Ask questions about your PDF!

## Database Structure

### Tables Created:

**1. profiles**
- Stores user information (name, email)
- Auto-created on signup

**2. summaries**
- Stores PDF summaries and content
- Includes: filename, summary_text, word_count, language, pdf_content
- Used by chatbot to answer PDF questions

## Authentication

**Built-in Email/Password Auth:**
- Email confirmation is auto-enabled (no verification needed)
- Passwords must be minimum 6 characters
- Session persists across page refreshes
- Protected routes redirect to auth page

## Environment Variables

All automatically configured via Lovable Cloud:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- `LOVABLE_API_KEY` - AI Gateway key (backend only)

## Customization

### Change AI Model
Edit `supabase/functions/chat-with-pdf/index.ts`:
```typescript
model: "google/gemini-2.5-flash", // or "openai/gpt-5"
```

### Change Color Theme
Edit `src/index.css`:
- `--primary`: Main brand color (purple-blue)
- `--secondary`: Secondary accent (purple)
- `--accent`: CTA color (amber)

### Add More Languages
Edit `src/components/LanguageSelector.tsx`:
```typescript
const INDIAN_LANGUAGES = [
  "English",
  "Hindi",
  // Add more languages...
];
```

## Troubleshooting

### Chatbot Not Working
1. Check that you've uploaded at least one PDF
2. Verify the edge function is deployed (automatic)
3. Check browser console for errors

### n8n Webhook Errors
1. Test webhook URL directly with Postman
2. Verify response format matches expected structure
3. Check n8n workflow is active

### Authentication Issues
- Email confirmation is auto-enabled
- If stuck, check Lovable Cloud tab
- Session should persist automatically

## Cost & Limits

**Lovable AI:**
- Free tier includes monthly requests
- Pay-as-you-go pricing after free tier
- Check usage: Settings → Workspace → Usage

**Database & Backend:**
- Included with Lovable Cloud
- Scales automatically

## Support

- [Lovable Docs](https://docs.lovable.dev/)
- [Lovable Discord](https://discord.gg/lovable)
- [n8n Docs](https://docs.n8n.io/)

## Next Steps

1. **Set up n8n webhook** for PDF processing
2. **Test chatbot** with sample PDFs
3. **Configure feedback webhook** (optional)
4. **Customize colors** to match your brand
5. **Deploy to production** via Publish button