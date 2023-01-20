import assert from 'assert';
import { app } from 'egg-mock/bootstrap';
import { UserResponse } from '../../../app/model/dto/UserResponse';

describe('test/app/controller/user.test.ts', () => {
  describe('GET /api/v1/user', () => {
    it('none throw error', async () => {
      app.mockCsrf();
      app.mockService('user', 'listUsers', function() {
        assert(false);
      });
      await app.httpRequest()
        .get('/api/v1/user')
        .expect(422);
    });

    it('wrong throw error', async () => {
      app.mockCsrf();
      app.mockService('user', 'listUsers', function() {
        assert(false);
      });
      await app.httpRequest()
        .get('/api/v1/user?pageNum=p')
        .expect(422);
    });

    it('success', async () => {
      app.mockCsrf();
      const user: UserResponse = { id: 2, name: '丢乐', username: 'diolam', gender: 0, createTime: new Date() };
      app.mockService('user', 'listUsers', function(pageNum: number) {
        assert(pageNum === 3);
        return [ user ];
      });
      await app.httpRequest()
        .get('/api/v1/user?pageNum=3')
        .expect(200)
        .expect(JSON.parse(JSON.stringify([ user ])));
    });
  });

  describe('GET /api/v1/user/:id', () => {
    it('none throw error', async () => {
      app.mockCsrf();
      app.mockService('user', 'getUserById', function() {
        assert(false);
      });
      await app.httpRequest()
        .get('/api/v1/user/')
        .expect(422);
    });

    it('wrong throw error', async () => {
      app.mockCsrf();
      app.mockService('user', 'getUserById', function() {
        assert(false);
      });
      await app.httpRequest()
        .get('/api/v1/user/p')
        .expect(422);
    });

    it('unexpect', async () => {
      app.mockCsrf();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user: UserResponse = { id: 2, name: '丢乐', username: 'diolam', gender: 0 };
      app.mockService('user', 'getUserById', function() {
        return user;
      });
      await app.httpRequest()
        .get('/api/v1/user/3')
        .expect(500);
    });

    it('success', async () => {
      app.mockCsrf();
      const user: UserResponse = { id: 2, name: '丢乐', username: 'diolam', gender: 0, createTime: new Date() };
      app.mockService('user', 'getUserById', function(id: number) {
        assert(id === 3);
        return user;
      });
      await app.httpRequest()
        .get('/api/v1/user/3')
        .expect(200)
        .expect(JSON.parse(JSON.stringify(user)));
    });
  });
});
