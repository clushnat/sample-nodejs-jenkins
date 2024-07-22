const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '.sqlite/database.sqlite', // SQLite 데이터베이스 파일 경로
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델을 여기에 불러오고 초기화합니다.
db.User = require('./user')(sequelize, Sequelize);

module.exports = db;