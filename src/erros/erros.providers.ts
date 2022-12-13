import { Connection } from 'typeorm';
import { Erros } from '../entities/erros.entity';

export const errosProviders = [
  {
    provide: 'ERROS_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Erros),
    inject: ['DATABASE_CONNECTION'],
  },
];