import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  config.serverTimeout = 300000


  config.jwt = {
    secret: '123456',
  }

  config.github = {
    client_id: '3a083efc4953c82dfc93',
    client_secret: '47f3644b990225e52e4e46e9252dff734faca211'
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1639113250018_6115';

  // add your config here
  config.middleware = [];

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };

  // config.security = {
  //   csrf: false,
  // };

  return config;
};
