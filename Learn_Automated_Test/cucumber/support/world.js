import {setWorldConstructor, World} from "@cucumber/cucumber";
import {request} from "@playwright/test";

/* 
    This Custom World class is to store universal(global?) info so that
    our stepdef file could use them without explicitly creating variables inside
    the step def functions 
*/

class CustomWorld extends World {
    constructor(options) {
        super(options); // enables us to use the "this" option - setting the foundations of a house

        // State variables to share between steps - adding details to the house

        // 1. Technical/Protocol Contexts
        this.apiContext = null;
        this.authToken = null;

        // 2. Request Response
        this.requestData = null;
        this.loginResponse = null;
        this.createResponse = null;
        this.getResponse = null;
        this.putResponse = null;
        this.patchResponse = null;
        this.deleteResponse = null;
        
        // 3. Business IDs
        this.bookingUserId = null;

        // 4. Booking objects
        this.curBookingObject = null;
        this.putBooking = null;
        this.patchBooking = null;
        this.bookingsSent = [];
        this.bookingsReceived = [];
    }

    async initApi() {
        if (!this.apiContext) { // if this.apiContext is null then this sets a default anchor to Restful booker, so we don't need to retype it
            this.apiContext = await request.newContext({
                baseURL: "https://restful-booker.herokuapp.com",
            });
        }
    }
}

setWorldConstructor(CustomWorld);