import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import app from '../index.js'

let mongod

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' })
}

describe('Protected routes', () => {
  test('requires auth', async () => {
    // hit the same admin endpoint you saw in logs
    const res = await request(app).get('/api/admin/get-interventions')
    expect([401, 403]).toContain(res.status)
  })

  test('returns data with valid cookie token (admin role)', async () => {
    const adminToken = sign({ id: 'abc', role: 'admin' })
    const res = await request(app)
      .get('/api/admin/get-interventions')
      .set('Cookie', [`access_token=${adminToken}; HttpOnly`])

    // could be 200 (with body) or 204 (no content) depending on your controller
    expect([200, 204]).toContain(res.status)
    // If 200, body is typically an array/object; skip if 204
    if (res.status === 200) {
      expect(typeof res.body === 'object').toBe(true)
    }
  })
})
