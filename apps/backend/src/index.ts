import express from 'express';
import { router } from './routes/v1/routes';

const app = express();

app.use('/api/v1', router);

app.listen(process.env.PORT || 3000);