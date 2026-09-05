import { BeforeAll, AfterAll, Before, After } from "@cucumber/cucumber";

// Before each and any single scenario 
Before(async function (scenario) {
//    if (typeof this.initApi === "function") {
//     await this.initApi();
//    }
//    else {
//     throw new Error("initAPI is not defined in the Custom World Context")
//    };
   await this.initApi();
   console.log("\n==================== Start of Scenario ====================");
   console.log("Scenario name: " + scenario.pickle.name);
   console.log("::::::::::::::::::::");
});

After(async function (scenario) {
   // Reset all of the global variables
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
   this.objectAmounts = 0;

   console.log("==================== End of Scenario ===================="); 
});