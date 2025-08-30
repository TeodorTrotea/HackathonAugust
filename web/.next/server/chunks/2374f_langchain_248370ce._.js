module.exports = [
"[project]/web/node_modules/langchain/dist/util/ml-distance/similarities.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Returns the average of cosine distances between vectors a and b
 * @param a - first vector
 * @param b - second vector
 *
 */ __turbopack_context__.s([
    "cosine",
    ()=>cosine
]);
function cosine(a, b) {
    let p = 0;
    let p2 = 0;
    let q2 = 0;
    for(let i = 0; i < a.length; i++){
        p += a[i] * b[i];
        p2 += a[i] * a[i];
        q2 += b[i] * b[i];
    }
    return p / (Math.sqrt(p2) * Math.sqrt(q2));
}
}),
"[project]/web/node_modules/langchain/dist/util/math.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$utils$2f$math$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/utils/math.js [app-route] (ecmascript) <locals>");
;
}),
"[project]/web/node_modules/langchain/dist/vectorstores/memory.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MemoryVectorStore",
    ()=>MemoryVectorStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$vectorstores$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/vectorstores.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$vectorstores$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/vectorstores.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$documents$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/documents.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$documents$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/documents/document.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$ml$2d$distance$2f$similarities$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/util/ml-distance/similarities.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$math$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/util/math.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$math$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/utils/math.js [app-route] (ecmascript)");
;
;
;
;
class MemoryVectorStore extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$vectorstores$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStore"] {
    _vectorstoreType() {
        return "memory";
    }
    constructor(embeddings, { similarity, ...rest } = {}){
        super(embeddings, rest);
        Object.defineProperty(this, "memoryVectors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "similarity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.similarity = similarity ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$ml$2d$distance$2f$similarities$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cosine"];
    }
    /**
     * Method to add documents to the memory vector store. It extracts the
     * text from each document, generates embeddings for them, and adds the
     * resulting vectors to the store.
     * @param documents Array of `Document` instances to be added to the store.
     * @returns Promise that resolves when all documents have been added.
     */ async addDocuments(documents) {
        const texts = documents.map(({ pageContent })=>pageContent);
        return this.addVectors(await this.embeddings.embedDocuments(texts), documents);
    }
    /**
     * Method to add vectors to the memory vector store. It creates
     * `MemoryVector` instances for each vector and document pair and adds
     * them to the store.
     * @param vectors Array of vectors to be added to the store.
     * @param documents Array of `Document` instances corresponding to the vectors.
     * @returns Promise that resolves when all vectors have been added.
     */ async addVectors(vectors, documents) {
        const memoryVectors = vectors.map((embedding, idx)=>({
                content: documents[idx].pageContent,
                embedding,
                metadata: documents[idx].metadata,
                id: documents[idx].id
            }));
        this.memoryVectors = this.memoryVectors.concat(memoryVectors);
    }
    async _queryVectors(query, k, filter) {
        const filterFunction = (memoryVector)=>{
            if (!filter) {
                return true;
            }
            const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$documents$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]({
                metadata: memoryVector.metadata,
                pageContent: memoryVector.content,
                id: memoryVector.id
            });
            return filter(doc);
        };
        const filteredMemoryVectors = this.memoryVectors.filter(filterFunction);
        return filteredMemoryVectors.map((vector, index)=>({
                similarity: this.similarity(query, vector.embedding),
                index,
                metadata: vector.metadata,
                content: vector.content,
                embedding: vector.embedding,
                id: vector.id
            })).sort((a, b)=>a.similarity > b.similarity ? -1 : 0).slice(0, k);
    }
    /**
     * Method to perform a similarity search in the memory vector store. It
     * calculates the similarity between the query vector and each vector in
     * the store, sorts the results by similarity, and returns the top `k`
     * results along with their scores.
     * @param query Query vector to compare against the vectors in the store.
     * @param k Number of top results to return.
     * @param filter Optional filter function to apply to the vectors before performing the search.
     * @returns Promise that resolves with an array of tuples, each containing a `Document` and its similarity score.
     */ async similaritySearchVectorWithScore(query, k, filter) {
        const searches = await this._queryVectors(query, k, filter);
        const result = searches.map((search)=>[
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$documents$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]({
                    metadata: search.metadata,
                    pageContent: search.content,
                    id: search.id
                }),
                search.similarity
            ]);
        return result;
    }
    async maxMarginalRelevanceSearch(query, options) {
        const queryEmbedding = await this.embeddings.embedQuery(query);
        const searches = await this._queryVectors(queryEmbedding, options.fetchK ?? 20, options.filter);
        const embeddingList = searches.map((searchResp)=>searchResp.embedding);
        const mmrIndexes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$math$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maximalMarginalRelevance"])(queryEmbedding, embeddingList, options.lambda, options.k);
        return mmrIndexes.map((idx)=>new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$documents$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]({
                metadata: searches[idx].metadata,
                pageContent: searches[idx].content,
                id: searches[idx].id
            }));
    }
    /**
     * Static method to create a `MemoryVectorStore` instance from an array of
     * texts. It creates a `Document` for each text and metadata pair, and
     * adds them to the store.
     * @param texts Array of texts to be added to the store.
     * @param metadatas Array or single object of metadata corresponding to the texts.
     * @param embeddings `Embeddings` instance used to generate embeddings for the texts.
     * @param dbConfig Optional `MemoryVectorStoreArgs` to configure the `MemoryVectorStore` instance.
     * @returns Promise that resolves with a new `MemoryVectorStore` instance.
     */ static async fromTexts(texts, metadatas, embeddings, dbConfig) {
        const docs = [];
        for(let i = 0; i < texts.length; i += 1){
            const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
            const newDoc = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$documents$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]({
                pageContent: texts[i],
                metadata
            });
            docs.push(newDoc);
        }
        return MemoryVectorStore.fromDocuments(docs, embeddings, dbConfig);
    }
    /**
     * Static method to create a `MemoryVectorStore` instance from an array of
     * `Document` instances. It adds the documents to the store.
     * @param docs Array of `Document` instances to be added to the store.
     * @param embeddings `Embeddings` instance used to generate embeddings for the documents.
     * @param dbConfig Optional `MemoryVectorStoreArgs` to configure the `MemoryVectorStore` instance.
     * @returns Promise that resolves with a new `MemoryVectorStore` instance.
     */ static async fromDocuments(docs, embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        await instance.addDocuments(docs);
        return instance;
    }
    /**
     * Static method to create a `MemoryVectorStore` instance from an existing
     * index. It creates a new `MemoryVectorStore` instance without adding any
     * documents or vectors.
     * @param embeddings `Embeddings` instance used to generate embeddings for the documents.
     * @param dbConfig Optional `MemoryVectorStoreArgs` to configure the `MemoryVectorStore` instance.
     * @returns Promise that resolves with a new `MemoryVectorStore` instance.
     */ static async fromExistingIndex(embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        return instance;
    }
}
}),
"[project]/web/node_modules/langchain/vectorstores/memory.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$vectorstores$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/vectorstores/memory.js [app-route] (ecmascript)");
;
}),
"[project]/web/node_modules/langchain/dist/document.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$documents$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/documents.js [app-route] (ecmascript) <locals>");
;
}),
"[project]/web/node_modules/langchain/document.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/document.js [app-route] (ecmascript) <locals>");
;
}),
"[project]/web/node_modules/langchain/dist/document.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Document",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$documents$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/document.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$documents$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/documents/document.js [app-route] (ecmascript)");
}),
"[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Agent",
    ()=>Agent,
    "AgentRunnableSequence",
    ()=>AgentRunnableSequence,
    "BaseAgent",
    ()=>BaseAgent,
    "BaseMultiActionAgent",
    ()=>BaseMultiActionAgent,
    "BaseSingleActionAgent",
    ()=>BaseSingleActionAgent,
    "LLMSingleActionAgent",
    ()=>LLMSingleActionAgent,
    "RunnableAgent",
    ()=>RunnableAgent,
    "RunnableMultiActionAgent",
    ()=>RunnableMultiActionAgent,
    "RunnableSingleActionAgent",
    ()=>RunnableSingleActionAgent,
    "isRunnableAgent",
    ()=>isRunnableAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/load/serializable.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/load/serializable.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
;
;
/**
 * Error class for parse errors in LangChain. Contains information about
 * the error message and the output that caused the error.
 */ class ParseError extends Error {
    constructor(msg, output){
        super(msg);
        Object.defineProperty(this, "output", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.output = output;
    }
}
class BaseAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Serializable"] {
    get returnValues() {
        return [
            "output"
        ];
    }
    get allowedTools() {
        return undefined;
    }
    /**
     * Return the string type key uniquely identifying this class of agent.
     */ _agentType() {
        throw new Error("Not implemented");
    }
    /**
     * Return response when agent has been stopped due to max iterations
     */ returnStoppedResponse(earlyStoppingMethod, _steps, _inputs, _callbackManager) {
        if (earlyStoppingMethod === "force") {
            return Promise.resolve({
                returnValues: {
                    output: "Agent stopped due to max iterations."
                },
                log: ""
            });
        }
        throw new Error(`Invalid stopping method: ${earlyStoppingMethod}`);
    }
    /**
     * Prepare the agent for output, if needed
     */ async prepareForOutput(_returnValues, _steps) {
        return {};
    }
}
class BaseSingleActionAgent extends BaseAgent {
    _agentActionType() {
        return "single";
    }
}
class BaseMultiActionAgent extends BaseAgent {
    _agentActionType() {
        return "multi";
    }
}
function isAgentAction(input) {
    return !Array.isArray(input) && input?.tool !== undefined;
}
function isRunnableAgent(x) {
    return x.runnable !== undefined;
}
class AgentRunnableSequence extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnableSequence"] {
    constructor(){
        super(...arguments);
        Object.defineProperty(this, "streamRunnable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "singleAction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromRunnables([first, ...runnables], config) {
        const sequence = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnableSequence"].from([
            first,
            ...runnables
        ], config.name);
        sequence.singleAction = config.singleAction;
        sequence.streamRunnable = config.streamRunnable;
        return sequence;
    }
    static isAgentRunnableSequence(x) {
        return typeof x.singleAction === "boolean";
    }
}
class RunnableSingleActionAgent extends BaseSingleActionAgent {
    get inputKeys() {
        return [];
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "runnable"
            ]
        });
        Object.defineProperty(this, "runnable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Whether to stream from the runnable or not.
         * If true, the underlying LLM is invoked in a streaming fashion to make it
         * possible to get access to the individual LLM tokens when using
         * `streamLog` with the Agent Executor. If false then LLM is invoked in a
         * non-streaming fashion and individual LLM tokens will not be available
         * in `streamLog`.
         *
         * Note that the runnable should still only stream a single action or
         * finish chunk.
         */ Object.defineProperty(this, "streamRunnable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "defaultRunName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "RunnableAgent"
        });
        this.runnable = fields.runnable;
        this.defaultRunName = fields.defaultRunName ?? this.runnable.name ?? this.defaultRunName;
        this.streamRunnable = fields.streamRunnable ?? this.streamRunnable;
    }
    async plan(steps, inputs, callbackManager, config) {
        const combinedInput = {
            ...inputs,
            steps
        };
        const combinedConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["patchConfig"])(config, {
            callbacks: callbackManager,
            runName: this.defaultRunName
        });
        if (this.streamRunnable) {
            const stream = await this.runnable.stream(combinedInput, combinedConfig);
            let finalOutput;
            for await (const chunk of stream){
                if (finalOutput === undefined) {
                    finalOutput = chunk;
                } else {
                    throw new Error([
                        `Multiple agent actions/finishes received in streamed agent output.`,
                        `Set "streamRunnable: false" when initializing the agent to invoke this agent in non-streaming mode.`
                    ].join("\n"));
                }
            }
            if (finalOutput === undefined) {
                throw new Error([
                    "No streaming output received from underlying runnable.",
                    `Set "streamRunnable: false" when initializing the agent to invoke this agent in non-streaming mode.`
                ].join("\n"));
            }
            return finalOutput;
        } else {
            return this.runnable.invoke(combinedInput, combinedConfig);
        }
    }
}
class RunnableMultiActionAgent extends BaseMultiActionAgent {
    get inputKeys() {
        return [];
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "runnable"
            ]
        });
        // TODO: Rename input to "intermediate_steps"
        Object.defineProperty(this, "runnable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "defaultRunName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "RunnableAgent"
        });
        Object.defineProperty(this, "stop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "streamRunnable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this.runnable = fields.runnable;
        this.stop = fields.stop;
        this.defaultRunName = fields.defaultRunName ?? this.runnable.name ?? this.defaultRunName;
        this.streamRunnable = fields.streamRunnable ?? this.streamRunnable;
    }
    async plan(steps, inputs, callbackManager, config) {
        const combinedInput = {
            ...inputs,
            steps
        };
        const combinedConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["patchConfig"])(config, {
            callbacks: callbackManager,
            runName: this.defaultRunName
        });
        let output;
        if (this.streamRunnable) {
            const stream = await this.runnable.stream(combinedInput, combinedConfig);
            let finalOutput;
            for await (const chunk of stream){
                if (finalOutput === undefined) {
                    finalOutput = chunk;
                } else {
                    throw new Error([
                        `Multiple agent actions/finishes received in streamed agent output.`,
                        `Set "streamRunnable: false" when initializing the agent to invoke this agent in non-streaming mode.`
                    ].join("\n"));
                }
            }
            if (finalOutput === undefined) {
                throw new Error([
                    "No streaming output received from underlying runnable.",
                    `Set "streamRunnable: false" when initializing the agent to invoke this agent in non-streaming mode.`
                ].join("\n"));
            }
            output = finalOutput;
        } else {
            output = await this.runnable.invoke(combinedInput, combinedConfig);
        }
        if (isAgentAction(output)) {
            return [
                output
            ];
        }
        return output;
    }
}
class RunnableAgent extends RunnableMultiActionAgent {
}
class LLMSingleActionAgent extends BaseSingleActionAgent {
    constructor(input){
        super(input);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents"
            ]
        });
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.stop = input.stop;
        this.llmChain = input.llmChain;
        this.outputParser = input.outputParser;
    }
    get inputKeys() {
        return this.llmChain.inputKeys;
    }
    /**
     * Decide what to do given some input.
     *
     * @param steps - Steps the LLM has taken so far, along with observations from each.
     * @param inputs - User inputs.
     * @param callbackManager - Callback manager.
     *
     * @returns Action specifying what tool to use.
     */ async plan(steps, inputs, callbackManager) {
        const output = await this.llmChain.call({
            intermediate_steps: steps,
            stop: this.stop,
            ...inputs
        }, callbackManager);
        return this.outputParser.parse(output[this.llmChain.outputKey], callbackManager);
    }
}
class Agent extends BaseSingleActionAgent {
    get allowedTools() {
        return this._allowedTools;
    }
    get inputKeys() {
        return this.llmChain.inputKeys.filter((k)=>k !== "agent_scratchpad");
    }
    constructor(input){
        super(input);
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_allowedTools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        this.llmChain = input.llmChain;
        this._allowedTools = input.allowedTools;
        this.outputParser = input.outputParser;
    }
    /**
     * Get the default output parser for this agent.
     */ static getDefaultOutputParser(_fields) {
        throw new Error("Not implemented");
    }
    /**
     * Create a prompt for this class
     *
     * @param _tools - List of tools the agent will have access to, used to format the prompt.
     * @param _fields - Additional fields used to format the prompt.
     *
     * @returns A PromptTemplate assembled from the given tools and fields.
     * */ static createPrompt(_tools, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fields) {
        throw new Error("Not implemented");
    }
    /** Construct an agent from an LLM and a list of tools */ static fromLLMAndTools(_llm, _tools, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _args) {
        throw new Error("Not implemented");
    }
    /**
     * Validate that appropriate tools are passed in
     */ static validateTools(_tools) {}
    _stop() {
        return [
            `\n${this.observationPrefix()}`
        ];
    }
    /**
     * Name of tool to use to terminate the chain.
     */ finishToolName() {
        return "Final Answer";
    }
    /**
     * Construct a scratchpad to let the agent continue its thought process
     */ async constructScratchPad(steps) {
        return steps.reduce((thoughts, { action, observation })=>thoughts + [
                action.log,
                `${this.observationPrefix()}${observation}`,
                this.llmPrefix()
            ].join("\n"), "");
    }
    async _plan(steps, inputs, suffix, callbackManager) {
        const thoughts = await this.constructScratchPad(steps);
        const newInputs = {
            ...inputs,
            agent_scratchpad: suffix ? `${thoughts}${suffix}` : thoughts
        };
        if (this._stop().length !== 0) {
            newInputs.stop = this._stop();
        }
        const output = await this.llmChain.predict(newInputs, callbackManager);
        if (!this.outputParser) {
            throw new Error("Output parser not set");
        }
        return this.outputParser.parse(output, callbackManager);
    }
    /**
     * Decide what to do given some input.
     *
     * @param steps - Steps the LLM has taken so far, along with observations from each.
     * @param inputs - User inputs.
     * @param callbackManager - Callback manager to use for this call.
     *
     * @returns Action specifying what tool to use.
     */ plan(steps, inputs, callbackManager) {
        return this._plan(steps, inputs, undefined, callbackManager);
    }
    /**
     * Return response when agent has been stopped due to max iterations
     */ async returnStoppedResponse(earlyStoppingMethod, steps, inputs, callbackManager) {
        if (earlyStoppingMethod === "force") {
            return {
                returnValues: {
                    output: "Agent stopped due to max iterations."
                },
                log: ""
            };
        }
        if (earlyStoppingMethod === "generate") {
            try {
                const action = await this._plan(steps, inputs, "\n\nI now need to return a final answer based on the previous steps:", callbackManager);
                if ("returnValues" in action) {
                    return action;
                }
                return {
                    returnValues: {
                        output: action.log
                    },
                    log: action.log
                };
            } catch (err) {
                // fine to use instanceof because we're in the same module
                // eslint-disable-next-line no-instanceof/no-instanceof
                if (!(err instanceof ParseError)) {
                    throw err;
                }
                return {
                    returnValues: {
                        output: err.output
                    },
                    log: err.output
                };
            }
        }
        throw new Error(`Invalid stopping method: ${earlyStoppingMethod}`);
    }
    /**
     * Load an agent from a json-like object describing it.
     */ static async deserialize(data) {
        switch(data._type){
            case "zero-shot-react-description":
                {
                    const { ZeroShotAgent } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/agents/mrkl/index.js [app-route] (ecmascript, async loader)");
                    return ZeroShotAgent.deserialize(data);
                }
            default:
                throw new Error("Unknown agent type");
        }
    }
}
}),
"[project]/web/node_modules/langchain/dist/tools/json.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JsonGetValueTool",
    ()=>JsonGetValueTool,
    "JsonListKeysTool",
    ()=>JsonListKeysTool,
    "JsonSpec",
    ()=>JsonSpec
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jsonpointer$2f$jsonpointer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jsonpointer/jsonpointer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/load/serializable.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/load/serializable.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript)");
;
;
;
class JsonSpec extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Serializable"] {
    constructor(obj, max_value_length = 4000){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "tools",
                "json"
            ]
        });
        Object.defineProperty(this, "obj", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxValueLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4000
        });
        this.obj = obj;
        this.maxValueLength = max_value_length;
    }
    /**
     * Retrieves all keys at a given path in the JSON object.
     * @param input The path to the keys in the JSON object, provided as a string in JSON pointer syntax.
     * @returns A string containing all keys at the given path, separated by commas.
     */ getKeys(input) {
        const pointer = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jsonpointer$2f$jsonpointer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compile(input);
        const res = pointer.get(this.obj);
        if (typeof res === "object" && !Array.isArray(res) && res !== null) {
            return Object.keys(res).map((i)=>i.replaceAll("~", "~0").replaceAll("/", "~1")).join(", ");
        }
        throw new Error(`Value at ${input} is not a dictionary, get the value directly instead.`);
    }
    /**
     * Retrieves the value at a given path in the JSON object.
     * @param input The path to the value in the JSON object, provided as a string in JSON pointer syntax.
     * @returns The value at the given path in the JSON object, as a string. If the value is a large dictionary or exceeds the maximum length, a message is returned instead.
     */ getValue(input) {
        const pointer = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jsonpointer$2f$jsonpointer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compile(input);
        const res = pointer.get(this.obj);
        if (res === null || res === undefined) {
            throw new Error(`Value at ${input} is null or undefined.`);
        }
        const str = typeof res === "object" ? JSON.stringify(res) : res.toString();
        if (typeof res === "object" && !Array.isArray(res) && str.length > this.maxValueLength) {
            return `Value is a large dictionary, should explore its keys directly.`;
        }
        if (str.length > this.maxValueLength) {
            return `${str.slice(0, this.maxValueLength)}...`;
        }
        return str;
    }
}
class JsonListKeysTool extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tool"] {
    static lc_name() {
        return "JsonListKeysTool";
    }
    constructor(fields){
        if (!("jsonSpec" in fields)) {
            // eslint-disable-next-line no-param-reassign
            fields = {
                jsonSpec: fields
            };
        }
        super(fields);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "json_list_keys"
        });
        Object.defineProperty(this, "jsonSpec", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: `Can be used to list all keys at a given path.
    Before calling this you should be SURE that the path to this exists.
    The input is a text representation of the path to the json as json pointer syntax (e.g. /key1/0/key2).`
        });
        this.jsonSpec = fields.jsonSpec;
    }
    /** @ignore */ async _call(input) {
        try {
            return this.jsonSpec.getKeys(input);
        } catch (error) {
            return `${error}`;
        }
    }
}
class JsonGetValueTool extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tool"] {
    static lc_name() {
        return "JsonGetValueTool";
    }
    constructor(jsonSpec){
        super();
        Object.defineProperty(this, "jsonSpec", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: jsonSpec
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "json_get_value"
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: `Can be used to see value in string format at a given path.
    Before calling this you should be SURE that the path to this exists.
    The input is a text representation of the path to the json as json pointer syntax (e.g. /key1/0/key2).`
        });
    }
    /** @ignore */ async _call(input) {
        try {
            return this.jsonSpec.getValue(input);
        } catch (error) {
            return `${error}`;
        }
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/json/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JSON_PREFIX",
    ()=>JSON_PREFIX,
    "JSON_SUFFIX",
    ()=>JSON_SUFFIX
]);
const JSON_PREFIX = `You are an agent designed to interact with JSON.
Your goal is to return a final answer by interacting with the JSON.
You have access to the following tools which help you learn more about the JSON you are interacting with.
Only use the below tools. Only use the information returned by the below tools to construct your final answer.
Do not make up any information that is not contained in the JSON.
Your input to the tools should be in the form of in json pointer syntax (e.g. /key1/0/key2).
You must escape a slash in a key with a ~1, and escape a tilde with a ~0.
For example, to access the key /foo, you would use /~1foo
You should only use keys that you know for a fact exist. You must validate that a key exists by seeing it previously when calling 'json_list_keys'.
If you have not seen a key in one of those responses, you cannot use it.
You should only add one key at a time to the path. You cannot add multiple keys at once.
If you encounter a null or undefined value, go back to the previous key, look at the available keys, and try again.

If the question does not seem to be related to the JSON, just return "I don't know" as the answer.
Always begin your interaction with the 'json_list_keys' with an empty string as the input to see what keys exist in the JSON.

Note that sometimes the value at a given path is large. In this case, you will get an error "Value is a large dictionary, should explore its keys directly".
In this case, you should ALWAYS follow up by using the 'json_list_keys' tool to see what keys exist at that path.
Do not simply refer the user to the JSON or a section of the JSON, as this is not a valid answer. Keep digging until you find the answer and explicitly return it.`;
const JSON_SUFFIX = `Begin!"

Question: {input}
Thought: I should look at the keys that exist to see what I can query. I should use the 'json_list_keys' tool with an empty string as the input.
{agent_scratchpad}`;
}),
"[project]/web/node_modules/langchain/dist/chains/base.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseChain",
    ()=>BaseChain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$outputs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/outputs.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$outputs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/outputs.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$callbacks$2f$manager$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/callbacks/manager.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$callbacks$2f$manager$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/callbacks/manager.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/language_models/base.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/language_models/base.js [app-route] (ecmascript)");
