import { buildWhereConditions } from './buildWhereConditions';

describe('buildConditions', () => {
  test('it builds conditions', () => {
    const map: {[key: string]: string} = {
      type: 'exercise',
      userId: 'uuid'
    }
    expect(buildWhereConditions(map)).toEqual('type = \'exercise\' AND userId = \'uuid\'')
  });
  test('it builds a single condition', () => {
    const map: {[key: string]: string} = {
      type: 'exercise'
    }
    expect(buildWhereConditions(map)).toEqual('type = \'exercise\'')
  });
  test('it filters out undefined', () => {
    const map: {[key: string]: undefined} = {
      type: undefined
    }
    expect(buildWhereConditions(map)).toEqual('')
  });
});
