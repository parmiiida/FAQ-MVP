-- Create the FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_faqs_user_id ON public.faqs(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON public.faqs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own FAQs
CREATE POLICY "Users can view own FAQs" ON public.faqs
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own FAQs
CREATE POLICY "Users can insert own FAQs" ON public.faqs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own FAQs
CREATE POLICY "Users can update own FAQs" ON public.faqs
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own FAQs
CREATE POLICY "Users can delete own FAQs" ON public.faqs
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
