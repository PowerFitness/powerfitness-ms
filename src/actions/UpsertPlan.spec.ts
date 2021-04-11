import DbProvider from '../abstraction/DbProvider';
import { Plan } from '../types/Plan';
import UpsertPlan from './UpsertPlan';
import { mock } from 'jest-mock-extended';

describe('UpsertPlan', () => {
	test('buildQuery', () => {
		const plan: Plan = {
			id: 1,
			userUniqueId: 'uid',
			motivationStatement: 'To be healthy',
			createdDate: 'date',
			lastUpdatedDate: 'date'
		};
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: UpsertPlan = new UpsertPlan(dbProvider, plan);
		expect(action.buildQuery()).toMatchSnapshot();
	})
})
