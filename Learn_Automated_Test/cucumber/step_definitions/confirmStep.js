/* Import Libraries */
import {test, expect} from "@playwright/test";
import {Then} from "@cucumber/cucumber";
import fs, { stat } from "fs";
import { assertBooking } from "../support/assertBooking.js";

/* Booking info */

// const file1 = fs.readFileSync("./testData/booking1.json");
// const booking1 = JSON.parse(file1);
// const file2 = fs.readFileSync("./testData/put.json");
// const updated_booking1 = JSON.parse(file2);
// const file3 = fs.readFileSync("./testData/patch.json");
// const partial_up_booking1 = JSON.parse(file3);

const file4 = fs.readFileSync("./testData/complete_patch.json");

const completely_patched_booking = JSON.parse(file4);

/*
    These steps is to assert that the contents and responses are correct
*/

/* Assertion for Login */
Then("the system should return {string} and an authorization token if valid", async function (statusText) {
    // Validate the successes for valid logins
    const validLogin = {
        username: "admin",
        password: "password123"
    };

    const login_json = await this.loginResponse.json();
    const auth_token = login_json.token;
    const isValidLogin = JSON.stringify(this.requestData) === JSON.stringify(validLogin);

    // Validate the successes for valid logins
    if (isValidLogin) { // In a real setting this would be (if {this.loginData in Database})
        expect(this.loginResponse.status(), "Should return a 200 status").toBe(200);
        expect(this.loginResponse.statusText(), "Should be OK for status text").toBe(statusText);
        expect(auth_token, "Should exists an authorization token for a valid login").toBeDefined();
        expect(auth_token, "Should exists an authorization token for a valid login").toBeTruthy();
    }

    // Validate the failures for invalid logins
    else {
        expect(this.loginResponse.status(), "Should return a 200 status").toBe(200);
        expect(this.loginResponse.statusText(), "Should be OK for status text").toBe(statusText);
        expect(auth_token, "Should not exist an authorization token for an invalid login").toBeUndefined();
    };

})

/* Assertion for Create Booking */

Then("the API should confirm the creation was successful", async function () {
    // Validate protocol success
    expect(this.createResponse.status(), "The API could not resolve the Create request").toBe(200);
    const create_json = await this.createResponse.json();
    const created_booking = create_json.booking;

    // Variables to loop through 
    const bookings_length = this.bookingsSent.length;

    // Validate the content of the response body
    for(let curBooking = 0; curBooking < bookings_length; curBooking++) {
        await assertBooking(created_booking, this.requestData);
    };
    //console.log(create_json);
    //console.log(this.targettargetUserId1); 

    // expect(create_json.booking.firstname).toBe(booking1.firstname);

    // expect(create_json.booking.lastname).toBe(booking1.lastname);

    // expect(create_json.booking.totalprice).toBe(booking1.totalprice);

    // expect(create_json.booking.depositpaid).toBe(booking1.depositpaid);

    // expect(create_json.booking.bookingdates).toEqual(booking1.bookingdates);

    // expect(create_json.booking.additionalneeds).toBe(booking1.additionalneeds);
});

/* Assertion for Get Booking */
Then("the API should return that booking's details", async function () {
    // Validate protocol success
    expect(this.getResponse.status(), "The API could not resolve the Get request").toBe(200);
    const get_json = await this.getResponse.json();

    // Validate the content of the response body
    await assertBooking(get_json, this.curBookingObject);


    // expect(get_json.firstname).toBe(booking1.firstname);

    // expect(get_json.lastname).toBe(booking1.lastname);

    // expect(get_json.totalprice).toBe(booking1.totalprice);

    // expect(get_json.depositpaid).toBe(booking1.depositpaid);

    // expect(get_json.bookingdates).toEqual(booking1.bookingdates);

    // expect(get_json.additionalneeds).toBe(booking1.additionalneeds);
});

/* Assertion for Full Update (Put) Booking */
Then("the API should confirm the booking details were saved successfully", async function () {
    // Validate protocol success
    expect(this.putResponse.status(), "The API could not resolve the Put request").toBe(200);
    const put_json = await this.putResponse.json();

    // Variable to loop through
    const bookings_length = this.bookingsSent.length;

    // Validate the content of the response body
    for (let curBooking = 0; curBooking < bookings_length; curBooking++) {
        await assertBooking(put_json, this.putBooking);
    };
    // expect(put_json.firstname).toBe(this.putBooking.firstname);

    // expect(put_json.lastname).toBe(this.putBooking.lastname);

    // expect(put_json.totalprice).toBe(this.putBooking.totalprice);

    // expect(put_json.depositpaid).toBe(this.putBooking.depositpaid);

    // expect(put_json.bookingdates).toEqual(this.putBooking.bookingdates);

    // expect(put_json.additionalneeds).toBe(this.putBooking.additionalneeds);
});

/* Assertion for Partial Update (Patch) Booking */
Then("the API should return the booking with partially updated details", async function () {
    // Validate protocol success
    expect(this.patchResponse.status(), "The API could not resolve the Patch request").toBe(200);
    const patch_json = await this.patchResponse.json();

    // Variable to loop through
    const payload_length = this.bookingsSent.length;

    // Validate the content of the response body
    for(let curBooking = 0; curBooking < payload_length; curBooking++) {
        await assertBooking(this.bookingsSent[curBooking], this.curBookingObject);
    };

    // expect(patch_json.firstname).toBe(completely_patched_booking.firstname);

    // expect(patch_json.lastname).toBe(completely_patched_booking.lastname);

    // expect(patch_json.totalprice).toBe(completely_patched_booking.totalprice);

    // expect(patch_json.depositpaid).toBe(completely_patched_booking.depositpaid);

    // expect(patch_json.bookingdates).toEqual(completely_patched_booking.bookingdates);

    // expect(patch_json.additionalneeds).toBe(completely_patched_booking.additionalneeds);
});

/* Assertion for Delete Booking */
Then("the API should return a successful delete response", async function () {
    const delete_resp = this.deleteResponse;

    expect(delete_resp.status(), "The API could not resolve the Delete request").toBe(201);
    expect(delete_resp.statusText()).toBe("Created");
});

Then("the API should NOT be able to return any booking with that id", async function () {
   expect(this.getResponse.status(), "There exists a booking with an invalid id").toBe(404);
   expect(this.getResponse.statusText(), "There exists a booking with an invalid id").toBe("Not Found"); 
});