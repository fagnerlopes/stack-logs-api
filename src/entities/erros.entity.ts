import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { formatISO, parseISO } from 'date-fns'

@Entity()
export class Erros {
  @PrimaryGeneratedColumn()
  iderro: number;

  @Column({ length: 100, default: '', nullable: true })
  cliente: string;

  @Column({ length: 100, default: '', nullable: true })
  loja: string;

  @Column({ length: 100, default: '', nullable: true })
  mensagem: string;

  @Column({ length: 20, default: '', nullable: true })
  aplicativo: string;

  @Column({ length: 30, default: '', nullable: true })
  form: string;

  @Column({ length: 30, default: '', nullable: true })
  classe: string;

  @Column({ length: 50, default: '', nullable: true })
  windows: string;

  @Column({ length: 50, default: '', nullable: true })
  comp_user: string;

  @Column({ length: 20, default: '', nullable: true })
  comp_ip: string;

  @Column({ length: 20, default: '', nullable: true })
  versao: string;

  @Column({ length: 20, default: '', nullable: true })
  versao_ok: string;

  @Column()
  data: Date;

  @Column()
  memoriasis: number;

  @Column()
  memoriatotal: number;

  @Column({ length: 20 })
  usuario: string;

  @Column({ length: 50, default: '', nullable: true })
  emailcli: string;

  @Column({ type: "mediumtext", default: '', nullable: true })
  log_Jedi: string;

  @Column({ type: "mediumtext", default: '', nullable: true })
  print1: string;

  @Column({ type: "mediumtext", default: '', nullable: true })
  print2: string;

  @Column({ length: 1, default: 'N', nullable: true })
  corrigido: string;

  @Column({ default: 0 })
  contador: number;

  fromBody(body: any): Erros {
    if (body) {
      let { cliente, loja, aplicativo, form, classe, windows, comp_user,
        comp_ip, versao, memoriasis, memoriatotal, usuario,
        emailcli, data, mensagem, print, print2, log_Jedi, versao_ok
      } = body;

      this.cliente = cliente;
      this.loja = loja;
      this.aplicativo = aplicativo;
      this.form = form;
      this.classe = classe;
      this.windows = windows;
      this.comp_user = comp_user;
      this.comp_ip = comp_ip;
      this.versao = versao;
      this.versao_ok = versao_ok;
      this.memoriasis = memoriasis;
      this.memoriatotal = memoriatotal;
      this.usuario = usuario;
      this.emailcli = emailcli;
      this.log_Jedi = log_Jedi;
      this.mensagem = mensagem.substr(0, 750);
      this.data = new Date(data);

      const print1Erro: string = Buffer.from(print, 'binary').toString('base64');
      const print2Erro: string = Buffer.from(print2, 'binary').toString('base64');

      this.print1 = print1Erro;
      this.print2 = print2Erro;
    }

    return this;

  }
}