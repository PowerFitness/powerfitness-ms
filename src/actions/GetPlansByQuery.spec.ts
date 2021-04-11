import DbProvider from '../abstraction/DbProvider';
import { mock } from 'jest-mock-extended';
import GetPlansByQuery from './GetPlansByQuery';

describe('GetPlansByQuery', () => {
	test('buildQuery', () => {
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: GetPlansByQuery = new GetPlansByQuery(dbProvider, { id: '1',
			userUniqueId: 'uid' });
		expect(action.buildQuery()).toMatchSnapshot();
	})
	test('buildQuery throws an error if no criteria', () => {
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: GetPlansByQuery = new GetPlansByQuery(dbProvider, { });
		expect(action.buildQuery).toThrowError()
	})
})
