/* Supabase Database Schema for SUN Clubs */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clubs table
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  description TEXT,
  email VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Club presidents table (links to Supabase Auth)
CREATE TABLE club_presidents (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  club_id VARCHAR NOT NULL REFERENCES clubs(club_id),
  name VARCHAR NOT NULL,
  position VARCHAR DEFAULT 'President',
  contact_number VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id VARCHAR NOT NULL REFERENCES clubs(club_id),
  title VARCHAR NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  venue VARCHAR,
  status VARCHAR DEFAULT 'upcoming',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_presidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public clubs are viewable by everyone" ON clubs
  FOR SELECT USING (true);

CREATE POLICY "Club presidents can only see their own data" ON club_presidents
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Club presidents can only manage their club events" ON events
  FOR ALL USING (club_id IN (
    SELECT club_id FROM club_presidents WHERE id = auth.uid()
  ));

-- Sample data insertion
-- Example club data population
INSERT INTO clubs (club_id, name, description, email) VALUES
('sun-event-club', 'SUN Event Club', 'Club for organizing university events', 'sun-event@sandipuniversity.edu.in'),
('sun-dance-club', 'SUN Dance Club', 'Club for dance enthusiasts', 'sun-dance@sandipuniversity.edu.in'),
('sun-photography-club', 'SUN Photography Club', 'Club for photography enthusiasts', 'sun-photography@sandipuniversity.edu.in');

-- NOTE: Club presidents would be created through Supabase auth signup and then linked to clubs
