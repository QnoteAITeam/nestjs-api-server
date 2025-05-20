import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  getHome(@Res() res: Response) {
    res.redirect('https://github.com/QnoteAITeam');
  }
}
