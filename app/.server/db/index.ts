import { LoaderFunctionArgs } from "@remix-run/cloudflare";

import { MikroORM } from "@mikro-orm/postgresql"; // or any other driver package

import { config } from "./config";

declare global {
  // eslint-disable-next-line no-var
  var orm: MikroORM;
}

export async function getOrm(args?: LoaderFunctionArgs) {
  if (global.orm) return global.orm.em.fork();
  global.orm = await MikroORM.init({
    ...config,
    dbName: args?.context.cloudflare.env.DATABASE_NAME,
    user: args?.context.cloudflare.env.DATABASE_USERNAME,
    password: args?.context.cloudflare.env.DATABASE_PASSWORD,
    host: args?.context.cloudflare.env.DATABASE_HOST,
  });
  return global.orm.em.fork();
}
