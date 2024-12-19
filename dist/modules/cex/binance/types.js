"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
var AccountType;
(function (AccountType) {
    AccountType["SPOT"] = "SPOT";
    AccountType["MARGIN"] = "MARGIN";
})(AccountType || (AccountType = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "0";
    TransactionType["WITHDRAW"] = "1";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
