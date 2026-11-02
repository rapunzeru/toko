import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema', // Mengarah ke folder multi-file skema Anda
  datasource: {
    url: env('DIRECT_URL'), // Menggunakan DIRECT_URL untuk migrasi ke Supabase
  },
});