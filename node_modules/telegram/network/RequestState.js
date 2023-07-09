"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestState = void 0;
class RequestState {
    constructor(request, after = undefined) {
        this.containerId = undefined;
        this.msgId = undefined;
        this.request = request;
        this.data = request.getBytes();
        this.after = after;
        this.result = undefined;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.RequestState = RequestState;
