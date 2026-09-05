import { test, expect } from "@playwright/test";

/**
    Custom assertion wrapper with Console Logging:
    @param {Object} actualBooking - Booking object
    @param {Object} expectedBooking - Booking object
    @param {string} parentKey - to keep track of what path failed

    @param {any} actual - the actual value received
    @param {any} expected - the expected value to match 
    @param {any} field - current field tested
**/

/* New work:
    Ideas to work on:
    - Make the assert function throw out errors the moment a test case fails, but still continue afterwards for the whole suite. Status: ? <=> Almost done needs testing
    - Make the tests more robust, instead of having hard coded values for test cases, only have the booking1 as the jumping off point,
    from then on utilize all the this.[specific]reponse fields to handle more robust cases. Status: ?
    - Use the dataTable for cucumber to pass data in. Status: Done YAY :3

Megawork later on (NOT NEEDED yet dont stress about it now):
    - Environment variable
    - Use hooks for test cases
    - Scenario outlines
    - Run test cases with tags

All in all: YOU GOT THIS!!! :3
*/

export async function assertBooking(actualBooking, expectedBooking, parentKey = '') {
    // 1. Check that the bookings aren't null and are objects
    if (!isObject(actualBooking) || !isObject(expectedBooking)) {
        throw new Error(`[Invalid Comparison] Both arguments must be valid non-null objects. Passed actual: ${typeof actualBooking}, expected: ${typeof expectedBooking}`);
    }

    // 2. Get all the fields of the 2 objects and add them into an array
    const allKeys = new Set([...Object.keys(actualBooking), ...Object.keys(expectedBooking)]);

    // 3. Loop through all the keys, but if one of the keys are not in either actualBooking or expectedBooking, then throw an error.
    for (const curKey of allKeys) {
        const fullPath = parentKey ? `${parentKey}.${curKey}` : curKey;
        const actualVal = actualBooking[curKey];
        const expectedVal = expectedBooking[curKey];

        // If the current value is not primitive then we go down a path
        if (isObject(actualVal) && isObject(expectedVal)) {
            await assertBooking(actualVal, expectedVal, fullPath);
            continue;
        }
        if (!(curKey in expectedBooking)) {
            console.error(`[Unexpected Key] Field Tested: ${curKey}, Actual: ${actualBooking[curKey]}, Expected: (Property Missing)`);
            throw new Error(`[Unexpected Key] Field Tested: ${curKey}, Actual: ${actualBooking[curKey]}, Expected: (Property Missing)`);
        };
        
        if (!(curKey in actualBooking)) {
            console.error(`[Missing Key] Field Tested: ${curKey}, Actual: (Property Missing), Expected: ${expectedBooking[curKey]}`);
            throw new Error(`[Missing Key] Field Tested: ${curKey}, Actual: (Property Missing), Expected: ${expectedBooking[curKey]}`);
        }; 

        // Comparing primitive fields' values using Playwright
        try {
            expect(actualVal, `❌ Failed | Field tested: ${fullPath}, Actual: ${actualVal}, Expected: ${expectedVal}`).toBe(expectedVal);
            console.log(`✅ Passed | Field tested: ${fullPath}, Actual: ${actualVal}, Expected: ${expectedVal}`);
        }

        catch (error) {
            console.log(`❌ Failed | Field tested: ${fullPath}, Actual: ${actualVal}, Expected: ${expectedVal}`);
            throw error;
        };
    };
};

function isObject(val) {
    return typeof val == "object" && val !== null && !Array.isArray(val);
};