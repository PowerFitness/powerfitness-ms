import { Router, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import PlanApi from './PlanApi';
import { Plan } from '../coordinator/RetrievePlanCoordinator';
import DbProvider from '../abstraction/DbProvider';
import { DbConfig, Config } from '../config'
import { Connection } from 'mysql';
import { Logger } from'../util/loggerFactory';

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

const mockRetrieveData: jest.Mock<Promise<Plan | null>> = jest.fn();
jest.mock('../coordinator/RetrievePlanCoordinator', () => ({
	default: class MockRetrievePlanCoordinator {
		dbProvider: DbProvider;
		queryParams: ParsedQs;
		constructor (dbProvider: DbProvider, queryParams: ParsedQs) {
			this.dbProvider = dbProvider;
			this.queryParams = queryParams;
		}
		async retrieveData(): Promise<Plan | null> {
			return mockRetrieveData();
		}
	},
	__esModule: true
}))

const mockUpsertData: jest.Mock<Promise<number>> = jest.fn();
jest.mock('../coordinator/UpsertPlanGoalsCoordinator', () => ({
	default: class MockUpsertPlanGoalsCoordinator {
		dbProvider: DbProvider;
		plan: Plan;
		constructor (dbProvider: DbProvider, plan: Plan) {
			this.dbProvider = dbProvider;
			this.plan = plan;
		}
		async upsertData(): Promise<number> {
			return mockUpsertData(this.plan);
		}
	},
	__esModule: true
}))

jest.mock('jwt-decode', () => ({
	default: () => ({
		user_id: 'testUserUniqueId'
	}),
	__esModule: true
}))

const mockPlan: Plan = {
	id: 1,
	userUniqueId: 'testUserUniqueId',
	motivationStatement: 'Just do it',
	createdDate: '2020-01-01',
	lastUpdatedDate: '2020-01-01',
	goals: [ {
		id: 1,
		planId: 1,
		type: 'testType',
		name: 'testName',
		unit: 'testUnit',
		value: 100,
		createdDate: '2020-01-01',
		lastUpdatedDate: '2020-01-01'
	} ]
};

describe('PlanApi', () => {
	describe('getRouter', () => {
		it('creates a router with two routes', () => {
			const router: Router = new PlanApi().getRouter();
			expect(router.stack.filter((l) => l.route.path == '/' && l.route.methods.get).length).toBeTruthy();
			expect(router.stack.filter((l) => l.route.path == '/' && l.route.methods.put).length).toBeTruthy();
		});
	});
	describe('getPlan', () => {
		it('uses the RetrievaPlanCoordinator', async () => {
			const planApi: PlanApi = new PlanApi();
			const req: Request = { query: { userUniqueId: 'testUserUniqueId' }, get: (header: string) => {
				switch(header) {
				case 'Authorization':
					return 'Bearer token'
				}
			} } as unknown as Request;
			const res: Response = { send: jest.fn(), status: jest.fn(), end: jest.fn() } as unknown as Response;
			mockRetrieveData.mockImplementationOnce(() => Promise.resolve(mockPlan));

			await planApi.getPlan(req, res);

			expect(mockRetrieveData).toHaveBeenCalled();
			expect(res.send).toHaveBeenCalledWith(mockPlan)
		});
		it('responds with an empty object when not found', async () => {
			const planApi: PlanApi = new PlanApi();
			const req: Request = { query: { userUniqueId: 'testUserUniqueId'  }, get: (header: string) => {
				switch(header) {
				case 'Authorization':
					return 'Bearer token'
				}
			} } as unknown as Request;
			const res: Response = { send: jest.fn(), status: jest.fn(), end: jest.fn() } as unknown as Response;
			mockRetrieveData.mockImplementationOnce(() => Promise.resolve(null));

			await planApi.getPlan(req, res);

			expect(mockRetrieveData).toHaveBeenCalled();
			expect(res.send).toHaveBeenCalledWith({})
		});
		it('catches errors and responds 500', async () => {
			const planApi: PlanApi = new PlanApi();
			const req: Request = { query: { userUniqueId: 'testUserUniqueId' }, get: (header: string) => {
				switch(header) {
				case 'Authorization':
					return 'Bearer token'
				}
			} } as unknown as Request;
			const res: Response = { send: jest.fn(), status: jest.fn(), end: jest.fn() } as unknown as Response;
			const error: Error = new Error('oops!');
			mockRetrieveData.mockImplementationOnce(() => Promise.reject(error));

			await planApi.getPlan(req, res);

			expect(mockLogger.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.end).toHaveBeenCalled();
		});
	});
	describe('putPlan', () => {
		it('uses the UpsertPlanGoalsCoordinator', async () => {
			const req: Request = { body: mockPlan, get: (header: string) => {
				switch(header) {
				case 'Authorization':
					return 'Bearer token'
				}
			} } as unknown as Request;
			const res: Response = { send: jest.fn(), status: jest.fn(), end: jest.fn() } as unknown as Response;
			const planApi: PlanApi = new PlanApi();
			mockUpsertData.mockImplementationOnce(() => Promise.resolve(1))

			await planApi.putPlan(req, res);

			expect(mockUpsertData).toHaveBeenCalledWith(mockPlan);
			expect(res.send).toHaveBeenCalledWith('1');
		});
		it('catches errors and responds 500', async () => {
			const req: Request = { body: mockPlan, get: (header: string) => {
				switch(header) {
				case 'Authorization':
					return 'Bearer token'
				}
			} } as unknown as Request;
			const res: Response = { send: jest.fn(), status: jest.fn(), end: jest.fn() } as unknown as Response;
			const planApi: PlanApi = new PlanApi();
			const error: Error = new Error('oops!');
			mockUpsertData.mockImplementationOnce(() => Promise.reject(error))

			await planApi.putPlan(req, res);

			expect(mockLogger.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.end).toHaveBeenCalled();
		});
	});
});
