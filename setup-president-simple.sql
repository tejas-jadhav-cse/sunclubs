-- ========================================
-- SIMPLIFIED CLUB PRESIDENT SETUP
-- Works with existing constraints
-- ========================================

-- Step 1: Check existing clubs table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'clubs'
ORDER BY ordinal_position;

-- Step 2: Check existing constraints on clubs table
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'clubs' 
  AND tc.table_schema = 'public';

-- Step 3: Create club_presidents table (this should work regardless)
CREATE TABLE IF NOT EXISTS public.club_presidents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    club_id text, -- Don't reference clubs table for now
    full_name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'president' CHECK (role IN ('president', 'vice-president', 'secretary', 'treasurer')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    phone text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 4: Create indexes for club_presidents
CREATE INDEX IF NOT EXISTS idx_club_presidents_user_id ON public.club_presidents(user_id);
CREATE INDEX IF NOT EXISTS idx_club_presidents_club_id ON public.club_presidents(club_id);
CREATE INDEX IF NOT EXISTS idx_club_presidents_email ON public.club_presidents(email);
CREATE INDEX IF NOT EXISTS idx_club_presidents_status ON public.club_presidents(status);

-- Step 5: Enable RLS for club_presidents
ALTER TABLE public.club_presidents ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for club_presidents (corrected syntax)
DROP POLICY IF EXISTS "club_presidents_select_policy" ON public.club_presidents;
CREATE POLICY "club_presidents_select_policy" ON public.club_presidents 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "club_presidents_insert_policy" ON public.club_presidents;
CREATE POLICY "club_presidents_insert_policy" ON public.club_presidents 
FOR INSERT TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "club_presidents_update_policy" ON public.club_presidents;
CREATE POLICY "club_presidents_update_policy" ON public.club_presidents 
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "club_presidents_delete_policy" ON public.club_presidents;
CREATE POLICY "club_presidents_delete_policy" ON public.club_presidents 
FOR DELETE TO authenticated 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Step 7: Insert basic club data (if clubs table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clubs') THEN
        -- Try to insert with very basic category values that are likely to pass constraints
        BEGIN
            INSERT INTO public.clubs (club_id, name, category) VALUES
            ('tech', 'Tech Club', 'academic')
            ON CONFLICT (club_id) DO NOTHING;
            
            INSERT INTO public.clubs (club_id, name, category) VALUES
            ('entrepreneurship', 'Entrepreneurship Club', 'academic')
            ON CONFLICT (club_id) DO NOTHING;
            
            RAISE NOTICE 'Successfully inserted basic clubs';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not insert clubs due to constraints: %', SQLERRM;
                RAISE NOTICE 'You may need to manually add clubs that match your existing constraints';
        END;
    ELSE
        RAISE NOTICE 'No clubs table found - you may need to create it manually';
    END IF;
END
$$;

-- Step 8: Show status
SELECT 
    'Club president authentication tables ready' as status,
    'club_presidents table created with RLS policies' as table_status,
    'Manual club creation may be needed if constraints exist' as note,
    'Create test users in Supabase Auth, then add to club_presidents table' as next_step;
