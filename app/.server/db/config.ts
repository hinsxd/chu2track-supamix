import "reflect-metadata";
import { Migrator } from "@mikro-orm/migrations";
import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SeedManager } from "@mikro-orm/seeder";

import { entities } from "./entities/index.js";

export const config: Options = {
  driver: PostgreSqlDriver,
  entities: Object.values(entities),
  dbName: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT)
    : undefined,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator, SeedManager],
  schema: "public",
  discovery: { disableDynamicFileAccess: true },
  entityGenerator: {
    scalarTypeInDecorator: true,
  },
};

export default config;
