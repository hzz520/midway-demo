import { EggPlugin } from 'egg';
export default {
  logrotator: false, // disable when use @midwayjs/logger
  static: false,
  jwt: {
    enable: true,
    package: "egg-jwt"
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  validate: {
    enable: true,
    package: 'egg-validate'
  }
} as EggPlugin;
