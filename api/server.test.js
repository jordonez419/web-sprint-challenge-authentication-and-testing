// Write your tests here
const request = require("supertest")
const db = require('../data/dbConfig')
const server = require('./server')
const Model = require('../api/auth/Model')
const jokes = require('./jokes/jokes-data')

test('sanity', () => {
  expect(true).toBe(true)
})

const user = {
  "username": 'Juan',
  "password": 'password'
}


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db("users").truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe('[POST] api/auth/register', () => {
  test('new user is registered', async () => {
    let res
    res = await request(server).post("/api/auth/register").send(user)
    expect(res.body.username).toEqual('Juan')
  })
  test('password is hashed', async () => {
    let res = await request(server).post("/api/auth/register").send(user)
    expect(res.body.password.length).toBeGreaterThan(user.password.length)
  })
})

describe('[POST] api/auth/login', () => {
  test('token is returned when user logs in', async () => {
    let register = await request(server).post("/api/auth/register").send(user)
    let login = await request(server).post("/api/auth/login").send(user)
    expect(login.token).toBeTruthy

  })
})

describe("[GET] api/jokes", () => {
  test('returns an array of all the jokes with token', async () => {
    let register = await request(server).post("/api/auth/register").send(user)
    let login = await request(server).post("/api/auth/login").send(user)
    let res = await request(server).get("/api/jokes").set({ 'Authorization': login.token })
    expect(res.body).toMatchObject(jokes)
  })
  test('returns a status code of 401 without token', async () => {
    const res = await request(server).get("/api/jokes")
    expect(res.status).toBe(401)
  })
})