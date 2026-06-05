import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Get the authorization header from the request
  const authHeader = request.headers.get('authorization');

  // Verify that it matches Vercel's Cron Secret
  // (In local development we bypass this check)
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Use env variables if present, otherwise fallback to the active project credentials from page.js
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nfahvsssiokaprylfrxv.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mYWh2c3NzaW9rYXByeWxmcnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDg2MDEsImV4cCI6MjA3OTkyNDYwMX0.yiq_rqI7_EDNX3eAnK50pgafFjZICoCrhnf8IStwpKs';

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform a lightweight query to teachers table to keep database active
    const { data, error } = await supabase.from('teachers').select('id').limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase database pinged successfully',
      data: data
    });
  } catch (error) {
    console.error('Cron job error pinging Supabase:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

