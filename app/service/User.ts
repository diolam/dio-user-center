import { Service } from 'egg';
import { User, UserStatus } from '../model/entity/User';
import { createHash, randomBytes } from 'crypto';
import { notMatched } from '../util/validate';
import { UserRequest } from '../model/dto/UserRequest';
import { UserPayload } from '../model/entity/UserPayload';

const passwordRegexp = /^.{6,16}$/;
const usernameRegexp = /^[a-zA-Z0-9_-]{3,20}$/;

/**
 * 用户服务
 * @author diolam
 */
export default class UserService extends Service {
  // 查询

  /**
   * 获取所有用户
   * @param {number} pageNum 页数
   * @return {Promise<User[]>} 该页所有用户
   */
  public async listUsers(pageNum: number): Promise<User[]> {
    const { pageSize } = this.app.config;

    if (pageNum <= 0) {
      this.ctx.throw(422, 'invalid pageNum');
    }

    const offset = pageSize * (pageNum - 1);
    const users: User[] = await this.app.mysql.select('user', {
      orders: [[ 'id', 'DESC' ]],
      limit: pageSize,
      offset,
    }) as User[];

    if (users.length === 0) {
      this.ctx.throw(404, 'user not found');
    }

    return users;
  }

  /**
   * 通过ID获取一个用户
   * @param {number} id 要获取的用户的ID
   * @return {Promise<User>} 获取到的用户
   */
  public async getUserById(id: number): Promise<User> {
    if (id <= 0) {
      this.ctx.throw(422, 'invalid id');
    }

    const user = await this.app.mysql.get('user', { id }) as User;

    if (!user) {
      this.ctx.throw(404, 'user not found');
    }

    return user;
  }

  /**
   * 通过用户名获取一个用户
   * @param {string} username 要获取的用户的用户名
   * @return {Promise<User>} 获取到的用户
   */
  public async getUserByUsername(username: string): Promise<User> {
    if (notMatched(username, usernameRegexp)) {
      this.ctx.throw(422, 'invalid username');
    }

    const user = await this.app.mysql.get('user', { username }) as User;

    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user;
  }

  /**
   * 创建一个用户
   * @param {UserRequest} userRequest 要创建的用户
   * @param {string} password 用户密码
   * @param {User} operator 执行创建的用户
   * @return {Promise<number>} 创建用户的ID
   */
  public async createUser(userRequest: UserRequest, password: string, operator: User): Promise<number> {
    // 只有管理员可以创建用户
    if (operator.userStatus !== UserStatus.admin) {
      this.ctx.throw(401, 'permission denied');
    }

    if (notMatched(userRequest.username, usernameRegexp)) {
      this.ctx.throw(422, 'invalid username');
    }
    if (notMatched(password, passwordRegexp)) {
      this.ctx.throw(422, 'invalid password');
    }

    const user: User = { ...userRequest };

    // 检查是否有重复的 username
    const duplicatedUser: User = await this.app.mysql.get('user', { username: user.username });
    if (duplicatedUser) {
      this.ctx.throw(403, 'duplicated username');
    }

    const sha256 = createHash('sha256');
    user.salt = randomBytes(128).toString('hex');
    user.password = sha256.update(password + user.salt).digest('hex');

    const result = await this.app.mysql.insert('user', user);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return result.insertedId;
  }

  /**
   * 验证用户密码是否正确
   * @param user 要验证的用户，应当通过 `userService.getUser` 获得
   * @param password 用户的密码
   */
  public async verifyUser(user: User, password: string) {
    const sha256 = createHash('sha256');
    if (!password || !user.salt) {
      throw Error(`invalid user ${JSON.stringify(user)}, \`user\` should be get from userService.getUser`);
    }

    const pswd = sha256.update(password + user.salt).digest('hex');
    if (pswd !== user.password) {
      this.ctx.throw(401, 'incorrect password');
    }
  }

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   */
  public async userLogin(username: string, password: string) {
    const user = await this.getUserByUsername(username);

    if (!user.id) {
      throw Error(`user ${JSON.stringify(user)} from \`getUserByUsername\` has an undefined field \`id\``);
    }

    await this.verifyUser(user, password);

    const payload: UserPayload = { id: user.id };
    const token = this.app.jwt.sign(payload, this.config.jwt.secret);
    return token;
  }
}
