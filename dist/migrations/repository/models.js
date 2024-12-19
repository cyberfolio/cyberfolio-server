"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const migrationSchema = new mongoose_1.default.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
    },
});
const migrationModel = mongoose_1.default.model('migration', migrationSchema);
exports.default = migrationModel;
