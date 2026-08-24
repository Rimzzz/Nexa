import { hash } from 'bcrypt';

async function createDemoUser() {
  const password = 'admin123';
  const hashedPassword = await hash(password, 10);
  console.log(`INSERT INTO users (username, password, role, full_name) VALUES ('admin@nexa.local', '${hashedPassword}', 'admin', 'Administrator');`);
}

createDemoUser();
