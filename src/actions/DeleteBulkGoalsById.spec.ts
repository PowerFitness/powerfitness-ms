import DbProvider from '../abstraction/DbProvider';
import { mock } from 'jest-mock-extended';
import DeleteBulkGoalsById from './DeleteBulkGoalsById';

describe('DeleteBulkGoalsById', () => {
	test('buildQuery', () => {
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: DeleteBulkGoalsById = new DeleteBulkGoalsById(dbProvider, [ 1, 2 ]);
		expect(action.buildQuery()).toMatchSnapshot();
	})
	test('buildQuery throws an error if no criteria', () => {
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: DeleteBulkGoalsById = new DeleteBulkGoalsById(dbProvider, undefined as unknown as Array<number>);
		expect(() => action.buildQuery()).toThrowError('Missing criteria')
	})
})
