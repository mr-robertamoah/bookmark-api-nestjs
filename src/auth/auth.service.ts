import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    signup () {
        return "signing up"
    }

    signin () {
        return "signing in"
    }
}