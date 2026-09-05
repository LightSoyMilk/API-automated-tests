import Booking from "./models/booking.js";

export function transformFullBookingTable(dataTable) {
    return dataTable.hashes().map(row => {
        // Making sure all fields are present 
        // if(!row.firstname || !row.lastname) {throw new Error("");}
        // Convert total price into an int value
        const totalPriceInt = parseInt(row.totalprice, 10);

        // Convert deposit paid string to boolean
        const depositPaidBool = row.depositpaid.toLowerCase() === "true";

        // Convert bookingdates to an array of dicts
        let bookingdatesDict = {};
        bookingdatesDict = row.bookingdates ? JSON.parse(row.bookingdates) : {};

        return {
            firstname: row.firstname, 
            lastname: row.lastname, 
            totalprice: totalPriceInt, 
            depositpaid: depositPaidBool, 
            bookingdates: bookingdatesDict, 
            additionalneeds: row.additionalneeds
        };
    });
}

export function transformPartialBookingTable(dataTable) {
    return dataTable.hashes().map(row => {
        const partialJSON = {};

        if ("firstname" in row) {
            partialJSON.firstname = row.firstname;
        }

        if ("lastname" in row) {
            partialJSON.lastname = row.lastname
        }

        if ("totalprice" in row) {
            partialJSON.totalprice = parseInt(row.totalprice, 10);
        }

        if ("depositpaid" in row) {
            partialJSON.depositpaid = row.depositpaid.toLowerCase() === "true";
        }

        if ("bookingdates" in row && row.bookingdates) {
            partialJSON.bookingdates = row.bookingdates ? JSON.parse(row.bookingdates) : {};
        }

        if ("additionalneeds" in row) {
            partialJSON.additionalneeds = row.additionalneeds;
        }

        return partialJSON;
    })
}