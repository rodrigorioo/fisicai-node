import {Model} from "./Model";

export interface UserInterface {
    id: number,
    email: string,
    password: string,
    created_at: string,
    updated_at: string,
}

export class UserModel extends Model {

    private email: string;
    private password: string;

    constructor(email: string, password: string) {
        super();

        this.table = "users";

        this.email = email;
        this.password = password;
    }
}
