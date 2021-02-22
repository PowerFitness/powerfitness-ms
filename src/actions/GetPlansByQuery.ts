import { ReadAction } from '../abstraction/ReadAction';
import { buildWhereConditions } from '../util/buildWhereConditions';
import { ParsedQs } from 'qs';
import { DbConfig } from '../config'

export interface Plan {
    id: number;
    userUniqueId: string;
    motivationStatement: string;
    createdDate: string;
    lastUpdatedDate: string;
}

interface PlansWhereMap { id?: number; userUniqueId?: string; }

export class GetPlansByQuery extends ReadAction {
    queryParams: ParsedQs;
    constructor(dbConfig: DbConfig, queryParams: ParsedQs) {
        super(dbConfig);
        this.queryParams = queryParams;
    }
    buildQuery(): string {
        const { id, userUniqueId } = this.queryParams;
        const whereMap: PlansWhereMap = {
            id,
            userUniqueId
        } as PlansWhereMap;
        return `select * from plans where ${buildWhereConditions(whereMap)}`
    }
}

export default GetPlansByQuery;