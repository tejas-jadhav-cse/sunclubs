-- ========================================
-- SUNCLUBS DATABASE SETUP - COMPLETE
-- ========================================
-- Run this script in your Supabase SQL Editor for fresh installation
-- This script creates everything needed for the club recruitment system

-- ========================================
-- STEP 1: Create the main table
-- ========================================

-- Drop table if exists (for clean reinstall)
DROP TABLE IF EXISTS public.club_applications CASCADE;

-- Create club_applications table with complete structure
CREATE TABLE public.club_applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    institution text NOT NULL CHECK (institution IN ('foundation', 'university')),
    college text NOT NULL,
    branch text,
    year text,
    selected_clubs text[] NOT NULL CHECK (array_length(selected_clubs, 1) > 0),
    reason text NOT NULL CHECK (char_length(reason) >= 50),
    portfolio_url text CHECK (portfolio_url IS NULL OR portfolio_url ~* '^https?://'),
    consent_given boolean NOT NULL DEFAULT false CHECK (consent_given = true),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================
-- STEP 2: Create indexes for performance
-- ========================================

CREATE INDEX idx_club_applications_email ON public.club_applications(email);
CREATE INDEX idx_club_applications_created_at ON public.club_applications(created_at DESC);
CREATE INDEX idx_club_applications_institution ON public.club_applications(institution);
CREATE INDEX idx_club_applications_college ON public.club_applications(college);
CREATE INDEX idx_club_applications_branch ON public.club_applications(branch) WHERE branch IS NOT NULL;
CREATE INDEX idx_club_applications_clubs ON public.club_applications USING GIN(selected_clubs);

-- ========================================
-- STEP 3: Create update trigger
-- ========================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER handle_updated_at 
    BEFORE UPDATE ON public.club_applications
    FOR EACH ROW 
    EXECUTE PROCEDURE public.handle_updated_at();

-- ========================================
-- STEP 4: Enable Row Level Security (RLS)
-- ========================================

ALTER TABLE public.club_applications ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 5: Create RLS Policies
-- ========================================

-- Policy 1: Allow anonymous users to submit applications
CREATE POLICY "club_applications_insert_policy" 
ON public.club_applications
FOR INSERT 
TO anon, authenticated
WITH CHECK (
    -- Ensure required fields are present and valid
    full_name IS NOT NULL AND 
    trim(full_name) != '' AND
    email IS NOT NULL AND 
    trim(email) != '' AND
    email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' AND
    institution IS NOT NULL AND 
    institution IN ('foundation', 'university') AND
    college IS NOT NULL AND 
    trim(college) != '' AND
    selected_clubs IS NOT NULL AND 
    array_length(selected_clubs, 1) > 0 AND
    array_length(selected_clubs, 1) <= 5 AND
    reason IS NOT NULL AND 
    char_length(trim(reason)) >= 50 AND
    consent_given = true
);

-- Policy 2: Allow reading applications (for admin dashboard)
CREATE POLICY "club_applications_select_policy" 
ON public.club_applications
FOR SELECT 
TO anon, authenticated
USING (true);

-- Policy 3: Allow authenticated users to update applications (admin)
CREATE POLICY "club_applications_update_policy" 
ON public.club_applications
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (
    full_name IS NOT NULL AND 
    email IS NOT NULL AND 
    institution IS NOT NULL AND 
    college IS NOT NULL AND 
    selected_clubs IS NOT NULL AND 
    consent_given = true
);

-- Policy 4: Allow authenticated users to delete applications (admin)
CREATE POLICY "club_applications_delete_policy" 
ON public.club_applications
FOR DELETE 
TO authenticated
USING (true);

-- ========================================
-- STEP 6: Create helpful views
-- ========================================

-- Application statistics view
CREATE OR REPLACE VIEW public.application_stats AS
SELECT 
    institution,
    college,
    branch,
    COUNT(DISTINCT ca.id) as total_applications,
    COUNT(DISTINCT ca.email) as unique_applicants,
    array_agg(DISTINCT club_name ORDER BY club_name) as all_clubs_applied,
    DATE(ca.created_at) as application_date,
    MIN(ca.created_at) as first_application,
    MAX(ca.created_at) as last_application
