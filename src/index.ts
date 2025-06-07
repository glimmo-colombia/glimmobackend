import { buildApp } from './app';

const app = buildApp();

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log('🚀 Server running on http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();