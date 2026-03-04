import app from './app';
import { config } from './config/env';
import prisma from './config/db';

const PORT = config.server.port;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${config.server.env}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔑 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`📚 Subjects endpoints: http://localhost:${PORT}/api/subjects`);
      console.log(`🎥 Videos endpoints: http://localhost:${PORT}/api/videos`);
      console.log(`📊 Progress endpoints: http://localhost:${PORT}/api/progress`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
