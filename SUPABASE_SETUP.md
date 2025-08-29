# Supabase Database Setup

## 1. Create the FAQs Table

Copy and paste the contents of `supabase-schema.sql` into your Supabase SQL Editor and run it.

## 2. Table Structure

The `faqs` table has the following structure:

- `id`: UUID (Primary Key, auto-generated)
- `question`: TEXT (Required)
- `answer`: TEXT (Required)
- `user_id`: UUID (Required, references auth.users.id)
- `created_at`: TIMESTAMP (Auto-generated)
- `updated_at`: TIMESTAMP (Auto-updated on changes)

## 3. Features

- **Row Level Security (RLS)**: Users can only access their own FAQs
- **Automatic timestamps**: `created_at` and `updated_at` are automatically managed
- **Cascade deletion**: FAQs are deleted when the user is deleted
- **Performance indexes**: Optimized queries for user_id and created_at

## 4. RLS Policies

The table includes these security policies:
- Users can only view their own FAQs
- Users can only insert FAQs for themselves
- Users can only update their own FAQs
- Users can only delete their own FAQs

## 5. Usage

After setting up the table, the FAQ system will:
- Automatically save new FAQs to Supabase
- Load FAQs from the database on component mount
- Delete FAQs from the database when removed
- Show loading states and success/error messages
- Maintain data persistence across sessions

## 6. Testing

To test the system:
1. Sign up/login to your app
2. Navigate to the dashboard
3. Open the Knowledge Base sidebar
4. Add a new FAQ
5. Check your Supabase dashboard to see the data
6. Refresh the page to verify data persistence