;
;
;
;
class BaseChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseLangChain"] {
    get lc_namespace() {
        return [
            "langchain",
            "chains",
            this._chainType()
        ];
    }
    constructor(fields, /** @deprecated */ verbose, /** @deprecated */ callbacks){
        if (arguments.length === 1 && typeof fields === "object" && !("saveContext" in fields)) {
            // fields is not a BaseMemory
            const { memory, callbackManager, ...rest } = fields;
            super({
                ...rest,
                callbacks: callbackManager ?? rest.callbacks
            });
            this.memory = memory;
        } else {
            // fields is a BaseMemory
            super({
                verbose,
                callbacks
            });
            this.memory = fields;
        }
    }
    /** @ignore */ _selectMemoryInputs(values) {
        const valuesForMemory = {
            ...values
        };
        if ("signal" in valuesForMemory) {
            delete valuesForMemory.signal;
        }
        if ("timeout" in valuesForMemory) {
            delete valuesForMemory.timeout;
        }
        return valuesForMemory;
    }
    /**
     * Invoke the chain with the provided input and returns the output.
     * @param input Input values for the chain run.
     * @param config Optional configuration for the Runnable.
     * @returns Promise that resolves with the output of the chain run.
     */ async invoke(input, options) {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureConfig"])(options);
        const fullValues = await this._formatValues(input);
        const callbackManager_ = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$callbacks$2f$manager$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CallbackManager"].configure(config?.callbacks, this.callbacks, config?.tags, this.tags, config?.metadata, this.metadata, {
            verbose: this.verbose
        });
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), fullValues, undefined, undefined, undefined, undefined, config?.runName);
        let outputValues;
        try {
            outputValues = await (fullValues.signal ? Promise.race([
                this._call(fullValues, runManager, config),
                new Promise((_, reject)=>{
                    fullValues.signal?.addEventListener("abort", ()=>{
                        reject(new Error("AbortError"));
                    });
                })
            ]) : this._call(fullValues, runManager, config));
        } catch (e) {
            await runManager?.handleChainError(e);
            throw e;
        }
        if (!(this.memory == null)) {
            await this.memory.saveContext(this._selectMemoryInputs(input), outputValues);
        }
        await runManager?.handleChainEnd(outputValues);
        // add the runManager's currentRunId to the outputValues
        Object.defineProperty(outputValues, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$outputs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RUN_KEY"], {
            value: runManager ? {
                runId: runManager?.runId
            } : undefined,
            configurable: true
        });
        return outputValues;
    }
    _validateOutputs(outputs) {
        const missingKeys = this.outputKeys.filter((k)=>!(k in outputs));
        if (missingKeys.length) {
            throw new Error(`Missing output keys: ${missingKeys.join(", ")} from chain ${this._chainType()}`);
        }
    }
    async prepOutputs(inputs, outputs, returnOnlyOutputs = false) {
        this._validateOutputs(outputs);
        if (this.memory) {
            await this.memory.saveContext(inputs, outputs);
        }
        if (returnOnlyOutputs) {
            return outputs;
        }
        return {
            ...inputs,
            ...outputs
        };
    }
    /**
     * Return a json-like object representing this chain.
     */ serialize() {
        throw new Error("Method not implemented.");
    }
    /** @deprecated Use .invoke() instead. Will be removed in 0.2.0. */ async run(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    input, config) {
        const inputKeys = this.inputKeys.filter((k)=>!this.memory?.memoryKeys.includes(k));
        const isKeylessInput = inputKeys.length <= 1;
        if (!isKeylessInput) {
            throw new Error(`Chain ${this._chainType()} expects multiple inputs, cannot use 'run' `);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const values = inputKeys.length ? {
            [inputKeys[0]]: input
        } : {};
        const returnValues = await this.call(values, config);
        const keys = Object.keys(returnValues);
        if (keys.length === 1) {
            return returnValues[keys[0]];
        }
        throw new Error("return values have multiple keys, `run` only supported when one key currently");
    }
    async _formatValues(values) {
        const fullValues = {
            ...values
        };
        if (fullValues.timeout && !fullValues.signal) {
            fullValues.signal = AbortSignal.timeout(fullValues.timeout);
            delete fullValues.timeout;
        }
        if (!(this.memory == null)) {
            const newValues = await this.memory.loadMemoryVariables(this._selectMemoryInputs(values));
            for (const [key, value] of Object.entries(newValues)){
                fullValues[key] = value;
            }
        }
        return fullValues;
    }
    /**
     * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
     *
     * Run the core logic of this chain and add to output if desired.
     *
     * Wraps _call and handles memory.
     */ async call(values, config, /** @deprecated */ tags) {
        const parsedConfig = {
            tags,
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$callbacks$2f$manager$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCallbackConfigArg"])(config)
        };
        return this.invoke(values, parsedConfig);
    }
    /**
     * @deprecated Use .batch() instead. Will be removed in 0.2.0.
     *
     * Call the chain on all inputs in the list
     */ async apply(inputs, config) {
        return Promise.all(inputs.map(async (i, idx)=>this.call(i, config?.[idx])));
    }
    /**
     * Load a chain from a json-like object describing it.
     */ static async deserialize(data, values = {}) {
        switch(data._type){
            case "llm_chain":
                {
                    const { LLMChain } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript, async loader)");
                    return LLMChain.deserialize(data);
                }
            case "sequential_chain":
                {
                    const { SequentialChain } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/chains/sequential_chain.js [app-route] (ecmascript, async loader)");
                    return SequentialChain.deserialize(data);
                }
            case "simple_sequential_chain":
                {
                    const { SimpleSequentialChain } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/chains/sequential_chain.js [app-route] (ecmascript, async loader)");
                    return SimpleSequentialChain.deserialize(data);
                }
            case "stuff_documents_chain":
                {
                    const { StuffDocumentsChain } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/chains/combine_docs_chain.js [app-route] (ecmascript, async loader)");
                    return StuffDocumentsChain.deserialize(data);
                }
            case "map_reduce_documents_chain":
                {
                    const { MapReduceDocumentsChain } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/chains/combine_docs_chain.js [app-route] (ecmascript, async loader)");
                    return MapReduceDocumentsChain.deserialize(data);
                }
            case "refine_documents_chain":
                {
                    const { RefineDocumentsChain } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/chains/combine_docs_chain.js [app-route] (ecmascript, async loader)");
                    return RefineDocumentsChain.deserialize(data);
                }
            case "vector_db_qa":
                {
                    const { VectorDBQAChain } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/chains/vector_db_qa.js [app-route] (ecmascript, async loader)");
                    return VectorDBQAChain.deserialize(data, values);
                }
            case "api_chain":
                {
                    const { APIChain } = await __turbopack_context__.A("[project]/web/node_modules/langchain/dist/chains/api/api_chain.js [app-route] (ecmascript, async loader)");
                    return APIChain.deserialize(data);
                }
            default:
                throw new Error(`Invalid prompt type in config: ${data._type}`);
        }
    }
}
}),
"[project]/web/node_modules/langchain/dist/output_parsers/noop.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NoOpOutputParser",
    ()=>NoOpOutputParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
;
class NoOpOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseOutputParser"] {
    constructor(){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "output_parsers",
                "default"
            ]
        });
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    static lc_name() {
        return "NoOpOutputParser";
    }
    /**
     * This method takes a string as input and returns the same string as
     * output. It does not perform any operations on the input string.
     * @param text The input string to be parsed.
     * @returns The same input string without any operations performed on it.
     */ parse(text) {
        return Promise.resolve(text);
    }
    /**
     * This method returns an empty string. It does not provide any formatting
     * instructions.
     * @returns An empty string, indicating no formatting instructions.
     */ getFormatInstructions() {
        return "";
    }
}
}),
"[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LLMChain",
    ()=>LLMChain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/language_models/base.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/language_models/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$output_parsers$2f$noop$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/output_parsers/noop.js [app-route] (ecmascript)");
;
;
;
;
;
function isBaseLanguageModel(llmLike) {
    return typeof llmLike._llmType === "function";
}
function _getLanguageModel(llmLike) {
    if (isBaseLanguageModel(llmLike)) {
        return llmLike;
    } else if ("bound" in llmLike && __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Runnable"].isRunnable(llmLike.bound)) {
        return _getLanguageModel(llmLike.bound);
    } else if ("runnable" in llmLike && "fallbacks" in llmLike && __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Runnable"].isRunnable(llmLike.runnable)) {
        return _getLanguageModel(llmLike.runnable);
    } else if ("default" in llmLike && __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Runnable"].isRunnable(llmLike.default)) {
        return _getLanguageModel(llmLike.default);
    } else {
        throw new Error("Unable to extract BaseLanguageModel from llmLike object.");
    }
}
class LLMChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    static lc_name() {
        return "LLMChain";
    }
    get inputKeys() {
        return this.prompt.inputVariables;
    }
    get outputKeys() {
        return [
            this.outputKey
        ];
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "prompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llmKwargs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "text"
        });
        Object.defineProperty(this, "outputParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.prompt = fields.prompt;
        this.llm = fields.llm;
        this.llmKwargs = fields.llmKwargs;
        this.outputKey = fields.outputKey ?? this.outputKey;
        this.outputParser = fields.outputParser ?? new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$output_parsers$2f$noop$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NoOpOutputParser"]();
        if (this.prompt.outputParser) {
            if (fields.outputParser) {
                throw new Error("Cannot set both outputParser and prompt.outputParser");
            }
            this.outputParser = this.prompt.outputParser;
        }
    }
    getCallKeys() {
        const callKeys = "callKeys" in this.llm ? this.llm.callKeys : [];
        return callKeys;
    }
    /** @ignore */ _selectMemoryInputs(values) {
        const valuesForMemory = super._selectMemoryInputs(values);
        const callKeys = this.getCallKeys();
        for (const key of callKeys){
            if (key in values) {
                delete valuesForMemory[key];
            }
        }
        return valuesForMemory;
    }
    /** @ignore */ async _getFinalOutput(generations, promptValue, runManager) {
        let finalCompletion;
        if (this.outputParser) {
            finalCompletion = await this.outputParser.parseResultWithPrompt(generations, promptValue, runManager?.getChild());
        } else {
            finalCompletion = generations[0].text;
        }
        return finalCompletion;
    }
    /**
     * Run the core logic of this chain and add to output if desired.
     *
     * Wraps _call and handles memory.
     */ call(values, config) {
        return super.call(values, config);
    }
    /** @ignore */ async _call(values, runManager) {
        const valuesForPrompt = {
            ...values
        };
        const valuesForLLM = {
            ...this.llmKwargs
        };
        const callKeys = this.getCallKeys();
        for (const key of callKeys){
            if (key in values) {
                if ("TURBOPACK compile-time truthy", 1) {
                    valuesForLLM[key] = values[key];
                    delete valuesForPrompt[key];
                }
            }
        }
        const promptValue = await this.prompt.formatPromptValue(valuesForPrompt);
        if ("generatePrompt" in this.llm) {
            const { generations } = await this.llm.generatePrompt([
                promptValue
            ], valuesForLLM, runManager?.getChild());
            return {
                [this.outputKey]: await this._getFinalOutput(generations[0], promptValue, runManager)
            };
        }
        const modelWithParser = this.outputParser ? this.llm.pipe(this.outputParser) : this.llm;
        const response = await modelWithParser.invoke(promptValue, runManager?.getChild());
        return {
            [this.outputKey]: response
        };
    }
    /**
     * Format prompt with values and pass to LLM
     *
     * @param values - keys to pass to prompt template
     * @param callbackManager - CallbackManager to use
     * @returns Completion from LLM.
     *
     * @example
     * ```ts
     * llm.predict({ adjective: "funny" })
     * ```
     */ async predict(values, callbackManager) {
        const output = await this.call(values, callbackManager);
        return output[this.outputKey];
    }
    _chainType() {
        return "llm";
    }
    static async deserialize(data) {
        const { llm, prompt } = data;
        if (!llm) {
            throw new Error("LLMChain must have llm");
        }
        if (!prompt) {
            throw new Error("LLMChain must have prompt");
        }
        return new LLMChain({
            llm: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseLanguageModel"].deserialize(llm),
            prompt: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BasePromptTemplate"].deserialize(prompt)
        });
    }
    /** @deprecated */ serialize() {
        const serialize = "serialize" in this.llm ? this.llm.serialize() : undefined;
        return {
            _type: `${this._chainType()}_chain`,
            llm: serialize,
            prompt: this.prompt.serialize()
        };
    }
    _getNumTokens(text) {
        return _getLanguageModel(this.llm).getNumTokens(text);
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/helpers.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deserializeHelper",
    ()=>deserializeHelper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
;
const deserializeHelper = async (llm, tools, data, fromLLMAndTools, fromConstructor)=>{
    if (data.load_from_llm_and_tools) {
        if (!llm) {
            throw new Error("Loading from llm and tools, llm must be provided.");
        }
        if (!tools) {
            throw new Error("Loading from llm and tools, tools must be provided.");
        }
        return fromLLMAndTools(llm, tools, data);
    }
    if (!data.llm_chain) {
        throw new Error("Loading from constructor, llm_chain must be provided.");
    }
    const llmChain = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"].deserialize(data.llm_chain);
    return fromConstructor({
        ...data,
        llmChain
    });
};
}),
"[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AgentActionOutputParser",
    ()=>AgentActionOutputParser,
    "AgentMultiActionOutputParser",
    ()=>AgentMultiActionOutputParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
;
class AgentActionOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseOutputParser"] {
}
class AgentMultiActionOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseOutputParser"] {
}
}),
"[project]/web/node_modules/langchain/dist/agents/mrkl/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FORMAT_INSTRUCTIONS",
    ()=>FORMAT_INSTRUCTIONS,
    "PREFIX",
    ()=>PREFIX,
    "SUFFIX",
    ()=>SUFFIX
]);
const PREFIX = `Answer the following questions as best you can. You have access to the following tools:`;
const FORMAT_INSTRUCTIONS = `Use the following format in your response:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question`;
const SUFFIX = `Begin!

Question: {input}
Thought:{agent_scratchpad}`;
}),
"[project]/web/node_modules/langchain/dist/agents/mrkl/outputParser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FINAL_ANSWER_ACTION",
    ()=>FINAL_ANSWER_ACTION,
    "ZeroShotAgentOutputParser",
    ()=>ZeroShotAgentOutputParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/prompt.js [app-route] (ecmascript)");
