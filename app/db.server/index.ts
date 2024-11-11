import { MikroORM } from "@mikro-orm/postgresql"; // or any other driver package

import { config } from "./config";

declare global {
  // eslint-disable-next-line no-var
  var orm: MikroORM;
}

export async function getOrm() {
  if (global.orm) return global.orm.em.fork();
  const orm = await MikroORM.init(config);
  global.orm = orm;
  return orm.em.fork();
}
