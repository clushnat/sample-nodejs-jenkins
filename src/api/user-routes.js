/**
 * @openapi
 * /users:
 *   post:
 *     summary: 사용자 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: 사용자 생성 성공
 *       500:
 *         description: 서버 에러
 *   get:
 *     summary: 모든 사용자 조회
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: 서버 에러
 * /users/{id}:
 *   get:
 *     summary: 사용자 정보 조회
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 *   put:
 *     summary: 사용자 정보 업데이트
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 사용자 정보 업데이트 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 *   delete:
 *     summary: 사용자 삭제
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 */

const express = require('express');
const { createUser, getAllUsers, getUser, updateUser, deleteUser, patchUser } = require('../services/user-service');

const router = express.Router();

// POST /users
router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await createUser(name, email);
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET /users
router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET /users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await getUser(id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT /users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, email } = req.body;
    if (isNaN(id)) {
      return res.status(400).send('Invalid user ID');
    }
    console.log(id, name, email);
    const user = await updateUser(id, name, email);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// DELETE /users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send('Invalid user ID');
    }
    const { name, email } = req.body;
    const user = await updateUser(id, name, email);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;

