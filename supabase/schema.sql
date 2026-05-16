-- Fiorenza — Databasschema
-- Kör detta i Supabase SQL Editor

-- Profiler (kopplade till Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can manage own profile"
  on profiles for all using (auth.uid() = id);

-- Leverantörer
create table suppliers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  area text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Produkter
create table products (
  id uuid default gen_random_uuid() primary key,
  supplier_id uuid references suppliers,
  name text not null,
  description text,
  price integer not null, -- i ören (10 kr = 1000)
  type text not null check (type in ('flower', 'card', 'gift')),
  requires_address boolean default false,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Kontakter
create table contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete cascade not null,
  name text not null,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  notes text,
  created_at timestamptz default now()
);
alter table contacts enable row level security;
create policy "Users can manage own contacts"
  on contacts for all using (auth.uid() = user_id);

-- Bemärkelsedagar
create table occasions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete cascade not null,
  contact_id uuid references contacts on delete cascade not null,
  type text not null check (type in ('birthday', 'anniversary', 'baptism', 'nameday', 'custom')),
  label text, -- fritext t.ex. "50-årsdag"
  month integer not null check (month between 1 and 12),
  day integer not null check (day between 1 and 31),
  year integer, -- valfritt, för åldersberäkning
  recurring boolean default true,
  created_at timestamptz default now()
);
alter table occasions enable row level security;
create policy "Users can manage own occasions"
  on occasions for all using (auth.uid() = user_id);

-- Ordrar
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete cascade not null,
  contact_id uuid references contacts not null,
  occasion_id uuid references occasions not null,
  product_id uuid references products not null,
  delivery_date date not null,
  delivery_address text, -- null om digitalt
  personal_message text,
  card_image_url text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'delivered', 'cancelled')),
  price integer not null, -- i ören, snapshot vid beställning
  invoiced boolean default false,
  created_at timestamptz default now()
);
alter table orders enable row level security;
create policy "Users can manage own orders"
  on orders for all using (auth.uid() = user_id);

-- Fakturaunderlag
create table invoice_rows (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles not null,
  order_id uuid references orders not null,
  month integer not null,
  year integer not null,
  amount integer not null, -- i ören
  description text,
  created_at timestamptz default now()
);
alter table invoice_rows enable row level security;
create policy "Users can view own invoice rows"
  on invoice_rows for select using (auth.uid() = user_id);

-- Seed: Anastasiia som första leverantör
insert into suppliers (name, email, phone, area)
values ('Anastasiia Palchak', 'nastazia979@gmail.com', null, 'Malmö / Skåne');

-- Seed: Startprodukter
insert into products (name, description, price, type, requires_address)
values
  ('Digitalt kort', 'Personlig hälsning skickas som mail', 1000, 'card', false),
  ('Blombukett — liten', 'Säsongsblommor, levereras till dörren', 29900, 'flower', true),
  ('Blombukett — stor', 'Stort gäng säsongsblommor, levereras till dörren', 49900, 'flower', true);
