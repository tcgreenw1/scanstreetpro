import bcrypt from 'bcryptjs';

const passwords = {
  'admin@scanstreetpro.com': 'AdminPass123!',
  'test@springfield.gov': 'TestUser123!',
  'premium@springfield.gov': 'Premium123!'
};

console.log('Generating password hashes...');

for (const [email, password] of Object.entries(passwords)) {
  const hash = await bcrypt.hash(password, 12);
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = '${email}';`);
}
