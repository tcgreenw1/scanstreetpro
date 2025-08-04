import bcrypt from 'bcryptjs';

const storedHash = '$2a$12$LQv3c1yqBwwHgOgm.G8.OeVnKNyGOGE6XBFvyYGE5UqK1L8XJdUKu';

const testPasswords = [
  'AdminPass123!',
  'TestUser123!',
  'Premium123!',
  'password123',
  'admin',
  'test',
  'demo123',
  'scanstreet'
];

console.log('Testing passwords against stored hash...');

for (const password of testPasswords) {
  const match = await bcrypt.compare(password, storedHash);
  console.log(`Password "${password}": ${match ? '✅ MATCH' : '❌ No match'}`);
}
