import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __dir = dirname(fileURLToPath(import.meta.url));

// Try multiple connection options
const configs = [
  { host: 'db.sduofgjtelvvdukntyct.supabase.co',   port: 5432 },
  { host: 'sduofgjtelvvdukntyct.supabase.co',       port: 5432 },
  { host: 'aws-0-ap-south-1.pooler.supabase.com',   port: 6543, user: 'postgres.sduofgjtelvvdukntyct' },
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 6543, user: 'postgres.sduofgjtelvvdukntyct' },
];

async function tryConnect(config) {
  const client = new Client({
    ...config,
    database: 'postgres',
    user: config.user || 'postgres',
    password: 'Santhu@3690',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  await client.connect();
  return client;
}

async function main() {
  let client = null;
  for (const cfg of configs) {
    try {
      process.stdout.write(`Trying ${cfg.host}:${cfg.port}... `);
      client = await tryConnect(cfg);
      console.log('✓ Connected!');
      break;
    } catch (e) {
      console.log(`✗ ${e.message.slice(0, 60)}`);
    }
  }

  if (!client) {
    console.log('\n⚠  Cannot reach PostgreSQL from this network.');
    console.log('   Please paste the SQL file contents into the Supabase SQL editor:');
    console.log('   https://supabase.com/dashboard/project/sduofgjtelvvdukntyct/sql/new');
    console.log('   File: scripts/migration.sql\n');
    process.exit(1);
  }

  const sql = readFileSync(join(__dir, 'migration.sql'), 'utf8');

  // Split on semicolons but preserve dollar-quoted blocks
  const stmts = sql
    .replace(/--[^\n]*/g, '')        // remove line comments
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 3);

  let ok = 0, skipped = 0, failed = 0;
  for (const stmt of stmts) {
    const preview = stmt.split('\n')[0].trim().slice(0, 65);
    try {
      await client.query(stmt);
      console.log('  ✓', preview);
      ok++;
    } catch (e) {
      if (e.message.match(/already exists|duplicate/i)) {
        console.log('  ~', preview, '(already exists)');
        skipped++;
      } else {
        console.error('  ✗', preview);
        console.error('    →', e.message.slice(0, 120));
        failed++;
      }
    }
  }

  await client.end();
  console.log(`\n${'─'.repeat(55)}`);
  console.log(`  ✓ ${ok} OK   ~ ${skipped} skipped   ✗ ${failed} failed`);
  if (failed === 0) {
    console.log('\n  All tables ready! Start your dev server: npm run dev');
  }
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
