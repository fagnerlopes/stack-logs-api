import { Injectable, Inject, NotAcceptableException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Erros } from '../entities/erros.entity';

@Injectable()
export class ErrosService {
  constructor(
    @Inject('ERROS_REPOSITORY')
    private errosRepository: Repository<Erros>,
  ) { }

  async filtrarErros(erro: any, pagina: number, itensPorPagina: number) {
    const qryBuilder = await this.errosRepository.createQueryBuilder("erros")
      .select(["erros.corrigido", "erros.iderro",
        "erros.data", "erros.cliente", "erros.mensagem",
        "erros.form", "erros.versao"])
      .orderBy("erros.data", "DESC");

    Object.keys(erro).forEach(propriedade => {
      if (erro[propriedade] && erro[propriedade] != "") {
        if (propriedade === "dataini") {
          qryBuilder.andWhere(`erros.data >= :${propriedade} `, {
            [propriedade]: erro[propriedade]
          })
        } else if (propriedade === "datafin") {
          qryBuilder.andWhere(`erros.data <= :${propriedade} `, {
            [propriedade]: erro[propriedade]
          })
        } else {
          qryBuilder.andWhere(`erros.${propriedade} like :${propriedade} `, {
            [propriedade]: `%${erro[propriedade]}%`
          })
        }
      }
    });

    const saida = {
      listaErros: [] as Array<Erros>,
      totalRegistros: 0,
    };

    const recount = await qryBuilder.getCount();

    qryBuilder.skip((pagina - 1) * itensPorPagina)
      .take(itensPorPagina);

    saida.listaErros = await qryBuilder.getMany();
    saida.totalRegistros = recount;

    return saida;
  }

  buscarErroId(iderro: number) {
    return this.errosRepository.findOne(iderro);
  }

  async corrigirErro(obj: any) {
    // procura o erro
    const erro = await this.errosRepository.findOne(obj.iderro);
    if (erro) {
      const erros = await this.errosRepository.find(
        {
          where: {
            mensagem: erro.mensagem,
            versao: erro.versao,
            form: erro.form
          }
        }
      );

      // pra cada erro atualiza
      for (let index = 0; index < erros.length; index++) {
        const element = erros[index];

        element.corrigido = 'S';
        element.versao_ok = obj.versaoOK;

        this.errosRepository.save(element);
      }
    }
  }

  async deletar(iderro: number) {
    try {
      const erro = await this.errosRepository.findOne(iderro);

      await this.errosRepository.delete({
        mensagem: erro.mensagem,
        versao: erro.versao,
        form: erro.form
      });
      return Promise.resolve(true);
    } catch (erro) {
      return Promise.reject(erro);
    }
  };

  async gravar(erro: any) {
    // Verifica se o erro ja existe
    let errodb = await this.errosRepository.findOne({
      where: {
        mensagem: erro.mensagem,
        versao: erro.versao,
        form: erro.form,
        cliente: erro.cliente
      }
    });

    if (errodb) {
      errodb.contador++;
    } else {
      // Verifica se o erro ja foi corrigido
      const isCorrigido = await this.errosRepository.findOne({
        mensagem: erro.mensagem,
        versao: erro.versao,
        form: erro.form,
        corrigido: 'S'
      });

      if (isCorrigido) {
        erro.corrigido = 'S'
      } else {
        erro.corrigido = 'N'
      }
    }
    return this.errosRepository.save(erro);
  }

  async top5erros() {
    const retorno = await this.errosRepository.createQueryBuilder("erros")
      .select("erros.mensagem")
      .addSelect("erros.contador")
      .where("erros.corrigido <> :valor", { valor: "S" })
      .orderBy("erros.contador", "DESC")
      .take(5)
      .getMany();

    return retorno;
  }

  async errosPorVersao() {
    const retorno = await this.errosRepository.createQueryBuilder("erros")
      .select("erros.versao", "versao")
      .addSelect("SUM(erros.contador)", "total")
      .where("erros.corrigido <> :valor", { valor: "S" })
      .groupBy("erros.versao")
      .orderBy("versao", "ASC")
      .take(10)
      .getRawMany();

    return retorno;
  }

  async errosPorForm() {
    const retorno = await this.errosRepository.createQueryBuilder("erros")
      .select("erros.form", "form")
      .addSelect("SUM(erros.contador)", "total")
      .where("erros.corrigido <> :valor", { valor: "S" })
      .groupBy("erros.form")
      .orderBy("total", "DESC")
      .take(5)
      .getRawMany();

    return retorno;
  }

  async errosPorFormVersao() {
    const retorno = await this.errosRepository.createQueryBuilder("erros")
      .select("erros.form", 'form')
      .addSelect("SUM(erros.contador)", "total")
      .addSelect('erros.versao', 'versao')
      .where("erros.corrigido <> :valor", { valor: "S" })
      .groupBy("erros.form")
      .orderBy("total", "DESC")
      .take(5)
      .getRawMany();

    const novoVetor = retorno.map(erro => {
      return {
        form_versao: `${erro.form}/${erro.versao}`,
        total: erro.total
      }
    })

    return novoVetor;
  }

  totalErros() {
    return this.errosRepository.count();
  }

  totalErrosCorrigidos() {
    return this.errosRepository.count(
      { where: {corrigido: "S"} }
    );
  }

  totalErrosNaoCorrigidos() {
    return this.errosRepository.count(
      { where: {corrigido: "N"} }
    );
  }
}
