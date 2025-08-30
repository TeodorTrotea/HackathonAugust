module.exports = [
"[project]/web/node_modules/langchain/dist/chains/api/prompts.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable spaced-comment */ __turbopack_context__.s([
    "API_RESPONSE_PROMPT_TEMPLATE",
    ()=>API_RESPONSE_PROMPT_TEMPLATE,
    "API_RESPONSE_RAW_PROMPT_TEMPLATE",
    ()=>API_RESPONSE_RAW_PROMPT_TEMPLATE,
    "API_URL_PROMPT_TEMPLATE",
    ()=>API_URL_PROMPT_TEMPLATE,
    "API_URL_RAW_PROMPT_TEMPLATE",
    ()=>API_URL_RAW_PROMPT_TEMPLATE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
;
const API_URL_RAW_PROMPT_TEMPLATE = `You are given the below API Documentation:
{api_docs}
Using this documentation, generate the full API url to call for answering the user question.
You should build the API url in order to get a response that is as short as possible, while still getting the necessary information to answer the question. Pay attention to deliberately exclude any unnecessary pieces of data in the API call.

Question:{question}
API url:`;
const API_URL_PROMPT_TEMPLATE = /* #__PURE__ */ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    inputVariables: [
        "api_docs",
        "question"
    ],
    template: API_URL_RAW_PROMPT_TEMPLATE
});
const API_RESPONSE_RAW_PROMPT_TEMPLATE = `${API_URL_RAW_PROMPT_TEMPLATE} {api_url}

Here is the response from the API:

{api_response}

Summarize this response to answer the original question.

Summary:`;
const API_RESPONSE_PROMPT_TEMPLATE = /* #__PURE__ */ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    inputVariables: [
        "api_docs",
        "question",
        "api_url",
        "api_response"
    ],
    template: API_RESPONSE_RAW_PROMPT_TEMPLATE
});
}),
"[project]/web/node_modules/langchain/dist/chains/api/api_chain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APIChain",
    ()=>APIChain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$api$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/api/prompts.js [app-route] (ecmascript)");
;
;
;
class APIChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    get inputKeys() {
        return [
            this.inputKey
        ];
    }
    get outputKeys() {
        return [
            this.outputKey
        ];
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "apiAnswerChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiRequestChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiDocs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "question"
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "output"
        });
        this.apiRequestChain = fields.apiRequestChain;
        this.apiAnswerChain = fields.apiAnswerChain;
        this.apiDocs = fields.apiDocs;
        this.inputKey = fields.inputKey ?? this.inputKey;
        this.outputKey = fields.outputKey ?? this.outputKey;
        this.headers = fields.headers ?? this.headers;
    }
    /** @ignore */ async _call(values, runManager) {
        const question = values[this.inputKey];
        const api_url = await this.apiRequestChain.predict({
            question,
            api_docs: this.apiDocs
        }, runManager?.getChild("request"));
        const res = await fetch(api_url, {
            headers: this.headers
        });
        const api_response = await res.text();
        const answer = await this.apiAnswerChain.predict({
            question,
            api_docs: this.apiDocs,
            api_url,
            api_response
        }, runManager?.getChild("response"));
        return {
            [this.outputKey]: answer
        };
    }
    _chainType() {
        return "api_chain";
    }
    static async deserialize(data) {
        const { api_request_chain, api_answer_chain, api_docs } = data;
        if (!api_request_chain) {
            throw new Error("LLMChain must have api_request_chain");
        }
        if (!api_answer_chain) {
            throw new Error("LLMChain must have api_answer_chain");
        }
        if (!api_docs) {
            throw new Error("LLMChain must have api_docs");
        }
        return new APIChain({
            apiAnswerChain: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"].deserialize(api_answer_chain),
            apiRequestChain: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"].deserialize(api_request_chain),
            apiDocs: api_docs
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            api_answer_chain: this.apiAnswerChain.serialize(),
            api_request_chain: this.apiRequestChain.serialize(),
            api_docs: this.apiDocs
        };
    }
    /**
     * Static method to create a new APIChain from a BaseLanguageModel and API
     * documentation.
     * @param llm BaseLanguageModel instance.
     * @param apiDocs API documentation.
     * @param options Optional configuration options for the APIChain.
     * @returns New APIChain instance.
     */ static fromLLMAndAPIDocs(llm, apiDocs, options = {}) {
        const { apiUrlPrompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$api$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_URL_PROMPT_TEMPLATE"], apiResponsePrompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$api$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_RESPONSE_PROMPT_TEMPLATE"] } = options;
        const apiRequestChain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            prompt: apiUrlPrompt,
            llm
        });
        const apiAnswerChain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            prompt: apiResponsePrompt,
            llm
        });
        return new this({
            apiAnswerChain,
            apiRequestChain,
            apiDocs,
            ...options
        });
    }
}
}),
];

//# sourceMappingURL=2374f_langchain_dist_chains_api_425e3cc3._.js.map