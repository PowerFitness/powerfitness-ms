import DbProvider from '../abstraction/DbProvider';
import { Result } from '../types/Result';
import { mock } from 'jest-mock-extended';
import UpsertBulkResults from './UpsertBulkResults';

describe('UpsertBulkResults', () => {
	test('buildQuery', () => {
		const result: Array<Result> = [
			{
				id: 1,
				userUniqueId: 'uid',
				date: 'today',
				type: 'exercise',
				subtype: 'exercise',
				name: 'running',
				value: 30,
				unit: 'minutes',
				createdDate: 'today',
				lastUpdatedDate: 'today',
			},
			{
				id: 2,
				userUniqueId: 'uid',
				date: 'today',
				type: 'water',
				subtype: 'water',
				name: 'water',
				value: 80,
				unit: 'ounces',
				createdDate: 'today',
				lastUpdatedDate: 'today',
			},
			{
				id: 3,
				userUniqueId: 'uid',
				date: 'today',
				type: 'nutrition',
				subtype: 'dinner',
				name: 'pizza',
				value: 200,
				unit: 'calories',
				createdDate: 'today',
				lastUpdatedDate: 'today',
			}
		];
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: UpsertBulkResults = new UpsertBulkResults(dbProvider, result);
		expect(action.buildQuery()).toMatchSnapshot();
	})
})
