import { Request } from 'express';

export const getToken = (req: Request): string => {
	const authorization: string = req.get('Authorization') as string;
	let token: string | null = null;
	if (authorization.startsWith('Bearer ')){
		token = authorization.substring(7, authorization.length);
	} else {
		throw new Error('Missing Authorization Header');
	}
	return token;
}
