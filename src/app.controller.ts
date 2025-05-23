import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'QnoteAITeam Organization Github Page Redirect' })
  @ApiResponse({ status: 302, description: 'Github Page 리다이렉트 성공' })
  @Get()
  getHome(@Res() res: Response) {
    res.redirect('https://github.com/QnoteAITeam');
  }
}
