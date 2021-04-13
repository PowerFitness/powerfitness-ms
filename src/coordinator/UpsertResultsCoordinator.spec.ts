import { mock } from 'jest-mock-extended';
import DbProvider from '../abstraction/DbProvider';
import { Plan } from '../types/Plan';
import { Goal } from '../types/Goal';
import { OkPacket } from 'mysql';
import { Result } from '../types/Result';
import UpsertResultsCoordinator from './UpsertResultsCoordinator';

const mockGetResults: jest.Mock<Promise<Array<Result>>> = jest.fn(() => Promise.resolve([]));
jest.mock('../actions/GetResultsByQuery', () => ({
	default: class MockGetResultsByQuery {
		execute(): Promise<Array<Result>> {
			return mockGetResults();
		}
	},
	__esModule: true
}));

const mockDeleteResultsById: jest.Mock<Promise<OkPacket>> = jest.fn();
jest.mock('../actions/DeleteBulkResultsById', () => ({
	default: class MockDeleteBulkResultsById {
		dbProvider: DbProvider;
		resultIds: Array<number>
		constructor(dbProvider: DbProvider, resultIds: Array<number>) {
			this.dbProvider = dbProvider;
			this.resultIds = resultIds;
		}
		execute(): Promise<OkPacket> {
			return mockDeleteResultsById(this.resultIds);
		}
	},
	__esModule: true
}))

const mockUpsertResults: jest.Mock<Promise<OkPacket>> = jest.fn();
jest.mock('../actions/UpsertBulkResults', () => ({
	default: class MockUpsertBulkResults {
		dbProvider: DbProvider;
		results: Array<Result>;
		constructor(dbProvider: DbProvider, results: Array<Result>) {
			this.dbProvider = dbProvider;
			this.results = results;
		}
		execute(): Promise<OkPacket> {
			return mockUpsertResults(this.results);
		}
	},
	__esModule: true
}));

