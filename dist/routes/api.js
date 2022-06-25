"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Controllers
const APIController_1 = __importDefault(require("../controllers/APIController"));
// About page route.
router.post('/solve-problem', APIController_1.default.solveProblem);
exports.default = router;
