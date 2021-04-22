import RetrievalPlanCoordinator from './RetrievePlanCoordinator';
import { Plan as PlanDetails } from '../actions/GetPlansByQuery';
import { mock } from 'jest-mock-extended';
import DbProvider from '../abstraction/DbProvider';
import { Plan } from '../types/Plan';
import { Goal } from '../types/Goal';

const mockPlan: Plan = {
	id: 1,
	userUniqueId: 'uid',
	motivationStatement: 'To be healthy',
	createdDate: 'date',
	lastUpdatedDate: 'date'
}
const mockRetrievePlan: jest.MockedFunction<() => Promise<Array<PlanDetails>>> = jest.fn(() => Promise.resolve([]))
jest.mock('../actions/GetPlansByQuery', () => ({
	default: class MockGetPlansByQuery {
		execute(): Promise<Array<PlanDetails>> {
			return mockRetrievePlan();
		}
	},
	__esModule: true
}))

const mockGoals: Array<Goal> = [
	{
		id: 1,
		planId: 1,
		type: 'exercise',
		name: 'dailyExercise',
		value: 30,
		unit: 'minutes',
		createdDate: 'date',
		lastUpdatedDate: 'date'
	}
]
const mockRetrieveGoals: jest.MockedFunction<() => Promise<Array<Goal>>> = jest.fn(() => Promise.resolve([]))
jest.mock('../actions/GetGoalsByPlanId', () => ({
	default: class MockGetGoalsByPlanId {
		execute(): Promise<Array<Goal>> {
			return mockRetrieveGoals();
		}
	},
	__esModule: true
}))

describe('RetrievePlanCoordinator', () => {
	describe('retrieveData', () => {
		test('it returns a plan and goals', async () => {
			const dbProvider: DbProvider = mock<DbProvider>();
			const coordinator: RetrievalPlanCoordinator = new RetrievalPlanCoordinator(dbProvider, {});
			mockRetrievePlan.mockImplementationOnce(() => Promise.resolve([ mockPlan ]));
			mockRetrieveGoals.mockImplementationOnce(() => Promise.resolve(mockGoals));
			const result: Plan | null = await coordinator.retrieveData();
			expect(result).toEqual({ ...mockPlan, goals: mockGoals });
		})
		test('it returns a plan without goals', async () => {
			const dbProvider: DbProvider = mock<DbProvider>();
			const coordinator: RetrievalPlanCoordinator = new RetrievalPlanCoordinator(dbProvider, {});
			mockRetrievePlan.mockImplementationOnce(() => Promise.resolve([ mockPlan ]));
			const result: Plan | null = await coordinator.retrieveData();
			expect(result).toEqual({ ...mockPlan, goals: [] });
		})
		test('it returns null if no plan', async () => {
			const dbProvider: DbProvider = mock<DbProvider>();
			const coordinator: RetrievalPlanCoordinator = new RetrievalPlanCoordinator(dbProvider, {});
			const result: Plan | null = await coordinator.retrieveData();
			expect(result).toBe(null);
		})
	})
})
