-- Create the songs table
create table public.songs (
  video_id text primary key,
  title text not null,
  artist text,
  plays bigint default 0,
  last_played_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.songs enable row level security;

-- Create a policy to allow anyone to read songs
create policy "Enable read access for all users" on public.songs
  for select using (true);

-- Create a policy to allow anyone to insert/update (for demo purposes)
-- In production, you'd want to restrict this more.
create policy "Enable insert/update for all users" on public.songs
  for all using (true) with check (true);
