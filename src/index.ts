import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import PlanApi from './api/PlanApi';
import ResultsApi from './api/ResultsApi';

const app: Express = express();
const port: number = 3001;
const baseRoute: string = '/api/powerfitness';

app.listen(port, () => {
	console.log(`PowerFitness-ms listening at http://localhost:${port}`)
})

app.use(bodyParser.json())

app.use((req: Request, res: Response, next: NextFunction) => {
	console.info(req.originalUrl);
	next();
})

app.use(baseRoute + PlanApi.route, new PlanApi().getRouter());
app.use(baseRoute + ResultsApi.route, new ResultsApi().getRouter());
