"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const App_1 = __importDefault(require("./App"));
const Locals_1 = __importDefault(require("./providers/Locals"));
const dotenv_1 = __importDefault(require("dotenv"));
/**
 * Init local .env
 */
dotenv_1.default.config(); // TODO conditional for dev only
/**
 * Make use of multi core CPU to scale up app instances
 */
if (Locals_1.default.config().clusterMode && cluster_1.default.isPrimary) {
    const CPUS = os_1.default.cpus();
    CPUS.forEach(() => cluster_1.default.fork());
}
else {
    void App_1.default.init();
}
