# PDF Summarizer Setup Guide

## Prerequisites
1. **Clerk Account** for authentication
2. **n8n Webhook** for PDF processing
3. **Email Service** (optional) for sending summaries

## Setup Steps

### 1. Clerk Authentication Setup

1. Go to [Clerk.dev](https://clerk.dev) and create an account
2. Create a new application
3. Enable Google OAuth:
   - Go to "Configure" → "Social Connections"
   - Enable Google
   - Add your OAuth credentials
4. Copy your Publishable Key
5. Update `src/App.tsx`:
   ```typescript
   const CLERK_PUBLISHABLE_KEY = "your_publishable_key_here";
   ```

### 2. n8n Webhook Setup

1. Create an n8n workflow with:
   - **Webhook Trigger** - to receive PDF data
   - **PDF Processing Node** - to extract text
   - **AI Node** - to generate summary (OpenAI, Anthropic, etc.)
   - **Response Node** - to return summary
   
2. Expected webhook payload:
   ```json
   {
     "pdfFile": "base64_encoded_pdf",
     "wordCount": 200,
     "language": "English",
     "userEmail": "user@example.com"
   }
   ```

3. Expected response:
   ```json
   {
     "summary": "Generated summary text..."
   }
   ```

4. Update webhook URL in `src/components/PDFUploader.tsx`:
   ```typescript
   const webhookUrl = "your_n8n_webhook_url_here";
   ```

### 3. Environment Variables

The following are automatically configured by Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### 4. Database

The database is automatically set up with:
- **summaries** table for storing user summaries
- Row Level Security (RLS) policies
- Automatic timestamps

### 5. Optional: Email Integration

To enable email sending:
1. Set up an email service (Resend, SendGrid, etc.)
2. Create an edge function to send emails
3. Call the edge function after successful summary generation

## Features Implemented

✅ Google Authentication via Clerk
✅ PDF Upload with validation (max 10MB)
✅ Multi-language support (23 Indian languages)
✅ Customizable summary length
✅ Text-to-speech functionality
✅ Download summary as PDF
✅ User dashboard with history
✅ Dark/Light mode toggle
✅ Responsive design
✅ Database storage for summaries

## Customization

### Change Color Theme
Edit `src/index.css` to modify:
- `--primary`: Main brand color
- `--secondary`: Secondary accent
- `--accent`: Call-to-action color

### Add More Languages
Edit `src/components/LanguageSelector.tsx` and add to `INDIAN_LANGUAGES` array.

### Modify Summary Display
Edit `src/components/SummaryDisplay.tsx` for custom presentation.

## Troubleshooting

### Clerk Not Loading
- Verify your publishable key is correct
- Check browser console for errors
- Ensure your domain is whitelisted in Clerk dashboard

### Webhook Not Working
- Test webhook URL directly with Postman/curl
- Check n8n workflow is active
- Verify payload structure matches expected format

### Database Connection Issues
- Database is automatically configured via Lovable Cloud
- Check the Cloud tab in Lovable for database status

## Support

For issues or questions:
- Check [Clerk Documentation](https://clerk.dev/docs)
- Check [n8n Documentation](https://docs.n8n.io)
- Visit Lovable Discord community