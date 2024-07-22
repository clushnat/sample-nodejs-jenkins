const app = require('./src/app'); // app.js의 경로가 프로젝트의 구조에 따라 다를 수 있습니다.
const db = require('./src/models'); // Sequelize 설정이 포함된 파일의 경로

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function gracefulShutdown(signal) {
  console.log(`${signal} received, shutting down gracefully.`);
  server.close(async () => {
    console.log('HTTP server closed.');

    try {
      await db.sequelize.close(); // Sequelize 연결 종료
      console.log('Sequelize connection closed.');
    } catch (error) {
      console.error('Error closing Sequelize connection:', error);
    }

    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
