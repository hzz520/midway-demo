import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as swagger from '@midwayjs/swagger';
import * as orm from '@midwayjs/orm';
import * as task from '@midwayjs/task'; 
// import { QueueService } from '@midwayjs/task';
// import { Queue } from 'bull'

@Configuration({
  imports: [{
    component: swagger,
  }, orm, task],
  importConfigs: [join(__dirname, './config')],
  conflictCheck: true
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;
  
  async onReady(container: IMidwayContainer) {
    const directory = join(this.app.config.baseDir, 'app/validate');
    this.app.loader.loadToApp(directory, 'validate')

    // let result: any = await container.getAsync(QueueService)

    // let job: Queue = result.getClassQueue(`HelloTask`);
    
    // let job: Queue = result.queueMap['HelloTask:execute']
    
    // job.add({}, { delay: 0, repeat: { cron: '* * * * *' }, });
  }
}
