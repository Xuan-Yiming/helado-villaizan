import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
const client = await db.connect();

import { 
    SocialAccount,
    Post,
    Encuesta,
    Question,
    Response as _Response,
    Answer
 } from '@/app/lib/types';




async function seedDatabase() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // Create SocialAccount table
  // await client.sql`
  //   CREATE TABLE IF NOT EXISTS social_accounts (
  //     id SERIAL PRIMARY KEY,
  //     red_social VARCHAR(255) NOT NULL,
  //     usuario VARCHAR(255),
  //     tipo_autenticacion VARCHAR(255) NOT NULL,
  //     page_id VARCHAR(255),
  //     open_id VARCHAR(255),
  //     refresh_token TEXT,
  //     token_autenticacion TEXT NOT NULL,
  //     instagram_business_account VARCHAR(255),
  //     fecha_expiracion_token TIMESTAMP,
  //     fecha_expiracion_refresh TIMESTAMP,
  //     linked BOOLEAN
  //   );
  // `;

  // // Create Post table
  // await client.sql`
  //   CREATE TABLE IF NOT EXISTS posts (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     social_media VARCHAR(255) NOT NULL,
  //     type VARCHAR(255) NOT NULL,
  //     status VARCHAR(255) NOT NULL,
  //     preview TEXT,
  //     media TEXT,
  //     content TEXT,
  //     post_time TIMESTAMP,
  //     link TEXT,
  //     is_programmed BOOLEAN NOT NULL,
  //     programmed_post_time TIMESTAMP
  //   );
  // `;

  // // Create Encuesta table
  // await client.sql`
  //   CREATE TABLE IF NOT EXISTS encuestas (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     title VARCHAR(255) NOT NULL,
  //     description TEXT,
  //     status VARCHAR(255) NOT NULL,
  //     start_date TIMESTAMP NOT NULL,
  //     end_date TIMESTAMP NOT NULL
  //   );
  // `;

  // // Create Question table
  // await client.sql`
  //   CREATE TABLE IF NOT EXISTS questions (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     encuesta_id UUID REFERENCES encuestas(id),
  //     title VARCHAR(255) NOT NULL,
  //     type VARCHAR(255) NOT NULL,
  //     required BOOLEAN,
  //     options TEXT[]
  //   );
  // `;

  // // Create Response table
  // await client.sql`
  //   CREATE TABLE IF NOT EXISTS responses (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     encuesta_id UUID REFERENCES encuestas(id),
  //     date TIMESTAMP NOT NULL
  //   );

  //   ALTER TABLE responses
  //     ADD COLUMN ip VARCHAR(45) NOT NULL;
  // `;

  // // Create Answer table
  // await client.sql`
  //   CREATE TABLE IF NOT EXISTS answers (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     response_id UUID REFERENCES responses(id),
  //     question_id UUID REFERENCES questions(id),
  //     answer TEXT NOT NULL
  //   );
  // `;

  // Insert initial data (example)
//   await client.sql`
//     INSERT INTO social_accounts (red_social,usuario, tipo_autenticacion, token_autenticacion)
//     VALUES ('facebook','Helado-FB', 'oauth', 'some-token');
//   `;
//   await client.sql`
//   INSERT INTO social_accounts (red_social,usuario, tipo_autenticacion, token_autenticacion)
//   VALUES ('instagram','Helado-IG', 'oauth', 'some-token');
// `;
// await client.sql`
// INSERT INTO social_accounts (red_social,usuario, tipo_autenticacion, token_autenticacion)
// VALUES ('tiktok','Helado-tk', 'oauth', 'some-token');
// `;

  // await client.sql`
  //   INSERT INTO posts (social_media, type, status, is_programmed)
  //   VALUES ('facebook', 'video', 'publicado', false);
  // `;

  // await client.sql`
  //   INSERT INTO encuestas (title, status, start_date, end_date)
  //   VALUES ('Customer Satisfaction Survey', 'active', NOW(), NOW() + INTERVAL '1 month');
  // `;

  console.log('Database seeded successfully');
}

export async function GET() {
    try {
      await client.sql`BEGIN`;
      await seedDatabase();
      await client.sql`COMMIT`;
      return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
      await client.sql`ROLLBACK`;
      return Response.json({ error }, { status: 500 });
    }
  }