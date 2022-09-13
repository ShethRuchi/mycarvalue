import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    NotFoundException, 
    Param, 
    Patch, 
    Post, 
    Query 
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serilize } from 'src/interceptors/serilize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serilize(UserDto)
export class UsersController {

    constructor(private userService: UsersService) {}

    @Post('/signup')
    createUser(@Body() request: CreateUserDto) {
        return this.userService.create(request.email, request.password);
    }
    @Get('/:id')
    async getUser(@Param('id') userId: string) {
        console.log("Handler is running");
        
        const user = await this.userService.findOne(parseInt(userId));
        if(!user) {
            throw new NotFoundException('user not found')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.getAllUsers(email);
    }

    @Patch('/:id')
    updateUser(
        @Param('id') userId: string,
        @Body() request: UpdateUserDto
    ) {
        this.userService.updateUser(parseInt(userId), request)
    }

    @Delete('/:id')
    deleteUser(@Param('id') userId: string) {
        return this.userService.removeUser(parseInt(userId));
    }


}
