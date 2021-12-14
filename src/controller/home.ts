import { Controller, Post, Provide, Inject } from '@midwayjs/decorator';
import { Context } from 'egg'

@Provide()
@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context

  @Post('/')
  async home(ctx: Context) {
    return 'Hello Midwayjs!';
  }
}
