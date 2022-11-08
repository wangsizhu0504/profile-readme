"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const profile_route_1 = __importDefault(require("./routes/profile-route"));
// Profile widget
router.use('/profile', profile_route_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map