/* eslint-disable @typescript-eslint/no-explicit-any */
import { escape } from 'mysql'

export const buildWhereConditions = (map: {[key: string]: any}): string => {
  const conditions: Array<string> = [];
  for (const key in map) {
    if (typeof map[key] !== 'undefined') {
      conditions.push(`${key} = ${escape(map[key])}`);
    }
  }
  return conditions.length ? conditions.join(' AND ') : '';
}
