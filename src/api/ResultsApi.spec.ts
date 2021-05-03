import { Connection } from 'mysql';
import { Router, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import ResultsApi from './ResultsApi';
import DbProvider from '../abstraction/DbProvider';
import { DbConfig, Config } from '../config';
import { Result } from '../types/Result'
import { Logger } from '../util/loggerFactory';


const mockLogger: Logger = { info: jest.fn(), error: jest.fn(), debug: jest.fn() } as unknown as Logger;
jest.mock('../util/loggerFactory', () => ({
	default: () => mockLogger,
	__esModule: true
}));

const mockConfig: jest.Mock<Config> = jest.fn(() => ({
	dbConfig: {
		host: '',
		port: 3306,
		user: '',
		password: '',
		database: ''
	}
})) as unknown as jest.Mock<Config>;
jest.mock('../config', () => ({
	config: () => mockConfig()
}))

jest.mock('../abstraction/DbProvider', () => ({
	default: class MockDbProvider {
		dbConfig: DbConfig;
		connection: Connection | null = null;
		constructor(dbConfig: DbConfig) {
			this.dbConfig = dbConfig;
		}
	},
	__esModule: true
}))

const mockGetResultsByQueryExecute: jest.Mock<Promise<Array<Result>>> = jest.fn();
jest.mock('../actions/GetResultsByQuery', () => ({
	default: class MockGetResultsByQuery {
		queryParams: ParsedQs;
		constructor(dbProvider: DbProvider, queryParams: ParsedQs) {
			this.queryParams = queryParams;
		}
		execute(): Promise<Array<Result>> {
			return mockGetResultsByQueryExecute();
		}
	},
	__esModule: true
}))

const mockUpsertResultsCoordinator: jest.Mock<Promise<void>> = jest.fn();
jest.mock('../coordinator/UpsertResultsCoordinator', () => ({
	default: class MockUpsertResultsCoordinator {
		dbProvider: DbProvider;
		userUniqueId: string;
		date: string;
		results: Result[];
		constructor (dbProvider: DbProvider, userUniqueId: string, date: string, results: Result[]) {
			this.dbProvider = dbProvider;
			this.userUniqueId = userUniqueId;
			this.date = date;
			this.results = results;
		}
		async upsertData(): Promise<void> {
			return mockUpsertResultsCoordinator();
		}
	},
	__esModule: true
}));

const mockResults: Array<Result> = [ {
	id: 1,
	userUniqueId: 'testUserUniqueId',
	date: '2020-01-01',
	type: 'testType',
	subtype: 'testSubtype',
	name: 'testName',
	unit: 'testUnit',
	value: 1,
	createdDate: '2020-01-01',
	lastUpdatedDate: '2020-01-01'
} ];


describe('ResultsApi', () => {
	describe('getRouter', () => {
		it('creates a router with two routes', () => {
			const router: Router = new ResultsApi().getRouter();
			expect(router.stack.filter((l) => l.route.path == '/' && l.route.methods.get).length).toBeTruthy();
			expect(router.stack.filter((l) => l.route.path == '/:userUniqueId/:date' && l.route.methods.put).length).toBeTruthy();
		});
	});
	describe('getResults', () => {
		it('uses GetResultsByQuery', async () => {
			const req: Request = { query: {} } as unknown as Request;
			const res: Response = { send: jest.fn(), status: jest.fn(), end: jest.fn() } as unknown as Response;
			const api: ResultsApi = new ResultsApi();
			mockGetResultsByQueryExecute.mockImplementationOnce(() => Promise.resolve(mockResults));

			await api.getResults(req, res);

			expect(mockGetResultsByQueryExecute).toHaveBeenCalled();
			expect(res.send).toHaveBeenCalledWith(mockResults);
		});
		it('catches errors and responds 500', async () => {
			const req: Request = { query: {} } as unknown as Request;
			const res: Response = { send: jest.fn(), status: jest.fn(), end: jest.fn() } as unknown as Response;
			const api: ResultsApi = new ResultsApi();
			const error: Error = new Error('oops!');
			mockGetResultsByQueryExecute.mockImplementationOnce(() => Promise.reject(error));

			await api.getResults(req, res);

			expect(mockLogger.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.end).toHaveBeenCalled();
		})
	});
	describe('putResults', () => {
		beforeEach(() => {
			mockUpsertResultsCoordinator.mockReset();
		})
		it('checks that userUniqueId path is set', async () => {
			const req: Request = { params: { date: '2020-01-01' }, body: mockResults } as unknown as Request;
			const res: Response = { status: jest.fn(), end: jest.fn() } as unknown as Response;
			const api: ResultsApi = new ResultsApi();
			mockUpsertResultsCoordinator.mockImplementationOnce(() => Promise.resolve());

			await api.putResults(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.end).toHaveBeenCalled();
		});
		it('checks that date path is set', async () => {
			const req: Request = { params: { userUniqueId: 'testUserUniqueId' }, body: mockResults } as unknown as Request;
			const res: Response = { status: jest.fn(), end: jest.fn() } as unknown as Response;
			const api: ResultsApi = new ResultsApi();
			mockUpsertResultsCoordinator.mockImplementationOnce(() => Promise.resolve());

			await api.putResults(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.end).toHaveBeenCalled();
		});
		it('uses the UpsertResultsCoordinator', async () => {
			const req: Request = {
				params: { userUniqueId: 'testUserUniqueId', date: '2020-01-01' },
				body: mockResults
			} as unknown as Request;
			const res: Response = { status: jest.fn(), end: jest.fn() } as unknown as Response;
			const api: ResultsApi = new ResultsApi();
			mockUpsertResultsCoordinator.mockImplementationOnce(() => Promise.resolve());

			await api.putResults(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.end).toHaveBeenCalled();
		})
		it('catches errors and responds 500', async () => {
			const req: Request = {
				params: { userUniqueId: 'testUserUniqueId',
					date: '2020-01-01' }, body: mockResults
			} as unknown as Request;
			const res: Response = { status: jest.fn(), end: jest.fn() } as unknown as Response;
			const api: ResultsApi = new ResultsApi();
			const error: Error = new Error('oops!')
			mockUpsertResultsCoordinator.mockImplementationOnce(() => Promise.reject(error));

			await api.putResults(req, res);

			expect(mockLogger.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.end).toHaveBeenCalled();
		})
	});
});
