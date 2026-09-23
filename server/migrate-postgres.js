const fs=require('fs'),path=require('path');
const {DatabaseSync}=require('node:sqlite');
const {Pool}=require('pg');
const required=process.env.DATABASE_URL;
if(!required){console.error('DATABASE_URL is required. Example: DATABASE_URL=postgresql://... node server/migrate-postgres.js');process.exit(1)}
const root=path.join(__dirname,'..');
const sqliteFile=path.join(root,'data','phoenixgarage.db');
if(!fs.existsSync(sqliteFile)){console.error('Local SQLite database not found:',sqliteFile);process.exit(1)}
const collections=['users','addresses','vehicles','userVehicles','products','orders','sessions','categories','messages','bookings','b2bApplications','b2bCompanies','b2bMembers'];
(async()=>{
 const sdb=new DatabaseSync(sqliteFile);
 const pool=new Pool({connectionString:required,ssl:process.env.PGSSL==='false'?false:{rejectUnauthorized:false}});
 await pool.query(`CREATE TABLE IF NOT EXISTS records(collection TEXT NOT NULL,id INTEGER NOT NULL,payload JSONB NOT NULL,PRIMARY KEY(collection,id)); CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value JSONB NOT NULL); CREATE TABLE IF NOT EXISTS wishlist_items(id INTEGER PRIMARY KEY,owner_type TEXT NOT NULL,owner_id TEXT NOT NULL,product_id INTEGER NOT NULL,created_at TEXT NOT NULL,UNIQUE(owner_type,owner_id,product_id)); CREATE TABLE IF NOT EXISTS cart_items(id INTEGER PRIMARY KEY,owner_type TEXT NOT NULL,owner_id TEXT NOT NULL,product_id INTEGER NOT NULL,qty INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL,UNIQUE(owner_type,owner_id,product_id));`);
 await pool.query('BEGIN');
 try{
   await pool.query('TRUNCATE records, meta, wishlist_items, cart_items');
   for(const c of collections){const rows=sdb.prepare('SELECT id,payload FROM records WHERE collection=? ORDER BY id').all(c);for(const r of rows)await pool.query('INSERT INTO records(collection,id,payload) VALUES($1,$2,$3::jsonb)',[c,r.id,r.payload]);}
   const meta=sdb.prepare('SELECT key,value FROM meta').all();for(const r of meta)await pool.query('INSERT INTO meta(key,value) VALUES($1,$2::jsonb)',[r.key,r.value]);
   for(const r of sdb.prepare('SELECT id,owner_type,owner_id,product_id,created_at FROM wishlist_items ORDER BY id').all())await pool.query('INSERT INTO wishlist_items(id,owner_type,owner_id,product_id,created_at) VALUES($1,$2,$3,$4,$5)',[r.id,r.owner_type,r.owner_id,r.product_id,r.created_at]);
   for(const r of sdb.prepare('SELECT id,owner_type,owner_id,product_id,qty,created_at FROM cart_items ORDER BY id').all())await pool.query('INSERT INTO cart_items(id,owner_type,owner_id,product_id,qty,created_at) VALUES($1,$2,$3,$4,$5,$6)',[r.id,r.owner_type,r.owner_id,r.product_id,r.qty,r.created_at]);
   await pool.query('COMMIT');
   const counts={};for(const c of collections)counts[c]=(await pool.query('SELECT count(*)::int AS n FROM records WHERE collection=$1',[c])).rows[0].n;
   console.log('PostgreSQL migration complete:',counts);
 }catch(e){await pool.query('ROLLBACK');throw e}finally{sdb.close();await pool.end()}
})().catch(e=>{console.error('Migration failed:',e);process.exit(1)});
