const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  const user = new User({
    username: "erz",
    name: "eero",
    password: "salainen"
  })
  await User.deleteMany({})
  await user.save()
})

describe('when creating a user', () => {
  test('with nonunique username it is not created', async () => {
    usersAtStart = await helper.usersInDb()

    const user = {
      username: "erz",
      name: "eero",
      password: "salainen",
    }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('with a too short password it is not created', async () => {
    usersAtStart = await helper.usersInDb()

    const user = {
      username: "erz",
      name: "eero",
      password: "ok"
    }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password too short')

    usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})