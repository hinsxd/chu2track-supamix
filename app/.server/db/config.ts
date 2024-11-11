import { Migrator } from "@mikro-orm/migrations";
import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import { Song } from "./entities/song.entity.js";

export const config: Options = {
  driver: PostgreSqlDriver,
  entities: [Song],
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  schema: "public",
  discovery: { disableDynamicFileAccess: true },
};

export default config;
