import { test, expect } from "@playwright/test";
//import * as allure from "allure-js-commons";

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
    - Make the assert function throw out errors the moment a test case fails. Status: ? <=> Almost done needs testing
    - Make the tests more robust, instead of having hard coded values for test cases, only have the booking1 as the jumping off point,
    from then on utilize all the this.[specific]reponse fields to handle more robust cases. Status: ? 
    - Use the dataTable for cucumber to pass data in. Status: ? 
    - Learn about metadata for allure. Status: ? <=> Almost done needs testing

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

    // if (typeof actualBooking !== "object" || actualBooking === null ||
    // typeof expectedBooking !== "object" || expectedBooking === null) {
    //     console.error("Faulty Booking objects");
    //     throw new Error("Undefined Object");
    // };
    
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
        
        // Calling assertField if the current value is a primitive type, else recursively go inside the function once more
        if (typeof actualBooking[curKey] === "object" && actualBooking[curKey] !== null && typeof expectedBooking[curKey] === "object" && expectedBooking[curKey] !== null) {
            assertBooking(actualBooking[curKey], expectedBooking[curKey]);
            continue;
        }
        
        // We are now comparing primitive data types
        assertField(curKey, actualBooking[curKey], expectedBooking[curKey]);
    }
    // Putting each field check inside a report step
    //     await allure.step(`Field tested: ${fullPath}`, async () => {

    //         // Check field's existence inside the Bookings' objects
    //         if (!(key in actualBooking)) {
    //             await allure.attachment(
    //                 `Missing field error: ${fullPath}`,
    //                 `Expected field: ${fullPath}, with value ${JSON.stringify(expectedVal)}`,
    //                 "text/plain"
    //             );
                
    //             throw new Error(`[Missing field] Field: ${fullPath} is missing from actualBooking`);
    //         };

    //         if (!(key in expectedBooking)) {
    //             await allure.attachment(
    //                 `Unexpected field error: ${fullPath}`,
    //                 `Actual field: ${fullPath}, with value ${JSON.stringify(expectedVal)}`,
    //                 "text/plain"
    //             );

    //             throw new Error(`[Unexpected field] Field: ${fullPath} found in actualBooking but not expectedBooking`);
    //         };


    //         // Comparing primitive fields' values using Playwright
    //         try {
    //             expect(actualVal, `❌ Failed | Field tested: ${fullPath}, Actual: ${actualVal}, Expected: ${expectedVal}`).toBe(expectedVal);

    //             // attaching details on pass for allure for visibility
    //             await allure.attachment(
    //                 `Field tested: ${fullPath}`,
    //                 `✅ [Passed] Actual: ${JSON.stringify(actualVal)}, Expected: ${JSON.stringify(expectedVal)}`,
    //                 "text/plain"
    //             );
    //         }

    //         catch (error) {
    //             // attaching different details on fail for allure for visibility
    //             await allure.attachment(
    //                 `Field failed: ${fullPath}`,
    //                 `❌ [Failed] Actual: ${JSON.stringify(actualVal)}, Expected: ${JSON.stringify(expectedVal)}`,
    //                 "text/plain"
    //             );

    //             throw error;
    //         };
    //     });
    // }
    
};

function assertField(field, actual, expected) {
    const message = `Field tested: ${field}, Actual: ${actual}, Expected: ${expected}`;
    try {
        expect(actual).toBe(expected);
        console.log(`✅ Passed | ${message}`);
        return;
    }
    catch (error) {
        console.error(`❌ Failed | ${message}`);
        throw new Error(`❌ Failed | ${message}`);
        return;
    }
};

function isObject(val) {
    return typeof val == "object" && val !== null && !Array.isArray(val);
};

/* Garbage of backup codes
if (!(curKey in expectedBooking)) {
            console.error(`[Unexpected Key] Field Tested: ${curKey}, Actual: ${actualBooking[curKey]}, Expected: (Property Missing)`);
            throw new Error(`[Unexpected Key] Field Tested: ${curKey}, Actual: ${actualBooking[curKey]}, Expected: (Property Missing)`);
        };
        
        if (!(curKey in actualBooking)) {
            console.error(`[Missing Key] Field Tested: ${curKey}, Actual: (Property Missing), Expected: ${expectedBooking[curKey]}`);
            throw new Error(`[Missing Key] Field Tested: ${curKey}, Actual: (Property Missing), Expected: ${expectedBooking[curKey]}`);
        }; 
        
        // Calling assertField if the current value is a primitive type, else recursively go inside the function once more
        if (typeof actualBooking[curKey] === "object" && actualBooking[curKey] !== null && typeof expectedBooking[curKey] === "object" && expectedBooking[curKey] !== null) {
            assertBooking(actualBooking[curKey], expectedBooking[curKey]);
            continue;
        }
        
        // We are now comparing primitive data types
        assertField(curKey, actualBooking[curKey], expectedBooking[curKey]);


        // Allure fix
        expect(actualBooking, `Field: ${fullPath} is missing from actualBooking`).toHaveProperty(curKey);
        expect(expectedBooking, `Unexpected property: ${fullPath} is found within actualBooking`).toHaveProperty(curKey);
};
*/