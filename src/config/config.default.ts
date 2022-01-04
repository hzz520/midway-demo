import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { ConnectionOptions } from 'typeorm'
import { SwaggerGeneratorInfoOptions } from '@midwayjs/swagger'

import {
  GithubConfig,
  K8sConfig,
  TokenHandlerConfig,
} from '../interface'

const tekton_base = 'https://kubernetes.docker.internal:6443'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.serverTimeout = 300000

  config.swagger = {
    title: 'Devops平台',
    description: 'Devops平台的API接口文档',
    version: '0.0.1',
  } as SwaggerGeneratorInfoOptions

  config.jwt = {
    secret: '123456',
  }

  config.tokenHandler = {
    ignore: ['/api/user/login', '/api/user/logout', '/api/user/test', new RegExp('^/api/pz')]
  } as TokenHandlerConfig

  config.cors = {
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  }

  config.github = {
    client_id: '3a083efc4953c82dfc93',
    client_secret: '47f3644b990225e52e4e46e9252dff734faca211'
  } as GithubConfig

  config.validate = {
    convert: true,  
  }

  config.k8s = {
    requestOptions: {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkxDMnJseEV6RTUzU21uczdvck04MUQ4R2RZOFRrbHY3ZVZoeHJEY0l5bkUifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJmZS10ZWt0b24iLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoiZGVmYXVsdC10b2tlbi03a3AyNCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiOGZiZjNhZTItM2FmMS00NTE4LWFlYmEtYmFmZjU0MjNkM2MwIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmZlLXRla3RvbjpkZWZhdWx0In0.PJcCps0XvMz-CHCqbowpOSGupfR6e5qW4GA51qvAvVFRtG7mSrUoLSG88IeUM24lfmwEwzCAKF9-oMOs1AcpekPnEkveU9y2gvP0lmf4JIGG2tV-x7L0LacOdKoG_7iSeuCf_sl8w-9CJ2vCAgCva0-CTATu-BfAxyFNt5CRc9LU8pZhGiBpEdzwQTJnP8zX32IrBVGwj84RArB2BjSTpKnSHbwNXGOKTfWvsoYV8Y402Pw6vr6S4kaEok5oTwkZO2g8NZfCop7fIb7QvTp68zNaktgjKvZkZ4EhM5y7aKrbeznPF3lFICkxbMhsTZz1Lm2UGNIHXGmmwXmHBB80uA'
      },
      rejectUnauthorized: false,
      dataType: 'json',
    },
    namespace: 'fe-tekton',
    base: `${tekton_base}/api/v1`,
    tekton: `${tekton_base}/apis/tekton.dev/v1beta1`,
    baseUrl: tekton_base
  } as K8sConfig

  config.orm = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'Qazwer12345',
    database: 'fe_cloud',
    timezone: '+08:00'
  } as ConnectionOptions

  config.taskConfig = {
    edis: {
      port: 6379,
      host: '127.0.0.1',
      // password: 'Qazwer12345',
    }, //此处相当于是ioredis的配置 https://www.npmjs.com/package/ioredis
    prefix: 'midway-task', // 这些任务存储的key，都是midway-task开头，以便区分用户原有redis里面的配置。
    defaultJobOptions: {
      repeat: {
        tz: 'Asia/Shanghai', // Task等参数里面设置的比如（0 0 0 * * *）本来是为了0点执行，但是由于时区不对，所以国内用户时区设置一下。
      },
    },
  } 

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1639113250018_6115';

  // add your config here
  config.middleware = ['tokenHandlerMiddleware', 'requestLoggerMiddleware'];

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: false,
  };

  config.security = {
    csrf: false,
    domainWhiteList: ["http://localhost:3333"]
  };

  return config;
};
