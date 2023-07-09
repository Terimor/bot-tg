"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePacker = void 0;
const core_1 = require("../tl/core");
const core_2 = require("../tl/core");
const BinaryWriter_1 = require("./BinaryWriter");
class MessagePacker {
    constructor(state, logger) {
        this._state = state;
        this._queue = [];
        this._pendingStates = [];
        this._ready = new Promise((resolve) => {
            this.setReady = resolve;
        });
        this._log = logger;
    }
    values() {
        return this._queue;
    }
    append(state) {
        this._queue.push(state);
        if (this.setReady) {
            this.setReady(true);
        }
    }
    extend(states) {
        for (const state of states) {
            this.append(state);
        }
    }
    async get() {
        if (!this._queue.length) {
            this._ready = new Promise((resolve) => {
                this.setReady = resolve;
            });
            await this._ready;
        }
        let data;
        let buffer = new BinaryWriter_1.BinaryWriter(Buffer.alloc(0));
        const batch = [];
        let size = 0;
        while (this._queue.length &&
            batch.length <= core_1.MessageContainer.MAXIMUM_LENGTH) {
            const state = this._queue.shift();
            size += state.data.length + core_2.TLMessage.SIZE_OVERHEAD;
            if (size <= core_1.MessageContainer.MAXIMUM_SIZE) {
                let afterId;
                if (state.after) {
                    afterId = state.after.msgId;
                }
                state.msgId = await this._state.writeDataAsMessage(buffer, state.data, state.request.classType === "request", afterId);
                this._log.debug(`Assigned msgId = ${state.msgId} to ${state.request.className ||
                    state.request.constructor.name}`);
                batch.push(state);
                continue;
            }
            if (batch.length) {
                this._queue.unshift(state);
                break;
            }
            this._log.warn(`Message payload for ${state.request.className || state.request.constructor.name} is too long ${state.data.length} and cannot be sent`);
            state.promise.reject("Request Payload is too big");
            size = 0;
        }
        if (!batch.length) {
            return null;
        }
        if (batch.length > 1) {
            const b = Buffer.alloc(8);
            b.writeUInt32LE(core_1.MessageContainer.CONSTRUCTOR_ID, 0);
            b.writeInt32LE(batch.length, 4);
            data = Buffer.concat([b, buffer.getValue()]);
            buffer = new BinaryWriter_1.BinaryWriter(Buffer.alloc(0));
            const containerId = await this._state.writeDataAsMessage(buffer, data, false);
            for (const s of batch) {
                s.containerId = containerId;
            }
        }
        data = buffer.getValue();
        return { batch, data };
    }
    rejectAll() {
        this._pendingStates.forEach((requestState) => {
            var _a;
            requestState.reject(new Error("Disconnect (caused from " +
                ((_a = requestState === null || requestState === void 0 ? void 0 : requestState.request) === null || _a === void 0 ? void 0 : _a.className) +
                ")"));
        });
    }
}
exports.MessagePacker = MessagePacker;