FROM public.club_applications ca
CROSS JOIN LATERAL unnest(ca.selected_clubs) as club_name
GROUP BY institution, college, branch, DATE(ca.created_at)
ORDER BY DATE(ca.created_at) DESC, institution, college;

-- Club popularity view
CREATE OR REPLACE VIEW public.club_popularity AS
SELECT 
    club_name,
    COUNT(*) as selection_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM public.club_applications), 2) as percentage
FROM public.club_applications ca
CROSS JOIN LATERAL unnest(ca.selected_clubs) as club_name
GROUP BY club_name
ORDER BY selection_count DESC;

-- Daily application summary
CREATE OR REPLACE VIEW public.daily_summary AS
SELECT 
    DATE(created_at) as application_date,
    COUNT(*) as total_applications,
    COUNT(DISTINCT email) as unique_applicants,
    COUNT(*) FILTER (WHERE institution = 'foundation') as foundation_apps,
    COUNT(*) FILTER (WHERE institution = 'university') as university_apps
FROM public.club_applications
GROUP BY DATE(created_at)
ORDER BY application_date DESC;

-- Grant access to views
GRANT SELECT ON public.application_stats TO anon, authenticated;
GRANT SELECT ON public.club_popularity TO anon, authenticated;
GRANT SELECT ON public.daily_summary TO anon, authenticated;

-- ========================================
-- STEP 7: Add helpful comments
-- ========================================

COMMENT ON TABLE public.club_applications IS 'Stores club recruitment applications from students';
COMMENT ON COLUMN public.club_applications.institution IS 'Either "foundation" for Sandip Foundation or "university" for Sandip University';
COMMENT ON COLUMN public.club_applications.college IS 'College code (e.g., SIEM, SOCSE, SITRC, SOET, etc.)';
COMMENT ON COLUMN public.club_applications.branch IS 'Optional branch/department selection';
COMMENT ON COLUMN public.club_applications.year IS 'Optional year of study (1st Year, 2nd Year, etc.)';
COMMENT ON COLUMN public.club_applications.selected_clubs IS 'Array of selected club IDs (min 1, max 5)';
COMMENT ON COLUMN public.club_applications.reason IS 'Why the student wants to join (minimum 50 characters)';
COMMENT ON COLUMN public.club_applications.portfolio_url IS 'Optional portfolio/resume URL (must start with http/https)';

-- ========================================
-- STEP 8: Insert sample data (optional)
-- ========================================

-- Uncomment the following to insert sample data for testing:

-- INSERT INTO public.club_applications (
--     full_name, email, phone, institution, college, branch, year, 
--     selected_clubs, reason, portfolio_url, consent_given
-- ) VALUES 
-- (
--     'John Doe', 
--     'john.doe@example.com', 
--     '+919876543210',
--     'foundation', 
--     'SIEM', 
--     'Computer Science', 
--     '2nd Year',
--     ARRAY['tech', 'gaming'], 
--     'I am passionate about technology and want to learn more about software development. I believe joining these clubs will help me grow my skills and network with like-minded peers.',
--     'https://johndoe.portfolio.com',
--     true
-- ),
-- (
--     'Jane Smith', 
--     'jane.smith@example.com', 
--     '+919876543211',
--     'university', 
--     'SOCSE', 
--     'Information Technology', 
--     '3rd Year',
--     ARRAY['tech', 'entrepreneurship', 'cultural'], 
--     'I want to combine my technical knowledge with business skills and cultural activities. These clubs will provide me with a well-rounded experience during my university years.',
--     NULL,
--     true
-- );

-- ========================================
-- STEP 9: Verification queries
-- ========================================

-- Verify table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'club_applications'
ORDER BY ordinal_position;

-- Check constraints
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'club_applications' 
  AND tc.table_schema = 'public';

-- Check indexes
SELECT 
    indexname, 
    indexdef
FROM pg_indexes 
WHERE tablename = 'club_applications' 
  AND schemaname = 'public';

-- Check RLS policies
SELECT 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE tablename = 'club_applications' 
  AND schemaname = 'public';

-- ========================================
-- SETUP COMPLETE!
-- ========================================

SELECT 'Database setup completed successfully!' as status,
       'Table: club_applications created with all constraints' as table_status,
       'RLS policies: 4 policies created (INSERT, SELECT, UPDATE, DELETE)' as security_status,
       'Views: 3 analytics views created' as views_status,
       'Ready for production use!' as final_status;
