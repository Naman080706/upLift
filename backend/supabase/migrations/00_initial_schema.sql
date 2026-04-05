-- Initial Schema for upLIFT AI Validator
-- Date: 2026-04-04

-- 1. Create the analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- The user's input data
  startup_name TEXT NOT NULL,
  industry TEXT,
  target_market TEXT,
  problem_statement TEXT,
  solution TEXT,
  
  -- The AI Engine's calculated results
  feasibility_score FLOAT NOT NULL,
  innovation_score FLOAT NOT NULL,
  risk_score FLOAT NOT NULL,
  success_rate FLOAT NOT NULL,
  decision TEXT NOT NULL, -- e.g., 'GO', 'NO-GO'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Policy: Users can only INSERT their own analyses
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'analyses' AND policyname = 'Users can insert their own analyses'
    ) THEN
        CREATE POLICY "Users can insert their own analyses" 
        ON analyses FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- Policy: Users can only SELECT (read) their own analyses
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'analyses' AND policyname = 'Users can view their own analyses'
    ) THEN
        CREATE POLICY "Users can view their own analyses" 
        ON analyses FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Policy: Users can only DELETE their own analyses
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'analyses' AND policyname = 'Users can delete their own analyses'
    ) THEN
        CREATE POLICY "Users can delete their own analyses" 
        ON analyses FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END
$$;
