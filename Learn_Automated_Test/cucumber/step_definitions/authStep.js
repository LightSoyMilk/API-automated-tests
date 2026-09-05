/* Import Libraries */
import { Given } from "@cucumber/cucumber";
import {test, expect} from "@playwright/test";
import fs from "fs";

/*
    This step is to handle login cases where we need the token
*/

Given("a logged-in user session", async function () {
    // Make sure our API context is initialized
    //await this.initApi();

    // User info
    const user_info = {
        "username": "admin",
        "password": "password123"
    };

    // Perform the login request
    const login_resp = await this.apiContext.post("/auth", 
        {headers: {"Content-Type": "application/json"},
        data: user_info});
        
    // Guard Assertion: Fail if the login response isn't successful
    await expect(login_resp.ok()).toBeTruthy();

    // Saving the authentication token
    const resp_json = await login_resp.json(); 

    // Guard Assertion: Making sure that the authToken isn't null
    await expect(resp_json.token).toBeDefined();
    await expect(resp_json.token).not.toBeNull();
     
    this.authToken = resp_json.token;
    
    // Guard Assertion: Making sure that the authToken isn't null
    await expect(this.authToken).toBeDefined();
    await expect(this.authToken).not.toBeNull();

});

/* The create booking step to get the booking's id */

Given("an existing booking in the system", async function () {
    // Make sure our API context is initialized
    //await this.initApi();

    // Initial booking object information
    const booking_payload = {
            "firstname" : "Jane",
            "lastname" : "Doe",
            "totalprice" : 222,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2025-01-01",
                "checkout" : "2026-01-01"
            },
            "additionalneeds" : "Coffee"
        }

    this.curBookingObject = booking_payload;

    // Calling the API, to get the booking id
    const create_resp = await this.apiContext.post("/booking", 
        {headers: {"Content-Type": "application/json"},
        data: booking_payload }); 

    // Guard assertions: Fail if the booking creation is not successful
    await expect(create_resp.ok(), "Failed to create the Booking").toBeTruthy();

    const create_json = await create_resp.json();
    this.bookingUserId = create_json.bookingid;

    // Guard Assertion: Making sure that the response body + booking id isn't null
    await expect(create_json, "The create response cannot be parsed into a JSON object").toBeDefined();
    await expect(create_json, "The create response JSON is null").not.toBeNull();

    await expect(this.bookingUserId, "The booking's id does not exist").toBeDefined();
    await expect(this.bookingUserId, "The booking's id is null").not.toBeNull();
})