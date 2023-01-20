import { EggPlugin } from 'egg';

const plugin: EggPlugin = {};

plugin.mysql = {
  enable: true,
  package: 'egg-mysql',
};

plugin.validate = {
  enable: true,
  package: 'egg-validate',
};

plugin.jwt = {
  enable: true,
  package: 'egg-jwt',
};

export default plugin;
