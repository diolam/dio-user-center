import assert from 'assert';
import { Context, IService } from 'egg';
import { app } from 'egg-mock/bootstrap';
import { Gender, UserStatus } from '../../../app/model/entity/User';
import { UserPayload } from '../../../app/model/entity/UserPayload';

describe('test/app/service/user.test.js', () => {
  let ctx: Context;
  let userService: IService['user'];

  before(async () => {
    ctx = app.mockContext();
    userService = ctx.service.user;
  });

  describe('test User.listUsers', () => {
    it('success', async () => {
      const result = await userService.listUsers(1);
      assert(result.length > 0);
    });

    it('invalid pageNum', async () => {
      let success = false;
      try {
        await userService.listUsers(-1);
      } catch (e) { success = true; assert((e as Error).message.includes('pageNum')); } finally { assert(success); }
    });

    it('not found', async () => {
      let success = false;
      try {
        await userService.listUsers(1000);
      } catch (e) { success = true; assert((e as Error).message.includes('not found')); } finally { assert(success); }
    });
  });

  describe('test User.getUserById', () => {
    it('success', async () => {
      await userService.getUserById(1);
    });

    it('invalid', async () => {
      let success = false;
      try {
        await userService.getUserById(-1);
      } catch (e) { success = true; assert((e as Error).message.includes('id')); } finally { assert(success); }
    });

    it('not found', async () => {
      let success = false;
      try {
        await userService.getUserById(100000);
      } catch (e) { success = true; assert((e as Error).message.includes('not found')); } finally { assert(success); }
    });
  });

  describe('test User.getUserByUsername', () => {
    it('success', async () => {
      await userService.getUserByUsername('diolam');
    });

    it('invalid', async () => {
      let success = false;
      try {
        await userService.getUserByUsername('a');
      } catch (e) { success = true; assert((e as Error).message.includes('username')); } finally { assert(success); }
    });

    it('not found', async () => {
      let success = false;
      try {
        await userService.getUserByUsername('notfound');
      } catch (e) { success = true; assert((e as Error).message.includes('not found')); } finally { assert(success); }
    });
  });

  describe('test User.getUserByUsername', () => {
    it('success', async () => {
      const user = {
        name: '测试',
        username: 'testcase',
        gender: Gender.male,
        userStatus: UserStatus.available,
      };
      const operator = await userService.getUserByUsername('diolam');
      let result: number;
      try {
        result = await userService.createUser(user, '123456', operator);
      } finally {
        await ctx.app.mysql.delete('user', { username: 'testcase' });
      }
      assert(result !== 0);
    });

    it('permission denied', async () => {
      const user = {
        name: '测试',
        username: 'testcase',
        gender: Gender.male,
        userStatus: UserStatus.available,
      };
      let success = false;
      const operator = await userService.getUserByUsername('lisi');
      try {
        await userService.createUser(user, '123456', operator);
      } catch (e) { success = true; assert((e as Error).message.includes('denied')); } finally { assert(success); }
    });

    it('duplicated username', async () => {
      const user = {
        name: '测试',
        username: 'lisi',
        gender: Gender.male,
        userStatus: UserStatus.available,
      };
      let success = false;
      const operator = await userService.getUserByUsername('diolam');
      try {
        await userService.createUser(user, '123456', operator);
      } catch (e) { success = true; assert((e as Error).message.includes('duplicated')); } finally { assert(success); }
    });

    it('invalid username', async () => {
      const user = {
        name: '测试',
        username: 'invalidusernameinvalidusernameinvalidusernameinvalidusername',
        gender: Gender.male,
        userStatus: UserStatus.available,
      };
      let success = false;
      const operator = await userService.getUserByUsername('diolam');
      try {
        await userService.createUser(user, '123456', operator);
      } catch (e) { success = true; assert((e as Error).message.includes('username')); } finally { assert(success); }
    });

    it('invalid password', async () => {
      const user = {
        name: '测试',
        username: 'testcase',
        gender: Gender.male,
        userStatus: UserStatus.available,
      };
      let success = false;
      const operator = await userService.getUserByUsername('diolam');
      try {
        await userService.createUser(user, '1', operator);
      } catch (e) { success = true; assert((e as Error).message.includes('password')); } finally { assert(success); }
    });
  });

  describe('test User.verifyUser', () => {
    it('test User.verifyUser fail', async () => {
      let success = false;
      const lisi = await userService.getUserByUsername('lisi');
      try {
        await userService.verifyUser(lisi, '456');
      } catch (e) { success = true; assert((e as Error).message.includes('incorrect')); } finally { assert(success); }
    });

    it('success', async () => {
      const lisi = await userService.getUserByUsername('lisi');
      await userService.verifyUser(lisi, '123456');
    });

    it('success', async () => {
      const userreq = {
        name: '测试',
        username: 'testcase',
        gender: Gender.male,
        userStatus: UserStatus.available,
      };
      const operator = await userService.getUserByUsername('diolam');
      await userService.createUser(userreq, '123456', operator);
      const user = await userService.getUserByUsername('testcase');
      try {
        await userService.verifyUser(user, '123456');
      } finally {
        await ctx.app.mysql.delete('user', { username: 'testcase' });
      }
    });

    it('invalid user', async () => {
      const userreq = {
        name: '测试',
        username: 'testcase',
        gender: Gender.male,
        userStatus: UserStatus.available,
      };
      const operator = await userService.getUserByUsername('diolam');
      await userService.createUser(userreq, '123456', operator);
      const user = await userService.getUserByUsername('testcase');
      user.salt = undefined;

      let success = false;
      try {
        await userService.verifyUser(user, '123456');
      } catch (e) { success = true; assert((e as Error).message.includes('user')); } finally {
        assert(success);
        await ctx.app.mysql.delete('user', { username: 'testcase' });
      }
    });
  });

  describe('test User.getUserById', () => {
    it('success', async () => {
      const token = await userService.userLogin('diolam', '123456');
      const value = app.jwt.verify(token, app.config.jwt.secret) as unknown as UserPayload;
      assert(value.id === 2);
    });

    it('unexpect', async () => {
      let success = false;
      app.mockService('user', 'getUserByUsername', function() { return {}; });
      try {
        await userService.userLogin('diolam', '123456');
      } catch (e) { success = true; assert((e as Error).message.includes('undefined field')); } finally { assert(success); }
    });
  });
});
