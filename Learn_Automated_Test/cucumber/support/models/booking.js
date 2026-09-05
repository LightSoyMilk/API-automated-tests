export default class Booking {
    constructor(firstname, lastname, totalprice, depositpaid, bookingdates, additionalneeds) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.totalprice = totalprice;
        this.depositpaid = depositpaid;
        this.bookingdates = bookingdates;
        this.additionalneeds = additionalneeds
    }

    isValid() {
        return typeof this.totalprice && typeof this.depositpaid === "boolean" && typeof this.bookingdates === "object";
    }
}