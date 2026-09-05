/* Import Libraries */
import {test, expect} from "@playwright/test"
import fs from "fs"

test("Auth Get Token with Restful Booker", async function ({request}) {
    /* 
        This block is to check users' login, authentication, and tokens
    */

    // Logging in as the user
    const file = fs.readFileSync("./testData/login.json");

    const website_url = "https://restful-booker.herokuapp.com/auth"; // Request url

    const userInfo = JSON.parse(file); // request body

    const resp = await request.post(website_url, 
        {headers: {"Content-Type": "application/json"}, 
        data: userInfo});

    const resp_json = await resp.json();

    const auth_token = resp_json.token;

    // console.log("Access Token:", auth_token);
    // console.log("---------------");

    /* This section is for testing */

    // Checking the status of the response and the response's body
    console.log("---- Testing Section for Logging In to create a Token ----");
    
    console.log("Request url: " + website_url);

    console.log("Request body:");

    console.log(userInfo);

    console.log("Response status: " + resp.status());
    
    console.log("Response body:");

    console.log(resp_json);

    // Testing if the login status was successful
    console.log("Expected status code: " + 200 + ", Actual status code: " + resp.status());
    expect(resp.status()).toBe(200);
    expect(resp.ok()).toBeTruthy();
})

test("Create and Get a Booking", async function ({request}) {
    /* 
       This block is to test the create and get booking API call
       from Restful Booker.
    */

    // Parsing a Booking Json Object
    const file = fs.readFileSync("./testData/booking1.json");

    const create_url = "https://restful-booker.herokuapp.com/booking"; // Request url

    const booking1 = JSON.parse(file); // Request body

    // Creating the Booking request
    const create_resp = await request.post(create_url,
        {headers: {"Content-Type": "application/json"},
        data: booking1});

    const create_json = await create_resp.json();

    const booking1_id = create_json.bookingid;

    /* This section is to test Create*/

    // Checking the status of the response and the response's body
    console.log("---- Testing Section for Creating a Booking ----");

    console.log("Request url: " + create_url);

    console.log("Request body:");

    console.log(booking1);

    console.log("Response status: " + create_resp.status());

    console.log("Response body:");

    console.log(create_json);

    // Checking if the Response status is successful 
    console.log("Expected status code: " + 200 + ", Actual status code: " + create_resp.status());
    expect(create_resp.status()).toBe(200); 
    expect(create_resp.ok()).toBeTruthy();

    // Checking if the booking's info are properly recorded
    console.log("Actual: " + create_json.booking.firstname + ", Expected: " + booking1.firstname);
    expect(create_json.booking.firstname).toBe(booking1.firstname);
    
    console.log("Actual: " + create_json.booking.lastname + ", Expected: " + booking1.lastname);
    expect(create_json.booking.lastname).toBe(booking1.lastname);

    console.log("Actual: " + create_json.booking.totalprice + ", Expected: " + booking1.totalprice);
    expect(create_json.booking.totalprice).toBe(booking1.totalprice);

    console.log("Actual: " + create_json.booking.depositpaid + ", Expected: " + booking1.depositpaid);
    expect(create_json.booking.depositpaid).toBe(booking1.depositpaid);

    console.log("Actual: " + create_json.booking.bookingdates + ", Expected: " + booking1.bookingdates);
    expect(create_json.booking.bookingdates).toEqual(booking1.bookingdates);

    console.log("Actual: " + create_json.booking.additionalneeds + ", Expected: " + booking1.additionalneeds);
    expect(create_json.booking.additionalneeds).toBe(booking1.additionalneeds);
    
    console.log("");
    console.log("================================================================");
    console.log("");

    // Creating the Get Booking request
    const get_url = "https://restful-booker.herokuapp.com/booking/" + booking1_id;
    
    const get_resp = await request.get(get_url);

    const get_json = await get_resp.json();

    /* This section is to test Get booking */

    // Checking the status of the response and the response's body
    console.log("---- Testing Section for Getting a Booking ----");

    console.log("Request url: " + get_url);

    console.log("Request Booking id: " + booking1_id);

    console.log("Response status: " + get_resp.status());

    console.log("Response body:");

    console.log(get_json);

    // Checking if the Response status is successful 
    console.log("Expected status code: " + 200 + ", Actual status code: " + get_resp.status());
    expect(get_resp.status()).toBe(200); 
    expect(get_resp.ok()).toBeTruthy();

    // Checking if the booking's info stored on the server matches with what was originally sent
    console.log("Actual: " + get_json.firstname + ", Expected: " + booking1.firstname);
    expect(get_json.firstname).toBe(booking1.firstname);
    
    console.log("Actual: " + get_json.lastname + ", Expected: " + booking1.lastname);
    expect(get_json.lastname).toBe(booking1.lastname);

    console.log("Actual: " + get_json.totalprice + ", Expected: " + booking1.totalprice);
    expect(get_json.totalprice).toBe(booking1.totalprice);

    console.log("Actual: " + get_json.depositpaid + ", Expected: " + booking1.depositpaid);
    expect(get_json.depositpaid).toBe(booking1.depositpaid);

    console.log("Actual: " + get_json.bookingdates + ", Expected: " + booking1.bookingdates);
    expect(get_json.bookingdates).toEqual(booking1.bookingdates);

    console.log("Actual: " + get_json.additionalneeds + ", Expected: " + booking1.additionalneeds);
    expect(get_json.additionalneeds).toBe(booking1.additionalneeds);

})

