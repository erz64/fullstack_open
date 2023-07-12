const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, curr) => {
    return curr.likes > prev.likes ? curr : prev
  }, blogs[0])
}

const mostBlogs = (blogs) => {
  const amountOfBlogs = lodash.countBy(blogs, (blog) => blog.author)
  let highestAmount = 0
  let authorWithMostBlogs = ""
  entries = Object.entries(amountOfBlogs)
  for ([author, amount] of entries){
    if (amount > highestAmount){
      highestAmount = amount
      authorWithMostBlogs = author
    }
  }
    return {
      author: authorWithMostBlogs,
      blogs: highestAmount
    }
}

const mostLikes = (blogs) => {
  const likeCounter = {}
  lodash.forEach(blogs, (blog) => {
    if (blog.author in likeCounter) {
      likeCounter[blog.author] += blog.likes
    } else {
      likeCounter[blog.author] = blog.likes
    }
  })

  let highestLikes = 0
  let authorWithMostLikes = ""
  entries = Object.entries(likeCounter)
  for ([author, likes] of entries){
    if (likes > highestLikes){
      highestLikes = likes
      authorWithMostLikes = author
    }
  }
    return {
      author: authorWithMostLikes,
      likes: highestLikes
    }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}