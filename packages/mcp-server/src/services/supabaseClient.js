const { createClient } = require('@supabase/supabase-js');

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function ensureSchema() {
  const sb = getClient();
  if (!sb) throw new Error('Supabase credentials missing (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)');

  // Create tables via SQL - idempotent with IF NOT EXISTS
  const sql = `
  create table if not exists isrc_registry (
    id uuid primary key default gen_random_uuid(),
    isrc varchar not null unique,
    track_title varchar,
    artist_name varchar,
    country_code varchar(2),
    registrant_code varchar(3),
    year varchar(2),
    designation_code varchar(5),
    generated_at timestamptz default now(),
    used boolean default false,
    professional_service boolean default false,
    created_by varchar,
    metadata jsonb,
    created_at timestamptz default now()
  );

  create table if not exists credit_ledger (
    id uuid primary key default gen_random_uuid(),
    wallet varchar not null,
    delta numeric not null,
    reason varchar,
    meta jsonb,
    created_at timestamptz default now()
  );
  `;

  const { error } = await sb.rpc('sql', { sql }).catch(() => ({ error: new Error('sql rpc not available') }));
  // Some Supabase projects may not allow rpc(sql) - fallback to using query via from
  if (error) {
    // try simple table creation via Postgres direct query using sb.from('...').insert() is not applicable.
    // As a fallback, attempt to run via REST endpoint
    const resp = await sb.post('/rest/v1/rpc', { sql }).catch(() => null);
    if (!resp) throw new Error('Failed to create schema via Supabase client: ' + (error && error.message));
  }

  return true;
}

module.exports = { getClient, ensureSchema };
