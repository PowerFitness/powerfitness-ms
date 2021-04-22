import DbProvider from '../abstraction/DbProvider';
import { Goal } from '../types/Goal';
import { mock } from 'jest-mock-extended';
import UpsertBulkGoals from './UpsertBulkGoals';

describe('UpsertBulkGoals', () => {
	test('buildQuery', () => {
		const result: Array<Goal> = [
			{
				id: 1,
				planId: 1,
				type: 'exercise',
				name: 'running',
				value: 30,
				unit: 'minutes',
				createdDate: 'today',
				lastUpdatedDate: 'today',
			},
			{
				id: 2,
				planId: 1,
				type: 'water',
				name: 'water',
				value: 80,
				unit: 'ounces',
				createdDate: 'today',
				lastUpdatedDate: 'today',
			},
			{
				id: 3,
				planId: 1,
				type: 'nutrition',
				name: 'pizza',
				value: 200,
				unit: 'calories',
				createdDate: 'today',
				lastUpdatedDate: 'today',
			}
		];
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: UpsertBulkGoals = new UpsertBulkGoals(dbProvider, result);
		expect(action.buildQuery()).toMatchSnapshot();
	})
})
