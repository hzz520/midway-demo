import { Inject, Controller, Provide, Get } from '@midwayjs/decorator';
import { Context } from 'egg';
import * as querystring from 'querystring'

const headers = {
  Authorization: 'token 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'
}

@Provide('github')
@Controller('/api/github', { tagName: 'github', description: '/api/github' })
export class GithubController {
  @Inject()
  ctx: Context

  @Get('/login')
  async login (ctx: Context) {
    let path = 'https://github.com/login/oauth/authorize?client_id=' + ctx.app.config.github.client_id
    ctx.redirect(path)
  }

  @Get('/callback')
  async getCb (ctx: Context): Promise<any> {
    const params = {
      ...ctx.app.config.github,
      code: ctx.query.code
    }
    
    let access_token = await ctx.curl('https://github.com/login/oauth/access_token', {
      method: 'POST',
      data: params
    }).then(async res => {
      try {
        let { access_token } = querystring.parse(Buffer.from(res.data, 'binary').toString('utf-8'))
      
      
        return access_token
      } catch (error) {
        return ''
      }
    }).catch((error) => {
      console.log('error', error);
      
    })

    let res = await ctx.curl(`https://api.github.com/user`, {
      method: 'GET',
    headers: {
      'Authorization': 'token ' + access_token
    },
  }).then(async res => {
    // console.log(Buffer.from(res.data, 'binary').toString('utf-8'));
    
    try {
      return JSON.parse(Buffer.from(res.data, 'binary').toString('utf-8'))
    } catch (error) {
      console.log('error', error);
      
      return {}
    }
  }).catch((error) => {
    console.log('error', error);
    
  })

  if (res.documentation_url) {
    let path = 'https://github.com/login/oauth/authorize?client_id=' + ctx.app.config.github.client_id
    ctx.redirect(path)
    return false
  }
  
    
    ctx.body = {
      code: 0,
      message: 'success',
      data: res
    }
  }

  @Get('/repos', { summary: '仓库', description: '获取仓库列表' })
  async getRepos (ctx: Context) {
    let url = `https://api.github.com/users/hzz520/repos`
    
    let list = await ctx.curl(url, { type: 'GET', dataType: 'json', data: ctx.request.query, headers }).then(res => {
        return res.data
    })

    ctx.body = {
        code: 0,
        message: 'ok',
        data: {
            list
        }
    }
  }

  @Get('/options', { summary: '分支', description: '获取镜像分支列表' })
  async getBranches (ctx: Context) {
    let {
      repo,
      type
    } = ctx.request.query
    if (!['branches', 'commits'].includes(type)) {
      ctx.body = {
        code: 500,
        message: 'type invalide must be branches or commits'
      }
      return 
    }
    let url = `https://api.github.com/repos/${repo}/${type}`
    
    let list = await ctx.curl(url, { type: 'GET', dataType: 'json', data: ctx.request.query, headers }).then(res => {
      return res.data
    })

    if (Object.prototype.toString.apply(list) === '[object Object]') {
      ctx.body = {
        code: 500,
        message: list.message
      }
      return 
    }

    ctx.body = {
      code: 0,
      message: 'ok',
      data: {
          list
      }
    }
  }
}