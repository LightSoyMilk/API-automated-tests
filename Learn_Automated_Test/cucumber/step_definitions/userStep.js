/* Import Libraries */
import {test, expect} from "@playwright/test";
import {When, DataTable} from "@cucumber/cucumber";
import {transformFullBookingTable, transformPartialBookingTable} from "../support/bookingTransformer.js";
import { applyPatch } from "../support/merger.js";
import fs from "fs";

/* Booking info */

// const file1 = fs.readFileSync("./testData/booking1.json");
// const booking1 = JSON.parse(file1);
// const file2 = fs.readFileSync("./testData/put.json");
// const put_booking_local = JSON.parse(file2);

const file3 = fs.readFileSync("./testData/patch.json");

const patch_booking_local = JSON.parse(file3);

/*
    These steps is to handle cases regarding user calls to the API
*/

/* Login */
When("the user login with {string} and {string}", async function (username, password) {
    //await this.initApi();

    // Creating the loginData we receive from the Feature File
    const loginData = {
        "username": username,
        "password": password
    };

    //console.log(loginPayload);
    this.requestData = loginData;
    
    console.log("[Post] https://restful-booker.herokuapp.com/auth");
    console.log("Request body:\n", loginData);

    // Sending the login request
    const login_resp = await this.apiContext.post("/auth", 
        {headers: {"Content-Type": "application/json"},
        data: loginData}
    );
    this.loginResponse = login_resp;

    const login_json = await login_resp.json();
    const auth_token = login_json.token;

    if (auth_token) {
        console.log("Response body: " + auth_token);
    }
    else {
        console.log("Invalid Login");
    }
});

/* Create Booking */

When("they create a booking", async function (dataTable) {
    // Make sure our API context is initialized
    //await this.initApi();

    // The request data
    const booking_info = {
        "firstname" : "Jane",
        "lastname" : "Doe",
        "totalprice" : 222,
        "depositpaid" : true,
        "bookingdates" : {
            "checkin" : "2025-01-01",
            "checkout" : "2026-01-01"
        },
        "additionalneeds" : "Coffee"
    };

    const payload = transformFullBookingTable(dataTable);
    const payloadLength = payload.length;
    this.requestData = booking_info;

    for (let curBooking = 0; curBooking < payloadLength; curBooking++) {
        // Setting the current request data
        this.requestData = payload[curBooking];
        this.bookingsSent.push(this.requestData);

        // Logging out the request we send to the API
        console.log("[Post] https://restful-booker.herokuapp.com/booking");
        console.log("Request body:\n", this.requestData);

        // Perform the create Booking request
        const create_resp = await this.apiContext.post("/booking",
            {headers: {"Content-Type": "application/json"},
            data: this.requestData});

        // Guard Assertion: Fail if the Booking creation isn't successful
        await expect(create_resp.ok(), "Booking creation was not successful").toBeTruthy();
        
        // Saving the response, and bookingId
        this.createResponse = create_resp;

        // Add more guard assertions for create_json before calling it to this.
        const create_json = await this.createResponse.json();
        this.bookingUserId = create_json.bookingid;
        this.bookingsReceived.push(create_json);

        // Guard Assertion: Making sure that the response body + booking id isn't null
        await expect(this.createResponse).toBeDefined();
        await expect(this.createResponse).not.toBeNull();

        await expect(this.bookingUserId).toBeDefined();
        await expect(this.bookingUserId).not.toBeNull();

        // Console logging the Response body
        console.log("Response body:\n", create_json);
    };
});


/* Get Booking */
When("a user send a get request with the booking id", async function () {
    // Make sure our API context is initialized 
    //await this.initApi();

    // Logging out the Get request we send to the API
    console.log("[Get] https://restful-booker.herokuapp.com/booking/" + this.bookingUserId);

    // Perform the Get Booking request
    const get_resp = await this.apiContext.get("/booking/" + this.bookingUserId);

    // Guard Assertion: Fail if the Booking Get isn't successful
    await expect(get_resp.ok()).toBeTruthy();

    // Saving the response
    this.getResponse = get_resp;
    const get_json = await this.getResponse.json();

    // Guard Assertion: Making sure that the response body isn't null
    await expect(this.getResponse).toBeDefined();
    await expect(this.getResponse).not.toBeNull();

    // Console logging the Response body
    console.log("Response body:\n", get_json);
    console.log("================================");
});


