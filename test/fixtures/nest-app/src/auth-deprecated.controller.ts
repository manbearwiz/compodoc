import { Controller, Delete, Headers, HttpStatus, Post, Res } from '@nestjs/common';

/**
 * @deprecated This controller is deprecated
 */
@Controller('auth')
export class AuthDeprecatedController {

    @Post()
    async login(@Headers() headers, @Res() res) {}

    @Delete()
    async logout(@Res() res) {}
}
