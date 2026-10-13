import fs from "node:fs";
import postgres from "postgres";

function readEnv(name) {
  const text = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
  const line = text.split(/\r?\n/).find((entry) => entry.startsWith(`${name}=`));
  if (!line) {
    return "";
  }

  return line.slice(name.length + 1).trim().replace(/`+$/g, "");
}

function publicError(error) {
  return String(error?.message || error).replace(/postgres(?:\.[^:@/]+)?:[^@]+@/gi, "postgres:***@");
}

const databaseUrl = readEnv("DATABASE_URL");
if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
  console.error("DATABASE_URL is missing or is not a Postgres connection string.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { ssl: "require", max: 1 });

const statements = [
  `create table if not exists public.customers (
    id uuid primary key,
    user_id text not null default (auth.jwt() ->> 'sub'),
    name text not null check (char_length(name) between 2 and 60),
    phone text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
  )`,
  `alter table public.customers enable row level security`,
  `grant select, insert on public.customers to authenticated`,
  `revoke update on public.customers from authenticated`,
  `grant update (name, phone) on public.customers to authenticated`,
  `revoke all on public.customers from anon`,
  `drop policy if exists "customers_select_own" on public.customers`,
  `create policy "customers_select_own"
    on public.customers
    for select
    to authenticated
    using ((select auth.jwt() ->> 'sub') = user_id and deleted_at is null)`,
  `drop policy if exists "customers_insert_own" on public.customers`,
  `create policy "customers_insert_own"
    on public.customers
    for insert
    to authenticated
    with check ((select auth.jwt() ->> 'sub') = user_id)`,
  `drop policy if exists "customers_update_own" on public.customers`,
  `create policy "customers_update_own"
    on public.customers
    for update
    to authenticated
    using ((select auth.jwt() ->> 'sub') = user_id)
    with check ((select auth.jwt() ->> 'sub') = user_id)`,
];

try {
  for (const statement of statements) {
    await sql.unsafe(statement);
  }

  const tables = await sql`
    select table_schema, table_name
    from information_schema.tables
    where table_schema in ('auth', 'vault')
    order by table_schema, table_name
  `;
  console.log(tables.map((row) => `${row.table_schema}.${row.table_name}`).join("\n"));
  console.log("customers table is ready");
} catch (error) {
  console.error(publicError(error));
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
