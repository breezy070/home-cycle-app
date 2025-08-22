import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import app from '../index.js'

// ⬇️ Make sure these paths match your project
import User from '../models/userModel.js'
import Technician from '../models/technicianModel.js'
import Admin from '../models/adminModel.js'

let mongod

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoose.connect(uri)
  await Promise.all([User.init(), Technician.init?.(), Admin.init?.()])
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase()
  await Promise.all([User.init(), Technician.init?.(), Admin.init?.()])
})

async function seedUserDoc({ email, password, role = 'user', withAddress = true }) {
  const doc = {
    email,
    password: await bcrypt.hash(password, 10),
    role,
    first_name: 'Test',
    last_name: 'User',
  }
  if (withAddress) doc.address = { addressString: '1 Rue de Test, Paris' }
  return User.create(doc)
}

async function seedTechnicianDoc({ email, password }) {
  // minimal fields your signupTechnician uses: first_name, last_name, email, password
  return Technician.create({
    first_name: 'Tech',
    last_name: 'Nician',
    email,
    password: await bcrypt.hash(password, 10),
    // if your Technician schema has role, set it explicitly:
    role: 'technician',
  })
}

async function seedAdminDoc({ email, password }) {
  return Admin.create({
    first_name: 'Ada',
    last_name: 'Min',
    email,
    password: await bcrypt.hash(password, 10),
    role: 'admin',
  })
}

describe('Auth API (signin per role)', () => {
  test('user signin → 200 + cookie', async () => {
    const email = 'u@example.com'
    const pass = 'secret123'
    await seedUserDoc({ email, password: pass })

    const res = await request(app).post('/api/auth/signin').send({ email, password: pass })
    expect(res.status).toBe(200)
    const cookies = res.headers['set-cookie'] || []
    expect(cookies.find(c => c.startsWith('access_token='))).toBeDefined()
  })

  test('technician signin → 200 + cookie', async () => {
    const email = 't@example.com'
    const pass = 'secret123'
    await seedTechnicianDoc({ email, password: pass })

    const res = await request(app).post('/api/auth/signin/technician').send({ email, password: pass })
    expect(res.status).toBe(200)
    const cookies = res.headers['set-cookie'] || []
    expect(cookies.find(c => c.startsWith('access_token='))).toBeDefined()
  })

  test('admin signin → 200 + cookie', async () => {
    const email = 'a@example.com'
    const pass = 'secret123'
    await seedAdminDoc({ email, password: pass })

    const res = await request(app).post('/api/auth/signin/admin').send({ email, password: pass })
    expect(res.status).toBe(200)
    const cookies = res.headers['set-cookie'] || []
    expect(cookies.find(c => c.startsWith('access_token='))).toBeDefined()
  })

  test('wrong password (user) → 400/401/403/404', async () => {
    const email = 'u2@example.com'
    await seedUserDoc({ email, password: 'correct123' })

    const res = await request(app).post('/api/auth/signin').send({ email, password: 'wrong' })
    expect([400, 401, 403, 404]).toContain(res.status)
  })
})
