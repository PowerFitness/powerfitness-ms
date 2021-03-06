import DbProvider from '../abstraction/DbProvider';
import GetGoalsByPlanId from '../actions/GetGoalsByPlanId';
import DeleteBulkGoalsById from '../actions/DeleteBulkGoalsById';
import UpsertBulkGoals from '../actions/UpsertBulkGoals';
import UpsertPlan from '../actions/UpsertPlan';
import { Plan } from '../types/Plan';
import { Goal } from '../types/Goal';
import { OkPacket } from 'mysql';

export class UpsertPlanGoalsCoordinator {
	dbProvider: DbProvider;
	plan: Plan;
	constructor (dbProvider: DbProvider, plan: Plan) {
		this.dbProvider = dbProvider;
		this.plan = plan;
	}
	async _getGoalIdsToDelete(): Promise<Array<number>> {
		const { goals = [], id: planId } = this.plan;
		if (!planId) {
			return [];
		} else {
			const existingGoals: Array<Goal> = await new GetGoalsByPlanId(this.dbProvider, planId).execute();
			const goalIds: Array<number> = existingGoals.filter((existingGoal) => {
				return !goals.find(function(goal) {
					return goal.id === existingGoal.id
				})
			}).map(goal => goal.id);
			return goalIds;
		}
	}
	async upsertData(): Promise<number> {
		try {
			this.dbProvider.beginTransaction();

			const upsertPlanOkPacket: OkPacket = await new UpsertPlan(this.dbProvider, this.plan).execute();
			const planId: number = upsertPlanOkPacket.insertId;

			const goalIdsToDelete: Array<number> = await this._getGoalIdsToDelete();
			if (goalIdsToDelete.length > 0) {
				await new DeleteBulkGoalsById(this.dbProvider, goalIdsToDelete).execute();
			}

			const { goals } = this.plan;
			if (goals && goals.length > 0) {
				goals.forEach(goal => goal.planId = planId)
				await new UpsertBulkGoals(this.dbProvider, goals).execute();
			}

			this.dbProvider.commit();

			return upsertPlanOkPacket.insertId;
		} catch (e) {
			this.dbProvider.rollback();
			throw e;
		}
	}
}

export default UpsertPlanGoalsCoordinator;
