import { Controller } from 'egg';
import { UserResponse } from '../model/dto/UserResponse';

export default class UserController extends Controller {
  /**
   * 分页获取所有用户
   */
  public async index() {
    const pageNum = Number(this.ctx.request.query.pageNum);
    if (pageNum <= 0 || !isFinite(pageNum) || isNaN(pageNum)) {
      this.ctx.throw(422, 'invalid pageNum');
    }

    const userList = await this.ctx.service.user.listUsers(pageNum);

    this.ctx.body = userList;
    this.ctx.status = 200;
  }

  public async show() {
    const id = Number(this.ctx.params.id);
    if (id <= 0 || !isFinite(id) || isNaN(id)) {
      this.ctx.throw(422, 'invalid id');
    }

    const user = await this.ctx.service.user.getUserById(id);
    if (!user.id || !user.name || !user.username || typeof user.gender === 'undefined' || !user.createTime) {
      throw Error(`user from user.getUserById returns undefined fields ${JSON.stringify(user)}`);
    }
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      gender: user.gender,
      createTime: user.createTime,
    };

    this.ctx.body = userResponse;
    this.ctx.state = 200;
  }
}
