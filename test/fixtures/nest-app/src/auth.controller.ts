import { Controller, Delete, Headers, HttpStatus, Post, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {

    @Post()
    async login(@Headers() headers, @Res() res) {}

    @Delete()
    async logout(@Res() res) {}
}
