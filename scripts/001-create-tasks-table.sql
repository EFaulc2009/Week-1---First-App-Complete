-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now - in production you'd want user-specific policies)
CREATE POLICY "Allow all operations on tasks" ON public.tasks
  FOR ALL USING (true) WITH CHECK (true);