;
;
;
const FINAL_ANSWER_ACTION = "Final Answer:";
class ZeroShotAgentOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "mrkl"
            ]
        });
        Object.defineProperty(this, "finishToolName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.finishToolName = fields?.finishToolName || FINAL_ANSWER_ACTION;
    }
    /**
     * Parses the text output of an agent action, extracting the tool, tool
     * input, and output.
     * @param text The text output of an agent action.
     * @returns An object containing the tool, tool input, and output extracted from the text, along with the original text as a log.
     */ async parse(text) {
        if (text.includes(this.finishToolName)) {
            const parts = text.split(this.finishToolName);
            const output = parts[parts.length - 1].trim();
            return {
                returnValues: {
                    output
                },
                log: text
            };
        }
        const match = /Action:([\s\S]*?)(?:\nAction Input:([\s\S]*?))?$/.exec(text);
        if (!match) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Could not parse LLM output: ${text}`);
        }
        return {
            tool: match[1].trim(),
            toolInput: match[2] ? match[2].trim().replace(/^("+)(.*?)(\1)$/, "$2") : "",
            log: text
        };
    }
    /**
     * Returns the format instructions for parsing the output of an agent
     * action in the style of the ZeroShotAgent.
     * @returns The format instructions for parsing the output.
     */ getFormatInstructions() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"];
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/mrkl/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZeroShotAgent",
    ()=>ZeroShotAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/template.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/helpers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/prompt.js [app-route] (ecmascript)");
;
;
;
;
;
;
class ZeroShotAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Agent"] {
    static lc_name() {
        return "ZeroShotAgent";
    }
    constructor(input){
        const outputParser = input?.outputParser ?? ZeroShotAgent.getDefaultOutputParser();
        super({
            ...input,
            outputParser
        });
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "mrkl"
            ]
        });
    }
    _agentType() {
        return "zero-shot-react-description";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    /**
     * Returns the default output parser for the ZeroShotAgent.
     * @param fields Optional arguments for the output parser.
     * @returns An instance of ZeroShotAgentOutputParser.
     */ static getDefaultOutputParser(fields) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgentOutputParser"](fields);
    }
    /**
     * Validates the tools for the ZeroShotAgent. Throws an error if any tool
     * does not have a description.
     * @param tools List of tools to validate.
     */ static validateTools(tools) {
        const descriptionlessTool = tools.find((tool)=>!tool.description);
        if (descriptionlessTool) {
            const msg = `Got a tool ${descriptionlessTool.name} without a description.` + ` This agent requires descriptions for all tools.`;
            throw new Error(msg);
        }
    }
    /**
     * Create prompt in the style of the zero shot agent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.suffix - String to put after the list of tools.
     * @param args.prefix - String to put before the list of tools.
     * @param args.inputVariables - List of input variables the final prompt will expect.
     */ static createPrompt(tools, args) {
        const { prefix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PREFIX"], suffix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUFFIX"], inputVariables = [
            "input",
            "agent_scratchpad"
        ] } = args ?? {};
        const toolStrings = tools.map((tool)=>`${tool.name}: ${tool.description}`).join("\n");
        const toolNames = tools.map((tool)=>`"${tool.name}"`).join(", ");
        const formatInstructions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"], "f-string", {
            tool_names: toolNames
        });
        const template = [
            prefix,
            toolStrings,
            formatInstructions,
            suffix
        ].join("\n\n");
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
            template,
            inputVariables
        });
    }
    /**
     * Creates a ZeroShotAgent from a Large Language Model and a set of tools.
     * @param llm The Large Language Model to use.
     * @param tools The tools for the agent to use.
     * @param args Optional arguments for creating the agent.
     * @returns A new instance of ZeroShotAgent.
     */ static fromLLMAndTools(llm, tools, args) {
        ZeroShotAgent.validateTools(tools);
        const prompt = ZeroShotAgent.createPrompt(tools, args);
        const outputParser = args?.outputParser ?? ZeroShotAgent.getDefaultOutputParser();
        const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            prompt,
            llm,
            callbacks: args?.callbacks ?? args?.callbackManager
        });
        return new ZeroShotAgent({
            llmChain: chain,
            allowedTools: tools.map((t)=>t.name),
            outputParser
        });
    }
    static async deserialize(data) {
        const { llm, tools, ...rest } = data;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deserializeHelper"])(llm, tools, rest, (llm, tools, args)=>ZeroShotAgent.fromLLMAndTools(llm, tools, {
                prefix: args.prefix,
                suffix: args.suffix,
                inputVariables: args.input_variables
            }), (args)=>new ZeroShotAgent(args));
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/executor.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AgentExecutor",
    ()=>AgentExecutor,
    "AgentExecutorIterator",
    ()=>AgentExecutorIterator,
    "ExceptionTool",
    ()=>ExceptionTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$callbacks$2f$manager$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/callbacks/manager.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$callbacks$2f$manager$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/callbacks/manager.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/load/serializable.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/load/serializable.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/base.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
class AgentExecutorIterator extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$load$2f$serializable$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Serializable"] {
    get finalOutputs() {
        return this._finalOutputs;
    }
    /** Intended to be used as a setter method, needs to be async. */ async setFinalOutputs(value) {
        this._finalOutputs = undefined;
        if (value) {
            const preparedOutputs = await this.agentExecutor.prepOutputs(this.inputs, value, true);
            this._finalOutputs = preparedOutputs;
        }
    }
    get nameToToolMap() {
        const toolMap = this.agentExecutor.tools.map((tool)=>({
                [tool.name]: tool
            }));
        return Object.assign({}, ...toolMap);
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "executor_iterator"
            ]
        });
        Object.defineProperty(this, "agentExecutor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @deprecated Use "config" */ Object.defineProperty(this, "callbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @deprecated Use "config" */ Object.defineProperty(this, "tags", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @deprecated Use "config" */ Object.defineProperty(this, "metadata", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @deprecated Use "config" */ Object.defineProperty(this, "runName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_finalOutputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "runManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "intermediateSteps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "iterations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.agentExecutor = fields.agentExecutor;
        this.inputs = fields.inputs;
        this.callbacks = fields.callbacks;
        this.tags = fields.tags;
        this.metadata = fields.metadata;
        this.runName = fields.runName;
        this.runManager = fields.runManager;
        this.config = fields.config;
    }
    /**
     * Reset the iterator to its initial state, clearing intermediate steps,
     * iterations, and the final output.
     */ reset() {
        this.intermediateSteps = [];
        this.iterations = 0;
        this._finalOutputs = undefined;
    }
    updateIterations() {
        this.iterations += 1;
    }
    async *streamIterator() {
        this.reset();
        // Loop to handle iteration
        while(true){
            try {
                if (this.iterations === 0) {
                    await this.onFirstStep();
                }
                const result = await this._callNext();
                yield result;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e) {
                if ("message" in e && e.message.startsWith("Final outputs already reached: ")) {
                    if (!this.finalOutputs) {
                        throw e;
                    }
                    return this.finalOutputs;
                }
                if (this.runManager) {
                    await this.runManager.handleChainError(e);
                }
                throw e;
            }
        }
    }
    /**
     * Perform any necessary setup for the first step
     * of the asynchronous iterator.
     */ async onFirstStep() {
        if (this.iterations === 0) {
            const callbackManager = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$callbacks$2f$manager$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CallbackManager"].configure(this.callbacks ?? this.config?.callbacks, this.agentExecutor.callbacks, this.tags ?? this.config?.tags, this.agentExecutor.tags, this.metadata ?? this.config?.metadata, this.agentExecutor.metadata, {
                verbose: this.agentExecutor.verbose
            });
            this.runManager = await callbackManager?.handleChainStart(this.agentExecutor.toJSON(), this.inputs, this.config?.runId, undefined, this.tags ?? this.config?.tags, this.metadata ?? this.config?.metadata, this.runName ?? this.config?.runName);
            if (this.config !== undefined) {
                delete this.config.runId;
            }
        }
    }
    /**
     * Execute the next step in the chain using the
     * AgentExecutor's _takeNextStep method.
     */ async _executeNextStep(runManager) {
        return this.agentExecutor._takeNextStep(this.nameToToolMap, this.inputs, this.intermediateSteps, runManager, this.config);
    }
    /**
     * Process the output of the next step,
     * handling AgentFinish and tool return cases.
     */ async _processNextStepOutput(nextStepOutput, runManager) {
        if ("returnValues" in nextStepOutput) {
            const output = await this.agentExecutor._return(nextStepOutput, this.intermediateSteps, runManager);
            if (this.runManager) {
                await this.runManager.handleChainEnd(output);
            }
            await this.setFinalOutputs(output);
            return output;
        }
        this.intermediateSteps = this.intermediateSteps.concat(nextStepOutput);
        let output = {};
        if (Array.isArray(nextStepOutput) && nextStepOutput.length === 1) {
            const nextStep = nextStepOutput[0];
            const toolReturn = await this.agentExecutor._getToolReturn(nextStep);
            if (toolReturn) {
                output = await this.agentExecutor._return(toolReturn, this.intermediateSteps, runManager);
                await this.runManager?.handleChainEnd(output);
                await this.setFinalOutputs(output);
            }
        }
        output = {
            intermediateSteps: nextStepOutput
        };
        return output;
    }
    async _stop() {
        const output = await this.agentExecutor.agent.returnStoppedResponse(this.agentExecutor.earlyStoppingMethod, this.intermediateSteps, this.inputs);
        const returnedOutput = await this.agentExecutor._return(output, this.intermediateSteps, this.runManager);
        await this.setFinalOutputs(returnedOutput);
        await this.runManager?.handleChainEnd(returnedOutput);
        return returnedOutput;
    }
    async _callNext() {
        // final output already reached: stopiteration (final output)
        if (this.finalOutputs) {
            throw new Error(`Final outputs already reached: ${JSON.stringify(this.finalOutputs, null, 2)}`);
        }
        // timeout/max iterations: stopiteration (stopped response)
        if (!this.agentExecutor.shouldContinueGetter(this.iterations)) {
            return this._stop();
        }
        const nextStepOutput = await this._executeNextStep(this.runManager);
        const output = await this._processNextStepOutput(nextStepOutput, this.runManager);
        this.updateIterations();
        return output;
    }
}
class ExceptionTool extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tool"] {
    constructor(){
        super(...arguments);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "_Exception"
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Exception tool"
        });
    }
    async _call(query) {
        return query;
    }
}
class AgentExecutor extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    static lc_name() {
        return "AgentExecutor";
    }
    get lc_namespace() {
        return [
            "langchain",
            "agents",
            "executor"
        ];
    }
    get inputKeys() {
        return this.agent.inputKeys;
    }
    get outputKeys() {
        return this.agent.returnValues;
    }
    constructor(input){
        let agent;
        let returnOnlyOutputs = true;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Runnable"].isRunnable(input.agent)) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentRunnableSequence"].isAgentRunnableSequence(input.agent)) {
                if (input.agent.singleAction) {
                    agent = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnableSingleActionAgent"]({
                        runnable: input.agent,
                        streamRunnable: input.agent.streamRunnable
                    });
                } else {
                    agent = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnableMultiActionAgent"]({
                        runnable: input.agent,
                        streamRunnable: input.agent.streamRunnable
                    });
                }
            } else {
                agent = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnableMultiActionAgent"]({
                    runnable: input.agent
                });
            }
            // TODO: Update BaseChain implementation on breaking change
            returnOnlyOutputs = false;
        } else {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRunnableAgent"])(input.agent)) {
                returnOnlyOutputs = false;
            }
            agent = input.agent;
        }
        super(input);
        Object.defineProperty(this, "agent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnIntermediateSteps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "maxIterations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 15
        });
        Object.defineProperty(this, "earlyStoppingMethod", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "force"
        });
        // TODO: Update BaseChain implementation on breaking change to include this
        Object.defineProperty(this, "returnOnlyOutputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        /**
         * How to handle errors raised by the agent's output parser.
          Defaults to `False`, which raises the error.
      
          If `true`, the error will be sent back to the LLM as an observation.
          If a string, the string itself will be sent to the LLM as an observation.
          If a callable function, the function will be called with the exception
          as an argument, and the result of that function will be passed to the agent
          as an observation.
         */ Object.defineProperty(this, "handleParsingErrors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "handleToolRuntimeErrors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.agent = agent;
        this.tools = input.tools;
        this.handleParsingErrors = input.handleParsingErrors ?? this.handleParsingErrors;
        this.handleToolRuntimeErrors = input.handleToolRuntimeErrors;
        this.returnOnlyOutputs = returnOnlyOutputs;
        if (this.agent._agentActionType() === "multi") {
            for (const tool of this.tools){
                if (tool.returnDirect) {
                    throw new Error(`Tool with return direct ${tool.name} not supported for multi-action agent.`);
                }
            }
        }
        this.returnIntermediateSteps = input.returnIntermediateSteps ?? this.returnIntermediateSteps;
        this.maxIterations = input.maxIterations ?? this.maxIterations;
        this.earlyStoppingMethod = input.earlyStoppingMethod ?? this.earlyStoppingMethod;
    }
    /** Create from agent and a list of tools. */ static fromAgentAndTools(fields) {
        return new AgentExecutor(fields);
    }
    get shouldContinueGetter() {
        return this.shouldContinue.bind(this);
    }
    /**
     * Method that checks if the agent execution should continue based on the
     * number of iterations.
     * @param iterations The current number of iterations.
     * @returns A boolean indicating whether the agent execution should continue.
     */ shouldContinue(iterations) {
        return this.maxIterations === undefined || iterations < this.maxIterations;
    }
    /** @ignore */ async _call(inputs, runManager, config) {
        const toolsByName = Object.fromEntries(this.tools.map((t)=>[
                t.name.toLowerCase(),
                t
            ]));
        const steps = [];
        let iterations = 0;
        const getOutput = async (finishStep)=>{
            const { returnValues } = finishStep;
            const additional = await this.agent.prepareForOutput(returnValues, steps);
            await runManager?.handleAgentEnd(finishStep);
            let response;
            if (this.returnIntermediateSteps) {
                response = {
                    ...returnValues,
                    intermediateSteps: steps,
                    ...additional
                };
            } else {
                response = {
                    ...returnValues,
                    ...additional
                };
            }
            if (!this.returnOnlyOutputs) {
                response = {
                    ...inputs,
                    ...response
                };
            }
            return response;
        };
        while(this.shouldContinue(iterations)){
            let output;
            try {
                output = await this.agent.plan(steps, inputs, runManager?.getChild(), config);
            } catch (e) {
                // eslint-disable-next-line no-instanceof/no-instanceof
                if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"]) {
                    let observation;
                    let text = e.message;
                    if (this.handleParsingErrors === true) {
                        if (e.sendToLLM) {
                            observation = e.observation;
                            text = e.llmOutput ?? "";
                        } else {
                            observation = "Invalid or incomplete response";
                        }
                    } else if (typeof this.handleParsingErrors === "string") {
                        observation = this.handleParsingErrors;
                    } else if (typeof this.handleParsingErrors === "function") {
                        observation = this.handleParsingErrors(e);
                    } else {
                        throw e;
                    }
                    output = {
                        tool: "_Exception",
                        toolInput: observation,
                        log: text
                    };
                } else {
                    throw e;
                }
            }
            // Check if the agent has finished
            if ("returnValues" in output) {
                return getOutput(output);
            }
            let actions;
            if (Array.isArray(output)) {
                actions = output;
            } else {
                actions = [
                    output
                ];
            }
            const newSteps = await Promise.all(actions.map(async (action)=>{
                await runManager?.handleAgentAction(action);
                const tool = action.tool === "_Exception" ? new ExceptionTool() : toolsByName[action.tool?.toLowerCase()];
                let observation;
                try {
                    observation = tool ? await tool.invoke(action.toolInput, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["patchConfig"])(config, {
                        callbacks: runManager?.getChild()
                    })) : `${action.tool} is not a valid tool, try another one.`;
                    if (typeof observation !== "string") {
                        throw new Error("Received unsupported non-string response from tool call.");
                    }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e) {
                    // eslint-disable-next-line no-instanceof/no-instanceof
                    if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ToolInputParsingException"]) {
                        if (this.handleParsingErrors === true) {
                            observation = "Invalid or incomplete tool input. Please try again.";
                        } else if (typeof this.handleParsingErrors === "string") {
                            observation = this.handleParsingErrors;
                        } else if (typeof this.handleParsingErrors === "function") {
                            observation = this.handleParsingErrors(e);
                        } else {
                            throw e;
                        }
                        observation = await new ExceptionTool().call(observation, runManager?.getChild());
                        return {
                            action,
                            observation: observation ?? ""
                        };
                    } else if (this.handleToolRuntimeErrors !== undefined) {
                        observation = this.handleToolRuntimeErrors(e);
                    }
                }
                return {
                    action,
                    observation: observation ?? ""
                };
            }));
            steps.push(...newSteps);
            const lastStep = steps[steps.length - 1];
            const lastTool = toolsByName[lastStep.action.tool?.toLowerCase()];
            if (lastTool?.returnDirect) {
                return getOutput({
                    returnValues: {
                        [this.agent.returnValues[0]]: lastStep.observation
                    },
                    log: ""
                });
            }
            iterations += 1;
        }
        const finish = await this.agent.returnStoppedResponse(this.earlyStoppingMethod, steps, inputs);
        return getOutput(finish);
    }
    async _takeNextStep(nameToolMap, inputs, intermediateSteps, runManager, config) {
        let output;
        try {
            output = await this.agent.plan(intermediateSteps, inputs, runManager?.getChild(), config);
        } catch (e) {
            // eslint-disable-next-line no-instanceof/no-instanceof
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"]) {
                let observation;
                let text = e.message;
                if (this.handleParsingErrors === true) {
                    if (e.sendToLLM) {
                        observation = e.observation;
                        text = e.llmOutput ?? "";
                    } else {
                        observation = "Invalid or incomplete response";
                    }
                } else if (typeof this.handleParsingErrors === "string") {
                    observation = this.handleParsingErrors;
                } else if (typeof this.handleParsingErrors === "function") {
                    observation = this.handleParsingErrors(e);
                } else {
                    throw e;
                }
                output = {
                    tool: "_Exception",
                    toolInput: observation,
                    log: text
                };
            } else {
                throw e;
            }
        }
        if ("returnValues" in output) {
            return output;
        }
        let actions;
        if (Array.isArray(output)) {
            actions = output;
        } else {
            actions = [
                output
            ];
        }
        const result = [];
        for (const agentAction of actions){
            let observation = "";
            if (runManager) {
                await runManager?.handleAgentAction(agentAction);
            }
            if (agentAction.tool in nameToolMap) {
                const tool = nameToolMap[agentAction.tool];
                try {
                    observation = await tool.call(agentAction.toolInput, runManager?.getChild());
                    if (typeof observation !== "string") {
                        throw new Error("Received unsupported non-string response from tool call.");
                    }
                } catch (e) {
                    // eslint-disable-next-line no-instanceof/no-instanceof
                    if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ToolInputParsingException"]) {
                        if (this.handleParsingErrors === true) {
                            observation = "Invalid or incomplete tool input. Please try again.";
                        } else if (typeof this.handleParsingErrors === "string") {
                            observation = this.handleParsingErrors;
                        } else if (typeof this.handleParsingErrors === "function") {
                            observation = this.handleParsingErrors(e);
                        } else {
                            throw e;
                        }
                        observation = await new ExceptionTool().call(observation, runManager?.getChild());
                    }
                }
            } else {
                observation = `${agentAction.tool} is not a valid tool, try another available tool: ${Object.keys(nameToolMap).join(", ")}`;
            }
            result.push({
                action: agentAction,
                observation
            });
        }
        return result;
    }
    async _return(output, intermediateSteps, runManager) {
        if (runManager) {
            await runManager.handleAgentEnd(output);
        }
        const finalOutput = output.returnValues;
        if (this.returnIntermediateSteps) {
            finalOutput.intermediateSteps = intermediateSteps;
        }
        return finalOutput;
    }
    async _getToolReturn(nextStepOutput) {
        const { action, observation } = nextStepOutput;
        const nameToolMap = Object.fromEntries(this.tools.map((t)=>[
                t.name.toLowerCase(),
                t
            ]));
        const [returnValueKey = "output"] = this.agent.returnValues;
        // Invalid tools won't be in the map, so we return False.
        if (action.tool in nameToolMap) {
            if (nameToolMap[action.tool].returnDirect) {
                return {
                    returnValues: {
                        [returnValueKey]: observation
                    },
                    log: ""
                };
            }
        }
        return null;
    }
    _returnStoppedResponse(earlyStoppingMethod) {
        if (earlyStoppingMethod === "force") {
            return {
                returnValues: {
                    output: "Agent stopped due to iteration limit or time limit."
                },
                log: ""
            };
        }
        throw new Error(`Got unsupported early_stopping_method: ${earlyStoppingMethod}`);
    }
    async *_streamIterator(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputs, options) {
        const agentExecutorIterator = new AgentExecutorIterator({
            inputs,
            agentExecutor: this,
            config: options,
            // TODO: Deprecate these other parameters
            metadata: options?.metadata,
            tags: options?.tags,
            callbacks: options?.callbacks
        });
        const iterator = agentExecutorIterator.streamIterator();
        for await (const step of iterator){
            if (!step) {
                continue;
            }
            yield step;
        }
    }
    _chainType() {
        return "agent_executor";
    }
    serialize() {
        throw new Error("Cannot serialize an AgentExecutor");
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/json/json.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JsonToolkit",
    ()=>JsonToolkit,
    "createJsonAgent",
    ()=>createJsonAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/tools/json.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/json/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/executor.js [app-route] (ecmascript)");
;
;
;
;
;
;
class JsonToolkit extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseToolkit"] {
    constructor(jsonSpec){
        super();
        Object.defineProperty(this, "jsonSpec", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: jsonSpec
        });
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.tools = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JsonListKeysTool"](jsonSpec),
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JsonGetValueTool"](jsonSpec)
        ];
    }
}
function createJsonAgent(llm, toolkit, args) {
    const { prefix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JSON_PREFIX"], suffix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JSON_SUFFIX"], inputVariables = [
        "input",
        "agent_scratchpad"
    ] } = args ?? {};
    const { tools } = toolkit;
    const prompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"].createPrompt(tools, {
        prefix,
        suffix,
        inputVariables
    });
    const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt,
        llm
    });
    const agent = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"]({
        llmChain: chain,
        allowedTools: tools.map((t)=>t.name)
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
        agent,
        tools,
        returnIntermediateSteps: true
    });
}
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/openapi/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JSON_EXPLORER_DESCRIPTION",
    ()=>JSON_EXPLORER_DESCRIPTION,
    "OPENAPI_PREFIX",
    ()=>OPENAPI_PREFIX,
    "OPENAPI_SUFFIX",
    ()=>OPENAPI_SUFFIX
]);
const OPENAPI_PREFIX = `You are an agent designed to answer questions by making web requests to an API given the OpenAPI spec.

If the question does not seem related to the API, return I don't know. Do not make up an answer.
Only use information provided by the tools to construct your response.

To find information in the OpenAPI spec, use the 'json_explorer' tool. The input to this tool is a question about the API.

Take the following steps:
First, find the base URL needed to make the request.

Second, find the relevant paths needed to answer the question. Take note that, sometimes, you might need to make more than one request to more than one path to answer the question.

Third, find the required parameters needed to make the request. For GET requests, these are usually URL parameters and for POST requests, these are request body parameters.

Fourth, make the requests needed to answer the question. Ensure that you are sending the correct parameters to the request by checking which parameters are required. For parameters with a fixed set of values, please use the spec to look at which values are allowed.

Use the exact parameter names as listed in the spec, do not make up any names or abbreviate the names of parameters.
If you get a not found error, ensure that you are using a path that actually exists in the spec.`;
const OPENAPI_SUFFIX = `Begin!"

Question: {input}
Thought: I should explore the spec to find the base url for the API.
{agent_scratchpad}`;
const JSON_EXPLORER_DESCRIPTION = `
Can be used to answer questions about the openapi spec for the API. Always use this tool before trying to make a request. 
Example inputs to this tool: 
    'What are the required query parameters for a GET request to the /bar endpoint?'
    'What are the required parameters in the request body for a POST request to the /foo endpoint?'
Always give this tool a specific question.`;
}),
"[project]/web/node_modules/langchain/dist/tools/requests.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RequestsGetTool",
    ()=>RequestsGetTool,
    "RequestsPostTool",
    ()=>RequestsPostTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript)");
;
class RequestsGetTool extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tool"] {
    static lc_name() {
        return "RequestsGetTool";
    }
    constructor(headers = {}, { maxOutputLength } = {}){
        super(...arguments);
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: headers
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "requests_get"
        });
        Object.defineProperty(this, "maxOutputLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2000
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: `A portal to the internet. Use this when you need to get specific content from a website.
  Input should be a url string (i.e. "https://www.google.com"). The output will be the text response of the GET request.`
        });
        this.maxOutputLength = maxOutputLength ?? this.maxOutputLength;
    }
    /** @ignore */ async _call(input) {
        const res = await fetch(input, {
            headers: this.headers
        });
        const text = await res.text();
        return text.slice(0, this.maxOutputLength);
    }
}
class RequestsPostTool extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tool"] {
    static lc_name() {
        return "RequestsPostTool";
    }
    constructor(headers = {}, { maxOutputLength } = {}){
        super(...arguments);
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: headers
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "requests_post"
        });
        Object.defineProperty(this, "maxOutputLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Infinity
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: `Use this when you want to POST to a website.
  Input should be a json string with two keys: "url" and "data".
  The value of "url" should be a string, and the value of "data" should be a dictionary of
  key-value pairs you want to POST to the url as a JSON body.
  Be careful to always use double quotes for strings in the json string
  The output will be the text response of the POST request.`
        });
        this.maxOutputLength = maxOutputLength ?? this.maxOutputLength;
    }
    /** @ignore */ async _call(input) {
        try {
            const { url, data } = JSON.parse(input);
            const res = await fetch(url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(data)
            });
            const text = await res.text();
            return text.slice(0, this.maxOutputLength);
        } catch (error) {
            return `${error}`;
        }
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/openapi/openapi.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenApiToolkit",
    ()=>OpenApiToolkit,
    "RequestsToolkit",
    ()=>RequestsToolkit,
    "createOpenApiAgent",
    ()=>createOpenApiAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/executor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/openapi/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$requests$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/tools/requests.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/json/json.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
class RequestsToolkit extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseToolkit"] {
    constructor(headers){
        super();
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.tools = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$requests$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RequestsGetTool"](headers),
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$requests$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RequestsPostTool"](headers)
        ];
    }
}
class OpenApiToolkit extends RequestsToolkit {
    constructor(jsonSpec, llm, headers){
        super(headers);
        const jsonAgent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createJsonAgent"])(llm, new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JsonToolkit"](jsonSpec));
        this.tools = [
            ...this.tools,
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DynamicTool"]({
                name: "json_explorer",
                func: async (input)=>{
                    const result = await jsonAgent.call({
                        input
                    });
                    return result.output;
                },
                description: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JSON_EXPLORER_DESCRIPTION"]
            })
        ];
    }
}
function createOpenApiAgent(llm, openApiToolkit, args) {
    const { prefix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OPENAPI_PREFIX"], suffix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OPENAPI_SUFFIX"], inputVariables = [
        "input",
        "agent_scratchpad"
    ] } = args ?? {};
    const { tools } = openApiToolkit;
    const prompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"].createPrompt(tools, {
        prefix,
        suffix,
        inputVariables
    });
    const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt,
        llm
    });
    const toolNames = tools.map((tool)=>tool.name);
    const agent = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"]({
        llmChain: chain,
        allowedTools: toolNames
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
        agent,
        tools,
        returnIntermediateSteps: true
    });
}
}),
"[project]/web/node_modules/langchain/dist/chains/combine_docs_chain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapReduceDocumentsChain",
    ()=>MapReduceDocumentsChain,
    "RefineDocumentsChain",
    ()=>RefineDocumentsChain,
    "StuffDocumentsChain",
    ()=>StuffDocumentsChain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
;
;
;
class StuffDocumentsChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    static lc_name() {
        return "StuffDocumentsChain";
    }
    get inputKeys() {
        return [
            this.inputKey,
            ...this.llmChain.inputKeys
        ].filter((key)=>key !== this.documentVariableName);
    }
    get outputKeys() {
        return this.llmChain.outputKeys;
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "input_documents"
        });
        Object.defineProperty(this, "documentVariableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "context"
        });
        this.llmChain = fields.llmChain;
        this.documentVariableName = fields.documentVariableName ?? this.documentVariableName;
        this.inputKey = fields.inputKey ?? this.inputKey;
    }
    /** @ignore */ _prepInputs(values) {
        if (!(this.inputKey in values)) {
            throw new Error(`Document key ${this.inputKey} not found.`);
        }
        const { [this.inputKey]: docs, ...rest } = values;
        const texts = docs.map(({ pageContent })=>pageContent);
        const text = texts.join("\n\n");
        return {
            ...rest,
            [this.documentVariableName]: text
        };
    }
    /** @ignore */ async _call(values, runManager) {
        const result = await this.llmChain.call(this._prepInputs(values), runManager?.getChild("combine_documents"));
        return result;
    }
    _chainType() {
        return "stuff_documents_chain";
    }
    static async deserialize(data) {
        if (!data.llm_chain) {
            throw new Error("Missing llm_chain");
        }
        return new StuffDocumentsChain({
            llmChain: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"].deserialize(data.llm_chain)
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            llm_chain: this.llmChain.serialize()
        };
    }
}
class MapReduceDocumentsChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    static lc_name() {
        return "MapReduceDocumentsChain";
    }
    get inputKeys() {
        return [
            this.inputKey,
            ...this.combineDocumentChain.inputKeys
        ];
    }
    get outputKeys() {
        return this.combineDocumentChain.outputKeys;
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "input_documents"
        });
        Object.defineProperty(this, "documentVariableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "context"
        });
        Object.defineProperty(this, "returnIntermediateSteps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "maxTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3000
        });
        Object.defineProperty(this, "maxIterations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 10
        });
        Object.defineProperty(this, "ensureMapStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "combineDocumentChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.llmChain = fields.llmChain;
        this.combineDocumentChain = fields.combineDocumentChain;
        this.documentVariableName = fields.documentVariableName ?? this.documentVariableName;
        this.ensureMapStep = fields.ensureMapStep ?? this.ensureMapStep;
        this.inputKey = fields.inputKey ?? this.inputKey;
        this.maxTokens = fields.maxTokens ?? this.maxTokens;
        this.maxIterations = fields.maxIterations ?? this.maxIterations;
        this.returnIntermediateSteps = fields.returnIntermediateSteps ?? false;
    }
    /** @ignore */ async _call(values, runManager) {
        if (!(this.inputKey in values)) {
            throw new Error(`Document key ${this.inputKey} not found.`);
        }
        const { [this.inputKey]: docs, ...rest } = values;
        let currentDocs = docs;
        let intermediateSteps = [];
        // For each iteration, we'll use the `llmChain` to get a new result
        for(let i = 0; i < this.maxIterations; i += 1){
            const inputs = currentDocs.map((d)=>({
                    [this.documentVariableName]: d.pageContent,
                    ...rest
                }));
            const canSkipMapStep = i !== 0 || !this.ensureMapStep;
            if (canSkipMapStep) {
                // Calculate the total tokens required in the input
                const formatted = await this.combineDocumentChain.llmChain.prompt.format(this.combineDocumentChain._prepInputs({
                    [this.combineDocumentChain.inputKey]: currentDocs,
                    ...rest
                }));
                const length = await this.combineDocumentChain.llmChain._getNumTokens(formatted);
                const withinTokenLimit = length < this.maxTokens;
                // If we can skip the map step, and we're within the token limit, we don't
                // need to run the map step, so just break out of the loop.
                if (withinTokenLimit) {
                    break;
                }
            }
            const results = await this.llmChain.apply(inputs, // If we have a runManager, then we need to create a child for each input
            // so that we can track the progress of each input.
            runManager ? Array.from({
                length: inputs.length
            }, (_, i)=>runManager.getChild(`map_${i + 1}`)) : undefined);
            const { outputKey } = this.llmChain;
            // If the flag is set, then concat that to the intermediate steps
            if (this.returnIntermediateSteps) {
                intermediateSteps = intermediateSteps.concat(results.map((r)=>r[outputKey]));
            }
            currentDocs = results.map((r)=>({
                    pageContent: r[outputKey],
                    metadata: {}
                }));
        }
        // Now, with the final result of all the inputs from the `llmChain`, we can
        // run the `combineDocumentChain` over them.
        const newInputs = {
            [this.combineDocumentChain.inputKey]: currentDocs,
            ...rest
        };
        const result = await this.combineDocumentChain.call(newInputs, runManager?.getChild("combine_documents"));
        // Return the intermediate steps results if the flag is set
        if (this.returnIntermediateSteps) {
            return {
                ...result,
                intermediateSteps
            };
        }
        return result;
    }
    _chainType() {
        return "map_reduce_documents_chain";
    }
    static async deserialize(data) {
        if (!data.llm_chain) {
            throw new Error("Missing llm_chain");
        }
        if (!data.combine_document_chain) {
            throw new Error("Missing combine_document_chain");
        }
        return new MapReduceDocumentsChain({
            llmChain: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"].deserialize(data.llm_chain),
            combineDocumentChain: await StuffDocumentsChain.deserialize(data.combine_document_chain)
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            llm_chain: this.llmChain.serialize(),
            combine_document_chain: this.combineDocumentChain.serialize()
        };
    }
}
class RefineDocumentsChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    static lc_name() {
        return "RefineDocumentsChain";
    }
    get defaultDocumentPrompt() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
            inputVariables: [
                "page_content"
            ],
            template: "{page_content}"
        });
    }
    get inputKeys() {
        return [
            ...new Set([
                this.inputKey,
                ...this.llmChain.inputKeys,
                ...this.refineLLMChain.inputKeys
            ])
        ].filter((key)=>key !== this.documentVariableName && key !== this.initialResponseName);
    }
    get outputKeys() {
        return [
            this.outputKey
        ];
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "input_documents"
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "output_text"
        });
        Object.defineProperty(this, "documentVariableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "context"
        });
        Object.defineProperty(this, "initialResponseName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "existing_answer"
        });
        Object.defineProperty(this, "refineLLMChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "documentPrompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.defaultDocumentPrompt
        });
        this.llmChain = fields.llmChain;
        this.refineLLMChain = fields.refineLLMChain;
        this.documentVariableName = fields.documentVariableName ?? this.documentVariableName;
        this.inputKey = fields.inputKey ?? this.inputKey;
        this.outputKey = fields.outputKey ?? this.outputKey;
        this.documentPrompt = fields.documentPrompt ?? this.documentPrompt;
        this.initialResponseName = fields.initialResponseName ?? this.initialResponseName;
    }
    /** @ignore */ async _constructInitialInputs(doc, rest) {
        const baseInfo = {
            page_content: doc.pageContent,
            ...doc.metadata
        };
        const documentInfo = {};
        this.documentPrompt.inputVariables.forEach((value)=>{
            documentInfo[value] = baseInfo[value];
        });
        const baseInputs = {
            [this.documentVariableName]: await this.documentPrompt.format({
                ...documentInfo
            })
        };
        const inputs = {
            ...baseInputs,
            ...rest
        };
        return inputs;
    }
    /** @ignore */ async _constructRefineInputs(doc, res) {
        const baseInfo = {
            page_content: doc.pageContent,
            ...doc.metadata
        };
        const documentInfo = {};
        this.documentPrompt.inputVariables.forEach((value)=>{
            documentInfo[value] = baseInfo[value];
        });
        const baseInputs = {
            [this.documentVariableName]: await this.documentPrompt.format({
                ...documentInfo
            })
        };
        const inputs = {
            [this.initialResponseName]: res,
            ...baseInputs
        };
        return inputs;
    }
    /** @ignore */ async _call(values, runManager) {
        if (!(this.inputKey in values)) {
            throw new Error(`Document key ${this.inputKey} not found.`);
        }
        const { [this.inputKey]: docs, ...rest } = values;
        const currentDocs = docs;
        const initialInputs = await this._constructInitialInputs(currentDocs[0], rest);
        let res = await this.llmChain.predict({
            ...initialInputs
        }, runManager?.getChild("answer"));
        const refineSteps = [
            res
        ];
        for(let i = 1; i < currentDocs.length; i += 1){
            const refineInputs = await this._constructRefineInputs(currentDocs[i], res);
            const inputs = {
                ...refineInputs,
                ...rest
            };
            res = await this.refineLLMChain.predict({
                ...inputs
            }, runManager?.getChild("refine"));
            refineSteps.push(res);
        }
        return {
            [this.outputKey]: res
        };
    }
    _chainType() {
        return "refine_documents_chain";
    }
    static async deserialize(data) {
        const SerializedLLMChain = data.llm_chain;
        if (!SerializedLLMChain) {
            throw new Error("Missing llm_chain");
        }
        const SerializedRefineDocumentChain = data.refine_llm_chain;
        if (!SerializedRefineDocumentChain) {
            throw new Error("Missing refine_llm_chain");
        }
        return new RefineDocumentsChain({
            llmChain: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"].deserialize(SerializedLLMChain),
            refineLLMChain: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"].deserialize(SerializedRefineDocumentChain)
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            llm_chain: this.llmChain.serialize(),
            refine_llm_chain: this.refineLLMChain.serialize()
        };
    }
}
}),
"[project]/web/node_modules/langchain/dist/chains/question_answering/stuff_prompts.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable spaced-comment */ __turbopack_context__.s([
    "DEFAULT_QA_PROMPT",
    ()=>DEFAULT_QA_PROMPT,
    "QA_PROMPT_SELECTOR",
    ()=>QA_PROMPT_SELECTOR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/chat.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$example_selectors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/example_selectors.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/example_selectors/conditional.js [app-route] (ecmascript)");
;
;
const DEFAULT_QA_PROMPT = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    template: "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\nQuestion: {question}\nHelpful Answer:",
    inputVariables: [
        "context",
        "question"
    ]
});
const system_template = `Use the following pieces of context to answer the users question. 
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;
const messages = [
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessagePromptTemplate"].fromTemplate(system_template),
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate("{question}")
];
const CHAT_PROMPT = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages(messages);
const QA_PROMPT_SELECTOR = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConditionalPromptSelector"](DEFAULT_QA_PROMPT, [
    [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isChatModel"],
        CHAT_PROMPT
    ]
]);
}),
"[project]/web/node_modules/langchain/dist/chains/question_answering/map_reduce_prompts.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable spaced-comment */ __turbopack_context__.s([
    "COMBINE_PROMPT",
    ()=>COMBINE_PROMPT,
    "COMBINE_PROMPT_SELECTOR",
    ()=>COMBINE_PROMPT_SELECTOR,
    "COMBINE_QA_PROMPT_SELECTOR",
    ()=>COMBINE_QA_PROMPT_SELECTOR,
    "DEFAULT_COMBINE_QA_PROMPT",
    ()=>DEFAULT_COMBINE_QA_PROMPT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/chat.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$example_selectors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/example_selectors.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/example_selectors/conditional.js [app-route] (ecmascript)");
