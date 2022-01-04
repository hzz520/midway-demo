import { Context } from 'egg'
import { RequestOptions2 } from 'urllib/lib';

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: string;
}

export interface IGetUserResponse {
  success: boolean;
  message: string;
  data: IUserOptions;
}

export { RequestOptions2 }

/**
 * @description Config parameters
 */

 export type IgnoreItem = string | RegExp | ((ctx: Context) => boolean);

 export interface TokenHandlerConfig {
   ignore?: IgnoreItem | IgnoreItem[]
 }
 export interface GithubConfig {
   client_id: string
   client_secret: string
 }
 
 export interface K8sConfig {
   requestOptions: RequestOptions2 & {
     headers: {
      Authorization: string
     }
   }
   base: string
   tekton: string
   namespace: string
   baseUrl: string
 }

