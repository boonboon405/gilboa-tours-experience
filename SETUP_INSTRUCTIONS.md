# Setup Instructions for Advanced Features

## 1. Email Queue Automation (Cron Job)

To enable automatic email processing every 5 minutes, run the following SQL in your Supabase SQL Editor:

### Step 1: Enable Required Extensions
```sql
-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Step 2: Create the Cron Job
```sql
-- Schedule email queue processing every 5 minutes
SELECT cron.schedule(
  'process-email-queue-every-5-minutes',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://sdyjuwjvrysjddageucj.supabase.co/functions/v1/process-email-queue',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkeWp1d2p2cnlzamRkYWdldWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjAxOTAsImV4cCI6MjA3NTM5NjE5MH0.sXf4ou4143HyqDzb-4lva9aWdZN-AxLRU9XRUGcBU7E"}'::jsonb,
        body:='{"triggered_by": "cron"}'::jsonb
    ) as request_id;
  $$
);
```

### Step 3: Verify Cron Job
```sql
-- Check if the cron job was created successfully
SELECT * FROM cron.job;
```

### Step 4: Monitor Cron Execution (Optional)
```sql
-- View cron job execution history
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'process-email-queue-every-5-minutes')
ORDER BY start_time DESC
LIMIT 10;
```

## 2. WhatsApp Notifications Setup

To enable WhatsApp notifications, you need to configure WhatsApp Business API credentials:

### Step 1: Get WhatsApp Business API Credentials
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add WhatsApp Business Platform product
4. Get your:
   - Phone Number ID
   - Access Token (Permanent token recommended)

### Step 2: Add Secrets to Lovable Cloud
You need to add these secrets in your Lovable Cloud backend:
- `WHATSAPP_API_KEY` - Your WhatsApp Business API Access Token
- `WHATSAPP_PHONE_ID` - Your WhatsApp Business Phone Number ID

To add secrets:
1. Open Lovable Cloud backend
2. Navigate to Settings → Secrets
3. Add the two secrets above

### Step 3: Test WhatsApp Integration
Use the `useWhatsAppNotifier` hook in your components:

```typescript
import { useWhatsAppNotifier } from "@/components/WhatsAppNotifier";

const { sendWhatsAppNotification } = useWhatsAppNotifier();

// Send a simple text message
await sendWhatsAppNotification(
  "+972501234567",  // Phone with country code
  "Hello from David Tours!"
);

// Or use a template (requires template setup in Meta)
await sendWhatsAppNotification(
  "+972501234567",
  "",
  "booking_confirmation",  // Template name
  {
    customer_name: "John",
    tour_date: "2025-12-15",
  }
);
```

## 3. Realtime Dashboard

The Master Dashboard (`/dashboard`) automatically updates in real-time when:
- New leads are created
- Bookings are made
- Testimonials are submitted
- Emails are sent

No additional setup required - it uses Supabase Realtime subscriptions.

## 4. Email Templates

Email templates support variable substitution using `{{variable_name}}` syntax.

Available variables:
- `{{customer_name}}` - Customer's name
- `{{customer_email}}` - Customer's email
- `{{tour_date}}` - Tour date
- `{{participants_count}}` - Number of participants
- And any custom variables you define

## 5. Automated Email Sequences

Email sequences can be triggered by:
- `lead_created` - When a new lead is created
- `booking_created` - When a new booking is made
- `no_response` - Follow-up for leads with no response
- `custom` - Custom triggers

Each sequence can have multiple steps with configurable delays (in hours).

## Troubleshooting

### Cron Job Not Running
- Check if extensions are enabled: `SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'pg_net');`
- Verify the URL and API key are correct
- Check cron logs: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;`

### WhatsApp Messages Not Sending
- Verify API credentials are correct
- Check if phone number includes country code (e.g., +972...)
- Ensure WhatsApp Business API is properly configured
- Check edge function logs in Lovable Cloud

### Realtime Updates Not Working
- Ensure Realtime is enabled in Supabase
- Check browser console for connection errors
- Verify RLS policies allow reading the tables

## Support

For issues or questions, check:
- Lovable Cloud logs for edge function errors
- Supabase SQL Editor for database queries
- Browser console for frontend errors
