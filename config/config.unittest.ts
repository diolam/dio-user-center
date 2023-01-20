import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1674016641670_531';

  // add your egg config in here
  config.middleware = [ 'logger', 'error' ];

  // MySQL 配置
  config.mysql = {
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3305',
      // 用户名
      user: 'diolam',
      // 密码
      password: 'root',
      // 数据库名
      database: 'dio_user_test',
    },
  };

  config.logger = {
    level: 'WARN',
    consoleLevel: 'DEBUG',
  };

  const myConfig = {
    pageSize: 10,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...myConfig,
  };
};