test("Update (Put/Patch) a TODO", async function ({request}) {
    /* 
        This block is to test the Update calls from Restful Booker (Put and Patch). 
    */

    /* Logging in to get the access token */
    // Logging in as the user
    const login_file = fs.readFileSync("./testData/login.json");

    const login_url = "https://restful-booker.herokuapp.com/auth"; // Login Request url

    const userInfo = JSON.parse(login_file); // Login Request body

    const login_resp = await request.post(login_url, 
        {headers: {"Content-Type": "application/json"}, 
        data: userInfo});

    const login_json = await login_resp.json();

    const auth_token = login_json.token;
    
    // This section is to quickly test the Login call
    // Checking the status of the Login call
    console.log("---- Quick Testing Section for Login Call ----");

    console.log("Expected status code: " + 200 + ", Actual status code: " + login_resp.status());
    expect(login_resp.status()).toBe(200);
    expect(login_resp.ok()).toBeTruthy();

    console.log("User Authorization token: " + auth_token);
    expect(auth_token).not.toBeNull();

    console.log("");
    console.log("================================================================");
    console.log("");

    /* Creating a Booking */
    // Parsing and createing a Booking Object
    const create_file = fs.readFileSync("./testData/booking1.json");

    const create_url = "https://restful-booker.herokuapp.com/booking"; // Create url

    const booking1 = JSON.parse(create_file); // Create Request body

    // Creating a booking 
    const create_resp = await request.post(create_url, 
        {headers: {"Content-Type": "application/json"},
        data: booking1});
    
    const create_json = await create_resp.json();

    const booking1_id = create_json.bookingid;

    //console.log(create_json);

    // This section is to quickly test the Create call
    // Checking the status of the Create call
    console.log("---- Quick Testing Section for Create Call ----");
    console.log("Expected status code: " + 200 + ", Actual status code: " + create_resp.status());
    expect(create_resp.status()).toBe(200);
    expect(create_resp.ok()).toBeTruthy();

    console.log("Booking1's id: " + booking1_id);
    expect(booking1_id).not.toBeNull();

    console.log("");
    console.log("================================================================");
    console.log("");

    /* Performing the Full Update (Put) call here */
    
    // Parsing the updated Booking
    const put_file = fs.readFileSync("./testData/put.json")

    const put_url = "https://restful-booker.herokuapp.com/booking/" + booking1_id; // Put url
    //console.log(put_url)

    const updated_booking1 = JSON.parse(put_file); // Put Request body

    // Fully updating booking1
    const put_resp = await request.put(put_url, 
        {headers: {"Content-Type": "application/json", "Accept": "application/json", "Cookie": "token=" + auth_token},
        data: updated_booking1});
    
    const put_json = await put_resp.json();

    /* This section is to test Put */
    // Checking the status of the response and the response's body
    console.log("---- Testing Section for Fully Updating (Put) a Booking ----");

    console.log("Request url: " + put_url);

    console.log("Request body:");

    console.log(updated_booking1);

    console.log("Response status: " + put_resp.status());

    console.log("Response body:");

    console.log(put_json);

    // Checking if the Response status is successful 
    console.log("Expected status code: " + 200 + ", Actual status code: " + put_resp.status());
    expect(put_resp.status()).toBe(200); 
    expect(put_resp.ok()).toBeTruthy();

    // Checking if the booking's info are properly recorded
    console.log("Actual: " + put_json.firstname + ", Expected: " + updated_booking1.firstname);
    expect(put_json.firstname).toBe(updated_booking1.firstname);
    
    console.log("Actual: " + put_json.lastname + ", Expected: " + updated_booking1.lastname);
    expect(put_json.lastname).toBe(updated_booking1.lastname);

    console.log("Actual: " + put_json.totalprice + ", Expected: " + updated_booking1.totalprice);
    expect(put_json.totalprice).toBe(updated_booking1.totalprice);

    console.log("Actual: " + put_json.depositpaid + ", Expected: " + updated_booking1.depositpaid);
    expect(put_json.depositpaid).toBe(updated_booking1.depositpaid);

    console.log("Actual: " + put_json.bookingdates + ", Expected: " + updated_booking1.bookingdates);
    expect(put_json.bookingdates).toEqual(updated_booking1.bookingdates);

    console.log("Actual: " + put_json.additionalneeds + ", Expected: " + updated_booking1.additionalneeds);
    expect(put_json.additionalneeds).toBe(updated_booking1.additionalneeds);
    
    console.log("");
    console.log("================================================================");
    console.log("");

    /* Performing the Partial Update (Patch) call here */

    // Parsing the partially updated booking info here
    const patch_file = fs.readFileSync("./testData/patch.json");

    const patch_url = "https://restful-booker.herokuapp.com/booking/" + booking1_id; // Patch url
    //console.log(patch_url);

    const partial_up_booking1 = JSON.parse(patch_file); // Patch Request body

    const patch_resp = await request.patch(patch_url, 
        {headers: {"Content-Type": "application/json", "Accept": "application/json", "Cookie": "token=" + auth_token},
        data: partial_up_booking1});
    
    const patch_json = await patch_resp.json();

    /* This section is to test Patch */
    // Checking the status of the response and the response's body
    console.log("---- Testing Section for Partially Updating (Patch) a Booking ----");

    console.log("Request url: " + patch_url);

    console.log("Request body:");

    console.log(partial_up_booking1);

    console.log("Response status: " + patch_resp.status());

    console.log("Response body:");

    console.log(patch_json);

    // Checking if the Response status is successful 
    console.log("Expected status code: " + 200 + ", Actual status code: " + patch_resp.status());
    expect(patch_resp.status()).toBe(200); 
    expect(patch_resp.ok()).toBeTruthy();

    // Checking if the booking's updated info are properly recorded, and the old field stays the same
    console.log("Actual: " + patch_json.firstname + ", Expected: " + partial_up_booking1.firstname); // Should Change
    expect(patch_json.firstname).toBe(partial_up_booking1.firstname);
    
    console.log("Actual: " + patch_json.lastname + ", Expected: " + updated_booking1.lastname);
    expect(patch_json.lastname).toBe(updated_booking1.lastname);

    console.log("Actual: " + patch_json.totalprice + ", Expected: " + partial_up_booking1.totalprice); // Should Change
    expect(patch_json.totalprice).toBe(partial_up_booking1.totalprice);

    console.log("Actual: " + patch_json.depositpaid + ", Expected: " + partial_up_booking1.depositpaid); // Should Change
    expect(patch_json.depositpaid).not.toBe(updated_booking1.depositpaid);

    console.log("Actual: " + patch_json.bookingdates + ", Expected: " + updated_booking1.bookingdates);
    expect(patch_json.bookingdates).toEqual(updated_booking1.bookingdates);

    console.log("Actual: " + patch_json.additionalneeds + ", Expected: " + updated_booking1.additionalneeds);
    expect(patch_json.additionalneeds).toBe(updated_booking1.additionalneeds);
    
    console.log("");
    console.log("================================================================");
    console.log("");
})

