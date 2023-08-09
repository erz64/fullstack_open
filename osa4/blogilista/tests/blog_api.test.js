const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs all returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog identifier should be defined as id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "1984",
    author: "George Orwell",
    url: "ok",
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogs.map(b => b.title)
  expect(titles).toContain('1984')
})

test('when adding a blog with no likes variable likes is set to 0', async () => {
  const newBlog = {
    title: "1984",
    author: "George Orwell",
    url: "ok",
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogs = await helper.blogsInDb()
  expect(blogs[helper.initialBlogs.length].likes).toBe(0)
})

test('when adding a blog with no url and title its not added', async () => {
  const newBlog = {
    author: "George Orwell",
    likes: 4
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length)
})

test('an existing blog can be removed', async () => {
  
  await api
    .delete(`/api/blogs/${helper.initialBlogs[0]._id}`)
    .expect(204)

  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length-1)
})

test('an existing blog can be modified', async () => {
  blogEdit = {...helper.initialBlogs[0], likes: 2}
  await api
    .put(`/api/blogs/${helper.initialBlogs[0]._id}`)
    .send(blogEdit)
  
  const blogs = await helper.blogsInDb()
  expect(blogs[0].likes).toBe(blogEdit.likes)
})


afterAll(async () => {
  await mongoose.connection.close()
})