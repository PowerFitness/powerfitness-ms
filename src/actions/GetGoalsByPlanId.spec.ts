import DbProvider from '../abstraction/DbProvider';
import { mock } from 'jest-mock-extended';
import GetGoalsByPlanId from './GetGoalsByPlanId';

describe('GetGoalsByPlanId', () => {
	test('buildQuery', () => {
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: GetGoalsByPlanId = new GetGoalsByPlanId(dbProvider, '1');
		expect(action.buildQuery()).toMatchSnapshot();
	})
	test('buildQuery throws an error if no criteria', () => {
		const dbProvider: DbProvider = mock<DbProvider>();
		const action: GetGoalsByPlanId = new GetGoalsByPlanId(dbProvider, undefined as unknown as string);
		expect(action.buildQuery).toThrowError()
	})
})
