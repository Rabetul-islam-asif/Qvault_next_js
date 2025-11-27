import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://imeykplylnqymupmofcb.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXlrcGx5bG5xeW11cG1vZmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTU1NzgsImV4cCI6MjA3OTQ3MTU3OH0.YjkgJ1eWVoM4PCP9bq8qMYKmdrqiwi2JBxk2l1woYZ4"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function testSupabase() {
  console.log('Testing Supabase Connection...\n')
  
  // Test 1: Teachers table
  console.log('1. Testing teachers table...')
  const { data: teachers, error: teachersError } = await supabase.from('teachers').select('*')
  if (teachersError) {
    console.log('❌ Teachers Error:', teachersError)
  } else {
    console.log('✅ Teachers:', teachers?.length || 0, 'records')
    if (teachers && teachers.length > 0) {
      console.log('   Sample:', JSON.stringify(teachers[0], null, 2))
    }
  }
  
  // Test 2: Papers table
  console.log('\n2. Testing papers table...')
  const { data: papers, error: papersError } = await supabase.from('papers').select('*')
  if (papersError) {
    console.log('❌ Papers Error:', papersError)
  } else {
    console.log('✅ Papers:', papers?.length || 0, 'records')
    if (papers && papers.length > 0) {
      console.log('   Sample:', JSON.stringify(papers[0], null, 2))
    }
  }
  
  // Test 3: Pending papers table
  console.log('\n3. Testing pending_papers table...')
  const { data: pending, error: pendingError } = await supabase.from('pending_papers').select('*')
  if (pendingError) {
    console.log('❌ Pending Papers Error:', pendingError)
  } else {
    console.log('✅ Pending Papers:', pending?.length || 0, 'records')
  }
  
  console.log('\n--- Test Complete ---')
}

testSupabase().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
