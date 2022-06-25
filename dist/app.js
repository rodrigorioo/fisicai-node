"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes_1 = __importDefault(require("./routes"));
require('dotenv').config();
// Setup
const app = (0, express_1.default)();
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
// Routes
app.use('/', routes_1.default);
// Listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
// Export the Express API
exports.default = app;
