import { Controller, Provide, Inject, Get } from '@midwayjs/decorator';
import { Context } from 'egg'

@Provide()
@Controller('/', { description: '/', tagName: '健康检查' })
export class HomeController {
  @Inject()
  ctx: Context

  @Get('/')
  async home(ctx: Context) {
    return 'Hello Midwayjs!';
  }

  @Get('/health')
  async health (ctx: Context) {
    return 'ok'
  }
}
