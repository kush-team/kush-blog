export class User {
    public id: string;
    public fullName: string;
    public emailAddress: string;
    public role: string;

    constructor (id: string, fullName: string, emailAddress: string, role: string) {
    	this.id = id;
    	this.fullName = fullName;
      this.emailAddress = emailAddress;
      this.role = role;
    }
}