test("Delete a Booking", async function ({request}) {
    /*
        This block is to test the Delete call from Restful Booker.
    */

   /* Logging in to get the access token */
    // Logging in as the user
    const login_file = fs.readFileSync("./testData/login.json");

    const login_url = "https://restful-booker.herokuapp.com/auth"; // Login Request url

    const userInfo = JSON.parse(login_file); // Login Request body

    const login_resp = await request.post(login_url, 
        {headers: {"Content-Type": "application/json"}, 
        data: userInfo});

    const login_json = await login_resp.json();

    const auth_token = login_json.token;
    
    // This section is to quickly test the Login call
    // Checking the status of the Login call
    console.log("---- Quick Testing Section for Login Call ----");

    console.log("Expected status code: 200, Actual status code: " + login_resp.status());
    expect(login_resp.status()).toBe(200);
    expect(login_resp.ok()).toBeTruthy();

    console.log("User Authorization token: " + auth_token);
    expect(auth_token).not.toBeNull();

    console.log("");
    console.log("================================================================");
    console.log("");

    /* Creating a Booking */
    // Parsing and createing a Booking Object
    const create_file = fs.readFileSync("./testData/booking1.json");

    const create_url = "https://restful-booker.herokuapp.com/booking"; // Create url

    const booking1 = JSON.parse(create_file); // Create Request body

    // Creating a booking 
    const create_resp = await request.post(create_url, 
        {headers: {"Content-Type": "application/json"},
        data: booking1});
    
    const create_json = await create_resp.json();

    const booking1_id = create_json.bookingid;

    //console.log(create_json);

    // This section is to quickly test the Create call
    // Checking the status of the Create call
    console.log("---- Quick Testing Section for Create Call ----");
    console.log("Expected status code: 200, Actual status code: " + create_resp.status());
    expect(create_resp.status()).toBe(200);
    expect(create_resp.ok()).toBeTruthy();

    console.log("Booking1's id: " + booking1_id);
    expect(booking1_id).not.toBeNull();

    console.log("");
    console.log("================================================================");
    console.log("");

    /* Deleting the Booking */
    const delete_url = "https://restful-booker.herokuapp.com/booking/" + booking1_id;

    const delete_resp = await request.delete(delete_url, 
        {headers: {"Content-Type": "application/json", "Cookie": "token=" + auth_token}});

    /* Testing section for Deleting */
    console.log("---- Testing Section for Deleting ----");

    console.log("Request url: " + delete_url);

    console.log("Response status: " + delete_resp.status());

    // Testing if the delete request was successful
    console.log("Expected status code: " + 201 + ", Actual status code: " + delete_resp.status());
    expect(delete_resp.status()).toBe(201);
    expect(delete_resp.statusText()).toBe("Created");

    console.log("");
    console.log("================================================================");
    console.log("");

    /* Try Get with the same booking id, it SHOULD fail */

    const get_url = "https://restful-booker.herokuapp.com/booking/" + booking1_id;

    const get_resp = await request.get(get_url);

    /* This section is to test Get booking after Delete */

    console.log("---- Testing Section for Getting a Booking after Delete ----");

    console.log("Request url: " + get_url);

    console.log("Request Booking id: " + booking1_id);

    console.log("Response status: " + get_resp.status());

    // Checking the status of the response, it should throw 404
    console.log("Expected status code: " + 404 + ", Actual status code: " + get_resp.status());
    expect(get_resp.status()).toBe(404);

    console.log("Expected Status text: Not Found, Actual Status text: " + get_resp.statusText());
    expect(get_resp.statusText()).toBe("Not Found");

})