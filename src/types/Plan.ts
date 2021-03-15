import { Goal } from './Goal';

export interface Plan {
	id: number;
	userUniqueId: string;
	motivationStatement: string;
	createdDate: string;
	lastUpdatedDate: string;
    goals?: Array<Goal>
}