/* Update (Put) Booking*/
When("they fully update their booking details to:", async function (dataTable) {
    // Make sure our API context is initialized 
    //await this.initApi();
    const put_booking_transformed = transformFullBookingTable(dataTable);

    const payloadLength = put_booking_transformed.length;

    for(let curBooking = 0; curBooking < payloadLength; curBooking++) {

        this.putBooking = put_booking_transformed[curBooking];
        
        // Logging out the request we send to the API
        console.log("[Put] https://restful-booker.herokuapp.com/booking/" + this.bookingUserId);
        console.log("Request body:\n", this.putBooking);

        // Perform the Put request
        const put_resp = await this.apiContext.put("/booking/" + this.bookingUserId, 
            {headers: {"Content-Type": "application/json", "Accept": "application/json", "Cookie": "token=" + this.authToken},
            data: this.putBooking});

        // Guard Assertion: Fail if the Put request isn't successful
        await expect(put_resp.ok()).toBeTruthy();

        // Saving the response 
        this.putResponse = put_resp;
        const put_json = await this.putResponse.json();
        this.curBookingObject = put_json;
        this.bookingsSent.push(this.putBooking);

        // Guard Assertion: Making sure that the response body isn't null
        await expect(this.putResponse).toBeDefined();
        await expect(this.putResponse).not.toBeNull();
        this.bookingsReceived.push(this.put_json);

        // Console logging the Response body
        console.log("Response body:\n", put_json);
        console.log("================================");

    };
});


/* Partially Update (Patch) Booking */
When("they partially update their booking details to:", async function (dataTable) {
    // Make sure our API context is initialized 
    //await this.initApi();

    const patch_booking_transformed = transformPartialBookingTable(dataTable);
    const payload_length = patch_booking_transformed.length;

    for (let curBooking = 0; curBooking < payload_length; curBooking++) {

        this.patchBooking = patch_booking_transformed[curBooking];
        const original_booking = applyPatch(this.curBookingObject, this.patchBooking);

        // Logging out the request we send to the API
        console.log("[Patch] https://restful-booker.herokuapp.com/booking/" + this.bookingUserId);
        console.log("Request body:\n", this.patchBooking);

        // Perform the Patch request
        const patch_resp = await this.apiContext.patch("/booking/" + this.bookingUserId,
            {headers: {"Content-Type": "application/json", "Accept": "application/json", "Cookie": "token=" + this.authToken},
            data: patch_booking_transformed[curBooking]});

        // Guard Assertion: Fail if the Put request isn't successful
        await expect(patch_resp.ok()).toBeTruthy();

        // Saving the response 
        this.patchResponse = patch_resp;
        const patch_json = await this.patchResponse.json();
    
        this.bookingsSent.push(patch_json);
        this.curBookingObject = original_booking;

        // Guard Assertion: Making sure that the response body isn't null
        await expect(this.patchResponse).toBeDefined();
        await expect(this.patchResponse).not.toBeNull();

        // Console logging the Response body
        console.log("Response body:\n", patch_json);
        console.log("================================");

    };
});


/* Delete Booking */
When('the user send a delete request with a booking\'s id', async function () {
    // Make sure our API context is initialized 
    //await this.initApi();

    // Logging out the request we send to the API
    console.log("================================");
    console.log("[Delete] https://restful-booker.herokuapp.com/booking/" + this.bookingUserId);

    // Perform the Delete request
    const delete_resp = await this.apiContext.delete("/booking/" + this.bookingUserId,
        {headers: {"Content-Type": "application/json", "Cookie": "token=" + this.authToken}});

    // Saving the Delete response
    this.deleteResponse = delete_resp;

    // Guard Assertion: Fail if the Delete request isn't successful
    await expect(delete_resp.ok()).toBeTruthy();

    // Console logging the Response status text
    console.log("Response status code:", this.deleteResponse.status());
    console.log("Response status text:", this.deleteResponse.statusText());
    console.log("================================");
});

When("a user send a get request with a booking id not available in the database", async function () {
    // Make sure our API context is initialized
    //await this.initApi();

    // Logging out the Get request we send to the API
    console.log("================================");
    console.log("[Get] https://restful-booker.herokuapp.com/booking/" + this.bookingUserId);

    const get_resp = await this.apiContext.get("/booking/" + this.bookingUserId);

    this.getResponse = get_resp;

    // Console logging the Response status text
    console.log("Response status code:", this.getResponse.status());
    console.log("Response status text:", this.getResponse.statusText());
    console.log("================================");
});