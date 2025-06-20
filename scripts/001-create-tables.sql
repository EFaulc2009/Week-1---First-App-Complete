-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  details TEXT,
  completed BOOLEAN DEFAULT FALSE,
  workout_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise_sets table
CREATE TABLE IF NOT EXISTS public.exercise_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  reps INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(10,2),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workouts" ON public.workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON public.workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON public.workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON public.workouts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view exercises for own workouts" ON public.exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workouts 
      WHERE workouts.id = exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert exercises for own workouts" ON public.exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts 
      WHERE workouts.id = exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update exercises for own workouts" ON public.exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workouts 
      WHERE workouts.id = exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete exercises for own workouts" ON public.exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workouts 
      WHERE workouts.id = exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sets for own exercises" ON public.exercise_sets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exercises 
      JOIN public.workouts ON workouts.id = exercises.workout_id
      WHERE exercises.id = exercise_sets.exercise_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sets for own exercises" ON public.exercise_sets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exercises 
      JOIN public.workouts ON workouts.id = exercises.workout_id
      WHERE exercises.id = exercise_sets.exercise_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sets for own exercises" ON public.exercise_sets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.exercises 
      JOIN public.workouts ON workouts.id = exercises.workout_id
      WHERE exercises.id = exercise_sets.exercise_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sets for own exercises" ON public.exercise_sets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.exercises 
      JOIN public.workouts ON workouts.id = exercises.workout_id
      WHERE exercises.id = exercise_sets.exercise_id 
      AND workouts.user_id = auth.uid()
    )
  );
