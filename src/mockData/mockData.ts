import { Plan } from '../types/Plan';

export const plan: Plan = {
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
	]
};

export const results: unknown = [
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
		updatedDate: 'datetime'
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
		updatedDate: 'datetime'
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
		updatedDate: 'datetime'
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
		updatedDate: 'datetime'
	}
];
