module.exports = [
"[project]/web/node_modules/langchain/dist/util/set.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations
 */ /**
 * returns intersection of two sets
 */ __turbopack_context__.s([
    "difference",
    ()=>difference,
    "intersection",
    ()=>intersection,
    "union",
    ()=>union
]);
function intersection(setA, setB) {
    const _intersection = new Set();
    for (const elem of setB){
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
function union(setA, setB) {
    const _union = new Set(setA);
    for (const elem of setB){
        _union.add(elem);
    }
    return _union;
}
function difference(setA, setB) {
    const _difference = new Set(setA);
    for (const elem of setB){
        _difference.delete(elem);
    }
    return _difference;
}
}),
"[project]/web/node_modules/langchain/dist/chains/sequential_chain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SequentialChain",
    ()=>SequentialChain,
    "SimpleSequentialChain",
    ()=>SimpleSequentialChain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/chains/base.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/langchain/dist/util/set.js [app-route] (ecmascript)");
;
;
function formatSet(input) {
    return Array.from(input).map((i)=>`"${i}"`).join(", ");
}
class SequentialChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    static lc_name() {
        return "SequentialChain";
    }
    get inputKeys() {
        return this.inputVariables;
    }
    get outputKeys() {
        return this.outputVariables;
    }
    constructor(fields){
        super(fields);
        Object.defineProperty(this, "chains", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputVariables", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputVariables", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnAll", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chains = fields.chains;
        this.inputVariables = fields.inputVariables;
        this.outputVariables = fields.outputVariables ?? [];
        if (this.outputVariables.length > 0 && fields.returnAll) {
            throw new Error("Either specify variables to return using `outputVariables` or use `returnAll` param. Cannot apply both conditions at the same time.");
        }
        this.returnAll = fields.returnAll ?? false;
        this._validateChains();
    }
    /** @ignore */ _validateChains() {
        if (this.chains.length === 0) {
            throw new Error("Sequential chain must have at least one chain.");
        }
        const memoryKeys = this.memory?.memoryKeys ?? [];
        const inputKeysSet = new Set(this.inputKeys);
        const memoryKeysSet = new Set(memoryKeys);
        const keysIntersection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["intersection"])(inputKeysSet, memoryKeysSet);
        if (keysIntersection.size > 0) {
            throw new Error(`The following keys: ${formatSet(keysIntersection)} are overlapping between memory and input keys of the chain variables. This can lead to unexpected behaviour. Please use input and memory keys that don't overlap.`);
        }
        const availableKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["union"])(inputKeysSet, memoryKeysSet);
        for (const chain of this.chains){
            let missingKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["difference"])(new Set(chain.inputKeys), availableKeys);
            if (chain.memory) {
                missingKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["difference"])(missingKeys, new Set(chain.memory.memoryKeys));
            }
            if (missingKeys.size > 0) {
                throw new Error(`Missing variables for chain "${chain._chainType()}": ${formatSet(missingKeys)}. Only got the following variables: ${formatSet(availableKeys)}.`);
            }
            const outputKeysSet = new Set(chain.outputKeys);
            const overlappingOutputKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["intersection"])(availableKeys, outputKeysSet);
            if (overlappingOutputKeys.size > 0) {
                throw new Error(`The following output variables for chain "${chain._chainType()}" are overlapping: ${formatSet(overlappingOutputKeys)}. This can lead to unexpected behaviour.`);
            }
            for (const outputKey of outputKeysSet){
                availableKeys.add(outputKey);
            }
        }
        if (this.outputVariables.length === 0) {
            if (this.returnAll) {
                const outputKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["difference"])(availableKeys, inputKeysSet);
                this.outputVariables = Array.from(outputKeys);
            } else {
                this.outputVariables = this.chains[this.chains.length - 1].outputKeys;
            }
        } else {
            const missingKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$util$2f$set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["difference"])(new Set(this.outputVariables), new Set(availableKeys));
            if (missingKeys.size > 0) {
                throw new Error(`The following output variables were expected to be in the final chain output but were not found: ${formatSet(missingKeys)}.`);
            }
        }
    }
    /** @ignore */ async _call(values, runManager) {
        let input = {};
        const allChainValues = values;
        let i = 0;
        for (const chain of this.chains){
            i += 1;
            input = await chain.call(allChainValues, runManager?.getChild(`step_${i}`));
            for (const key of Object.keys(input)){
                allChainValues[key] = input[key];
            }
        }
        const output = {};
        for (const key of this.outputVariables){
            output[key] = allChainValues[key];
        }
        return output;
    }
    _chainType() {
        return "sequential_chain";
    }
    static async deserialize(data) {
        const chains = [];
        const inputVariables = data.input_variables;
        const outputVariables = data.output_variables;
        const serializedChains = data.chains;
        for (const serializedChain of serializedChains){
            const deserializedChain = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"].deserialize(serializedChain);
            chains.push(deserializedChain);
        }
        return new SequentialChain({
            chains,
            inputVariables,
            outputVariables
        });
    }
    serialize() {
        const chains = [];
        for (const chain of this.chains){
            chains.push(chain.serialize());
        }
        return {
            _type: this._chainType(),
            input_variables: this.inputVariables,
            output_variables: this.outputVariables,
            chains
        };
    }
}
class SimpleSequentialChain extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"] {
    static lc_name() {
        return "SimpleSequentialChain";
    }
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
        Object.defineProperty(this, "chains", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "input"
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "output"
        });
        Object.defineProperty(this, "trimOutputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chains = fields.chains;
        this.trimOutputs = fields.trimOutputs ?? false;
        this._validateChains();
    }
    /** @ignore */ _validateChains() {
        for (const chain of this.chains){
            if (chain.inputKeys.filter((k)=>!chain.memory?.memoryKeys.includes(k)).length !== 1) {
                throw new Error(`Chains used in SimpleSequentialChain should all have one input, got ${chain.inputKeys.length} for ${chain._chainType()}.`);
            }
            if (chain.outputKeys.length !== 1) {
                throw new Error(`Chains used in SimpleSequentialChain should all have one output, got ${chain.outputKeys.length} for ${chain._chainType()}.`);
            }
        }
    }
    /** @ignore */ async _call(values, runManager) {
        let input = values[this.inputKey];
        let i = 0;
        for (const chain of this.chains){
            i += 1;
            input = (await chain.call({
                [chain.inputKeys[0]]: input,
                signal: values.signal
            }, runManager?.getChild(`step_${i}`)))[chain.outputKeys[0]];
            if (this.trimOutputs) {
                input = input.trim();
            }
            await runManager?.handleText(input);
        }
        return {
            [this.outputKey]: input
        };
    }
    _chainType() {
        return "simple_sequential_chain";
    }
    static async deserialize(data) {
        const chains = [];
        const serializedChains = data.chains;
        for (const serializedChain of serializedChains){
            const deserializedChain = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$langchain$2f$dist$2f$chains$2f$base$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChain"].deserialize(serializedChain);
            chains.push(deserializedChain);
        }
        return new SimpleSequentialChain({
            chains
        });
    }
    serialize() {
        const chains = [];
        for (const chain of this.chains){
            chains.push(chain.serialize());
        }
        return {
            _type: this._chainType(),
            chains
        };
    }
}
}),
];

//# sourceMappingURL=2374f_langchain_dist_c12f2ca6._.js.map