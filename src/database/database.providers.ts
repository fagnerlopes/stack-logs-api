import { createConnection } from 'typeorm';


export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORTA,
      username: process.env.DB_USUARIO,
      password: process.env.DB_SENHA,
      database: process.env.DB_BANCO,      
      entities: [process.env.ENV == 'prod' ? './entities/**/*.entity.js' : './src/entities/**/*.entity.ts',],
      synchronize: false,      
    }),
  },
];