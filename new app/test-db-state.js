import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwoeeejaxmwvxggcpchw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53b2VlZWpheG13dnhnZ2NwY2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NDMzNjUsImV4cCI6MjA1NDAyMDM2NX0.ht51w2gBJOdGPZPDyh6A7WaTVCGvNpJAQe8-BVV3z2c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('Testing database state...');
  
  try {
    // Check organizations
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('*');
    
    console.log('Organizations:', orgs?.length || 0);
    if (orgs && orgs.length > 0) {
      console.log('Sample org:', orgs[0]);
    }
    
    // Check users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*');
    
    console.log('Users:', users?.length || 0);
    if (users && users.length > 0) {
      console.log('Sample user:', users[0]);
    }
    
    if (orgError) console.error('Org error:', orgError);
    if (userError) console.error('User error:', userError);
    
  } catch (error) {
    console.error('Database test error:', error);
  }
}

testDatabase();