;
;
const qa_template = `Use the following portion of a long document to see if any of the text is relevant to answer the question. 
Return any relevant text verbatim.
{context}
Question: {question}
Relevant text, if any:`;
const DEFAULT_COMBINE_QA_PROMPT = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"].fromTemplate(qa_template);
const system_template = `Use the following portion of a long document to see if any of the text is relevant to answer the question. 
Return any relevant text verbatim.
----------------
{context}`;
const messages = [
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessagePromptTemplate"].fromTemplate(system_template),
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate("{question}")
];
const CHAT_QA_PROMPT = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages(messages);
const COMBINE_QA_PROMPT_SELECTOR = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConditionalPromptSelector"](DEFAULT_COMBINE_QA_PROMPT, [
    [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isChatModel"],
        CHAT_QA_PROMPT
    ]
]);
const combine_prompt = `Given the following extracted parts of a long document and a question, create a final answer. 
If you don't know the answer, just say that you don't know. Don't try to make up an answer.

QUESTION: Which state/country's law governs the interpretation of the contract?
=========
Content: This Agreement is governed by English law and the parties submit to the exclusive jurisdiction of the English courts in  relation to any dispute (contractual or non-contractual) concerning this Agreement save that either party may apply to any court for an  injunction or other relief to protect its Intellectual Property Rights.

Content: No Waiver. Failure or delay in exercising any right or remedy under this Agreement shall not constitute a waiver of such (or any other)  right or remedy.\n\n11.7 Severability. The invalidity, illegality or unenforceability of any term (or part of a term) of this Agreement shall not affect the continuation  in force of the remainder of the term (if any) and this Agreement.\n\n11.8 No Agency. Except as expressly stated otherwise, nothing in this Agreement shall create an agency, partnership or joint venture of any  kind between the parties.\n\n11.9 No Third-Party Beneficiaries.

Content: (b) if Google believes, in good faith, that the Distributor has violated or caused Google to violate any Anti-Bribery Laws (as  defined in Clause 8.5) or that such a violation is reasonably likely to occur,
=========
FINAL ANSWER: This Agreement is governed by English law.

QUESTION: What did the president say about Michael Jackson?
=========
Content: Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.  \n\nLast year COVID-19 kept us apart. This year we are finally together again. \n\nTonight, we meet as Democrats Republicans and Independents. But most importantly as Americans. \n\nWith a duty to one another to the American people to the Constitution. \n\nAnd with an unwavering resolve that freedom will always triumph over tyranny. \n\nSix days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated. \n\nHe thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined. \n\nHe met the Ukrainian people. \n\nFrom President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world. \n\nGroups of citizens blocking tanks with their bodies. Everyone from students to retirees teachers turned soldiers defending their homeland.

Content: And we won’t stop. \n\nWe have lost so much to COVID-19. Time with one another. And worst of all, so much loss of life. \n\nLet’s use this moment to reset. Let’s stop looking at COVID-19 as a partisan dividing line and see it for what it is: A God-awful disease.  \n\nLet’s stop seeing each other as enemies, and start seeing each other for who we really are: Fellow Americans.  \n\nWe can’t change how divided we’ve been. But we can change how we move forward—on COVID-19 and other issues we must face together. \n\nI recently visited the New York City Police Department days after the funerals of Officer Wilbert Mora and his partner, Officer Jason Rivera. \n\nThey were responding to a 9-1-1 call when a man shot and killed them with a stolen gun. \n\nOfficer Mora was 27 years old. \n\nOfficer Rivera was 22. \n\nBoth Dominican Americans who’d grown up on the same streets they later chose to patrol as police officers. \n\nI spoke with their families and told them that we are forever in debt for their sacrifice, and we will carry on their mission to restore the trust and safety every community deserves.

Content: And a proud Ukrainian people, who have known 30 years  of independence, have repeatedly shown that they will not tolerate anyone who tries to take their country backwards.  \n\nTo all Americans, I will be honest with you, as I’ve always promised. A Russian dictator, invading a foreign country, has costs around the world. \n\nAnd I’m taking robust action to make sure the pain of our sanctions  is targeted at Russia’s economy. And I will use every tool at our disposal to protect American businesses and consumers. \n\nTonight, I can announce that the United States has worked with 30 other countries to release 60 Million barrels of oil from reserves around the world.  \n\nAmerica will lead that effort, releasing 30 Million barrels from our own Strategic Petroleum Reserve. And we stand ready to do more if necessary, unified with our allies.  \n\nThese steps will help blunt gas prices here at home. And I know the news about what’s happening can seem alarming. \n\nBut I want you to know that we are going to be okay.

Content: More support for patients and families. \n\nTo get there, I call on Congress to fund ARPA-H, the Advanced Research Projects Agency for Health. \n\nIt’s based on DARPA—the Defense Department project that led to the Internet, GPS, and so much more.  \n\nARPA-H will have a singular purpose—to drive breakthroughs in cancer, Alzheimer’s, diabetes, and more. \n\nA unity agenda for the nation. \n\nWe can do this. \n\nMy fellow Americans—tonight , we have gathered in a sacred space—the citadel of our democracy. \n\nIn this Capitol, generation after generation, Americans have debated great questions amid great strife, and have done great things. \n\nWe have fought for freedom, expanded liberty, defeated totalitarianism and terror. \n\nAnd built the strongest, freest, and most prosperous nation the world has ever known. \n\nNow is the hour. \n\nOur moment of responsibility. \n\nOur test of resolve and conscience, of history itself. \n\nIt is in this moment that our character is formed. Our purpose is found. Our future is forged. \n\nWell I know this nation.
=========
FINAL ANSWER: The president did not mention Michael Jackson.

QUESTION: {question}
=========
{summaries}
=========
FINAL ANSWER:`;
const COMBINE_PROMPT = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"].fromTemplate(combine_prompt);
const system_combine_template = `Given the following extracted parts of a long document and a question, create a final answer. 
If you don't know the answer, just say that you don't know. Don't try to make up an answer.
----------------
{summaries}`;
const combine_messages = [
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessagePromptTemplate"].fromTemplate(system_combine_template),
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate("{question}")
];
const CHAT_COMBINE_PROMPT = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages(combine_messages);
const COMBINE_PROMPT_SELECTOR = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConditionalPromptSelector"](COMBINE_PROMPT, [
    [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isChatModel"],
        CHAT_COMBINE_PROMPT
    ]
]);
}),
"[project]/web/node_modules/langchain/dist/chains/question_answering/refine_prompts.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable spaced-comment */ __turbopack_context__.s([
    "CHAT_QUESTION_PROMPT",
    ()=>CHAT_QUESTION_PROMPT,
    "CHAT_REFINE_PROMPT",
    ()=>CHAT_REFINE_PROMPT,
    "DEFAULT_REFINE_PROMPT",
    ()=>DEFAULT_REFINE_PROMPT,
    "DEFAULT_REFINE_PROMPT_TMPL",
    ()=>DEFAULT_REFINE_PROMPT_TMPL,
    "DEFAULT_TEXT_QA_PROMPT",
    ()=>DEFAULT_TEXT_QA_PROMPT,
    "DEFAULT_TEXT_QA_PROMPT_TMPL",
    ()=>DEFAULT_TEXT_QA_PROMPT_TMPL,
    "QUESTION_PROMPT_SELECTOR",
    ()=>QUESTION_PROMPT_SELECTOR,
    "REFINE_PROMPT_SELECTOR",
    ()=>REFINE_PROMPT_SELECTOR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/chat.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$example_selectors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/example_selectors.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/example_selectors/conditional.js [app-route] (ecmascript)");
;
;
const DEFAULT_REFINE_PROMPT_TMPL = `The original question is as follows: {question}
We have provided an existing answer: {existing_answer}
We have the opportunity to refine the existing answer
(only if needed) with some more context below.
------------
{context}
------------
Given the new context, refine the original answer to better answer the question. 
If the context isn't useful, return the original answer.`;
const DEFAULT_REFINE_PROMPT = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    inputVariables: [
        "question",
        "existing_answer",
        "context"
    ],
    template: DEFAULT_REFINE_PROMPT_TMPL
});
const refineTemplate = `The original question is as follows: {question}
We have provided an existing answer: {existing_answer}
We have the opportunity to refine the existing answer
(only if needed) with some more context below.
------------
{context}
------------
Given the new context, refine the original answer to better answer the question. 
If the context isn't useful, return the original answer.`;
const messages = [
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate("{question}"),
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AIMessagePromptTemplate"].fromTemplate("{existing_answer}"),
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate(refineTemplate)
];
const CHAT_REFINE_PROMPT = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages(messages);
const REFINE_PROMPT_SELECTOR = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConditionalPromptSelector"](DEFAULT_REFINE_PROMPT, [
    [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isChatModel"],
        CHAT_REFINE_PROMPT
    ]
]);
const DEFAULT_TEXT_QA_PROMPT_TMPL = `Context information is below. 
---------------------
{context}
---------------------
Given the context information and no prior knowledge, answer the question: {question}`;
const DEFAULT_TEXT_QA_PROMPT = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    inputVariables: [
        "context",
        "question"
    ],
    template: DEFAULT_TEXT_QA_PROMPT_TMPL
});
const chat_qa_prompt_template = `Context information is below. 
---------------------
{context}
---------------------
Given the context information and no prior knowledge, answer any questions`;
const chat_messages = [
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessagePromptTemplate"].fromTemplate(chat_qa_prompt_template),
    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate("{question}")
];
const CHAT_QUESTION_PROMPT = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages(chat_messages);
const QUESTION_PROMPT_SELECTOR = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConditionalPromptSelector"](DEFAULT_TEXT_QA_PROMPT, [
    [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$example_selectors$2f$conditional$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isChatModel"],
        CHAT_QUESTION_PROMPT
    ]
]);
}),
"[project]/web/node_modules/langchain/dist/chains/question_answering/load.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadQAChain",
    ()=>loadQAChain,
    "loadQAMapReduceChain",
    ()=>loadQAMapReduceChain,
    "loadQARefineChain",
    ()=>loadQARefineChain,
    "loadQAStuffChain",
    ()=>loadQAStuffChain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$combine_docs_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/combine_docs_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$stuff_prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/question_answering/stuff_prompts.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$map_reduce_prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/question_answering/map_reduce_prompts.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$refine_prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/question_answering/refine_prompts.js [app-route] (ecmascript)");
;
;
;
;
;
const loadQAChain = (llm, params = {
    type: "stuff"
})=>{
    const { type } = params;
    if (type === "stuff") {
        return loadQAStuffChain(llm, params);
    }
    if (type === "map_reduce") {
        return loadQAMapReduceChain(llm, params);
    }
    if (type === "refine") {
        return loadQARefineChain(llm, params);
    }
    throw new Error(`Invalid _type: ${type}`);
};
function loadQAStuffChain(llm, params = {}) {
    const { prompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$stuff_prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QA_PROMPT_SELECTOR"].getPrompt(llm), verbose } = params;
    const llmChain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt,
        llm,
        verbose
    });
    const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$combine_docs_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StuffDocumentsChain"]({
        llmChain,
        verbose
    });
    return chain;
}
function loadQAMapReduceChain(llm, params = {}) {
    const { combineMapPrompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$map_reduce_prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COMBINE_QA_PROMPT_SELECTOR"].getPrompt(llm), combinePrompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$map_reduce_prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COMBINE_PROMPT_SELECTOR"].getPrompt(llm), verbose, combineLLM, returnIntermediateSteps } = params;
    const llmChain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt: combineMapPrompt,
        llm,
        verbose
    });
    const combineLLMChain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt: combinePrompt,
        llm: combineLLM ?? llm,
        verbose
    });
    const combineDocumentChain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$combine_docs_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StuffDocumentsChain"]({
        llmChain: combineLLMChain,
        documentVariableName: "summaries",
        verbose
    });
    const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$combine_docs_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MapReduceDocumentsChain"]({
        llmChain,
        combineDocumentChain,
        returnIntermediateSteps,
        verbose
    });
    return chain;
}
function loadQARefineChain(llm, params = {}) {
    const { questionPrompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$refine_prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUESTION_PROMPT_SELECTOR"].getPrompt(llm), refinePrompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$refine_prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["REFINE_PROMPT_SELECTOR"].getPrompt(llm), refineLLM, verbose } = params;
    const llmChain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt: questionPrompt,
        llm,
        verbose
    });
    const refineLLMChain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt: refinePrompt,
        llm: refineLLM ?? llm,
        verbose
    });
    const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$combine_docs_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RefineDocumentsChain"]({
        llmChain,
        refineLLMChain,
        verbose
    });
    return chain;
}
}),
"[project]/web/node_modules/langchain/dist/chains/vector_db_qa.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VectorDBQAChain",
    ()=>VectorDBQAChain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$load$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/question_answering/load.js [app-route] (ecmascript)");
;
;
class VectorDBQAChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    static lc_name() {
        return "VectorDBQAChain";
    }
    get inputKeys() {
        return [
            this.inputKey
        ];
    }
    get outputKeys() {
        return this.combineDocumentsChain.outputKeys.concat(this.returnSourceDocuments ? [
            "sourceDocuments"
        ] : []);
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "k", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "query"
        });
        Object.defineProperty(this, "vectorstore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "combineDocumentsChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnSourceDocuments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.vectorstore = fields.vectorstore;
        this.combineDocumentsChain = fields.combineDocumentsChain;
        this.inputKey = fields.inputKey ?? this.inputKey;
        this.k = fields.k ?? this.k;
        this.returnSourceDocuments = fields.returnSourceDocuments ?? this.returnSourceDocuments;
    }
    /** @ignore */ async _call(values, runManager) {
        if (!(this.inputKey in values)) {
            throw new Error(`Question key ${this.inputKey} not found.`);
        }
        const question = values[this.inputKey];
        const docs = await this.vectorstore.similaritySearch(question, this.k, values.filter, runManager?.getChild("vectorstore"));
        const inputs = {
            question,
            input_documents: docs
        };
        const result = await this.combineDocumentsChain.call(inputs, runManager?.getChild("combine_documents"));
        if (this.returnSourceDocuments) {
            return {
                ...result,
                sourceDocuments: docs
            };
        }
        return result;
    }
    _chainType() {
        return "vector_db_qa";
    }
    static async deserialize(data, values) {
        if (!("vectorstore" in values)) {
            throw new Error(`Need to pass in a vectorstore to deserialize VectorDBQAChain`);
        }
        const { vectorstore } = values;
        if (!data.combine_documents_chain) {
            throw new Error(`VectorDBQAChain must have combine_documents_chain in serialized data`);
        }
        return new VectorDBQAChain({
            combineDocumentsChain: await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"].deserialize(data.combine_documents_chain),
            k: data.k,
            vectorstore
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            combine_documents_chain: this.combineDocumentsChain.serialize(),
            k: this.k
        };
    }
    /**
     * Static method that creates a VectorDBQAChain instance from a
     * BaseLanguageModel and a vector store. It also accepts optional options
     * to customize the chain.
     * @param llm The BaseLanguageModel instance.
     * @param vectorstore The vector store used for similarity search.
     * @param options Optional options to customize the chain.
     * @returns A new instance of VectorDBQAChain.
     */ static fromLLM(llm, vectorstore, options) {
        const qaChain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$question_answering$2f$load$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loadQAStuffChain"])(llm);
        return new this({
            vectorstore,
            combineDocumentsChain: qaChain,
            ...options
        });
    }
}
}),
"[project]/web/node_modules/langchain/dist/tools/vectorstore.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VectorStoreQATool",
    ()=>VectorStoreQATool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$vector_db_qa$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/vector_db_qa.js [app-route] (ecmascript)");
;
;
class VectorStoreQATool extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tool"] {
    static lc_name() {
        return "VectorStoreQATool";
    }
    constructor(name, description, fields){
        super(...arguments);
        Object.defineProperty(this, "vectorStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name;
        this.description = description;
        this.vectorStore = fields.vectorStore;
        this.llm = fields.llm;
        this.chain = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$vector_db_qa$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorDBQAChain"].fromLLM(this.llm, this.vectorStore);
    }
    /**
     * Returns a string that describes what the tool does.
     * @param name The name of the tool.
     * @param description A description of what the tool does.
     * @returns A string that describes what the tool does.
     */ static getDescription(name, description) {
        return `Useful for when you need to answer questions about ${name}. Whenever you need information about ${description} you should ALWAYS use this. Input should be a fully formed question.`;
    }
    /** @ignore */ async _call(input) {
        return this.chain.run(input);
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/vectorstore/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VECTOR_PREFIX",
    ()=>VECTOR_PREFIX,
    "VECTOR_ROUTER_PREFIX",
    ()=>VECTOR_ROUTER_PREFIX
]);
const VECTOR_PREFIX = `You are an agent designed to answer questions about sets of documents.
You have access to tools for interacting with the documents, and the inputs to the tools are questions.
Sometimes, you will be asked to provide sources for your questions, in which case you should use the appropriate tool to do so.
If the question does not seem relevant to any of the tools provided, just return "I don't know" as the answer.`;
const VECTOR_ROUTER_PREFIX = `You are an agent designed to answer questions.
You have access to tools for interacting with different sources, and the inputs to the tools are questions.
Your main task is to decide which of the tools is relevant for answering question at hand.
For complex questions, you can break the question down into sub questions and use tools to answers the sub questions.`;
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/vectorstore/vectorstore.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VectorStoreRouterToolkit",
    ()=>VectorStoreRouterToolkit,
    "VectorStoreToolkit",
    ()=>VectorStoreToolkit,
    "createVectorStoreAgent",
    ()=>createVectorStoreAgent,
    "createVectorStoreRouterAgent",
    ()=>createVectorStoreRouterAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/tools/vectorstore.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/vectorstore/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/executor.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
