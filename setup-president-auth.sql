-- ========================================
-- CLUB PRESIDENT AUTHENTICATION SYSTEM
-- Additional tables for president login functionality
-- ========================================

-- First, let's inspect existing table structure to understand constraints
DO $$
BEGIN
    RAISE NOTICE '=== INSPECTING EXISTING DATABASE STRUCTURE ===';
    
    -- Check if clubs table exists and show its structure
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clubs') THEN
        RAISE NOTICE 'Found existing clubs table';
        
        -- Show constraints
        PERFORM column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'clubs'
        ORDER BY ordinal_position;
        
    ELSE
        RAISE NOTICE 'No existing clubs table found';
    END IF;
END
$$;

-- Step 1: Create clubs table (check if exists first)
DO $$
BEGIN
    -- Check if clubs table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clubs') THEN
        CREATE TABLE public.clubs (
            club_id text PRIMARY KEY,
            name text NOT NULL,
            category text NOT NULL,
            description text,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );
        RAISE NOTICE 'Created clubs table';
    ELSE
        RAISE NOTICE 'Clubs table already exists, skipping creation';
    END IF;
END
$$;

-- Step 2: Create club_presidents table
CREATE TABLE IF NOT EXISTS public.club_presidents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    club_id text REFERENCES public.clubs(club_id) ON DELETE CASCADE,
    full_name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'president' CHECK (role IN ('president', 'vice-president', 'secretary', 'treasurer')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    phone text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, club_id)
);

-- Step 3: Insert sample clubs (with error handling)
DO $$
BEGIN
    -- Insert clubs with safe category values
    INSERT INTO public.clubs (club_id, name, category, description) VALUES
    ('tech', 'Tech Club', 'academic', 'Technology and innovation club'),
    ('entrepreneurship', 'Entrepreneurship Club', 'academic', 'Business and startup club'),
    ('cultural', 'Cultural Club', 'cultural', 'Cultural activities and arts'),
    ('sports', 'Sports Club', 'sports', 'Sports and fitness activities'),
    ('debate', 'Debate Club', 'academic', 'Debating and public speaking'),
    ('music', 'Music Club', 'cultural', 'Musical activities and performances'),
    ('dance', 'Dance Club', 'cultural', 'Dance performances and training'),
    ('photography', 'Photography Club', 'cultural', 'Photography and visual arts'),
    ('community-service', 'Community Service', 'social', 'Social service activities'),
    ('gaming', 'Gaming Club', 'recreational', 'Gaming and esports')
    ON CONFLICT (club_id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        updated_at = timezone('utc'::text, now());
    
    RAISE NOTICE 'Clubs data inserted/updated successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting clubs: %, trying alternative approach...', SQLERRM;
        
        -- Alternative approach: try with minimal data
        INSERT INTO public.clubs (club_id, name, category) VALUES
        ('tech', 'Tech Club', 'academic'),
        ('entrepreneurship', 'Entrepreneurship Club', 'academic'),
        ('cultural', 'Cultural Club', 'cultural'),
        ('sports', 'Sports Club', 'sports'),
        ('debate', 'Debate Club', 'academic')
        ON CONFLICT (club_id) DO NOTHING;
END
$$;

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_club_presidents_user_id ON public.club_presidents(user_id);
CREATE INDEX IF NOT EXISTS idx_club_presidents_club_id ON public.club_presidents(club_id);
CREATE INDEX IF NOT EXISTS idx_club_presidents_email ON public.club_presidents(email);
CREATE INDEX IF NOT EXISTS idx_club_presidents_status ON public.club_presidents(status);

-- Step 5: Create update triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER clubs_updated_at_trigger
    BEFORE UPDATE ON public.clubs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER club_presidents_updated_at_trigger
    BEFORE UPDATE ON public.club_presidents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Step 6: Set up RLS policies
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_presidents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "clubs_select_policy" ON public.clubs;
DROP POLICY IF EXISTS "clubs_insert_policy" ON public.clubs;
DROP POLICY IF EXISTS "clubs_update_policy" ON public.clubs;
DROP POLICY IF EXISTS "clubs_delete_policy" ON public.clubs;

DROP POLICY IF EXISTS "club_presidents_select_policy" ON public.club_presidents;
DROP POLICY IF EXISTS "club_presidents_insert_policy" ON public.club_presidents;
DROP POLICY IF EXISTS "club_presidents_update_policy" ON public.club_presidents;
DROP POLICY IF EXISTS "club_presidents_delete_policy" ON public.club_presidents;

-- Clubs policies (corrected syntax)
CREATE POLICY "clubs_select_policy" ON public.clubs 
FOR SELECT TO anon, authenticated 
USING (true);

CREATE POLICY "clubs_insert_policy" ON public.clubs 
FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "clubs_update_policy" ON public.clubs 
FOR UPDATE TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "clubs_delete_policy" ON public.clubs 
FOR DELETE TO authenticated 
USING (true);

-- Club presidents policies (corrected syntax)
CREATE POLICY "club_presidents_select_policy" ON public.club_presidents 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "club_presidents_insert_policy" ON public.club_presidents 
FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "club_presidents_update_policy" ON public.club_presidents 
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "club_presidents_delete_policy" ON public.club_presidents 
FOR DELETE TO authenticated 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Step 7: Create sample president users (you'll need to create these in Supabase Auth first)
-- This is just a template - actual users need to be created through Supabase Auth UI or API

-- INSERT INTO public.club_presidents (user_id, club_id, full_name, email, role, status) VALUES
-- ('YOUR_USER_UUID_HERE', 'tech', 'John Doe', 'john.doe@university.edu', 'president', 'active'),
-- ('YOUR_USER_UUID_HERE', 'entrepreneurship', 'Jane Smith', 'jane.smith@university.edu', 'president', 'active');

SELECT 'Club president authentication system setup completed!' as status,
       'Tables: clubs, club_presidents created' as tables_status,
       'RLS policies: All access policies created' as security_status,
       'Next: Create users in Supabase Auth and add them to club_presidents table' as next_steps;
