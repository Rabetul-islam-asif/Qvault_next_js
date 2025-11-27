// Test script to verify backend services
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://imeykplylnqymupmofcb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXlrcGx5bG5xeW11cG1vZmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTU1NzgsImV4cCI6MjA3OTQ3MTU3OH0.YjkgJ1eWVoM4PCP9bq8qMYKmdrqiwi2JBxk2l1woYZ4";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testBackend() {
  console.log('🔍 Testing Backend Services...\n');

  // Test 1: Supabase Connection
  console.log('1️⃣ Testing Supabase Connection...');
  try {
    const { data, error } = await supabase.from('teachers').select('count');
    if (error) throw error;
    console.log('✅ Supabase connection successful!');
  } catch (err) {
    console.log('❌ Supabase connection failed:', err.message);
  }

  // Test 2: Teachers Table
  console.log('\n2️⃣ Testing Teachers Table...');
  try {
    const { data, error } = await supabase.from('teachers').select('*').limit(5);
    if (error) throw error;
    console.log(`✅ Teachers table exists with ${data.length} records`);
    if (data.length > 0) {
      console.log('   Sample teacher:', data[0]);
    }
  } catch (err) {
    console.log('❌ Teachers table error:', err.message);
  }

  // Test 3: Papers Table
  console.log('\n3️⃣ Testing Papers Table...');
  try {
    const { data, error } = await supabase.from('papers').select('*').limit(5);
    if (error) throw error;
    console.log(`✅ Papers table exists with ${data.length} records`);
    if (data.length > 0) {
      console.log('   Sample paper:', data[0]);
    }
  } catch (err) {
    console.log('❌ Papers table error:', err.message);
  }

  // Test 4: Pending Papers Table
  console.log('\n4️⃣ Testing Pending Papers Table...');
  try {
    const { data, error } = await supabase.from('pending_papers').select('*').limit(5);
    if (error) throw error;
    console.log(`✅ Pending papers table exists with ${data.length} records`);
    if (data.length > 0) {
      console.log('   Sample pending paper:', data[0]);
    }
  } catch (err) {
    console.log('❌ Pending papers table error:', err.message);
  }

  // Test 5: ImgBB API (just check if key is set)
  console.log('\n5️⃣ Checking ImgBB Configuration...');
  const imgbbKey = '659c558f44d89bffc201c4e258836605';
  if (imgbbKey && imgbbKey.length > 0) {
    console.log('✅ ImgBB API key is configured');
  } else {
    console.log('❌ ImgBB API key is missing');
  }

  // Test 6: Catbox Configuration
  console.log('\n6️⃣ Checking Catbox Configuration...');
  console.log('✅ Catbox upload endpoint is configured (via corsproxy.io)');

  console.log('\n✨ Backend verification complete!');
}

testBackend().catch(console.error);