class VectorStoreToolkit extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseToolkit"] {
    constructor(vectorStoreInfo, llm){
        super();
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const description = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQATool"].getDescription(vectorStoreInfo.name, vectorStoreInfo.description);
        this.llm = llm;
        this.tools = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQATool"](vectorStoreInfo.name, description, {
                vectorStore: vectorStoreInfo.vectorStore,
                llm: this.llm
            })
        ];
    }
}
class VectorStoreRouterToolkit extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseToolkit"] {
    constructor(vectorStoreInfos, llm){
        super();
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "vectorStoreInfos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.llm = llm;
        this.vectorStoreInfos = vectorStoreInfos;
        this.tools = vectorStoreInfos.map((vectorStoreInfo)=>{
            const description = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQATool"].getDescription(vectorStoreInfo.name, vectorStoreInfo.description);
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQATool"](vectorStoreInfo.name, description, {
                vectorStore: vectorStoreInfo.vectorStore,
                llm: this.llm
            });
        });
    }
}
function createVectorStoreAgent(llm, toolkit, args) {
    const { prefix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VECTOR_PREFIX"], suffix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUFFIX"], inputVariables = [
        "input",
        "agent_scratchpad"
    ] } = args ?? {};
    const { tools } = toolkit;
    const prompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"].createPrompt(tools, {
        prefix,
        suffix,
        inputVariables
    });
    const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt,
        llm
    });
    const agent = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"]({
        llmChain: chain,
        allowedTools: tools.map((t)=>t.name)
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
        agent,
        tools,
        returnIntermediateSteps: true
    });
}
function createVectorStoreRouterAgent(llm, toolkit, args) {
    const { prefix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VECTOR_ROUTER_PREFIX"], suffix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUFFIX"], inputVariables = [
        "input",
        "agent_scratchpad"
    ] } = args ?? {};
    const { tools } = toolkit;
    const prompt = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"].createPrompt(tools, {
        prefix,
        suffix,
        inputVariables
    });
    const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
        prompt,
        llm
    });
    const agent = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"]({
        llmChain: chain,
        allowedTools: tools.map((t)=>t.name)
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
        agent,
        tools,
        returnIntermediateSteps: true
    });
}
}),
"[project]/web/node_modules/langchain/dist/util/document.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Given a list of documents, this util formats their contents
 * into a string, separated by newlines.
 *
 * @param documents
 * @returns A string of the documents page content, separated by newlines.
 */ __turbopack_context__.s([
    "formatDocumentsAsString",
    ()=>formatDocumentsAsString
]);
const formatDocumentsAsString = (documents)=>documents.map((doc)=>doc.pageContent).join("\n\n");
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/conversational_retrieval/tool.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRetrieverTool",
    ()=>createRetrieverTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/web/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/util/document.js [app-route] (ecmascript)");
;
;
;
function createRetrieverTool(retriever, input) {
    const func = async ({ input }, runManager)=>{
        const docs = await retriever.getRelevantDocuments(input, runManager?.getChild("retriever"));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$document$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatDocumentsAsString"])(docs);
    };
    const schema = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        input: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Natural language query used as input to the retriever")
    });
    return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DynamicStructuredTool"]({
        ...input,
        func,
        schema
    });
}
}),
"[project]/web/node_modules/langchain/dist/memory/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ENTITY_EXTRACTION_PROMPT",
    ()=>ENTITY_EXTRACTION_PROMPT,
    "ENTITY_MEMORY_CONVERSATION_TEMPLATE",
    ()=>ENTITY_MEMORY_CONVERSATION_TEMPLATE,
    "ENTITY_SUMMARIZATION_PROMPT",
    ()=>ENTITY_SUMMARIZATION_PROMPT,
    "SUMMARY_PROMPT",
    ()=>SUMMARY_PROMPT,
    "_DEFAULT_ENTITY_EXTRACTION_TEMPLATE",
    ()=>_DEFAULT_ENTITY_EXTRACTION_TEMPLATE,
    "_DEFAULT_ENTITY_MEMORY_CONVERSATION_TEMPLATE",
    ()=>_DEFAULT_ENTITY_MEMORY_CONVERSATION_TEMPLATE,
    "_DEFAULT_ENTITY_SUMMARIZATION_TEMPLATE",
    ()=>_DEFAULT_ENTITY_SUMMARIZATION_TEMPLATE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
;
const _DEFAULT_SUMMARIZER_TEMPLATE = `Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary.

EXAMPLE
Current summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good.

New lines of conversation:
Human: Why do you think artificial intelligence is a force for good?
AI: Because artificial intelligence will help humans reach their full potential.

New summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good because it will help humans reach their full potential.
END OF EXAMPLE

Current summary:
{summary}

New lines of conversation:
{new_lines}

New summary:`;
const SUMMARY_PROMPT = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    inputVariables: [
        "summary",
        "new_lines"
    ],
    template: _DEFAULT_SUMMARIZER_TEMPLATE
});
const _DEFAULT_ENTITY_MEMORY_CONVERSATION_TEMPLATE = `You are an assistant to a human, powered by a large language model trained by OpenAI.

You are designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, you are able to generate human-like text based on the input you receive, allowing you to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

You are constantly learning and improving, and your capabilities are constantly evolving. You are able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. You have access to some personalized information provided by the human in the Context section below. Additionally, you are able to generate your own text based on the input you receive, allowing you to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, you are a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether the human needs help with a specific question or just wants to have a conversation about a particular topic, you are here to assist.

Context:
{entities}

Current conversation:
{history}
Last line:
Human: {input}
You:`;
const ENTITY_MEMORY_CONVERSATION_TEMPLATE = // eslint-disable-next-line spaced-comment
/*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    inputVariables: [
        "entities",
        "history",
        "input"
    ],
    template: _DEFAULT_ENTITY_MEMORY_CONVERSATION_TEMPLATE
});
const _DEFAULT_ENTITY_EXTRACTION_TEMPLATE = `You are an AI assistant reading the transcript of a conversation between an AI and a human. Extract all of the proper nouns from the last line of conversation. As a guideline, a proper noun is generally capitalized. You should definitely extract all names and places.

The conversation history is provided just in case of a coreference (e.g. "What do you know about him" where "him" is defined in a previous line) -- ignore items mentioned there that are not in the last line.

Return the output as a single comma-separated list, or NONE if there is nothing of note to return (e.g. the user is just issuing a greeting or having a simple conversation).

EXAMPLE
Conversation history:
Person #1: my name is Jacob. how's it going today?
AI: "It's going great! How about you?"
Person #1: good! busy working on Langchain. lots to do.
AI: "That sounds like a lot of work! What kind of things are you doing to make Langchain better?"
Last line:
Person #1: i'm trying to improve Langchain's interfaces, the UX, its integrations with various products the user might want ... a lot of stuff.
Output: Jacob,Langchain
END OF EXAMPLE

EXAMPLE
Conversation history:
Person #1: how's it going today?
AI: "It's going great! How about you?"
Person #1: good! busy working on Langchain. lots to do.
AI: "That sounds like a lot of work! What kind of things are you doing to make Langchain better?"
Last line:
Person #1: i'm trying to improve Langchain's interfaces, the UX, its integrations with various products the user might want ... a lot of stuff. I'm working with Person #2.
Output: Langchain, Person #2
END OF EXAMPLE

Conversation history (for reference only):
{history}
Last line of conversation (for extraction):
Human: {input}

Output:`;
const ENTITY_EXTRACTION_PROMPT = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    inputVariables: [
        "history",
        "input"
    ],
    template: _DEFAULT_ENTITY_EXTRACTION_TEMPLATE
});
const _DEFAULT_ENTITY_SUMMARIZATION_TEMPLATE = `You are an AI assistant helping a human keep track of facts about relevant people, places, and concepts in their life. Update and add to the summary of the provided entity in the "Entity" section based on the last line of your conversation with the human. If you are writing the summary for the first time, return a single sentence.
The update should only include facts that are relayed in the last line of conversation about the provided entity, and should only contain facts about the provided entity.

If there is no new information about the provided entity or the information is not worth noting (not an important or relevant fact to remember long-term), output the exact string "UNCHANGED" below.

Full conversation history (for context):
{history}

Entity to summarize:
{entity}

Existing summary of {entity}:
{summary}

Last line of conversation:
Human: {input}
Updated summary (or the exact string "UNCHANGED" if there is no new information about {entity} above):`;
const ENTITY_SUMMARIZATION_PROMPT = /*#__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    inputVariables: [
        "entity",
        "summary",
        "history",
        "input"
    ],
    template: _DEFAULT_ENTITY_SUMMARIZATION_TEMPLATE
});
}),
"[project]/web/node_modules/langchain/dist/stores/message/in_memory.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$chat_history$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/chat_history.js [app-route] (ecmascript) <locals>");
;
}),
"[project]/web/node_modules/langchain/dist/memory/chat_memory.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseChatMemory",
    ()=>BaseChatMemory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/memory.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/memory.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$stores$2f$message$2f$in_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/stores/message/in_memory.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$chat_history$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__InMemoryChatMessageHistory__as__ChatMessageHistory$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/chat_history.js [app-route] (ecmascript) <export InMemoryChatMessageHistory as ChatMessageHistory>");
;
;
class BaseChatMemory extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseMemory"] {
    constructor(fields){
        super();
        Object.defineProperty(this, "chatHistory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chatHistory = fields?.chatHistory ?? new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$chat_history$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__InMemoryChatMessageHistory__as__ChatMessageHistory$3e$__["ChatMessageHistory"]();
        this.returnMessages = fields?.returnMessages ?? this.returnMessages;
        this.inputKey = fields?.inputKey ?? this.inputKey;
        this.outputKey = fields?.outputKey ?? this.outputKey;
    }
    /**
     * Method to add user and AI messages to the chat history in sequence.
     * @param inputValues The input values from the user.
     * @param outputValues The output values from the AI.
     * @returns Promise that resolves when the context has been saved.
     */ async saveContext(inputValues, outputValues) {
        // this is purposefully done in sequence so they're saved in order
        await this.chatHistory.addUserMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInputValue"])(inputValues, this.inputKey));
        await this.chatHistory.addAIChatMessage((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOutputValue"])(outputValues, this.outputKey));
    }
    /**
     * Method to clear the chat history.
     * @returns Promise that resolves when the chat history has been cleared.
     */ async clear() {
        await this.chatHistory.clear();
    }
}
}),
"[project]/web/node_modules/langchain/dist/memory/summary.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseConversationSummaryMemory",
    ()=>BaseConversationSummaryMemory,
    "ConversationSummaryMemory",
    ()=>ConversationSummaryMemory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/system.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/memory/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$chat_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/memory/chat_memory.js [app-route] (ecmascript)");
;
;
;
;
class BaseConversationSummaryMemory extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$chat_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChatMemory"] {
    constructor(fields){
        const { returnMessages, inputKey, outputKey, chatHistory, humanPrefix, aiPrefix, llm, prompt, summaryChatMessageClass } = fields;
        super({
            returnMessages,
            inputKey,
            outputKey,
            chatHistory
        });
        Object.defineProperty(this, "memoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "history"
        });
        Object.defineProperty(this, "humanPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Human"
        });
        Object.defineProperty(this, "aiPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AI"
        });
        Object.defineProperty(this, "llm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "prompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUMMARY_PROMPT"]
        });
        Object.defineProperty(this, "summaryChatMessageClass", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$system$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessage"]
        });
        this.memoryKey = fields?.memoryKey ?? this.memoryKey;
        this.humanPrefix = humanPrefix ?? this.humanPrefix;
        this.aiPrefix = aiPrefix ?? this.aiPrefix;
        this.llm = llm;
        this.prompt = prompt ?? this.prompt;
        this.summaryChatMessageClass = summaryChatMessageClass ?? this.summaryChatMessageClass;
    }
    /**
     * Predicts a new summary for the conversation given the existing messages
     * and summary.
     * @param messages Existing messages in the conversation.
     * @param existingSummary Current summary of the conversation.
     * @returns A promise that resolves to a new summary string.
     */ async predictNewSummary(messages, existingSummary) {
        const newLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBufferString"])(messages, this.humanPrefix, this.aiPrefix);
        const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            llm: this.llm,
            prompt: this.prompt
        });
        return await chain.predict({
            summary: existingSummary,
            new_lines: newLines
        });
    }
}
class ConversationSummaryMemory extends BaseConversationSummaryMemory {
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "buffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
    }
    get memoryKeys() {
        return [
            this.memoryKey
        ];
    }
    /**
     * Loads the memory variables for the conversation memory.
     * @returns A promise that resolves to an object containing the memory variables.
     */ async loadMemoryVariables(_) {
        if (this.returnMessages) {
            const result = {
                [this.memoryKey]: [
                    new this.summaryChatMessageClass(this.buffer)
                ]
            };
            return result;
        }
        const result = {
            [this.memoryKey]: this.buffer
        };
        return result;
    }
    /**
     * Saves the context of the conversation memory.
     * @param inputValues Input values for the conversation.
     * @param outputValues Output values from the conversation.
     * @returns A promise that resolves when the context has been saved.
     */ async saveContext(inputValues, outputValues) {
        await super.saveContext(inputValues, outputValues);
        const messages = await this.chatHistory.getMessages();
        this.buffer = await this.predictNewSummary(messages.slice(-2), this.buffer);
    }
    /**
     * Clears the conversation memory.
     * @returns A promise that resolves when the memory has been cleared.
     */ async clear() {
        await super.clear();
        this.buffer = "";
    }
}
}),
"[project]/web/node_modules/langchain/dist/memory/summary_buffer.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConversationSummaryBufferMemory",
    ()=>ConversationSummaryBufferMemory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$summary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/memory/summary.js [app-route] (ecmascript)");
;
;
class ConversationSummaryBufferMemory extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$summary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseConversationSummaryMemory"] {
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "movingSummaryBuffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "maxTokenLimit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2000
        });
        this.maxTokenLimit = fields?.maxTokenLimit ?? this.maxTokenLimit;
    }
    get memoryKeys() {
        return [
            this.memoryKey
        ];
    }
    /**
     * Method that loads the chat messages from the memory and returns them as
     * a string or as a list of messages, depending on the returnMessages
     * property.
     * @param _ InputValues object, not used in this method.
     * @returns Promise that resolves with MemoryVariables object containing the loaded chat messages.
     */ async loadMemoryVariables(_) {
        let buffer = await this.chatHistory.getMessages();
        if (this.movingSummaryBuffer) {
            buffer = [
                new this.summaryChatMessageClass(this.movingSummaryBuffer),
                ...buffer
            ];
        }
        let finalBuffer;
        if (this.returnMessages) {
            finalBuffer = buffer;
        } else {
            finalBuffer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBufferString"])(buffer, this.humanPrefix, this.aiPrefix);
        }
        return {
            [this.memoryKey]: finalBuffer
        };
    }
    /**
     * Method that saves the context of the conversation, including the input
     * and output values, and prunes the memory if it exceeds the maximum
     * token limit.
     * @param inputValues InputValues object containing the input values of the conversation.
     * @param outputValues OutputValues object containing the output values of the conversation.
     * @returns Promise that resolves when the context is saved and the memory is pruned.
     */ async saveContext(inputValues, outputValues) {
        await super.saveContext(inputValues, outputValues);
        await this.prune();
    }
    /**
     * Method that prunes the memory if the total number of tokens in the
     * buffer exceeds the maxTokenLimit. It removes messages from the
     * beginning of the buffer until the total number of tokens is within the
     * limit.
     * @returns Promise that resolves when the memory is pruned.
     */ async prune() {
        // Prune buffer if it exceeds max token limit
        let buffer = await this.chatHistory.getMessages();
        if (this.movingSummaryBuffer) {
            buffer = [
                new this.summaryChatMessageClass(this.movingSummaryBuffer),
                ...buffer
            ];
        }
        let currBufferLength = await this.llm.getNumTokens((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBufferString"])(buffer, this.humanPrefix, this.aiPrefix));
        if (currBufferLength > this.maxTokenLimit) {
            const prunedMemory = [];
            while(currBufferLength > this.maxTokenLimit){
                const poppedMessage = buffer.shift();
                if (poppedMessage) {
                    prunedMemory.push(poppedMessage);
                    currBufferLength = await this.llm.getNumTokens((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBufferString"])(buffer, this.humanPrefix, this.aiPrefix));
                }
            }
            this.movingSummaryBuffer = await this.predictNewSummary(prunedMemory, this.movingSummaryBuffer);
        }
    }
    /**
     * Method that clears the memory and resets the movingSummaryBuffer.
     * @returns Promise that resolves when the memory is cleared.
     */ async clear() {
        await super.clear();
        this.movingSummaryBuffer = "";
    }
}
}),
"[project]/web/node_modules/langchain/dist/memory/buffer_memory.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BufferMemory",
    ()=>BufferMemory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$chat_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/memory/chat_memory.js [app-route] (ecmascript)");
;
;
class BufferMemory extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$chat_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChatMemory"] {
    constructor(fields){
        super({
            chatHistory: fields?.chatHistory,
            returnMessages: fields?.returnMessages ?? false,
            inputKey: fields?.inputKey,
            outputKey: fields?.outputKey
        });
        Object.defineProperty(this, "humanPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Human"
        });
        Object.defineProperty(this, "aiPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AI"
        });
        Object.defineProperty(this, "memoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "history"
        });
        this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
        this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
        this.memoryKey = fields?.memoryKey ?? this.memoryKey;
    }
    get memoryKeys() {
        return [
            this.memoryKey
        ];
    }
    /**
     * Loads the memory variables. It takes an `InputValues` object as a
     * parameter and returns a `Promise` that resolves with a
     * `MemoryVariables` object.
     * @param _values `InputValues` object.
     * @returns A `Promise` that resolves with a `MemoryVariables` object.
     */ async loadMemoryVariables(_values) {
        const messages = await this.chatHistory.getMessages();
        if (this.returnMessages) {
            const result = {
                [this.memoryKey]: messages
            };
            return result;
        }
        const result = {
            [this.memoryKey]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBufferString"])(messages, this.humanPrefix, this.aiPrefix)
        };
        return result;
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/chat/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FORMAT_INSTRUCTIONS",
    ()=>FORMAT_INSTRUCTIONS,
    "PREFIX",
    ()=>PREFIX,
    "SUFFIX",
    ()=>SUFFIX
]);
const PREFIX = `Answer the following questions as best you can. You have access to the following tools:`;
const FORMAT_INSTRUCTIONS = `The way you use the tools is by specifying a json blob, denoted below by $JSON_BLOB
Specifically, this $JSON_BLOB should have a "action" key (with the name of the tool to use) and a "action_input" key (with the input to the tool going here). 
The $JSON_BLOB should only contain a SINGLE action, do NOT return a list of multiple actions. Here is an example of a valid $JSON_BLOB:

\`\`\`
{{
  "action": "calculator",
  "action_input": "1 + 2"
}}
\`\`\`

ALWAYS use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: 
\`\`\`
$JSON_BLOB
\`\`\`
Observation: the result of the action
... (this Thought/Action/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question`;
const SUFFIX = `Begin! Reminder to always use the exact characters \`Final Answer\` when responding.`;
}),
"[project]/web/node_modules/langchain/dist/agents/chat/outputParser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatAgentOutputParser",
    ()=>ChatAgentOutputParser,
    "FINAL_ANSWER_ACTION",
    ()=>FINAL_ANSWER_ACTION
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat/prompt.js [app-route] (ecmascript)");
;
;
;
const FINAL_ANSWER_ACTION = "Final Answer:";
class ChatAgentOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "chat"
            ]
        });
    }
    /**
     * Parses the output text from the MRKL chain into an agent action or
     * agent finish. If the text contains the final answer action or does not
     * contain an action, it returns an AgentFinish with the output and log.
     * If the text contains a JSON response, it returns the tool, toolInput,
     * and log.
     * @param text The output text from the MRKL chain.
     * @returns An object that satisfies the AgentFinish interface or an object with the tool, toolInput, and log.
     */ async parse(text) {
        if (text.includes(FINAL_ANSWER_ACTION) || !text.includes(`"action":`)) {
            const parts = text.split(FINAL_ANSWER_ACTION);
            const output = parts[parts.length - 1].trim();
            return {
                returnValues: {
                    output
                },
                log: text
            };
        }
        const action = text.includes("```") ? text.trim().split(/```(?:json)?/)[1] : text.trim();
        try {
            const response = JSON.parse(action.trim());
            return {
                tool: response.action,
                toolInput: response.action_input,
                log: text
            };
        } catch  {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Unable to parse JSON response from chat agent.\n\n${text}`);
        }
    }
    /**
     * Returns the format instructions used in the output parser for the
     * ChatAgent class.
     * @returns The format instructions as a string.
     */ getFormatInstructions() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"];
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/chat/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatAgent",
    ()=>ChatAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/chat.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat/prompt.js [app-route] (ecmascript)");
