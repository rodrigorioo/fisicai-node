import express, { Express } from 'express';
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
import routes from "./routes";
require('dotenv').config();

// Setup
const app : Express = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Listen
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

// Export the Express API
export default app;
