create extension if not exists pgcrypto;

create type public.user_role as enum ('renter','owner','store','brand','creator','admin');
create type public.item_status as enum ('draft','published','paused','rented','archived');
create type public.booking_status as enum ('pending','confirmed','active','completed','cancelled','disputed');
create type public.condition_grade as enum ('new','excellent','good','fair');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  city text,
  role public.user_role not null default 'renter',
  verification_level smallint not null default 0 check (verification_level between 0 and 3),
  rating numeric(3,2) not null default 0 check (rating between 0 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table public.clothing_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text,
  brand text,
  size text,
  color text,
  style text,
  condition public.condition_grade not null default 'excellent',
  status public.item_status not null default 'draft',
  daily_price numeric(10,2) not null check (daily_price >= 0),
  cleaning_fee numeric(10,2) not null default 0 check (cleaning_fee >= 0),
  deposit_amount numeric(10,2) not null default 0 check (deposit_amount >= 0),
  rental_score smallint check (rental_score between 0 and 100),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.clothing_items(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.item_availability (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.clothing_items(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  available boolean not null default true,
  check (end_date >= start_date)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.clothing_items(id) on delete restrict,
  renter_id uuid not null references public.profiles(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  status public.booking_status not null default 'pending',
  subtotal numeric(10,2) not null check (subtotal >= 0),
  platform_fee numeric(10,2) not null default 0 check (platform_fee >= 0),
  protection_fee numeric(10,2) not null default 0 check (protection_fee >= 0),
  total_amount numeric(10,2) not null check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date),
  check (total_amount >= subtotal)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.clothing_items(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (booking_id, reviewer_id)
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.clothing_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.categories (name, slug, sort_order) values
  ('Vestidos','vestidos',1),('Social','social',2),('Casual','casual',3),
  ('Masculino','masculino',4),('Infantil','infantil',5),('Esportivo','esportivo',6),
  ('Luxo','luxo',7),('Fantasias','fantasias',8),('Inverno','inverno',9),('Maternidade','maternidade',10)
  on conflict (slug) do nothing;

insert into public.platform_settings (key, value) values
  ('platform_commission', '{"percentage":20}'::jsonb),
  ('protection_fee', '{"percentage":5,"minimum":3}'::jsonb)
  on conflict (key) do nothing;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.clothing_items enable row level security;
alter table public.item_images enable row level security;
alter table public.item_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.platform_settings enable row level security;

create policy "published items are public" on public.clothing_items for select using (status = 'published' or owner_id = auth.uid());
create policy "public categories" on public.categories for select using (active = true);
create policy "public images for visible items" on public.item_images for select using (exists (select 1 from public.clothing_items i where i.id = item_id and (i.status = 'published' or i.owner_id = auth.uid())));
create policy "public availability for visible items" on public.item_availability for select using (exists (select 1 from public.clothing_items i where i.id = item_id and (i.status = 'published' or i.owner_id = auth.uid())));
create policy "users read own profile" on public.profiles for select using (id = auth.uid());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "owners manage own items" on public.clothing_items for insert with check (owner_id = auth.uid());
create policy "owners update own items" on public.clothing_items for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners delete own items" on public.clothing_items for delete using (owner_id = auth.uid());
create policy "owners manage own images" on public.item_images for all using (exists (select 1 from public.clothing_items i where i.id = item_id and i.owner_id = auth.uid())) with check (exists (select 1 from public.clothing_items i where i.id = item_id and i.owner_id = auth.uid()));
create policy "owners manage own availability" on public.item_availability for all using (exists (select 1 from public.clothing_items i where i.id = item_id and i.owner_id = auth.uid())) with check (exists (select 1 from public.clothing_items i where i.id = item_id and i.owner_id = auth.uid()));
create policy "users manage own favorites" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users read own bookings" on public.bookings for select using (renter_id = auth.uid() or exists (select 1 from public.clothing_items i where i.id = item_id and i.owner_id = auth.uid()));
create policy "renters create bookings" on public.bookings for insert with check (renter_id = auth.uid());
create policy "users read reviews" on public.reviews for select using (true);
create policy "users create own reviews" on public.reviews for insert with check (reviewer_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