;
;
;
;
;
const DEFAULT_HUMAN_MESSAGE_TEMPLATE = "{input}\n\n{agent_scratchpad}";
class ChatAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Agent"] {
    static lc_name() {
        return "ChatAgent";
    }
    constructor(input){
        const outputParser = input?.outputParser ?? ChatAgent.getDefaultOutputParser();
        super({
            ...input,
            outputParser
        });
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "chat"
            ]
        });
    }
    _agentType() {
        return "chat-zero-shot-react-description";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    _stop() {
        return [
            "Observation:"
        ];
    }
    /**
     * Validates that all tools have descriptions. Throws an error if a tool
     * without a description is found.
     * @param tools Array of Tool instances to validate.
     * @returns void
     */ static validateTools(tools) {
        const descriptionlessTool = tools.find((tool)=>!tool.description);
        if (descriptionlessTool) {
            const msg = `Got a tool ${descriptionlessTool.name} without a description.` + ` This agent requires descriptions for all tools.`;
            throw new Error(msg);
        }
    }
    /**
     * Returns a default output parser for the ChatAgent.
     * @param _fields Optional OutputParserArgs to customize the output parser.
     * @returns ChatAgentOutputParser instance
     */ static getDefaultOutputParser(_fields) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatAgentOutputParser"]();
    }
    /**
     * Constructs the agent's scratchpad, which is a string representation of
     * the agent's previous steps.
     * @param steps Array of AgentStep instances representing the agent's previous steps.
     * @returns Promise resolving to a string representing the agent's scratchpad.
     */ async constructScratchPad(steps) {
        const agentScratchpad = await super.constructScratchPad(steps);
        if (agentScratchpad) {
            return `This was your previous work (but I haven't seen any of it! I only see what you return as final answer):\n${agentScratchpad}`;
        }
        return agentScratchpad;
    }
    /**
     * Create prompt in the style of the zero shot agent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.suffix - String to put after the list of tools.
     * @param args.prefix - String to put before the list of tools.
     * @param args.humanMessageTemplate - String to use directly as the human message template
     * @param args.formatInstructions - Formattable string to use as the instructions template
     */ static createPrompt(tools, args) {
        const { prefix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PREFIX"], suffix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUFFIX"], humanMessageTemplate = DEFAULT_HUMAN_MESSAGE_TEMPLATE, formatInstructions = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"] } = args ?? {};
        const toolStrings = tools.map((tool)=>`${tool.name}: ${tool.description}`).join("\n");
        const template = [
            prefix,
            toolStrings,
            formatInstructions,
            suffix
        ].join("\n\n");
        const messages = [
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessagePromptTemplate"].fromTemplate(template),
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate(humanMessageTemplate)
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages(messages);
    }
    /**
     * Creates a ChatAgent instance using a language model, tools, and
     * optional arguments.
     * @param llm BaseLanguageModelInterface instance to use in the agent.
     * @param tools Array of Tool instances to include in the agent.
     * @param args Optional arguments to customize the agent and prompt.
     * @returns ChatAgent instance
     */ static fromLLMAndTools(llm, tools, args) {
        ChatAgent.validateTools(tools);
        const prompt = ChatAgent.createPrompt(tools, args);
        const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            prompt,
            llm,
            callbacks: args?.callbacks ?? args?.callbackManager
        });
        const outputParser = args?.outputParser ?? ChatAgent.getDefaultOutputParser();
        return new ChatAgent({
            llmChain: chain,
            outputParser,
            allowedTools: tools.map((t)=>t.name)
        });
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/chat_convo/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PREFIX",
    ()=>DEFAULT_PREFIX,
    "DEFAULT_SUFFIX",
    ()=>DEFAULT_SUFFIX,
    "FORMAT_INSTRUCTIONS",
    ()=>FORMAT_INSTRUCTIONS,
    "PREFIX_END",
    ()=>PREFIX_END,
    "TEMPLATE_TOOL_RESPONSE",
    ()=>TEMPLATE_TOOL_RESPONSE
]);
const DEFAULT_PREFIX = `Assistant is a large language model trained by OpenAI.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful system that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.`;
const PREFIX_END = ` However, above all else, all responses must adhere to the format of RESPONSE FORMAT INSTRUCTIONS.`;
const FORMAT_INSTRUCTIONS = `RESPONSE FORMAT INSTRUCTIONS
----------------------------

Output a JSON markdown code snippet containing a valid JSON object in one of two formats:

**Option 1:**
Use this if you want the human to use a tool.
Markdown code snippet formatted in the following schema:

\`\`\`json
{{{{
    "action": string, // The action to take. Must be one of [{tool_names}]
    "action_input": string // The input to the action. May be a stringified object.
}}}}
\`\`\`

**Option #2:**
Use this if you want to respond directly and conversationally to the human. Markdown code snippet formatted in the following schema:

\`\`\`json
{{{{
    "action": "Final Answer",
    "action_input": string // You should put what you want to return to user here and make sure to use valid json newline characters.
}}}}
\`\`\`

For both options, remember to always include the surrounding markdown code snippet delimiters (begin with "\`\`\`json" and end with "\`\`\`")!
`;
const DEFAULT_SUFFIX = `TOOLS
------
Assistant can ask the user to use tools to look up information that may be helpful in answering the users original question. The tools the human can use are:

{tools}

{format_instructions}

USER'S INPUT
--------------------
Here is the user's input (remember to respond with a markdown code snippet of a json blob with a single action, and NOTHING else):

{{input}}`;
const TEMPLATE_TOOL_RESPONSE = `TOOL RESPONSE:
---------------------
{observation}

USER'S INPUT
--------------------

Okay, so what is the response to my last comment? If using information obtained from the tools you must mention it explicitly without mentioning the tool names - I have forgotten all TOOL RESPONSES! Remember to respond with a markdown code snippet of a json blob with a single action, and NOTHING else.`;
}),
"[project]/web/node_modules/langchain/dist/output_parsers/prompts.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NAIVE_FIX_PROMPT",
    ()=>NAIVE_FIX_PROMPT,
    "NAIVE_FIX_TEMPLATE",
    ()=>NAIVE_FIX_TEMPLATE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
;
const NAIVE_FIX_TEMPLATE = `Instructions:
--------------
{instructions}
--------------
Completion:
--------------
{completion}
--------------

Above, the Completion did not satisfy the constraints given in the Instructions.
Error:
--------------
{error}
--------------

Please try again. Please only respond with an answer that satisfies the constraints laid out in the Instructions:`;
const NAIVE_FIX_PROMPT = /* #__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"].fromTemplate(NAIVE_FIX_TEMPLATE);
}),
"[project]/web/node_modules/langchain/dist/output_parsers/fix.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OutputFixingParser",
    ()=>OutputFixingParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$output_parsers$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/output_parsers/prompts.js [app-route] (ecmascript)");
;
;
;
function isLLMChain(x) {
    return x.prompt !== undefined && x.llm !== undefined;
}
class OutputFixingParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseOutputParser"] {
    static lc_name() {
        return "OutputFixingParser";
    }
    /**
     * Static method to create a new instance of OutputFixingParser using a
     * given language model, parser, and optional fields.
     * @param llm The language model to be used.
     * @param parser The parser to be used.
     * @param fields Optional fields which may contain a prompt.
     * @returns A new instance of OutputFixingParser.
     */ static fromLLM(llm, parser, fields) {
        const prompt = fields?.prompt ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$output_parsers$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NAIVE_FIX_PROMPT"];
        const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            llm,
            prompt
        });
        return new OutputFixingParser({
            parser,
            retryChain: chain
        });
    }
    constructor({ parser, retryChain }){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "output_parsers",
                "fix"
            ]
        });
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "parser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "retryChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.parser = parser;
        this.retryChain = retryChain;
    }
    /**
     * Method to parse the completion using the parser. If the initial parsing
     * fails, it uses the retryChain to attempt to fix the output and retry
     * the parsing process.
     * @param completion The completion to be parsed.
     * @param callbacks Optional callbacks to be used during parsing.
     * @returns The parsed output.
     */ async parse(completion, callbacks) {
        try {
            return await this.parser.parse(completion, callbacks);
        } catch (e) {
            // eslint-disable-next-line no-instanceof/no-instanceof
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"]) {
                const retryInput = {
                    instructions: this.parser.getFormatInstructions(),
                    completion,
                    error: e
                };
                if (isLLMChain(this.retryChain)) {
                    const result = await this.retryChain.call(retryInput, callbacks);
                    const newCompletion = result[this.retryChain.outputKey];
                    return this.parser.parse(newCompletion, callbacks);
                } else {
                    const result = await this.retryChain.invoke(retryInput, {
                        callbacks
                    });
                    return result;
                }
            }
            throw e;
        }
    }
    /**
     * Method to get the format instructions for the parser.
     * @returns The format instructions for the parser.
     */ getFormatInstructions() {
        return this.parser.getFormatInstructions();
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/chat_convo/outputParser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatConversationalAgentOutputParser",
    ()=>ChatConversationalAgentOutputParser,
    "ChatConversationalAgentOutputParserWithRetries",
    ()=>ChatConversationalAgentOutputParserWithRetries
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/template.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$output_parsers$2f$fix$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/output_parsers/fix.js [app-route] (ecmascript)");
;
;
;
;
;
class ChatConversationalAgentOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(fields){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "chat_convo"
            ]
        });
        Object.defineProperty(this, "toolNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.toolNames = fields.toolNames;
    }
    /**
     * Parses the given text into an AgentAction or AgentFinish object. If an
     * output fixing parser is defined, uses it to parse the text.
     * @param text Text to parse.
     * @returns Promise that resolves to an AgentAction or AgentFinish object.
     */ async parse(text) {
        let jsonOutput = text.trim();
        if (jsonOutput.includes("```json") || jsonOutput.includes("```")) {
            const testString = jsonOutput.includes("```json") ? "```json" : "```";
            const firstIndex = jsonOutput.indexOf(testString);
            const actionInputIndex = jsonOutput.indexOf("action_input");
            if (actionInputIndex > firstIndex) {
                jsonOutput = jsonOutput.slice(firstIndex + testString.length).trimStart();
                const lastIndex = jsonOutput.lastIndexOf("```");
                if (lastIndex !== -1) {
                    jsonOutput = jsonOutput.slice(0, lastIndex).trimEnd();
                }
            }
        }
        try {
            const response = JSON.parse(jsonOutput);
            const { action, action_input } = response;
            if (action === "Final Answer") {
                return {
                    returnValues: {
                        output: action_input
                    },
                    log: text
                };
            }
            return {
                tool: action,
                toolInput: action_input,
                log: text
            };
        } catch (e) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Failed to parse. Text: "${text}". Error: ${e}`);
        }
    }
    /**
     * Returns the format instructions as a string. If the 'raw' option is
     * true, returns the raw FORMAT_INSTRUCTIONS.
     * @param options Options for getting the format instructions.
     * @returns Format instructions as a string.
     */ getFormatInstructions() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"], "f-string", {
            tool_names: this.toolNames.join(", ")
        });
    }
}
class ChatConversationalAgentOutputParserWithRetries extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "chat_convo"
            ]
        });
        Object.defineProperty(this, "baseParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputFixingParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toolNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.toolNames = fields.toolNames ?? this.toolNames;
        this.baseParser = fields?.baseParser ?? new ChatConversationalAgentOutputParser({
            toolNames: this.toolNames
        });
        this.outputFixingParser = fields?.outputFixingParser;
    }
    /**
     * Returns the format instructions as a string.
     * @returns Format instructions as a string.
     */ getFormatInstructions(options) {
        if (options.raw) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"];
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"], "f-string", {
            tool_names: options.toolNames.join(", ")
        });
    }
    /**
     * Parses the given text into an AgentAction or AgentFinish object.
     * @param text Text to parse.
     * @returns Promise that resolves to an AgentAction or AgentFinish object.
     */ async parse(text) {
        if (this.outputFixingParser !== undefined) {
            return this.outputFixingParser.parse(text);
        }
        return this.baseParser.parse(text);
    }
    /**
     * Static method to create a new
     * ChatConversationalAgentOutputParserWithRetries from a BaseLanguageModelInterface
     * and options. If no base parser is provided in the options, a new
     * ChatConversationalAgentOutputParser is created. An OutputFixingParser
     * is also created from the BaseLanguageModelInterface and the base parser.
     * @param llm BaseLanguageModelInterface instance used to create the OutputFixingParser.
     * @param options Options for creating the ChatConversationalAgentOutputParserWithRetries instance.
     * @returns A new instance of ChatConversationalAgentOutputParserWithRetries.
     */ static fromLLM(llm, options) {
        const baseParser = options.baseParser ?? new ChatConversationalAgentOutputParser({
            toolNames: options.toolNames ?? []
        });
        const outputFixingParser = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$output_parsers$2f$fix$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputFixingParser"].fromLLM(llm, baseParser);
        return new ChatConversationalAgentOutputParserWithRetries({
            baseParser,
            outputFixingParser,
            toolNames: options.toolNames
        });
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/chat_convo/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatConversationalAgent",
    ()=>ChatConversationalAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/chat.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/template.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/human.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/ai.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/prompt.js [app-route] (ecmascript)");
;
;
;
;
;
;
class ChatConversationalAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Agent"] {
    static lc_name() {
        return "ChatConversationalAgent";
    }
    constructor(input){
        const outputParser = input.outputParser ?? ChatConversationalAgent.getDefaultOutputParser();
        super({
            ...input,
            outputParser
        });
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "chat_convo"
            ]
        });
    }
    _agentType() {
        return "chat-conversational-react-description";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    _stop() {
        return [
            "Observation:"
        ];
    }
    static validateTools(tools) {
        const descriptionlessTool = tools.find((tool)=>!tool.description);
        if (descriptionlessTool) {
            const msg = `Got a tool ${descriptionlessTool.name} without a description.` + ` This agent requires descriptions for all tools.`;
            throw new Error(msg);
        }
    }
    /**
     * Constructs the agent scratchpad based on the agent steps. It returns an
     * array of base messages representing the thoughts of the agent.
     * @param steps The agent steps to construct the scratchpad from.
     * @returns An array of base messages representing the thoughts of the agent.
     */ async constructScratchPad(steps) {
        const thoughts = [];
        for (const step of steps){
            thoughts.push(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AIMessage"](step.action.log));
            thoughts.push(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessage"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TEMPLATE_TOOL_RESPONSE"], "f-string", {
                observation: step.observation
            })));
        }
        return thoughts;
    }
    /**
     * Returns the default output parser for the ChatConversationalAgent
     * class. It takes optional fields as arguments to customize the output
     * parser.
     * @param fields Optional fields to customize the output parser.
     * @returns The default output parser for the ChatConversationalAgent class.
     */ static getDefaultOutputParser(fields) {
        if (fields?.llm) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatConversationalAgentOutputParserWithRetries"].fromLLM(fields.llm, {
                toolNames: fields.toolNames
            });
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatConversationalAgentOutputParserWithRetries"]({
            toolNames: fields?.toolNames
        });
    }
    /**
     * Create prompt in the style of the ChatConversationAgent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.systemMessage - String to put before the list of tools.
     * @param args.humanMessage - String to put after the list of tools.
     * @param args.outputParser - Output parser to use for formatting.
     */ static createPrompt(tools, args) {
        const systemMessage = (args?.systemMessage ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PREFIX"]) + __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PREFIX_END"];
        const humanMessage = args?.humanMessage ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SUFFIX"];
        const toolStrings = tools.map((tool)=>`${tool.name}: ${tool.description}`).join("\n");
        const toolNames = tools.map((tool)=>tool.name);
        const outputParser = args?.outputParser ?? ChatConversationalAgent.getDefaultOutputParser({
            toolNames
        });
        const formatInstructions = outputParser.getFormatInstructions({
            toolNames
        });
        const renderedHumanMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(humanMessage, "f-string", {
            format_instructions: formatInstructions,
            tools: toolStrings
        });
        const messages = [
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessagePromptTemplate"].fromTemplate(systemMessage),
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MessagesPlaceholder"]("chat_history"),
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate(renderedHumanMessage),
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MessagesPlaceholder"]("agent_scratchpad")
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages(messages);
    }
    /**
     * Creates an instance of the ChatConversationalAgent class from a
     * BaseLanguageModel and a set of tools. It takes optional arguments to
     * customize the agent.
     * @param llm The BaseLanguageModel to create the agent from.
     * @param tools The set of tools to create the agent from.
     * @param args Optional arguments to customize the agent.
     * @returns An instance of the ChatConversationalAgent class.
     */ static fromLLMAndTools(llm, tools, args) {
        ChatConversationalAgent.validateTools(tools);
        const outputParser = args?.outputParser ?? ChatConversationalAgent.getDefaultOutputParser({
            llm,
            toolNames: tools.map((tool)=>tool.name)
        });
        const prompt = ChatConversationalAgent.createPrompt(tools, {
            ...args,
            outputParser
        });
        const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            prompt,
            llm,
            callbacks: args?.callbacks ?? args?.callbackManager
        });
        return new ChatConversationalAgent({
            llmChain: chain,
            outputParser,
            allowedTools: tools.map((t)=>t.name)
        });
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/structured_chat/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AGENT_ACTION_FORMAT_INSTRUCTIONS",
    ()=>AGENT_ACTION_FORMAT_INSTRUCTIONS,
    "FORMAT_INSTRUCTIONS",
    ()=>FORMAT_INSTRUCTIONS,
    "PREFIX",
    ()=>PREFIX,
    "SUFFIX",
    ()=>SUFFIX
]);
const PREFIX = `Answer the following questions truthfully and as best you can.`;
const AGENT_ACTION_FORMAT_INSTRUCTIONS = `Output a JSON markdown code snippet containing a valid JSON blob (denoted below by $JSON_BLOB).
This $JSON_BLOB must have a "action" key (with the name of the tool to use) and an "action_input" key (tool input).

Valid "action" values: "Final Answer" (which you must use when giving your final response to the user), or one of [{tool_names}].

The $JSON_BLOB must be valid, parseable JSON and only contain a SINGLE action. Here is an example of an acceptable output:

\`\`\`json
{{
  "action": $TOOL_NAME,
  "action_input": $INPUT
}}
\`\`\`

Remember to include the surrounding markdown code snippet delimiters (begin with "\`\`\`" json and close with "\`\`\`")!
`;
const FORMAT_INSTRUCTIONS = `You have access to the following tools.
You must format your inputs to these tools to match their "JSON schema" definitions below.

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Here are the JSON Schema instances for the tools you have access to:

{tool_schemas}

The way you use the tools is as follows:

------------------------

${AGENT_ACTION_FORMAT_INSTRUCTIONS}

If you are using a tool, "action_input" must adhere to the tool's input schema, given above.

------------------------

ALWAYS use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action:
\`\`\`json
$JSON_BLOB
\`\`\`
Observation: the result of the action
... (this Thought/Action/Observation can repeat N times)
Thought: I now know the final answer
Action:
\`\`\`json
{{
  "action": "Final Answer",
  "action_input": "Final response to human"
}}
\`\`\``;
const SUFFIX = `Begin! Reminder to ALWAYS use the above format, and to use tools if appropriate.`;
}),
"[project]/web/node_modules/langchain/dist/agents/structured_chat/outputParser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StructuredChatOutputParser",
    ()=>StructuredChatOutputParser,
    "StructuredChatOutputParserWithRetries",
    ()=>StructuredChatOutputParserWithRetries
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/template.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/structured_chat/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$output_parsers$2f$fix$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/output_parsers/fix.js [app-route] (ecmascript)");
;
;
;
;
;
class StructuredChatOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(fields){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "structured_chat"
            ]
        });
        Object.defineProperty(this, "toolNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.toolNames = fields.toolNames;
    }
    /**
     * Parses the given text and returns an `AgentAction` or `AgentFinish`
     * object. If an `OutputFixingParser` is provided, it is used for parsing;
     * otherwise, the base parser is used.
     * @param text The text to parse.
     * @param callbacks Optional callbacks for asynchronous operations.
     * @returns A Promise that resolves to an `AgentAction` or `AgentFinish` object.
     */ async parse(text) {
        try {
            const regex = /```(?:json)?(.*)(```)/gs;
            const actionMatch = regex.exec(text);
            if (actionMatch === null) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Could not parse an action. The agent action must be within a markdown code block, and "action" must be a provided tool or "Final Answer"`);
            }
            const response = JSON.parse(actionMatch[1].trim());
            const { action, action_input } = response;
            if (action === "Final Answer") {
                return {
                    returnValues: {
                        output: action_input
                    },
                    log: text
                };
            }
            return {
                tool: action,
                toolInput: action_input || {},
                log: text
            };
        } catch (e) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Failed to parse. Text: "${text}". Error: ${e}`);
        }
    }
    /**
     * Returns the format instructions for parsing the output of an agent
     * action in the style of the StructuredChatAgent.
     * @returns A string representing the format instructions.
     */ getFormatInstructions() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_ACTION_FORMAT_INSTRUCTIONS"], "f-string", {
            tool_names: this.toolNames.join(", ")
        });
    }
}
class StructuredChatOutputParserWithRetries extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "structured_chat"
            ]
        });
        Object.defineProperty(this, "baseParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputFixingParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toolNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.toolNames = fields.toolNames ?? this.toolNames;
        this.baseParser = fields?.baseParser ?? new StructuredChatOutputParser({
            toolNames: this.toolNames
        });
        this.outputFixingParser = fields?.outputFixingParser;
    }
    /**
     * Parses the given text and returns an `AgentAction` or `AgentFinish`
     * object. Throws an `OutputParserException` if the parsing fails.
     * @param text The text to parse.
     * @returns A Promise that resolves to an `AgentAction` or `AgentFinish` object.
     */ async parse(text, callbacks) {
        if (this.outputFixingParser !== undefined) {
            return this.outputFixingParser.parse(text, callbacks);
        }
        return this.baseParser.parse(text);
    }
    /**
     * Returns the format instructions for parsing the output of an agent
     * action in the style of the StructuredChatAgent.
     * @returns A string representing the format instructions.
     */ getFormatInstructions() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"], "f-string", {
            tool_names: this.toolNames.join(", ")
        });
    }
    /**
     * Creates a new `StructuredChatOutputParserWithRetries` instance from a
     * `BaseLanguageModel` and options. The options can include a base parser
     * and tool names.
     * @param llm A `BaseLanguageModel` instance.
     * @param options Options for creating a `StructuredChatOutputParserWithRetries` instance.
     * @returns A new `StructuredChatOutputParserWithRetries` instance.
     */ static fromLLM(llm, options) {
        const baseParser = options.baseParser ?? new StructuredChatOutputParser({
            toolNames: options.toolNames ?? []
        });
        const outputFixingParser = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$output_parsers$2f$fix$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputFixingParser"].fromLLM(llm, baseParser);
        return new StructuredChatOutputParserWithRetries({
            baseParser,
            outputFixingParser,
            toolNames: options.toolNames
        });
    }
}
}),
"[project]/web/node_modules/langchain/dist/tools/render.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "renderTextDescription",
    ()=>renderTextDescription,
    "renderTextDescriptionAndArgs",
    ()=>renderTextDescriptionAndArgs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/language_models/base.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/language_models/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$utils$2f$json_schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/utils/json_schema.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$json_schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/utils/json_schema.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$utils$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/utils/types.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$types$2f$zod$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/utils/types/zod.js [app-route] (ecmascript)");
;
;
;
function renderTextDescription(tools) {
    if (tools.every(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isOpenAITool"])) {
        return tools.map((tool)=>`${tool.function.name}${tool.function.description ? `: ${tool.function.description}` : ""}`).join("\n");
    }
    return tools.map((tool)=>`${tool.name}: ${tool.description}`).join("\n");
}
function renderTextDescriptionAndArgs(tools) {
    if (tools.every(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isOpenAITool"])) {
        return tools.map((tool)=>`${tool.function.name}${tool.function.description ? `: ${tool.function.description}` : ""}, args: ${JSON.stringify(tool.function.parameters)}`).join("\n");
    }
    return tools.map((tool)=>{
        const jsonSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$types$2f$zod$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isInteropZodSchema"])(tool.schema) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$json_schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toJsonSchema"])(tool.schema) : tool.schema;
        return `${tool.name}: ${tool.description}, args: ${JSON.stringify(jsonSchema?.properties)}`;
    }).join("\n");
}
}),
"[project]/web/node_modules/langchain/dist/agents/format_scratchpad/log.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Construct the scratchpad that lets the agent continue its thought process.
 * @param intermediateSteps
 * @param observationPrefix
 * @param llmPrefix
 * @returns a string with the formatted observations and agent logs
 */ __turbopack_context__.s([
    "formatLogToString",
    ()=>formatLogToString
]);
function formatLogToString(intermediateSteps, observationPrefix = "Observation: ", llmPrefix = "Thought: ") {
    const formattedSteps = intermediateSteps.reduce((thoughts, { action, observation })=>thoughts + [
            action.log,
            `\n${observationPrefix}${observation}`,
            llmPrefix
        ].join("\n"), "");
    return formattedSteps;
}
}),
"[project]/web/node_modules/langchain/dist/agents/structured_chat/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StructuredChatAgent",
    ()=>StructuredChatAgent,
    "createStructuredChatAgent",
    ()=>createStructuredChatAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/language_models/base.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/language_models/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/chat.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/utils/function_calling.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/utils/function_calling.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$utils$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/utils/types.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$types$2f$zod$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/utils/types/zod.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$utils$2f$json_schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/utils/json_schema.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$json_schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/utils/json_schema.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/structured_chat/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/structured_chat/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$render$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/tools/render.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$log$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/log.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
class StructuredChatAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Agent"] {
    static lc_name() {
        return "StructuredChatAgent";
    }
    constructor(input){
        const outputParser = input?.outputParser ?? StructuredChatAgent.getDefaultOutputParser();
        super({
            ...input,
            outputParser
        });
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "structured_chat"
            ]
        });
    }
    _agentType() {
        return "structured-chat-zero-shot-react-description";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    _stop() {
        return [
            "Observation:"
        ];
    }
    /**
     * Validates that all provided tools have a description. Throws an error
     * if any tool lacks a description.
     * @param tools Array of StructuredTool instances to validate.
     */ static validateTools(tools) {
        const descriptionlessTool = tools.find((tool)=>!tool.description);
        if (descriptionlessTool) {
            const msg = `Got a tool ${descriptionlessTool.name} without a description.` + ` This agent requires descriptions for all tools.`;
            throw new Error(msg);
        }
    }
    /**
     * Returns a default output parser for the StructuredChatAgent. If an LLM
     * is provided, it creates an output parser with retry logic from the LLM.
     * @param fields Optional fields to customize the output parser. Can include an LLM and a list of tool names.
     * @returns An instance of StructuredChatOutputParserWithRetries.
     */ static getDefaultOutputParser(fields) {
        if (fields?.llm) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StructuredChatOutputParserWithRetries"].fromLLM(fields.llm, {
                toolNames: fields.toolNames
            });
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StructuredChatOutputParserWithRetries"]({
            toolNames: fields?.toolNames
        });
    }
    /**
     * Constructs the agent's scratchpad from a list of steps. If the agent's
     * scratchpad is not empty, it prepends a message indicating that the
     * agent has not seen any previous work.
     * @param steps Array of AgentStep instances to construct the scratchpad from.
     * @returns A Promise that resolves to a string representing the agent's scratchpad.
     */ async constructScratchPad(steps) {
        const agentScratchpad = await super.constructScratchPad(steps);
        if (agentScratchpad) {
            return `This was your previous work (but I haven't seen any of it! I only see what you return as final answer):\n${agentScratchpad}`;
        }
        return agentScratchpad;
    }
    /**
     * Creates a string representation of the schemas of the provided tools.
     * @param tools Array of StructuredTool instances to create the schemas string from.
     * @returns A string representing the schemas of the provided tools.
     */ static createToolSchemasString(tools) {
        return tools.map((tool)=>{
            const jsonSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$types$2f$zod$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isInteropZodSchema"])(tool.schema) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$json_schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toJsonSchema"])(tool.schema) : tool.schema;
            return `${tool.name}: ${tool.description}, args: ${JSON.stringify(jsonSchema?.properties)}`;
        }).join("\n");
    }
    /**
     * Create prompt in the style of the agent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.suffix - String to put after the list of tools.
     * @param args.prefix - String to put before the list of tools.
     * @param args.inputVariables List of input variables the final prompt will expect.
     * @param args.memoryPrompts List of historical prompts from memory.
     */ static createPrompt(tools, args) {
        const { prefix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PREFIX"], suffix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUFFIX"], inputVariables = [
            "input",
            "agent_scratchpad"
        ], humanMessageTemplate = "{input}\n\n{agent_scratchpad}", memoryPrompts = [] } = args ?? {};
        const template = [
            prefix,
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"],
            suffix
        ].join("\n\n");
        const messages = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessagePromptTemplate"](new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
                template,
                inputVariables,
                partialVariables: {
                    tool_schemas: StructuredChatAgent.createToolSchemasString(tools),
                    tool_names: tools.map((tool)=>tool.name).join(", ")
                }
            })),
            ...memoryPrompts,
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"](new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
                template: humanMessageTemplate,
                inputVariables
            }))
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages(messages);
    }
    /**
     * Creates a StructuredChatAgent from an LLM and a list of tools.
     * Validates the tools, creates a prompt, and sets up an LLM chain for the
     * agent.
     * @param llm BaseLanguageModel instance to create the agent from.
     * @param tools Array of StructuredTool instances to create the agent from.
     * @param args Optional arguments to customize the creation of the agent. Can include arguments for creating the prompt and AgentArgs.
     * @returns A new instance of StructuredChatAgent.
     */ static fromLLMAndTools(llm, tools, args) {
        StructuredChatAgent.validateTools(tools);
        const prompt = StructuredChatAgent.createPrompt(tools, args);
        const outputParser = args?.outputParser ?? StructuredChatAgent.getDefaultOutputParser({
            llm,
            toolNames: tools.map((tool)=>tool.name)
        });
        const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            prompt,
            llm,
            callbacks: args?.callbacks
        });
        return new StructuredChatAgent({
            llmChain: chain,
            outputParser,
            allowedTools: tools.map((t)=>t.name)
        });
    }
}
async function createStructuredChatAgent({ llm, tools, prompt, streamRunnable }) {
    const missingVariables = [
        "tools",
        "tool_names",
        "agent_scratchpad"
    ].filter((v)=>!prompt.inputVariables.includes(v));
    if (missingVariables.length > 0) {
        throw new Error(`Provided prompt is missing required input variables: ${JSON.stringify(missingVariables)}`);
    }
    let toolNames = [];
    if (tools.every(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$language_models$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isOpenAITool"])) {
        toolNames = tools.map((tool)=>tool.function.name);
    } else if (tools.every(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isStructuredTool"])) {
        toolNames = tools.map((tool)=>tool.name);
    } else {
        throw new Error("All tools must be either OpenAI or Structured tools, not a mix.");
    }
    const partialedPrompt = await prompt.partial({
        tools: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$render$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTextDescriptionAndArgs"])(tools),
        tool_names: toolNames.join(", ")
    });
    // TODO: Add .bind to core runnable interface.
    const llmWithStop = llm.withConfig({
        stop: [
            "Observation"
        ]
    });
    const agent = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentRunnableSequence"].fromRunnables([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnablePassthrough"].assign({
            agent_scratchpad: (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$log$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatLogToString"])(input.steps)
        }),
        partialedPrompt,
        llmWithStop,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StructuredChatOutputParserWithRetries"].fromLLM(llm, {
            toolNames
        })
    ], {
        name: "StructuredChatAgent",
        streamRunnable,
        singleAction: true
    });
    return agent;
}
}),
"[project]/web/node_modules/langchain/dist/agents/openai_functions/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PREFIX",
    ()=>PREFIX,
    "SUFFIX",
    ()=>SUFFIX
]);
const PREFIX = `You are a helpful AI assistant.`;
const SUFFIX = ``;
}),
"[project]/web/node_modules/langchain/dist/agents/openai_functions/output_parser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenAIFunctionsAgentOutputParser",
    ()=>OpenAIFunctionsAgentOutputParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
;
;
;
class OpenAIFunctionsAgentOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "openai"
            ]
        });
    }
    static lc_name() {
        return "OpenAIFunctionsAgentOutputParser";
    }
    async parse(text) {
        throw new Error(`OpenAIFunctionsAgentOutputParser can only parse messages.\nPassed input: ${text}`);
    }
    async parseResult(generations) {
        if ("message" in generations[0] && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBaseMessage"])(generations[0].message)) {
            return this.parseAIMessage(generations[0].message);
        }
        throw new Error("parseResult on OpenAIFunctionsAgentOutputParser only works on ChatGeneration output");
    }
    /**
     * Parses the output message into a FunctionsAgentAction or AgentFinish
     * object.
     * @param message The BaseMessage to parse.
     * @returns A FunctionsAgentAction or AgentFinish object.
     */ parseAIMessage(message) {
        if (message.content && typeof message.content !== "string") {
            throw new Error("This agent cannot parse non-string model responses.");
        }
        if (message.additional_kwargs.function_call) {
            // eslint-disable-next-line prefer-destructuring
            const function_call = message.additional_kwargs.function_call;
            try {
                const toolInput = function_call.arguments ? JSON.parse(function_call.arguments) : {};
                return {
                    tool: function_call.name,
                    toolInput,
                    log: `Invoking "${function_call.name}" with ${function_call.arguments ?? "{}"}\n${message.content}`,
                    messageLog: [
                        message
                    ]
                };
            } catch (error) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Failed to parse function arguments from chat model response. Text: "${function_call.arguments}". ${error}`);
            }
        } else {
            return {
                returnValues: {
                    output: message.content
                },
                log: message.content
            };
        }
    }
    getFormatInstructions() {
        throw new Error("getFormatInstructions not implemented inside OpenAIFunctionsAgentOutputParser.");
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/openai_tools/output_parser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenAIToolsAgentOutputParser",
    ()=>OpenAIToolsAgentOutputParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
;
;
;
class OpenAIToolsAgentOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentMultiActionOutputParser"] {
    constructor(){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "openai"
            ]
        });
    }
    static lc_name() {
        return "OpenAIToolsAgentOutputParser";
    }
    async parse(text) {
        throw new Error(`OpenAIFunctionsAgentOutputParser can only parse messages.\nPassed input: ${text}`);
    }
    async parseResult(generations) {
        if ("message" in generations[0] && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBaseMessage"])(generations[0].message)) {
            return this.parseAIMessage(generations[0].message);
        }
        throw new Error("parseResult on OpenAIFunctionsAgentOutputParser only works on ChatGeneration output");
    }
    /**
     * Parses the output message into a ToolsAgentAction[] or AgentFinish
     * object.
     * @param message The BaseMessage to parse.
     * @returns A ToolsAgentAction[] or AgentFinish object.
     */ parseAIMessage(message) {
        if (message.content && typeof message.content !== "string") {
            throw new Error("This agent cannot parse non-string model responses.");
        }
        if (message.additional_kwargs.tool_calls) {
            const toolCalls = message.additional_kwargs.tool_calls;
            try {
                return toolCalls.map((toolCall, i)=>{
                    if (toolCall.type === "function") {
                        const toolInput = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {};
                        const messageLog = i === 0 ? [
                            message
                        ] : [];
                        return {
                            tool: toolCall.function.name,
                            toolInput,
                            toolCallId: toolCall.id,
                            log: `Invoking "${toolCall.function.name}" with ${toolCall.function.arguments ?? "{}"}\n${message.content}`,
                            messageLog
                        };
                    }
                    return undefined;
                }).filter(Boolean);
            } catch (error) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Failed to parse tool arguments from chat model response. Text: "${JSON.stringify(toolCalls)}". ${error}`);
            }
        } else {
            return {
                returnValues: {
                    output: message.content
                },
                log: message.content
            };
        }
    }
    getFormatInstructions() {
        throw new Error("getFormatInstructions not implemented inside OpenAIToolsAgentOutputParser.");
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/openai/output_parser.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// console.warn([
//   `[WARNING]: The root "langchain/agents/openai/output_parser" entrypoint is deprecated.`,
//   `Please use either "langchain/agents/openai/output_parser" specific entrypoint instead.`
// ].join("\n"));
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_functions/output_parser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_tools$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_tools/output_parser.js [app-route] (ecmascript)");
;
;
}),
"[project]/web/node_modules/langchain/dist/agents/format_scratchpad/openai_functions.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatForOpenAIFunctions",
    ()=>formatForOpenAIFunctions,
    "formatToOpenAIFunctionMessages",
    ()=>formatToOpenAIFunctionMessages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/ai.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/human.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$function$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/function.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/template.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/prompt.js [app-route] (ecmascript)");
;
;
;
function formatForOpenAIFunctions(steps) {
    const thoughts = [];
    for (const step of steps){
        thoughts.push(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AIMessage"](step.action.log));
        thoughts.push(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$human$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessage"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TEMPLATE_TOOL_RESPONSE"], "f-string", {
            observation: step.observation
        })));
    }
    return thoughts;
}
function formatToOpenAIFunctionMessages(steps) {
    return steps.flatMap(({ action, observation })=>{
        if ("messageLog" in action && action.messageLog !== undefined) {
            const log = action.messageLog;
            return log.concat(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$function$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FunctionMessage"](observation, action.tool));
        } else {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AIMessage"](action.log)
            ];
        }
    });
}
}),
"[project]/web/node_modules/langchain/dist/agents/openai_functions/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenAIAgent",
    ()=>OpenAIAgent,
    "_formatIntermediateSteps",
    ()=>_formatIntermediateSteps,
    "createOpenAIFunctionsAgent",
    ()=>createOpenAIFunctionsAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/utils/function_calling.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/utils/function_calling.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/ai.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$function$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/function.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/chat.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_functions/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai/output_parser.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_functions/output_parser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$openai_functions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/openai_functions.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
/**
 * Checks if the given action is a FunctionsAgentAction.
 * @param action The action to check.
 * @returns True if the action is a FunctionsAgentAction, false otherwise.
 */ function isFunctionsAgentAction(action) {
    return action.messageLog !== undefined;
}
function _convertAgentStepToMessages(action, observation) {
    if (isFunctionsAgentAction(action) && action.messageLog !== undefined) {
        return action.messageLog?.concat(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$function$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FunctionMessage"](observation, action.tool));
    } else {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AIMessage"](action.log)
        ];
    }
}
function _formatIntermediateSteps(intermediateSteps) {
    return intermediateSteps.flatMap(({ action, observation })=>_convertAgentStepToMessages(action, observation));
}
class OpenAIAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Agent"] {
    static lc_name() {
        return "OpenAIAgent";
    }
    _agentType() {
        return "openai-functions";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    _stop() {
        return [
            "Observation:"
        ];
    }
    constructor(input){
        super({
            ...input,
            outputParser: undefined
        });
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "openai"
            ]
        });
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenAIFunctionsAgentOutputParser"]()
        });
        this.tools = input.tools;
    }
    /**
     * Creates a prompt for the OpenAIAgent using the provided tools and
     * fields.
     * @param _tools The tools to be used in the prompt.
     * @param fields Optional fields for creating the prompt.
     * @returns A BasePromptTemplate object representing the created prompt.
     */ static createPrompt(_tools, fields) {
        const { prefix = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PREFIX"] } = fields || {};
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages([
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SystemMessagePromptTemplate"].fromTemplate(prefix),
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MessagesPlaceholder"]("chat_history"),
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate("{input}"),
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MessagesPlaceholder"]("agent_scratchpad")
        ]);
    }
    /**
     * Creates an OpenAIAgent from a BaseLanguageModel and a list of tools.
     * @param llm The BaseLanguageModel to use.
     * @param tools The tools to be used by the agent.
     * @param args Optional arguments for creating the agent.
     * @returns An instance of OpenAIAgent.
     */ static fromLLMAndTools(llm, tools, args) {
        OpenAIAgent.validateTools(tools);
        if (llm._modelType() !== "base_chat_model" || llm._llmType() !== "openai") {
            throw new Error("OpenAIAgent requires an OpenAI chat model");
        }
        const prompt = OpenAIAgent.createPrompt(tools, args);
        const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            prompt,
            llm,
            callbacks: args?.callbacks
        });
        return new OpenAIAgent({
            llmChain: chain,
            allowedTools: tools.map((t)=>t.name),
            tools
        });
    }
    /**
     * Constructs a scratch pad from a list of agent steps.
     * @param steps The steps to include in the scratch pad.
     * @returns A string or a list of BaseMessages representing the constructed scratch pad.
     */ async constructScratchPad(steps) {
        return _formatIntermediateSteps(steps);
    }
    /**
     * Plans the next action or finish state of the agent based on the
     * provided steps, inputs, and optional callback manager.
     * @param steps The steps to consider in planning.
     * @param inputs The inputs to consider in planning.
     * @param callbackManager Optional CallbackManager to use in planning.
     * @returns A Promise that resolves to an AgentAction or AgentFinish object representing the planned action or finish state.
     */ async plan(steps, inputs, callbackManager) {
        // Add scratchpad and stop to inputs
        const thoughts = await this.constructScratchPad(steps);
        const newInputs = {
            ...inputs,
            agent_scratchpad: thoughts
        };
        if (this._stop().length !== 0) {
            newInputs.stop = this._stop();
        }
        // Split inputs between prompt and llm
        const llm = this.llmChain.llm;
        const valuesForPrompt = {
            ...newInputs
        };
        const valuesForLLM = {
            functions: this.tools.map((tool)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["convertToOpenAIFunction"])(tool))
        };
        const callKeys = "callKeys" in this.llmChain.llm ? this.llmChain.llm.callKeys : [];
        for (const key of callKeys){
            if (key in inputs) {
                valuesForLLM[key] = inputs[key];
                delete valuesForPrompt[key];
            }
        }
        const promptValue = await this.llmChain.prompt.formatPromptValue(valuesForPrompt);
        const message = await llm.invoke(promptValue.toChatMessages(), {
            ...valuesForLLM,
            callbacks: callbackManager
        });
        return this.outputParser.parseAIMessage(message);
    }
}
async function createOpenAIFunctionsAgent({ llm, tools, prompt, streamRunnable }) {
    if (!prompt.inputVariables.includes("agent_scratchpad")) {
        throw new Error([
            `Prompt must have an input variable named "agent_scratchpad".`,
            `Found ${JSON.stringify(prompt.inputVariables)} instead.`
        ].join("\n"));
    }
    const llmWithTools = llm.bindTools ? llm.bindTools(tools) : llm.withConfig({
        functions: tools.map((tool)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["convertToOpenAIFunction"])(tool))
    });
    const agent = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentRunnableSequence"].fromRunnables([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnablePassthrough"].assign({
            agent_scratchpad: (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$openai_functions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatToOpenAIFunctionMessages"])(input.steps)
        }),
        prompt,
        llmWithTools,
        new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenAIFunctionsAgentOutputParser"]()
    ], {
        name: "OpenAIFunctionsAgent",
        streamRunnable,
        singleAction: true
    });
    return agent;
}
}),
"[project]/web/node_modules/langchain/dist/agents/xml/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AGENT_INSTRUCTIONS",
    ()=>AGENT_INSTRUCTIONS
]);
const AGENT_INSTRUCTIONS = `You are a helpful assistant. Help the user answer any questions.

You have access to the following tools:

{tools}

In order to use a tool, you can use <tool></tool> and <tool_input></tool_input> tags.
You will then get back a response in the form <observation></observation>
For example, if you have a tool called 'search' that could run a google search, in order to search for the weather in SF you would respond:

<tool>search</tool><tool_input>weather in SF</tool_input>
<observation>64 degrees</observation>

When you are done, respond with a final answer between <final_answer></final_answer>. For example:

<final_answer>The weather in SF is 64 degrees</final_answer>

Begin!

Question: {question}`;
}),
"[project]/web/node_modules/langchain/dist/agents/xml/output_parser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "XMLAgentOutputParser",
    ()=>XMLAgentOutputParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
