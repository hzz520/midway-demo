import { Controller, Provide, Inject, Get } from '@midwayjs/decorator';
import { Context } from 'egg'

@Provide()
@Controller('/')
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
