import { mock } from 'jest-mock-extended';
import { UpsertPlanGoalsCoordinator, Plan } from './UpsertPlanGoalsCoordinator';
import DbProvider from '../abstraction/DbProvider';
import { Goal } from '../actions/GetGoalsByPlanId';
import { OkPacket } from 'mysql';

const mockGetGoalsByPlanIdExecute: jest.Mock<Promise<Array<Goal>>> = jest.fn();
jest.mock('../actions/GetGoalsByPlanId', () => ({
	default: class MockGetGoalsByPlanId {
		dbProvider: DbProvider
		planId: number;
		constructor(dbProvider: DbProvider, planId: number) {
			this.dbProvider = dbProvider;
			this.planId = planId;
		}
		execute(): Promise<Array<Goal>> {
			return mockGetGoalsByPlanIdExecute();
		}
	},
	__esModule: true
}));

const mockDeleteBulkGoalsByIdExecute: jest.Mock<Promise<OkPacket>> = jest.fn();
jest.mock('../actions/DeleteBulkGoalsById', () => ({
	default: class MockDeleteBulkGoalsById {
		dbProvider: DbProvider;
		goalIds: Array<number>
		constructor(dbProvider: DbProvider, goalIds: Array<number>) {
			this.dbProvider = dbProvider;
			this.goalIds = goalIds;
		}
		execute(): Promise<OkPacket> {
			return mockDeleteBulkGoalsByIdExecute(this.goalIds);
		}
	},
	__esModule: true
}))

const mockUpsertBulkGoalsExecute: jest.Mock<Promise<OkPacket>> = jest.fn();
jest.mock('../actions/UpsertBulkGoals', () => ({
	default: class MockUpsertBulkGoals {
		dbProvider: DbProvider;
		goalsList: Array<Goal>;
		constructor(dbProvider: DbProvider, goalsList: Array<Goal>) {
			this.dbProvider = dbProvider;
			this.goalsList = goalsList;
		}
		execute(): Promise<OkPacket> {
			return mockUpsertBulkGoalsExecute(this.goalsList);
		}
	},
	__esModule: true
}));

const mockUpsertPlanExecute: jest.Mock<Promise<OkPacket>> = jest.fn();
jest.mock('../actions/UpsertPlan', () => ({
	default: class MockUpsertPlan {
		dbProvider: DbProvider;
		plan: Plan;
		constructor(dbProvider: DbProvider, plan: Plan) {
			this.plan = plan;
			this.dbProvider = dbProvider;
		}
		execute(): Promise<OkPacket> {
			return mockUpsertPlanExecute(this.plan);
		}
	},
	__esModule: true
}));

