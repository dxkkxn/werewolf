const app = require('../app');
const request = require('supertest');
const status = require("http-status");

describe('', () => {
  test('create users', async () => {
    const response = await request(app)
      .post('/signin');
    expect(response.statusCode).toBe(status.BAD_REQUEST)
  })
})




// let token
// // getToken of test user by default in the db
// describe('GET /api/getjwtDeleg/test', () => {
//   test('Get token of test user a valid token', async() => {
//     const response = await request(app)
//       .get('/api/getjwtDeleg/test')
//     expect(response.statusCode).toBe(200)
//     expect(response.body.message).toBe("Returning token")
//     token = response.body.accessToken
//     expect(token).not.toBeNull()
//     expect(jws.verify(token, 'HS256', TOKENSECRET)).toBe(true)
//   })
// })


// // token of test user by default in the database
// describe('GET /bmt/test/tags', () => {
//   test('Test get tags of user test', async () => {
//     const response = await request(app)
//       .get('/bmt/test/tags')
//       .set({'x-access-token' : token})
//     expect(response.statusCode).toBe(200)
//     expect(response.body.message).toBe('Returning tags')
//     expect(response.body.data.length).toBe(1)
//   })
// })


// // get with a not existing user
// describe('GET /bmt/test0/tags', () => {
//   test('Test get tags of user test', async () => {
//     const response = await request(app)
//       .get('/bmt/test0/tags')
//       .set({'x-access-token' : token})
//     expect(response.statusCode).toBe(status.FORBIDDEN)
//   })
// })

// // create tag
// describe('POST /bmt/test/tags', () => {
//   test('create tag', async () => {
//     const response = await request(app)
//       .post('/bmt/test/tags')
//       .set({'x-access-token' : token})
//       .send({'data' : '{"name": "tag-test2"}'})
//     expect(response.statusCode).toBe(status.CREATED)
//     expect(response.body.message).toBe('Tag added')
//   })
// })

// // create same tag
// describe('POST /bmt/test/tags', () => {
//   test('create tag', async () => {
//     const response = await request(app)
//       .post('/bmt/test/tags')
//       .set({'x-access-token' : token})
//       .send({'data' : '{"name": "tag-test2"}'})
//     expect(response.statusCode).toBe(status.NOT_MODIFIED)
//   })
// })

// //PUT : CR405
// describe('PUT /bmt/test/tags', ()=> {
//   test('put tags shoud return Error 405', async () => {
//       const response = await request(app)
//         .put('/bmt/test/tags')
//       expect(response.statusCode).toBe(status.METHOD_NOT_ALLOWED)
//   })
// })
// //DELETE : CR405
// describe('DELETE /bmt/test/tags', ()=> {
//   test('delet tags shoud return Error 405', async () => {
//       const response = await request(app)
//         .delete('/bmt/test/tags')
//     expect(response.statusCode).toBe(status.METHOD_NOT_ALLOWED)
//   })
// })


// // get tag info
// describe('GET /bmt/test/tags/1', () => {
//   test('get tag 1 info', async () => {
//     const response = await request(app)
//       .get('/bmt/test/tags/1')
//       .set({'x-access-token' : token})
//     expect(response.statusCode).toBe(200)
//     expect(response.body.message).toBe('Returning tag info')
//   })
// })

// // post tag
// describe('POST /bmt/test/tags/2', () => {
//   test('post tag', async () => {
//     const response = await request(app)
//       .post('/bmt/test/tags/2')
//       .set({'x-access-token' : token})
//     expect(response.statusCode).toBe(405)
//   })
// })

// // put tag
// describe('put /bmt/test/tags/2', () => {
//   test('put tag', async () => {
//     const response = await request(app)
//       .put('/bmt/test/tags/2')
//       .set({'x-access-token' : token})
//       .send({'data' : '{"name": "tag-test2-bis"}'})
//     expect(response.statusCode).toBe(status.OK)
//   })
// })

// // put tag not existing
// describe('put /bmt/test/tags/3', () => {
//   test('put tag', async () => {
//     const response = await request(app)
//       .put('/bmt/test/tags/3')
//       .set({'x-access-token' : token})
//       .send({'data' : '{"name": "tag-test2-bis"}'})
//     expect(response.statusCode).toBe(status.FORBIDDEN)
//   })
// })

// // deleting tag-test2
// describe('delete /bmt/test/tags/2', () => {
//   test('delete tag', async () => {
//     const response = await request(app)
//       .delete('/bmt/test/tags/2')
//       .set({'x-access-token' : token})
//     expect(response.statusCode).toBe(status.OK)
//   })
// })

// // re deleting tag-test2
// describe('delete /bmt/test/tags/2', () => {
//   test('delete tag', async () => {
//     const response = await request(app)
//       .delete('/bmt/test/tags/2')
//       .set({'x-access-token' : token})
//     expect(response.statusCode).toBe(status.FORBIDDEN)
//   })
// })

// // get tag info not existing tag
// describe('GET /bmt/test/tags/2', () => {
//   test('get tag 1 info', async () => {
//     const response = await request(app)
//       .get('/bmt/test/tags/2')
//       .set({'x-access-token' : token})
//     expect(response.statusCode).toBe(404)
//     expect(response.body.message).toBe('Tag not found')
//   })
// })
