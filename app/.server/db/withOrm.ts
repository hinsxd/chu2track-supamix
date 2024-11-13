import { MikroORM } from "@mikro-orm/postgresql";

import { getOrm } from "~/.server/db";

export function withOrm<T, R>(
  fn: (args: T, orm: MikroORM["em"]) => Promise<R>
) {
  return async (args: T): Promise<R> => {
    const orm = await getOrm();
    return fn(args, orm);
  };
}
