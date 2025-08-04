# 🚀 Google OAuth Setup for Scan Street Pro

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or Select Project**: Create a new project or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Scan Street Pro"
   - Authorized JavaScript origins: 
     - `http://localhost:8080` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `https://nwoeeejaxmwvxggcpchw.supabase.co/auth/v1/callback`

## Step 2: Configure Supabase

1. **Log into Supabase Dashboard**: https://supabase.com/dashboard
2. **Go to Authentication → Providers**
3. **Enable Google Provider**:
   - Toggle "Enable Google provider" to ON
   - Paste your Google Client ID
   - Paste your Google Client Secret
   - Click "Save"

## Step 3: Environment Variables

Add these to your project's environment variables:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 4: Test Google Login

1. The Google login button is already implemented in the login page
2. Click "Sign in with Google" to test
3. You should be redirected to Google's OAuth consent screen
4. After consent, you'll be redirected back to your app

## Step 5: Handle New Google Users

When a user signs in with Google for the first time, you may need to:

1. Create a user profile in your `users` table
2. Assign them to an organization
3. Set their role (default: 'viewer')

This can be handled with a Supabase database trigger or in your application logic.

## Security Notes

- Never expose your Google Client Secret in frontend code
- Use environment variables for all sensitive data
- Consider setting up different OAuth apps for development and production
- Regularly rotate your OAuth credentials

## Troubleshooting

- **"OAuth client not found"**: Check your client ID is correct
- **"Redirect URI mismatch"**: Ensure your redirect URIs match exactly
- **"Access blocked"**: Check your OAuth consent screen configuration
- **"Invalid client"**: Verify your client secret in Supabase

## Demo Credentials Available

For testing without Google OAuth:
- **Admin**: admin@scanstreetpro.com / AdminPass123!
- **User**: test@springfield.gov / TestUser123!  
- **Premium**: premium@springfield.gov / Premium!

---

✨ Once configured, users can sign in with their Google accounts and enjoy seamless authentication!
