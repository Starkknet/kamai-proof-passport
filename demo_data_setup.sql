-- Demo Data Setup for KAMAI Demo User
-- This script creates sample data for demo@kamai.in

-- STEP 1: Create the demo user manually in Supabase Dashboard
-- Go to Authentication > Users > Add User
-- Email: demo@kamai.in
-- Password: DemoKamai2024

-- STEP 2: Run this SQL script in the Supabase SQL Editor

-- Insert sample uploaded file for demo user
INSERT INTO uploaded_files (user_id, filename, platform, rows_detected, date_uploaded)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'demo@kamai.in'),
  'swiggy_demo_march2024.csv',
  'Swiggy',
  92,
  '2024-03-15T10:30:00Z'
);

-- Insert sample transactions for demo user (92 transactions)
-- January 2024 (28 transactions)
INSERT INTO transactions (user_id, platform, amount_numeric, txn_date, trip_id, uploaded_file_id)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'demo@kamai.in'),
  'Swiggy',
  CASE 
    WHEN i % 5 = 0 THEN 650
    WHEN i % 4 = 0 THEN 580
    WHEN i % 3 = 0 THEN 520
    ELSE 490
  END,
  ('2024-01-01'::date + (i || ' days')::interval)::date,
  'DEMO-TRIP-' || LPAD(i::text, 5, '0'),
  (SELECT id FROM uploaded_files WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in') LIMIT 1)
FROM generate_series(1, 28) AS i;

-- February 2024 (29 transactions)
INSERT INTO transactions (user_id, platform, amount_numeric, txn_date, trip_id, uploaded_file_id)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'demo@kamai.in'),
  'Swiggy',
  CASE 
    WHEN i % 5 = 0 THEN 680
    WHEN i % 4 = 0 THEN 600
    WHEN i % 3 = 0 THEN 540
    ELSE 510
  END,
  ('2024-02-01'::date + (i || ' days')::interval)::date,
  'DEMO-TRIP-' || LPAD((i + 28)::text, 5, '0'),
  (SELECT id FROM uploaded_files WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in') LIMIT 1)
FROM generate_series(1, 29) AS i;

-- March 2024 (35 transactions to reach 92 total)
INSERT INTO transactions (user_id, platform, amount_numeric, txn_date, trip_id, uploaded_file_id)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'demo@kamai.in'),
  'Swiggy',
  CASE 
    WHEN i % 5 = 0 THEN 700
    WHEN i % 4 = 0 THEN 620
    WHEN i % 3 = 0 THEN 560
    ELSE 530
  END,
  ('2024-03-01'::date + (i || ' days')::interval)::date,
  'DEMO-TRIP-' || LPAD((i + 57)::text, 5, '0'),
  (SELECT id FROM uploaded_files WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in') LIMIT 1)
FROM generate_series(1, 35) AS i;

-- Insert sample certificate for demo user
INSERT INTO certificates (
  user_id,
  certificate_id,
  period_start,
  period_end,
  total_net_income,
  stability_score,
  platforms,
  issue_date,
  verification_hash
)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'demo@kamai.in'),
  'KAM-2024-DEMO1',
  '2024-01-01',
  '2024-03-31',
  45050.00,
  680,
  ARRAY['Swiggy'],
  NOW(),
  encode(sha256('KAM-2024-DEMO1-45050-680'::bytea), 'hex')
);

-- Verify the data was inserted correctly
SELECT 
  'Transactions' as data_type,
  COUNT(*) as count,
  SUM(amount_numeric) as total_gross,
  ROUND(SUM(amount_numeric) * 0.85, 2) as total_net
FROM transactions 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in');

SELECT 
  'Uploaded Files' as data_type,
  COUNT(*) as count
FROM uploaded_files 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in');

SELECT 
  'Certificates' as data_type,
  COUNT(*) as count
FROM certificates 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo@kamai.in');
