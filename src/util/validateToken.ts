import * as _firebaseAdmin from 'firebase-admin';
import { config } from '../config';
import { Logger } from '../util/loggerFactory'

let firebaseAdmin: _firebaseAdmin.app.App | null;
if (process.env.NODE_APP_INSTANCE === 'production' || process.env.NODE_APP_INSTANCE == 'localWithAuth') {
	firebaseAdmin = _firebaseAdmin.initializeApp({
		credential: _firebaseAdmin.credential.cert(config().adminCert || ''),
		projectId: 'powerfitness-app'
	});
}

export const validateToken = (token: string, logger: Logger): Promise<boolean> => {
	if (!firebaseAdmin) {
		return Promise.resolve(true);
	}
	return new Promise((resolve) => {
		(firebaseAdmin as _firebaseAdmin.app.App)
			.auth()
			.verifyIdToken(token)
			.then(() => {
				resolve(true)
			})
			.catch((error: Error) => {
				logger.error(error);
				resolve(false);
			});
	})
}

