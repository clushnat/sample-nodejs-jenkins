const sqlite3 = require('sqlite3').verbose();
const request = require('supertest');
const app = require('../src/app'); // Express 애플리케이션을 export하는 app.js 파일의 경로를 적절히 수정해야 합니다.

let db;

beforeAll(done => {
  db = new sqlite3.Database('.sqlite/database.sqlite', (err) => {
    if (err) {
      return done(err);
    }
    db.serialize(() => {
      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
      db.run(`INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com')`);
      db.run(`INSERT INTO users (name, email) VALUES ('Jane Doe', 'jane@example.com')`, done);
    });
  });
});

afterAll(done => {
  db.close(done);
});

describe('User Routes', () => {
  it('POST /api/users - 사용자 생성', async () => {
    const userData = { name: 'Jahn Dae', email: 'jahn@example.com' };
    const response = await request(app).post('/api/users').send(userData);
    expect(response.statusCode).toBe(201);
  });

  it('GET /api/users - 모든 사용자 조회', async () => {
    const response = await request(app).get('/api/users');
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });

  it('GET /api/users/:id - 유효한 사용자 ID로 사용자 정보 조회', async () => {
    const userId = 1; // 테스트에 사용할 유효한 사용자 ID
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
  });

  it('GET /api/users/:id - 존재하지 않는 사용자 ID로 사용자 정보 조회 시 404 반환', async () => {
    const userId = 9999; // 존재하지 않는 사용자 ID
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.statusCode).toBe(404);
  });

  it('PUT /api/users/:id - 유효한 사용자 ID와 정보로 사용자 정보 업데이트', async () => {
    const userId = 2; // 테스트에 사용할 유효한 사용자 ID
    const newUserDetails = { name: 'Updated Name', email: 'updated@example.com' };
    const response = await request(app).put(`/api/users/${userId}`).send(newUserDetails);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', newUserDetails.name);
    expect(response.body).toHaveProperty('email', newUserDetails.email);
    // 추가적인 속성 검증이 필요할 수 있습니다.
  });

  it('PUT /api/users/:id - 존재하지 않는 사용자 ID로 사용자 정보 업데이트 시 404 반환', async () => {
    const userId = 9999; // 존재하지 않는 사용자 ID
    const newUserDetails = { name: 'Name', email: 'email@example.com' };
    const response = await request(app).put(`/api/users/${userId}`).send(newUserDetails);
    expect(response.statusCode).toBe(404);
  });

  it('DELETE /api/users/:id - 유효한 사용자 ID로 사용자 삭제 시 성공 메시지 반환', async () => {
    const userId = 2; // 테스트에 사용할 유효한 사용자 ID
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.statusCode).toBe(200);
  });

  it('DELETE /api/users/:id - 존재하지 않는 사용자 ID로 사용자 삭제 시 404 반환', async () => {
    const userId = 9999; // 존재하지 않는 사용자 ID
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.statusCode).toBe(404);
  });
});