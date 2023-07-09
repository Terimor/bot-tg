"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineResult = void 0;
const api_1 = require("../api");
const __1 = require("../../");
const Helpers_1 = require("../../Helpers");
const inspect_1 = require("../../inspect");
class InlineResult {
    constructor(client, original, queryId, entity) {
        this._ARTICLE = "article";
        this._PHOTO = "photo";
        this._GIF = "gif";
        this._VIDEO = "video";
        this._VIDEO_GIF = "mpeg4_gif";
        this._AUDIO = "audio";
        this._DOCUMENT = "document";
        this._LOCATION = "location";
        this._VENUE = "venue";
        this._CONTACT = "contact";
        this._GAME = "game";
        this._client = client;
        this.result = original;
        this._queryId = queryId;
        this._entity = entity;
    }
    [inspect_1.inspect.custom]() {
        return (0, Helpers_1.betterConsoleLog)(this);
    }
    get type() {
        return this.result.type;
    }
    get message() {
        return this.result.sendMessage;
    }
    get description() {
        return this.result.description;
    }
    get url() {
        if (this.result instanceof api_1.Api.BotInlineResult) {
            return this.result.url;
        }
    }
    get photo() {
        if (this.result instanceof api_1.Api.BotInlineResult) {
            return this.result.thumb;
        }
        else {
            return this.result.photo;
        }
    }
    get document() {
        if (this.result instanceof api_1.Api.BotInlineResult) {
            return this.result.content;
        }
        else {
            return this.result.document;
        }
    }
    async click(entity, replyTo, silent = false, clearDraft = false, hideVia = false) {
        if (entity) {
            entity = await this._client.getInputEntity(entity);
        }
        else if (this._entity) {
            entity = this._entity;
        }
        else {
            throw new Error("You must provide the entity where the result should be sent to");
        }
        const replyId = replyTo ? __1.utils.getMessageId(replyTo) : undefined;
        const request = new api_1.Api.messages.SendInlineBotResult({
            peer: entity,
            queryId: this._queryId,
            id: this.result.id,
            silent: silent,
            clearDraft: clearDraft,
            hideVia: hideVia,
            replyToMsgId: replyId,
        });
        return await this._client.invoke(request);
    }
}
exports.InlineResult = InlineResult;
