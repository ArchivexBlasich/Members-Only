#! /usr/bin-env node
// eslint-disable-next-line import/extensions
import '../config.js';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';

console.warn(process.env.DB_URL);

if (!process.env.ADMIN_PASS || !process.env.DB_URL) {
  console.error('Define a ADMIN_PASS and DB_URL env variable');
  process.exit(1);
}

const createRoleTable = `
  CREATE TABLE IF NOT EXISTS role (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL UNIQUE
  );
`;

const createUserTable = `
  CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    firstName VARCHAR ( 100 ) NOT NULL,
    lastName VARCHAR ( 100 ) NOT NULL,
    email VARCHAR ( 150 ) NOT NULL UNIQUE,
    password_hash VARCHAR ( 255 ) NOT NULL,
    role_id INTEGER NOT NULL,
    CONSTRAINT fk_Role_User
      FOREIGN KEY (role_id) 
      REFERENCES role (id)
      ON DELETE RESTRICT
  );
`;

const createMessageTable = `
  CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR ( 255 ) NOT NULL,
    content TEXT NOT NULL,
    publish_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id INTEGER NOT NULL,
    CONSTRAINT fk_User_Message
      FOREIGN KEY (author_id) 
      REFERENCES "user" (id)
      ON DELETE RESTRICT
  );
`;

const insertRoles = `
  INSERT INTO role (name)
  VALUES ('admin'), ('member'), ('non-member')
  ON CONFLICT (name) DO NOTHING; 
`;

const insertAdminQuery = `
  INSERT INTO "user" (firstName, lastName, email, password_hash, role_id)
  VALUES ($1, $2, $3, $4, (SELECT id FROM role WHERE name = $5))
  ON CONFLICT (email) DO NOTHING;
`;

async function main() {
  console.warn('Seeding database...');
  const client = new Client({
    connectionString: process.env.DB_URL,
  });

  try {
    await client.connect();
    console.warn('Client connected. Starting transaction...');

    await client.query('BEGIN');

    console.warn('Creating role table...');
    await client.query(createRoleTable);

    console.warn('Creating user table...');
    await client.query(createUserTable);

    console.warn('Creating message table...');
    await client.query(createMessageTable);

    console.warn('Inserting roles...');
    await client.query(insertRoles);

    console.warn('Inserting admin user...');
    const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASS, 10);
    const adminValues = [
      'Fabricio',
      'Blasich',
      'fblasich0@gmail.com',
      passwordHash,
      'admin',
    ];

    await client.query(insertAdminQuery, adminValues);

    await client.query('COMMIT');
    console.warn('✅ Seeding completed successfully.');
  } catch (err) {
    console.error('❌ Error creating and populating database:', err);
    try {
      console.warn('Rolling back transaction...');
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Critical error during rollback:', rollbackErr);
    }
  } finally {
    await client.end();
    console.warn('Client disconnected.');
  }
}

main();
