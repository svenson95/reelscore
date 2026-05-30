import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import { SearchController } from '../controllers';

export const search = express.Router();

search.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new SearchController();

    const searchTerm =
      typeof req.query.searchTerm === 'string'
        ? req.query.searchTerm.trim()
        : '';

    if (!searchTerm) {
      return res.json([]);
    }

    const doc = await controller.getBySearchTerm(searchTerm);

    return res.json(doc);
  } catch (error) {
    return next(error);
  }
});