;
;
class XMLAgentOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "xml"
            ]
        });
    }
    static lc_name() {
        return "XMLAgentOutputParser";
    }
    /**
     * Parses the output text from the agent and returns an AgentAction or
     * AgentFinish object.
     * @param text The output text from the agent.
     * @returns An AgentAction or AgentFinish object.
     */ async parse(text) {
        if (text.includes("</tool>")) {
            const _toolMatch = text.match(/<tool>([^<]*)<\/tool>/);
            const _tool = _toolMatch ? _toolMatch[1] : "";
            const _toolInputMatch = text.match(/<tool_input>([^<]*?)(?:<\/tool_input>|$)/);
            const _toolInput = _toolInputMatch ? _toolInputMatch[1] : "";
            return {
                tool: _tool,
                toolInput: _toolInput,
                log: text
            };
        } else if (text.includes("<final_answer>")) {
            const answerMatch = text.match(/<final_answer>([^<]*?)(?:<\/final_answer>|$)/);
            const answer = answerMatch ? answerMatch[1] : "";
            return {
                returnValues: {
                    output: answer
                },
                log: text
            };
        } else {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Could not parse LLM output: ${text}`);
        }
    }
    getFormatInstructions() {
        throw new Error("getFormatInstructions not implemented inside OpenAIFunctionsAgentOutputParser.");
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/format_scratchpad/xml.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatXml",
    ()=>formatXml
]);
function formatXml(intermediateSteps) {
    let log = "";
    for (const step of intermediateSteps){
        const { action, observation } = step;
        log += `<tool>${action.tool}</tool><tool_input>${action.toolInput}\n</tool_input><observation>${observation}</observation>`;
    }
    return log;
}
}),
"[project]/web/node_modules/langchain/dist/agents/xml/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "XMLAgent",
    ()=>XMLAgent,
    "createXmlAgent",
    ()=>createXmlAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/chat.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/llm_chain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/xml/prompt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/xml/output_parser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$render$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/tools/render.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$xml$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/xml.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
class XMLAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseSingleActionAgent"] {
    static lc_name() {
        return "XMLAgent";
    }
    _agentType() {
        return "xml";
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "xml"
            ]
        });
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["XMLAgentOutputParser"]()
        });
        this.tools = fields.tools;
        this.llmChain = fields.llmChain;
    }
    get inputKeys() {
        return [
            "input"
        ];
    }
    static createPrompt() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatPromptTemplate"].fromMessages([
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HumanMessagePromptTemplate"].fromTemplate(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_INSTRUCTIONS"]),
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$chat$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AIMessagePromptTemplate"].fromTemplate("{intermediate_steps}")
        ]);
    }
    /**
     * Plans the next action or finish state of the agent based on the
     * provided steps, inputs, and optional callback manager.
     * @param steps The steps to consider in planning.
     * @param inputs The inputs to consider in planning.
     * @param callbackManager Optional CallbackManager to use in planning.
     * @returns A Promise that resolves to an AgentAction or AgentFinish object representing the planned action or finish state.
     */ async plan(steps, inputs, callbackManager) {
        let log = "";
        for (const { action, observation } of steps){
            log += `<tool>${action.tool}</tool><tool_input>${action.toolInput}</tool_input><observation>${observation}</observation>`;
        }
        let tools = "";
        for (const tool of this.tools){
            tools += `${tool.name}: ${tool.description}\n`;
        }
        const _inputs = {
            intermediate_steps: log,
            tools,
            question: inputs.input,
            stop: [
                "</tool_input>",
                "</final_answer>"
            ]
        };
        const response = await this.llmChain.call(_inputs, callbackManager);
        return this.outputParser.parse(response[this.llmChain.outputKey]);
    }
    /**
     * Creates an XMLAgent from a BaseLanguageModel and a list of tools.
     * @param llm The BaseLanguageModel to use.
     * @param tools The tools to be used by the agent.
     * @param args Optional arguments for creating the agent.
     * @returns An instance of XMLAgent.
     */ static fromLLMAndTools(llm, tools, args) {
        const prompt = XMLAgent.createPrompt();
        const chain = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$llm_chain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMChain"]({
            prompt,
            llm,
            callbacks: args?.callbacks
        });
        return new XMLAgent({
            llmChain: chain,
            tools
        });
    }
}
async function createXmlAgent({ llm, tools, prompt, streamRunnable }) {
    const missingVariables = [
        "tools",
        "agent_scratchpad"
    ].filter((v)=>!prompt.inputVariables.includes(v));
    if (missingVariables.length > 0) {
        throw new Error(`Provided prompt is missing required input variables: ${JSON.stringify(missingVariables)}`);
    }
    const partialedPrompt = await prompt.partial({
        tools: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$render$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTextDescription"])(tools)
    });
    // TODO: Add .bind to core runnable interface.
    const llmWithStop = llm.withConfig({
        stop: [
            "</tool_input>",
            "</final_answer>"
        ]
    });
    const agent = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentRunnableSequence"].fromRunnables([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnablePassthrough"].assign({
            agent_scratchpad: (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$xml$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatXml"])(input.steps)
        }),
        partialedPrompt,
        llmWithStop,
        new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["XMLAgentOutputParser"]()
    ], {
        name: "XMLAgent",
        streamRunnable,
        singleAction: true
    });
    return agent;
}
}),
"[project]/web/node_modules/langchain/dist/agents/initialize.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializeAgentExecutor",
    ()=>initializeAgentExecutor,
    "initializeAgentExecutorWithOptions",
    ()=>initializeAgentExecutorWithOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$buffer_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/memory/buffer_memory.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/structured_chat/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/executor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_functions/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/xml/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
const initializeAgentExecutor = async (tools, llm, _agentType, _verbose, _callbackManager)=>{
    const agentType = _agentType ?? "zero-shot-react-description";
    const verbose = _verbose;
    const callbackManager = _callbackManager;
    switch(agentType){
        case "zero-shot-react-description":
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"].fromLLMAndTools(llm, tools),
                tools,
                returnIntermediateSteps: true,
                verbose,
                callbackManager
            });
        case "chat-zero-shot-react-description":
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatAgent"].fromLLMAndTools(llm, tools),
                tools,
                returnIntermediateSteps: true,
                verbose,
                callbackManager
            });
        case "chat-conversational-react-description":
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatConversationalAgent"].fromLLMAndTools(llm, tools),
                tools,
                verbose,
                callbackManager
            });
        default:
            throw new Error("Unknown agent type");
    }
};
async function initializeAgentExecutorWithOptions(tools, llm, options = {
    agentType: llm._modelType() === "base_chat_model" ? "chat-zero-shot-react-description" : "zero-shot-react-description"
}) {
    // Note this tools cast is safe as the overload signatures prevent
    // the function from being called with a StructuredTool[] when
    // the agentType is not in InitializeAgentExecutorOptionsStructured
    switch(options.agentType){
        case "zero-shot-react-description":
            {
                const { agentArgs, tags, ...rest } = options;
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                    tags: [
                        ...tags ?? [],
                        "zero-shot-react-description"
                    ],
                    agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"].fromLLMAndTools(llm, tools, agentArgs),
                    tools,
                    ...rest
                });
            }
        case "chat-zero-shot-react-description":
            {
                const { agentArgs, tags, ...rest } = options;
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                    tags: [
                        ...tags ?? [],
                        "chat-zero-shot-react-description"
                    ],
                    agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatAgent"].fromLLMAndTools(llm, tools, agentArgs),
                    tools,
                    ...rest
                });
            }
        case "chat-conversational-react-description":
            {
                const { agentArgs, memory, tags, ...rest } = options;
                const executor = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                    tags: [
                        ...tags ?? [],
                        "chat-conversational-react-description"
                    ],
                    agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatConversationalAgent"].fromLLMAndTools(llm, tools, agentArgs),
                    tools,
                    memory: memory ?? new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$buffer_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BufferMemory"]({
                        returnMessages: true,
                        memoryKey: "chat_history",
                        inputKey: "input",
                        outputKey: "output"
                    }),
                    ...rest
                });
                return executor;
            }
        case "xml":
            {
                const { agentArgs, tags, ...rest } = options;
                const executor = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                    tags: [
                        ...tags ?? [],
                        "xml"
                    ],
                    agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["XMLAgent"].fromLLMAndTools(llm, tools, agentArgs),
                    tools,
                    ...rest
                });
                return executor;
            }
        case "structured-chat-zero-shot-react-description":
            {
                const { agentArgs, memory, tags, ...rest } = options;
                const executor = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                    tags: [
                        ...tags ?? [],
                        "structured-chat-zero-shot-react-description"
                    ],
                    agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StructuredChatAgent"].fromLLMAndTools(llm, tools, agentArgs),
                    tools,
                    memory,
                    ...rest
                });
                return executor;
            }
        case "openai-functions":
            {
                const { agentArgs, memory, tags, ...rest } = options;
                const executor = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"].fromAgentAndTools({
                    tags: [
                        ...tags ?? [],
                        "openai-functions"
                    ],
                    agent: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenAIAgent"].fromLLMAndTools(llm, tools, agentArgs),
                    tools,
                    memory: memory ?? new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$buffer_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BufferMemory"]({
                        returnMessages: true,
                        memoryKey: "chat_history",
                        inputKey: "input",
                        outputKey: "output"
                    }),
                    ...rest
                });
                return executor;
            }
        default:
            {
                throw new Error("Unknown agent type");
            }
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/conversational_retrieval/token_buffer_memory.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenAIAgentTokenBufferMemory",
    ()=>OpenAIAgentTokenBufferMemory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/memory.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/memory.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$chat_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/memory/chat_memory.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_functions/index.js [app-route] (ecmascript)");
;
;
;
;
class OpenAIAgentTokenBufferMemory extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$chat_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChatMemory"] {
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "humanPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Human"
        });
        Object.defineProperty(this, "aiPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AI"
        });
        Object.defineProperty(this, "llm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "memoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "history"
        });
        Object.defineProperty(this, "maxTokenLimit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 12000
        });
        Object.defineProperty(this, "returnMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "output"
        });
        Object.defineProperty(this, "intermediateStepsKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "intermediateSteps"
        });
        this.humanPrefix = fields.humanPrefix ?? this.humanPrefix;
        this.aiPrefix = fields.aiPrefix ?? this.aiPrefix;
        this.llm = fields.llm;
        this.memoryKey = fields.memoryKey ?? this.memoryKey;
        this.maxTokenLimit = fields.maxTokenLimit ?? this.maxTokenLimit;
        this.returnMessages = fields.returnMessages ?? this.returnMessages;
        this.outputKey = fields.outputKey ?? this.outputKey;
        this.intermediateStepsKey = fields.intermediateStepsKey ?? this.intermediateStepsKey;
    }
    get memoryKeys() {
        return [
            this.memoryKey
        ];
    }
    /**
     * Retrieves the messages from the chat history.
     * @returns Promise that resolves with the messages from the chat history.
     */ async getMessages() {
        return this.chatHistory.getMessages();
    }
    /**
     * Loads memory variables from the input values.
     * @param _values Input values.
     * @returns Promise that resolves with the loaded memory variables.
     */ async loadMemoryVariables(_values) {
        const buffer = await this.getMessages();
        if (this.returnMessages) {
            return {
                [this.memoryKey]: buffer
            };
        } else {
            const bufferString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBufferString"])(buffer, this.humanPrefix, this.aiPrefix);
            return {
                [this.memoryKey]: bufferString
            };
        }
    }
    /**
     * Saves the context of the chat, including user input, AI output, and
     * intermediate steps. Prunes the chat history if the total token count
     * exceeds the maximum limit.
     * @param inputValues Input values.
     * @param outputValues Output values.
     * @returns Promise that resolves when the context has been saved.
     */ async saveContext(inputValues, outputValues) {
        const inputValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInputValue"])(inputValues, this.inputKey);
        const outputValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOutputValue"])(outputValues, this.outputKey);
        await this.chatHistory.addUserMessage(inputValue);
        const intermediateStepMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["_formatIntermediateSteps"])(outputValues[this.intermediateStepsKey]);
        for (const message of intermediateStepMessages){
            await this.chatHistory.addMessage(message);
        }
        await this.chatHistory.addAIChatMessage(outputValue);
        const currentMessages = await this.chatHistory.getMessages();
        let tokenInfo = await this.llm.getNumTokensFromMessages(currentMessages);
        if (tokenInfo.totalCount > this.maxTokenLimit) {
            const prunedMemory = [];
            while(tokenInfo.totalCount > this.maxTokenLimit){
                const retainedMessage = currentMessages.pop();
                if (!retainedMessage) {
                    console.warn(`Could not prune enough messages from chat history to stay under ${this.maxTokenLimit} tokens.`);
                    break;
                }
                prunedMemory.push(retainedMessage);
                tokenInfo = await this.llm.getNumTokensFromMessages(currentMessages);
            }
            await this.chatHistory.clear();
            for (const message of prunedMemory){
                await this.chatHistory.addMessage(message);
            }
        }
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/conversational_retrieval/openai_functions.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createConversationalRetrievalAgent",
    ()=>createConversationalRetrievalAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$summary_buffer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/memory/summary_buffer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$initialize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/initialize.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$conversational_retrieval$2f$token_buffer_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/conversational_retrieval/token_buffer_memory.js [app-route] (ecmascript)");
;
;
;
async function createConversationalRetrievalAgent(llm, tools, options) {
    const { rememberIntermediateSteps = true, memoryKey = "chat_history", outputKey = "output", inputKey = "input", prefix, verbose } = options ?? {};
    let memory;
    if (rememberIntermediateSteps) {
        memory = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$conversational_retrieval$2f$token_buffer_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenAIAgentTokenBufferMemory"]({
            memoryKey,
            llm,
            outputKey,
            inputKey
        });
    } else {
        memory = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$memory$2f$summary_buffer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConversationSummaryBufferMemory"]({
            memoryKey,
            llm,
            maxTokenLimit: 12000,
            returnMessages: true,
            outputKey,
            inputKey
        });
    }
    const executor = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$initialize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeAgentExecutorWithOptions"])(tools, llm, {
        agentType: "openai-functions",
        memory,
        verbose,
        returnIntermediateSteps: rememberIntermediateSteps,
        agentArgs: {
            prefix: prefix ?? `Do your best to answer the questions. Feel free to use any tools available to look up relevant information, only if necessary.`
        }
    });
    return executor;
}
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/json/json.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$openapi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/openapi/openapi.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/vectorstore/vectorstore.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$conversational_retrieval$2f$tool$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/conversational_retrieval/tool.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$conversational_retrieval$2f$openai_functions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/conversational_retrieval/openai_functions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$conversational_retrieval$2f$token_buffer_memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/conversational_retrieval/token_buffer_memory.js [app-route] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/web/node_modules/langchain/dist/agents/toolkits/base.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/tools.js [app-route] (ecmascript) <locals>");
;
}),
"[project]/web/node_modules/langchain/dist/agents/format_scratchpad/tool_calling.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_createToolMessage",
    ()=>_createToolMessage,
    "formatToToolMessages",
    ()=>formatToToolMessages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/ai.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/index.js [app-route] (ecmascript)");
;
function _createToolMessage(step) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ToolMessage"]({
        tool_call_id: step.action.toolCallId,
        content: step.observation,
        additional_kwargs: {
            name: step.action.tool
        }
    });
}
function formatToToolMessages(steps) {
    return steps.flatMap(({ action, observation })=>{
        if ("messageLog" in action && action.messageLog !== undefined) {
            const log = action.messageLog;
            return log.concat(_createToolMessage({
                action,
                observation
            }));
        } else {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AIMessage"](action.log)
            ];
        }
    });
}
}),
"[project]/web/node_modules/langchain/dist/agents/format_scratchpad/openai_tools.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$tool_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/tool_calling.js [app-route] (ecmascript)");
;
;
}),
"[project]/web/node_modules/langchain/dist/agents/format_scratchpad/tool_calling.js [app-route] (ecmascript) <export formatToToolMessages as formatToOpenAIToolMessages>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatToOpenAIToolMessages",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$tool_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatToToolMessages"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$tool_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/tool_calling.js [app-route] (ecmascript)");
}),
"[project]/web/node_modules/langchain/dist/agents/openai_tools/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createOpenAIToolsAgent",
    ()=>createOpenAIToolsAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/utils/function_calling.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/utils/function_calling.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$openai_tools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/openai_tools.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$tool_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__formatToToolMessages__as__formatToOpenAIToolMessages$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/tool_calling.js [app-route] (ecmascript) <export formatToToolMessages as formatToOpenAIToolMessages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_tools$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_tools/output_parser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
;
;
;
;
;
;
async function createOpenAIToolsAgent({ llm, tools, prompt, streamRunnable }) {
    if (!prompt.inputVariables.includes("agent_scratchpad")) {
        throw new Error([
            `Prompt must have an input variable named "agent_scratchpad".`,
            `Found ${JSON.stringify(prompt.inputVariables)} instead.`
        ].join("\n"));
    }
    const modelWithTools = llm.bindTools ? llm.bindTools(tools) : llm.withConfig({
        tools: tools.map((tool)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$utils$2f$function_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["convertToOpenAITool"])(tool))
    });
    const agent = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentRunnableSequence"].fromRunnables([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnablePassthrough"].assign({
            agent_scratchpad: (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$tool_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__formatToToolMessages__as__formatToOpenAIToolMessages$3e$__["formatToOpenAIToolMessages"])(input.steps)
        }),
        prompt,
        modelWithTools,
        new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_tools$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenAIToolsAgentOutputParser"]()
    ], {
        name: "OpenAIToolsAgent",
        streamRunnable,
        singleAction: false
    });
    return agent;
}
}),
"[project]/web/node_modules/langchain/dist/agents/tool_calling/output_parser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToolCallingAgentOutputParser",
    ()=>ToolCallingAgentOutputParser,
    "parseAIMessageToToolAction",
    ()=>parseAIMessageToToolAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$messages$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/messages.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/messages/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
;
;
;
function parseAIMessageToToolAction(message) {
    const stringifiedMessageContent = typeof message.content === "string" ? message.content : JSON.stringify(message.content);
    let toolCalls = [];
    if (message.tool_calls !== undefined && message.tool_calls.length > 0) {
        toolCalls = message.tool_calls;
    } else {
        if (!message.additional_kwargs.tool_calls || message.additional_kwargs.tool_calls.length === 0) {
            return {
                returnValues: {
                    output: message.content
                },
                log: stringifiedMessageContent
            };
        }
        // Best effort parsing
        for (const toolCall of message.additional_kwargs.tool_calls ?? []){
            const functionName = toolCall.function?.name;
            try {
                const args = JSON.parse(toolCall.function.arguments);
                toolCalls.push({
                    name: functionName,
                    args,
                    id: toolCall.id
                });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Failed to parse tool arguments from chat model response. Text: "${JSON.stringify(toolCalls)}". ${e}`);
            }
        }
    }
    return toolCalls.map((toolCall, i)=>{
        const messageLog = i === 0 ? [
            message
        ] : [];
        const log = `Invoking "${toolCall.name}" with ${JSON.stringify(toolCall.args ?? {})}\n${stringifiedMessageContent}`;
        return {
            tool: toolCall.name,
            toolInput: toolCall.args,
            toolCallId: toolCall.id ?? "",
            log,
            messageLog
        };
    });
}
class ToolCallingAgentOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentMultiActionOutputParser"] {
    constructor(){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "tool_calling"
            ]
        });
    }
    static lc_name() {
        return "ToolCallingAgentOutputParser";
    }
    async parse(text) {
        throw new Error(`ToolCallingAgentOutputParser can only parse messages.\nPassed input: ${text}`);
    }
    async parseResult(generations) {
        if ("message" in generations[0] && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$messages$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBaseMessage"])(generations[0].message)) {
            return parseAIMessageToToolAction(generations[0].message);
        }
        throw new Error("parseResult on ToolCallingAgentOutputParser only works on ChatGeneration output");
    }
    getFormatInstructions() {
        throw new Error("getFormatInstructions not implemented inside ToolCallingAgentOutputParser.");
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/tool_calling/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createToolCallingAgent",
    ()=>createToolCallingAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$tool_calling$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/tool_calling/output_parser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$tool_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/tool_calling.js [app-route] (ecmascript)");
;
;
;
;
function _isBaseChatModel(x) {
    const model = x;
    return typeof model._modelType === "function" && model._modelType() === "base_chat_model";
}
function createToolCallingAgent({ llm, tools, prompt, streamRunnable }) {
    if (!prompt.inputVariables.includes("agent_scratchpad")) {
        throw new Error([
            `Prompt must have an input variable named "agent_scratchpad".`,
            `Found ${JSON.stringify(prompt.inputVariables)} instead.`
        ].join("\n"));
    }
    let modelWithTools;
    if (_isBaseChatModel(llm)) {
        if (llm.bindTools === undefined) {
            throw new Error(`This agent requires that the "bind_tools()" method be implemented on the input model.`);
        }
        modelWithTools = llm.bindTools(tools);
    } else {
        modelWithTools = llm;
    }
    const agent = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentRunnableSequence"].fromRunnables([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnablePassthrough"].assign({
            agent_scratchpad: (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$tool_calling$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatToToolMessages"])(input.steps)
        }),
        prompt,
        modelWithTools,
        new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$tool_calling$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ToolCallingAgentOutputParser"]()
    ], {
        name: "ToolCallingAgent",
        streamRunnable,
        singleAction: false
    });
    return agent;
}
}),
"[project]/web/node_modules/langchain/dist/agents/react/prompt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FORMAT_INSTRUCTIONS",
    ()=>FORMAT_INSTRUCTIONS
]);
const FORMAT_INSTRUCTIONS = `Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question`;
}),
"[project]/web/node_modules/langchain/dist/agents/react/output_parser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReActSingleInputOutputParser",
    ()=>ReActSingleInputOutputParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$prompts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/prompts.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/prompts/template.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$output_parsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/output_parsers.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/output_parsers/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$react$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/react/prompt.js [app-route] (ecmascript)");
;
;
;
;
const FINAL_ANSWER_ACTION = "Final Answer:";
const FINAL_ANSWER_AND_PARSABLE_ACTION_ERROR_MESSAGE = "Parsing LLM output produced both a final answer and a parse-able action:";
class ReActSingleInputOutputParser extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"] {
    constructor(fields){
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "langchain",
                "agents",
                "react"
            ]
        });
        Object.defineProperty(this, "toolNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.toolNames = fields.toolNames;
    }
    /**
     * Parses the given text into an AgentAction or AgentFinish object. If an
     * output fixing parser is defined, uses it to parse the text.
     * @param text Text to parse.
     * @returns Promise that resolves to an AgentAction or AgentFinish object.
     */ async parse(text) {
        const includesAnswer = text.includes(FINAL_ANSWER_ACTION);
        const regex = /Action\s*\d*\s*:[\s]*(.*?)[\s]*Action\s*\d*\s*Input\s*\d*\s*:[\s]*(.*)/;
        const actionMatch = text.match(regex);
        if (actionMatch) {
            if (includesAnswer) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`${FINAL_ANSWER_AND_PARSABLE_ACTION_ERROR_MESSAGE}: ${text}`);
            }
            const action = actionMatch[1];
            const actionInput = actionMatch[2];
            const toolInput = actionInput.trim().replace(/^"|"$/g, "");
            return {
                tool: action,
                toolInput,
                log: text
            };
        }
        if (includesAnswer) {
            const finalAnswerText = text.split(FINAL_ANSWER_ACTION)[1].trim();
            return {
                returnValues: {
                    output: finalAnswerText
                },
                log: text
            };
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$output_parsers$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OutputParserException"](`Could not parse LLM output: ${text}`);
    }
    /**
     * Returns the format instructions as a string. If the 'raw' option is
     * true, returns the raw FORMAT_INSTRUCTIONS.
     * @param options Options for getting the format instructions.
     * @returns Format instructions as a string.
     */ getFormatInstructions() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$prompts$2f$template$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTemplate"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$react$2f$prompt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORMAT_INSTRUCTIONS"], "f-string", {
            tool_names: this.toolNames.join(", ")
        });
    }
}
}),
"[project]/web/node_modules/langchain/dist/agents/react/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createReactAgent",
    ()=>createReactAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$runnables$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/runnables.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/runnables/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$render$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/tools/render.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$log$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/format_scratchpad/log.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$react$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/react/output_parser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
;
;
;
;
;
async function createReactAgent({ llm, tools, prompt, streamRunnable }) {
    const missingVariables = [
        "tools",
        "tool_names",
        "agent_scratchpad"
    ].filter((v)=>!prompt.inputVariables.includes(v));
    if (missingVariables.length > 0) {
        throw new Error(`Provided prompt is missing required input variables: ${JSON.stringify(missingVariables)}`);
    }
    const toolNames = tools.map((tool)=>tool.name);
    const partialedPrompt = await prompt.partial({
        tools: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$tools$2f$render$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderTextDescription"])(tools),
        tool_names: toolNames.join(", ")
    });
    const llmWithStop = llm.withConfig({
        stop: [
            "\nObservation:"
        ]
    });
    const agent = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentRunnableSequence"].fromRunnables([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$runnables$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnablePassthrough"].assign({
            agent_scratchpad: (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$format_scratchpad$2f$log$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatLogToString"])(input.steps)
        }),
        partialedPrompt,
        llmWithStop,
        new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$react$2f$output_parser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ReActSingleInputOutputParser"]({
            toolNames
        })
    ], {
        name: "ReactAgent",
        streamRunnable,
        singleAction: true
    });
    return agent;
}
}),
"[project]/web/node_modules/langchain/dist/agents/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/base.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/executor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$initialize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/initialize.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/structured_chat/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/structured_chat/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_functions/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_tools/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$tool_calling$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/tool_calling/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/xml/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$react$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/react/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/web/node_modules/langchain/agents.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/index.js [app-route] (ecmascript) <locals>");
;
}),
"[project]/web/node_modules/langchain/dist/agents/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Agent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Agent"],
    "AgentActionOutputParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentActionOutputParser"],
    "AgentExecutor",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentExecutor"],
    "BaseMultiActionAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseMultiActionAgent"],
    "BaseSingleActionAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseSingleActionAgent"],
    "ChatAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatAgent"],
    "ChatAgentOutputParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatAgentOutputParser"],
    "ChatConversationalAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatConversationalAgent"],
    "ChatConversationalAgentOutputParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatConversationalAgentOutputParser"],
    "ChatConversationalAgentOutputParserWithRetries",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatConversationalAgentOutputParserWithRetries"],
    "JsonToolkit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JsonToolkit"],
    "LLMSingleActionAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMSingleActionAgent"],
    "OpenAIAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenAIAgent"],
    "OpenApiToolkit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$openapi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenApiToolkit"],
    "RequestsToolkit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$openapi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RequestsToolkit"],
    "RunnableAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RunnableAgent"],
    "StructuredChatAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StructuredChatAgent"],
    "StructuredChatOutputParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StructuredChatOutputParser"],
    "StructuredChatOutputParserWithRetries",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StructuredChatOutputParserWithRetries"],
    "Toolkit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__BaseToolkit__as__Toolkit$3e$__["Toolkit"],
    "VectorStoreRouterToolkit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreRouterToolkit"],
    "VectorStoreToolkit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreToolkit"],
    "XMLAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["XMLAgent"],
    "ZeroShotAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgent"],
    "ZeroShotAgentOutputParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ZeroShotAgentOutputParser"],
    "createJsonAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createJsonAgent"],
    "createOpenAIFunctionsAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOpenAIFunctionsAgent"],
    "createOpenAIToolsAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createOpenAIToolsAgent"],
    "createOpenApiAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$openapi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOpenApiAgent"],
    "createReactAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$react$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createReactAgent"],
    "createStructuredChatAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createStructuredChatAgent"],
    "createToolCallingAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$tool_calling$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createToolCallingAgent"],
    "createVectorStoreAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createVectorStoreAgent"],
    "createVectorStoreRouterAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createVectorStoreRouterAgent"],
    "createXmlAgent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createXmlAgent"],
    "initializeAgentExecutor",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$initialize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeAgentExecutor"],
    "initializeAgentExecutorWithOptions",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$initialize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeAgentExecutorWithOptions"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$agent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/agent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$json$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/json/json.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$openapi$2f$openapi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/openapi/openapi.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$toolkits$2f$vectorstore$2f$vectorstore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/toolkits/vectorstore/vectorstore.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__BaseToolkit__as__Toolkit$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@langchain/core/dist/tools/index.js [app-route] (ecmascript) <export BaseToolkit as Toolkit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$chat_convo$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/chat_convo/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$executor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/executor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$initialize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/initialize.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$mrkl$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/mrkl/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/structured_chat/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$structured_chat$2f$outputParser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/structured_chat/outputParser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_functions$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_functions/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$openai_tools$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/openai_tools/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$tool_calling$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/tool_calling/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$xml$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/xml/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$agents$2f$react$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/agents/react/index.js [app-route] (ecmascript)");
}),
];

//# sourceMappingURL=2374f_langchain_248370ce._.js.map