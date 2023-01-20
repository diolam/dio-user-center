import { app } from 'egg-mock/bootstrap';

describe('test app/middleware/error.ts', () => {
  it('should return err code', async () => {
    app.mockCsrf();
    app.mockService('user', 'listUsers', function() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.ctx.throw(400, 'Bad Req', { message: 'test' });
    });
    await app.httpRequest()
      .get('/api/v1/user?pageNum=1')
      .expect(400)
      .expect({ message: 'test' });
  });

  it('should return internal server error', async () => {
    app.mockCsrf();
    app.mockService('user', 'listUsers', function() {
      throw Error('test');
    });
    await app.httpRequest()
      .get('/api/v1/user?pageNum=1')
      .expect(500)
      .expect({ message: 'internal server error' });
  });
});
