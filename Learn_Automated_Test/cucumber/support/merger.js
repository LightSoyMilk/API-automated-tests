import merge from "lodash.merge";

/*
    Create a new Booking object by merging a potential patch into an existing Booking object
*/ 

export function applyPatch(original, patch) {
    // Perform a cloning of the original Booking object so that we don't transform it in memory - safety
    const clonedOriginal = structuredClone(original);

    // Then we use lodash to update the fields in clonedOriginal with certain fields in patch
    return merge(clonedOriginal, patch);
};