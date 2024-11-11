import { Migrator } from "@mikro-orm/migrations";
import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import { Song } from "./entities/song.entity.js";
export const config: Options = {
  driver: PostgreSqlDriver,

  entities: [Song],

  dbName: process.env.MIKRO_ORM_DATABASE_NAME,
  schema: process.env.MIKRO_ORM_DATABASE_SCHEMA,
  user: process.env.MIKRO_ORM_DATABASE_USERNAME,
  password: process.env.MIKRO_ORM_DATABASE_PASSWORD,
  host: process.env.MIKRO_ORM_DATABASE_HOST,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
};
console.log(config);
export default config;
