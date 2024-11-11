import { LoaderFunctionArgs } from "@remix-run/node";

import { MikroORM } from "@mikro-orm/postgresql";

import { getOrm } from "~/.server/db";

export function withOrm<R>(
  fn: (orm: MikroORM["em"], args: LoaderFunctionArgs) => Promise<R>
) {
  return async (args: LoaderFunctionArgs): Promise<R> => {
    const orm = await getOrm();
    return fn(orm, args);
  };
}
