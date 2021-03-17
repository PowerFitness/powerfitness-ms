import { buildWhereAndConditions, buildWhereOrConditions, buildBulkInsertValues } from './buildConditions';

jest.mock('mysql', () => ({
	...jest.requireActual('mysql') as Record<string, unknown>,
	raw: () => 'date',
	__esModule: true
}))
describe('buildConditions', () => {
	describe('buildWhereAndConditions', () => {
		test('it builds conditions', () => {
			const map: {[key: string]: string} = {
				type: 'exercise',
				userId: 'uuid'
			}
			expect(buildWhereAndConditions(map)).toEqual('type = \'exercise\' AND userId = \'uuid\'')
		});
		test('it builds a single condition', () => {
			const map: {[key: string]: string} = {
				type: 'exercise'
			}
			expect(buildWhereAndConditions(map)).toEqual('type = \'exercise\'')
		});
		test('it filters out undefined', () => {
			const map: {[key: string]: undefined} = {
				type: undefined
			}
			expect(buildWhereAndConditions(map)).toEqual('')
		});
	});
	describe('buildWhereOrConditions', () => {
		test('it builds OR conditions', () => {
			expect(buildWhereOrConditions([ 1, 2, 3 ], 'id')).toEqual('id = 1 OR id = 2 OR id = 3')
		});

		test('it builds a single OR conditions', () => {
			expect(buildWhereOrConditions([ 1 ], 'id')).toEqual('id = 1')
		});
	});
	describe('buildBulkUpsertValues', () => {
		test('it builds bulk upsert values', () => {
			expect(buildBulkInsertValues(
				[ 'id', 'planId', 'type' ],
				[
					{ id: 1, planId: 1, type: 'exercise' },
					{ planId: 1, id: 2, type: 'water' }
				]
			)).toEqual('(1, 1, \'exercise\'), (2, 1, \'water\')')
		});
		test('it builds fills in null values', () => {
			expect(buildBulkInsertValues(
				[ 'id', 'planId', 'type' ],
				[
					{ id: 1, planId: 1, type: 'exercise' },
					{ planId: 1, type: 'water' }
				]
			)).toEqual('(1, 1, \'exercise\'), (null, 1, \'water\')')
		});
		test('it builds fills in current timestamp', () => {
			expect(buildBulkInsertValues(
				[ 'id', 'planId', 'type', 'createdDate', 'lastUpdatedDate' ],
				[
					{ id: 1, planId: 1, type: 'exercise' },
					{ planId: 1, type: 'water' }
				]
			)).toEqual('(1, 1, \'exercise\', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()), (null, 1, \'water\', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())')
		});
	})
});
