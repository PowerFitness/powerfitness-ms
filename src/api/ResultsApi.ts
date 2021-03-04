import { Router, Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import GetResultsByQuery, { Result } from '../actions/GetResultsByQuery';
import { config } from '../config';

export class ResultsApi {
    static route: string = '/results'
    getRouter(): Router {
      const router: Router = Router();
      router.get('/', (...args) => this.getResults(...args))
      return router;
    }

    async getResults(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const query: ParsedQs = req.query;
        const results: Array<Result> = await new GetResultsByQuery(config().dbConfig, query).execute();
        res.send(results)
      } catch (e) {
        console.log(e.message)
      }
    }
}

export default ResultsApi;