describe('UpsertResultsCoordinator', () => {
	describe('_getResultIdsToDelete', () => {
		it('determines which resultIds to delete', async () => {
			const resultsFromDb: Array<Result> =  [
				{
					id: 1,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Snowboarding',
					unit: 'minutes',
					value: 180,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 2,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Walking',
					unit: 'minutes',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 3,
					userUniqueId: '1234',
					date: 'date',
					type: 'water',
					subtype: 'water',
					name: 'water',
					unit: 'ounces',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 4,
					userUniqueId: '1234',
					date: 'date',
					type: 'nutrition',
					subtype: 'breakfast',
					name: 'Omelette',
					unit: 'calories',
					value: 200,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				}
			];

			mockGetResults.mockImplementationOnce(() => Promise.resolve(resultsFromDb));
			const results: Array<Result> = resultsFromDb.slice(0, -1);
			const coordinator: UpsertResultsCoordinator = new UpsertResultsCoordinator(mock<DbProvider>(), '1234', 'date', results);

			const resultIdsToDelete: Array<number> = await coordinator._getResultIdsToDelete();

			expect(resultIdsToDelete).toEqual([ 4 ]);
		});
		it('deletes all ids', async () => {
			const resultsFromDb: Array<Result> =  [
				{
					id: 1,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Snowboarding',
					unit: 'minutes',
					value: 180,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 2,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Walking',
					unit: 'minutes',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 3,
					userUniqueId: '1234',
					date: 'date',
					type: 'water',
					subtype: 'water',
					name: 'water',
					unit: 'ounces',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 4,
					userUniqueId: '1234',
					date: 'date',
					type: 'nutrition',
					subtype: 'breakfast',
					name: 'Omelette',
					unit: 'calories',
					value: 200,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				}
			];

			mockGetResults.mockImplementationOnce(() => Promise.resolve(resultsFromDb));
			const coordinator: UpsertResultsCoordinator = new UpsertResultsCoordinator(mock<DbProvider>(), '1234', 'date', []);

			const resultIdsToDelete: Array<number> = await coordinator._getResultIdsToDelete();

			expect(resultIdsToDelete).toEqual([ 1, 2, 3, 4 ]);
		});
		it('deletes all ids - undefined', async () => {
			const resultsFromDb: Array<Result> =  [
				{
					id: 1,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Snowboarding',
					unit: 'minutes',
					value: 180,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 2,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Walking',
					unit: 'minutes',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 3,
					userUniqueId: '1234',
					date: 'date',
					type: 'water',
					subtype: 'water',
					name: 'water',
					unit: 'ounces',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 4,
					userUniqueId: '1234',
					date: 'date',
					type: 'nutrition',
					subtype: 'breakfast',
					name: 'Omelette',
					unit: 'calories',
					value: 200,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				}
			];

			mockGetResults.mockImplementationOnce(() => Promise.resolve(resultsFromDb));
			const coordinator: UpsertResultsCoordinator = new UpsertResultsCoordinator(
				mock<DbProvider>(), '1234', 'date', undefined as unknown as Array<Result>
			);

			const resultIdsToDelete: Array<number> = await coordinator._getResultIdsToDelete();

			expect(resultIdsToDelete).toEqual([ 1, 2, 3, 4 ]);
		});
	});
	describe('upsertData', () => {
		beforeEach(() => {
			mockDeleteResultsById.mockReset();
			mockUpsertResults.mockReset();
		})
		it('deletes results then upserts results', async () => {
			const dbProvider: DbProvider = { ...mock<DbProvider>(), beginTransaction: jest.fn(), commit: jest.fn() };
			const resultsFromDb: Array<Result> = [
				{
					id: 1,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Snowboarding',
					unit: 'minutes',
					value: 180,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 2,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Walking',
					unit: 'minutes',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 3,
					userUniqueId: '1234',
					date: 'date',
					type: 'water',
					subtype: 'water',
					name: 'water',
					unit: 'ounces',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 4,
					userUniqueId: '1234',
					date: 'date',
					type: 'nutrition',
					subtype: 'breakfast',
					name: 'Omelette',
					unit: 'calories',
					value: 200,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				}
			];
			mockGetResults.mockImplementationOnce(() => Promise.resolve(resultsFromDb));
			const results: Array<Result> = resultsFromDb.slice(0, -1);
			const coordinator: UpsertResultsCoordinator = new UpsertResultsCoordinator(dbProvider, '1234', 'date', results);
			mockUpsertResults.mockImplementationOnce(() => Promise.resolve({ } as OkPacket));
			coordinator._getResultIdsToDelete = (): Promise<Array<number>> => Promise.resolve([ 4 ]);
			mockDeleteResultsById.mockImplementationOnce(() => Promise.resolve({} as OkPacket));

			await coordinator.upsertData();

			expect(dbProvider.beginTransaction).toHaveBeenCalled();
			expect(mockUpsertResults).toHaveBeenCalledWith(results);
			expect(mockDeleteResultsById).toHaveBeenCalledWith([ 4 ]);
			expect(dbProvider.commit).toHaveBeenCalled();
		});
		it('deletes results then upserts results', async () => {
			const dbProvider: DbProvider = { ...mock<DbProvider>(), beginTransaction: jest.fn(), commit: jest.fn() };
			const resultsFromDb: Array<Result> = [
				{
					id: 1,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Snowboarding',
					unit: 'minutes',
					value: 180,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 2,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Walking',
					unit: 'minutes',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 3,
					userUniqueId: '1234',
					date: 'date',
					type: 'water',
					subtype: 'water',
					name: 'water',
					unit: 'ounces',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 4,
					userUniqueId: '1234',
					date: 'date',
					type: 'nutrition',
					subtype: 'breakfast',
					name: 'Omelette',
					unit: 'calories',
					value: 200,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				}
			];
			mockGetResults.mockImplementationOnce(() => Promise.resolve(resultsFromDb));
			const results: Array<Result> = resultsFromDb.slice(0, -1);
			const coordinator: UpsertResultsCoordinator = new UpsertResultsCoordinator(dbProvider, '1234', 'date', results);
			mockUpsertResults.mockImplementationOnce(() => Promise.resolve({ } as OkPacket));
			coordinator._getResultIdsToDelete = (): Promise<Array<number>> => Promise.resolve([ 4 ]);
			mockDeleteResultsById.mockImplementationOnce(() => Promise.resolve({} as OkPacket));

			await coordinator.upsertData();

			expect(dbProvider.beginTransaction).toHaveBeenCalled();
			expect(mockUpsertResults).toHaveBeenCalledWith(results);
			expect(mockDeleteResultsById).toHaveBeenCalledWith([ 4 ]);
			expect(dbProvider.commit).toHaveBeenCalled();
		});
		it('does not delete results when there are none given', async () => {
			const dbProvider: DbProvider = { ...mock<DbProvider>(), beginTransaction: jest.fn(), commit: jest.fn() };
			const resultsFromDb: Array<Result> = [
				{
					id: 1,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Snowboarding',
					unit: 'minutes',
					value: 180,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 2,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Walking',
					unit: 'minutes',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 3,
					userUniqueId: '1234',
					date: 'date',
					type: 'water',
					subtype: 'water',
					name: 'water',
					unit: 'ounces',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 4,
					userUniqueId: '1234',
					date: 'date',
					type: 'nutrition',
					subtype: 'breakfast',
					name: 'Omelette',
					unit: 'calories',
					value: 200,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				}
			];
			mockGetResults.mockImplementationOnce(() => Promise.resolve(resultsFromDb));
			const coordinator: UpsertResultsCoordinator = new UpsertResultsCoordinator(dbProvider, '1234', 'date', resultsFromDb);
			mockUpsertResults.mockImplementationOnce(() => Promise.resolve({ } as OkPacket));

			await coordinator.upsertData();

			expect(dbProvider.beginTransaction).toHaveBeenCalled();
			expect(mockUpsertResults).toHaveBeenCalledWith(resultsFromDb);
			expect(mockDeleteResultsById).not.toHaveBeenCalled();
			expect(dbProvider.commit).toHaveBeenCalled();
		});
		it('does not upsert results when there are none given', async () => {
			const dbProvider: DbProvider = { ...mock<DbProvider>(), beginTransaction: jest.fn(), commit: jest.fn() };
			const resultsFromDb: Array<Result> = [
				{
					id: 1,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Snowboarding',
					unit: 'minutes',
					value: 180,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 2,
					userUniqueId: '1234',
					date: 'date',
					type: 'exercise',
					subtype: 'exercise',
					name: 'Walking',
					unit: 'minutes',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 3,
					userUniqueId: '1234',
					date: 'date',
					type: 'water',
					subtype: 'water',
					name: 'water',
					unit: 'ounces',
					value: 30,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				},
				{
					id: 4,
					userUniqueId: '1234',
					date: 'date',
					type: 'nutrition',
					subtype: 'breakfast',
					name: 'Omelette',
					unit: 'calories',
					value: 200,
					createdDate: 'datetime',
					lastUpdatedDate: 'datetime'
				}
			];
			mockGetResults.mockImplementationOnce(() => Promise.resolve(resultsFromDb));
			const coordinator: UpsertResultsCoordinator = new UpsertResultsCoordinator(dbProvider, '1234', 'date', []);
			mockUpsertResults.mockImplementationOnce(() => Promise.resolve({ } as OkPacket));

			await coordinator.upsertData();

			expect(dbProvider.beginTransaction).toHaveBeenCalled();
			expect(mockUpsertResults).not.toHaveBeenCalled();
			expect(mockDeleteResultsById).toHaveBeenCalledWith([ 1, 2, 3, 4 ]);
			expect(dbProvider.commit).toHaveBeenCalled();
		});
	});
});
