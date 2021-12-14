// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!
import 'egg';
import '@midwayjs/web';
import 'egg-onerror';
import 'egg-session';
import 'egg-i18n';
import 'egg-watcher';
import 'egg-multipart';
import 'egg-security';
import 'egg-development';
import 'egg-logrotator';
import 'egg-schedule';
import 'egg-static';
import 'egg-jsonp';
import 'egg-view';
import 'midway-schedule';
import 'egg-jwt';
import { EggPluginItem, EggAppConfig } from 'egg';
declare module 'egg' {
  interface EggAppConfig {
    github?: {
      client_id: string
      client_secret: string
    }
  }
  interface EggPlugin {
    'onerror'?: EggPluginItem;
    'session'?: EggPluginItem;
    'i18n'?: EggPluginItem;
    'watcher'?: EggPluginItem;
    'multipart'?: EggPluginItem;
    'security'?: EggPluginItem;
    'development'?: EggPluginItem;
    'logrotator'?: EggPluginItem;
    'schedule'?: EggPluginItem;
    'static'?: EggPluginItem;
    'jsonp'?: EggPluginItem;
    'view'?: EggPluginItem;
    'schedulePlus'?: EggPluginItem;
    'jwt'?: EggPluginItem
  }
}