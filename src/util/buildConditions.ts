/* eslint-disable @typescript-eslint/no-explicit-any */
import { escape } from 'mysql'

export const buildWhereAndConditions = (map: {[key: string]: any}): string => {
	const conditions: Array<string> = [];
	for (const key in map) {
		if (typeof map[key] !== 'undefined') {
			conditions.push(`${key} = ${escape(map[key])}`);
		}
	}
	return conditions.length ? conditions.join(' AND ') : '';
}

export const buildWhereOrConditions = (list: Array<any>, column: string): string => {
	const conditions: Array<string> = [];
	for (const key of list) {
		conditions.push(`${column} = ${escape(key)}`);
	}
	return conditions.length ? conditions.join(' OR ') : '';
}

export const buildBulkInsertValues = (
	columnNames: Array<string>,
	valuesList: Array<{[key: string]: any}>
): string => {
	let values: string = '';
	for (const valueMap of valuesList) {
		if (values.length > 0) {
			values += ', ';
		}
		let valuesForRow: string = '';
		for (const key of columnNames) {
			valuesForRow.length === 0 ? valuesForRow += '(' : valuesForRow += ', ';
			if (key === 'createdDate' || key === 'lastUpdatedDate') {
				valuesForRow += 'CURRENT_TIMESTAMP()'
			} else {
				typeof valueMap[key] !== 'undefined' ? valuesForRow += `${escape(valueMap[key])}`: valuesForRow += 'null';
			}
		}
		valuesForRow += ')';
		values += valuesForRow;
	}
	return values;
}


