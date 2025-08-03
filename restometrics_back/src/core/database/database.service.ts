import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './database.types';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  db: Kysely<Database>;

  onModuleInit() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    });

    this.db = new Kysely<Database>({ dialect });
  }

  async onModuleDestroy() {
    await this.db?.destroy();
  }
}
