import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { id } from 'date-fns/locale';
import { retry } from 'rxjs';
import { ErrosService } from './erros.service';

@Controller('erros')
export class ErrosController {
  constructor(private readonly errosService: ErrosService) { }

  @Post('filtrar')
  filtrarErros(@Body() body, @Query() query) {
    return this.errosService.filtrarErros(
      body, 
      query && query.pagina ? query.pagina : 1, 
      query.itensPorPagina
    );
  }

  @Get('id/:id')
  buscarErroId(@Body() body, @Req() req) {
    return this.errosService.buscarErroId(req.params.id);
  }

  @Delete('deletar/:id')
  async deletar(@Body() body, @Req() req, @Res() res) {
    return await this.errosService.deletar(req.params.id)
      .then(
        (resolve) => {
          res.status(200).send(resolve);
        },
        (reject) => {
          res.status(500).send(reject);
        },
      );
  }

  @Post('gravar')
  gravar(@Body() body: any) {
    return this.errosService.gravar(body);  
  }

  @Post('corrigir')
  async corrigirErro(@Body() body: any, @Req() req, @Res() res) {
    return await this.errosService.corrigirErro(body)
      .then(
        (resolve) => {
          res.status(200).send(resolve);
        },
        (reject) => {
          res.status(500).send(reject);
        },
      );
  }

  @Get('top5erros')
  async top5erros() {
    return await this.errosService.top5erros();
  }

  @Get('errosPorVersao')
  async top10errosversao() {
    return await this.errosService.errosPorVersao();
  }

  @Get('errosPorForm')
  async top10errosform() {
    return await this.errosService.errosPorForm();
  }

  @Get('errosPorFormVersao')
  async top10errosformversao() {
    return await this.errosService.errosPorFormVersao();
  }

  @Get('totalErros')
  async totalErros() {
    return await this.errosService.totalErros();
  }

  @Get('totalErrosCorrigidos')
  async totalErrosCorrigidos() {
    return await this.errosService.totalErrosCorrigidos();
  }

  @Get('totalErrosNaoCorrigidos')
  async totalErrosNaoCorrigidos() {
    return await this.errosService.totalErrosNaoCorrigidos();
  }
}
