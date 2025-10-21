// src/lib/server/env.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // load once for the server (dev)

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
