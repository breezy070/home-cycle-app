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
    // admin endpoint
    const res = await request(app).get('/api/admin/get-interventions')
    expect([401, 403]).toContain(res.status)
  })

  test('returns data with valid cookie token (admin role)', async () => {
    const adminToken = sign({ id: 'abc', role: 'admin' })
    const res = await request(app)
      .get('/api/admin/get-interventions')
      .set('Cookie', [`access_token=${adminToken}; HttpOnly`])

    
    expect([200, 204]).toContain(res.status)
  
    if (res.status === 200) {
      expect(typeof res.body === 'object').toBe(true)
    }
  })
})
