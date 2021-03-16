import express, { Express } from 'express';
import bodyParser from 'body-parser';
import PlanApi from './api/PlanApi';
import ResultsApi from './api/ResultsApi';

const app: Express = express();
const port: number = 3000;
const baseRoute: string = '/powerfitness';

app.listen(port, () => {
	console.log(`PowerFitness-ms listening at http://localhost:${port}`)
})

app.use(bodyParser.json())

app.use(baseRoute + PlanApi.route, new PlanApi().getRouter());
app.use(baseRoute + ResultsApi.route, new ResultsApi().getRouter());
