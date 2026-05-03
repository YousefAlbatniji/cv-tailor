-- Run this in the Supabase SQL editor

create table cv_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  cv_original_path text not null,
  cv_original_url text not null,
  cv_text text not null,
  paragraphs jsonb not null,
  file_type text not null,
  file_name text not null
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  session_id uuid references cv_sessions(id) on delete cascade,
  job_description text not null,
  cover_letters jsonb not null,
  cv_modified_url text not null,
  modification_summary text
);

-- Storage buckets (create these in the Supabase dashboard under Storage)
-- Bucket name: cv-originals  (public)
-- Bucket name: cv-modified   (public)
