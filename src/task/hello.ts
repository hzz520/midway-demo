import { Provide, Queue, Inject } from '@midwayjs/decorator';
// import { Application } from 'egg';

@Queue()
@Provide()
export class HelloTask {
  @Inject()
  logger
 
  async execute(params) {
    this.logger.info('【params】', params)
  }
}