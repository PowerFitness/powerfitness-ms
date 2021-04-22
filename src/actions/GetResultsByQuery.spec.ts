import DbProvider from '../abstraction/DbProvider';
import { mock } from 'jest-mock-extended';
import GetResultsByQuery from './GetResultsByQuery';

describe('GetResultsByQuery', () => {
	test('buildQuery', () => {
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: GetResultsByQuery = new GetResultsByQuery(dbProvider, { userUniqueId: 'uid',
			date: 'date' });
		expect(action.buildQuery()).toMatchSnapshot();
	})
	test('buildQuery throws an error if no criteria', () => {
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: GetResultsByQuery = new GetResultsByQuery(dbProvider, { });
		expect(() => action.buildQuery()).toThrowError('Missing criteria')
	})
})
