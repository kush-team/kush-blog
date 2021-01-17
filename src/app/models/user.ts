export class User {
    public id: string;
    public fullName: string;
    public emailAddress: string;

    constructor (id: string, fullName: string, emailAddress: string) {
    	this.id = id;
    	this.fullName = fullName;
    	this.emailAddress = emailAddress;
    }
}
