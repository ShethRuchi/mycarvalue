import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt} from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async signup(email: string, password: string) {
        // see if email in use
        const user = await this.userService.find(email);

        if(user.length) {
            throw new BadRequestException('Email in use')
        }
        
        // Hash user's password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and password together
        const hash = await scrypt(password, salt, 32) as Buffer;

        // Join the hashed result and the salt together
        const hashedPassword = `${salt}.${hash.toString('hex')}`;

        // Create a new user and save it
        const newUser = this.userService.create(email, hashedPassword);

        // return user
        return user;

    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);

        if(!user) {
            throw new NotFoundException('user not found');
        }
    }
}