# KAMAI Demo Mode Setup Instructions

## Overview
The "Try Demo" feature allows evaluators to test KAMAI without signing up. Users can auto-login and explore sample data showing realistic gig worker earnings.

## What Was Implemented

### 1. Frontend Changes
- ✅ **Homepage (Index.tsx)**: Added "Try Demo" button with Play icon next to "Get Started"
- ✅ **Auto-login**: Demo button automatically signs in as demo@kamai.in
- ✅ **Demo Banners**: Added informative banners on Dashboard, Upload, and Settings pages
- ✅ **Exit Demo**: Navigation includes "Exit Demo" button when logged in as demo user
- ✅ **Upload Restrictions**: Demo users cannot upload new files (blocked with toast message)
- ✅ **Settings Restrictions**: Demo users cannot modify settings (inputs disabled)

### 2. Demo User Details
- **Email**: demo@kamai.in
- **Password**: DemoKamai2024
- **Data**: Pre-populated with 92 Swiggy transactions from Jan-Mar 2024

### 3. Demo Data Overview
- **Total Transactions**: 92
- **Platform**: Swiggy only
- **Period**: January 1, 2024 - March 31, 2024
- **Total Gross**: ~₹53,000
- **Net Income**: ₹45,050 (after 15% deduction)
- **Stability Score**: 680/850
- **Pre-generated Certificate**: KAM-2024-DEMO1

## Setup Instructions

### Step 1: Create Demo User in Supabase
1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Users**
3. Click **Add User**
4. Enter:
   - Email: `demo@kamai.in`
   - Password: `DemoKamai2024`
5. Confirm the user (disable email confirmation if needed)

### Step 2: Run SQL Script to Populate Data
1. Open the file `demo_data_setup.sql` in your project
2. Go to your Supabase Dashboard
3. Navigate to **SQL Editor**
4. Copy and paste the entire SQL script
5. Click **Run**
6. Verify the results show:
   - 92 transactions
   - 1 uploaded file
   - 1 certificate

### Step 3: Test the Demo
1. Go to your KAMAI homepage
2. Click the **"Try Demo"** button
3. You should be automatically logged in and redirected to the dashboard
4. Verify you see:
   - Demo banner at the top
   - ₹45,050 total income
   - 680/850 stability score
   - Monthly income chart with data
   - "Exit Demo" button in navigation

## Demo User Capabilities

### ✅ What Demo Users CAN Do:
- View dashboard with real charts and metrics
- See uploaded files list
- View transaction history
- Generate new certificates (using existing demo data)
- Download PDF certificates
- Navigate all pages (About, Privacy, Contact, etc.)

### ❌ What Demo Users CANNOT Do:
- Upload new CSV files (blocked with message: "Sign up to upload your files")
- Change settings (inputs are disabled)
- Modify account details
- Delete their account

## User Experience Flow

1. **Homepage**: User clicks "Try Demo" → Auto-login → Redirect to /dashboard
2. **Dashboard**: Shows demo banner, sample data, and "Exit Demo" button
3. **Upload Page**: Shows demo banner, blocks file uploads, encourages signup
4. **Settings Page**: Shows demo alert, disables all inputs, encourages signup
5. **Exit**: Clicking "Exit Demo" logs out and redirects to /login

## Benefits for Evaluators

- **No signup required**: Instant access to explore features
- **Realistic data**: 3 months of actual earnings patterns
- **Full functionality**: Can generate and download certificates
- **Clear labeling**: Always know they're in demo mode
- **Easy exit**: One click to exit and sign up for real account

## Troubleshooting

### Demo Login Not Working
- Ensure demo@kamai.in user exists in Supabase Auth
- Check that the password is exactly: `DemoKamai2024`
- Verify the user is confirmed (not waiting for email verification)

### No Data Showing on Dashboard
- Run the SQL script in `demo_data_setup.sql`
- Check that transactions were inserted correctly
- Verify the user_id matches the demo@kamai.in user UUID

### Upload Block Not Working
- Clear browser cache and reload
- Check that the user email check is working: `user.email === 'demo@kamai.in'`

## Maintenance

### Resetting Demo Data
If demo data gets corrupted, run these SQL commands:

```sql
-- Delete all demo user data
DELETE FROM certificates WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in');
DELETE FROM transactions WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in');
DELETE FROM uploaded_files WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in');

-- Then re-run demo_data_setup.sql
```

### Updating Demo Data
To change demo data, modify `demo_data_setup.sql` and re-run it after resetting.

## Security Notes

- Demo user has same RLS policies as regular users
- Cannot access other users' data
- Cannot modify other users' data
- Password is public but account data is isolated and read-only for uploads/settings