describe('UpsertPlanGoalsCoordinator', () => {
	describe('_getGoalIdsToDelete', () => {
		it('determines which goalIds to delete', async () => {
			const plan: Plan =  {
				id: 1,
				userUniqueId: '1234',
				motivationStatement: 'This is my motivation statement',
				createdDate: 'datetime',
				lastUpdatedDate: 'datetime',
				goals: [
					{
						id: 1,
						planId: 1,
						type: 'exercise',
						name: 'weeklyExercise',
						unit: 'days',
						value: 5,
						createdDate: 'datetime',
						updatedDate: 'datetime',
					},
					{
						id: 2,
						planId: 1,
						type: 'exercise',
						name: 'dailyExercise',
						unit: 'minutes',
						value: 30,
						createdDate: 'datetime',
						updatedDate: 'datetime',
					},
					// {
					// 	id: 3,
					// 	planId: 1,
					// 	type: 'water',
					// 	name: 'dailyWater',
					// 	unit: 'ounces',
					// 	value: 80,
					// 	createdDate: 'datetime',
					// 	updatedDate: 'datetime',
					// },
					{
						id: 4,
						planId: 1,
						type: 'nutrition',
						name: 'dailyCalories',
						unit: 'calories',
						value: 2000,
						createdDate: 'datetime',
						updatedDate: 'datetime',
					}
				]
			};

			mockGetGoalsByPlanIdExecute.mockImplementationOnce(() => Promise.resolve([
				{
					id: 1,
					planId: 1,
					type: 'exercise',
					name: 'weeklyExercise',
					unit: 'days',
					value: 5,
					createdDate: 'datetime',
					updatedDate: 'datetime',
				},
				// {
				// 	id: 2,
				// 	planId: 1,
				// 	type: 'exercise',
				// 	name: 'dailyExercise',
				// 	unit: 'minutes',
				// 	value: 30,
				// 	createdDate: 'datetime',
				// 	updatedDate: 'datetime',
				// },
				{
					id: 3,
					planId: 1,
					type: 'water',
					name: 'dailyWater',
					unit: 'ounces',
					value: 80,
					createdDate: 'datetime',
					updatedDate: 'datetime',
				},
				{
					id: 4,
					planId: 1,
					type: 'nutrition',
					name: 'dailyCalories',
					unit: 'calories',
					value: 2000,
					createdDate: 'datetime',
					updatedDate: 'datetime',
				}
			] as Array<Goal>))
			const coordinator: UpsertPlanGoalsCoordinator = new UpsertPlanGoalsCoordinator(mock<DbProvider>(), plan);

			const goalIdsToDelete: Array<number> = await coordinator._getGoalIdsToDelete();

			expect(goalIdsToDelete).toEqual([ 3 ]);
		});
		it('does not have any ids to delete when no planId', async () => {
			const plan: Plan =  {
				userUniqueId: '1234',
				motivationStatement: 'This is my motivation statement',
				createdDate: 'datetime',
				lastUpdatedDate: 'datetime',
				goals: [
					{
						id: 1,
						planId: 1,
						type: 'exercise',
						name: 'weeklyExercise',
						unit: 'days',
						value: 5,
						createdDate: 'datetime',
						updatedDate: 'datetime',
					}
				]
			};

			mockGetGoalsByPlanIdExecute.mockImplementationOnce(() => Promise.reject('should not retrieve goals'));
			const coordinator: UpsertPlanGoalsCoordinator = new UpsertPlanGoalsCoordinator(mock<DbProvider>(), plan);

			const goalIdsToDelete: Array<number> = await coordinator._getGoalIdsToDelete();

			expect(goalIdsToDelete).toEqual([]);
		});
	});
	describe('upsertData', () => {
		it('deletes goals, upserts goals, and upserts plan', async () => {
			const dbProvider: DbProvider = { ...mock<DbProvider>(), beginTransaction: jest.fn(), commit: jest.fn() };
			const plan: Plan =  {
				id: 1,
				userUniqueId: '1234',
				motivationStatement: 'This is my motivation statement',
				createdDate: 'datetime',
				lastUpdatedDate: 'datetime',
				goals: [
					{
						id: 1,
						planId: 1,
						type: 'exercise',
						name: 'weeklyExercise',
						unit: 'days',
						value: 5,
						createdDate: 'datetime',
						updatedDate: 'datetime',
					},
					{
						id: 2,
						planId: 1,
						type: 'exercise',
						name: 'dailyExercise',
						unit: 'minutes',
						value: 30,
						createdDate: 'datetime',
						updatedDate: 'datetime',
					},
					// {
					// 	id: 3,
					// 	planId: 1,
					// 	type: 'water',
					// 	name: 'dailyWater',
					// 	unit: 'ounces',
					// 	value: 80,
					// 	createdDate: 'datetime',
					// 	updatedDate: 'datetime',
					// },
					{
						id: 4,
						planId: 1,
						type: 'nutrition',
						name: 'dailyCalories',
						unit: 'calories',
						value: 2000,
						createdDate: 'datetime',
						updatedDate: 'datetime',
					}
				]
			};
			const coordinator: UpsertPlanGoalsCoordinator = new UpsertPlanGoalsCoordinator(dbProvider, plan);
			mockUpsertPlanExecute.mockImplementationOnce(() => Promise.resolve({ insertId: 1 } as OkPacket));
			coordinator._getGoalIdsToDelete = (): Promise<Array<number>> => Promise.resolve([ 3 ]);
			mockDeleteBulkGoalsByIdExecute.mockImplementationOnce(() => Promise.resolve({} as OkPacket));
			mockUpsertBulkGoalsExecute.mockImplementationOnce(() => Promise.resolve({} as OkPacket));

			const planId: number = await coordinator.upsertData();

			expect(dbProvider.beginTransaction).toHaveBeenCalled();
			expect(mockUpsertPlanExecute).toHaveBeenCalledWith(plan);
			expect(mockDeleteBulkGoalsByIdExecute).toHaveBeenCalledWith([ 3 ]);
			expect(mockUpsertBulkGoalsExecute).toHaveBeenCalledWith(plan.goals);
			expect(dbProvider.commit).toHaveBeenCalled();
			expect(planId).toBe(1)
		});
	});
});
