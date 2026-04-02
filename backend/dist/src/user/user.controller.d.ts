import { UserService } from "./user.service";
import { CreateUserDto, UpdateSelfDto, UpdateUserDto } from "./user.dto";
import { type AuthenticatedRequest } from "../auth/interfaces/auth-request.interface";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: AuthenticatedRequest): Promise<import("shared-types").UserDetail>;
    updateSelf(req: AuthenticatedRequest, data: UpdateSelfDto): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: {
            id: number;
            email: string;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            uuid: string;
            password: string;
            username: string;
            firstName: string;
            middleName: string | null;
            lastName: string;
            lastLogin: Date | null;
        };
    }>;
    createUser(data: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: {
            id: number;
            email: string;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            uuid: string;
            password: string;
            username: string;
            firstName: string;
            middleName: string | null;
            lastName: string;
            lastLogin: Date | null;
        };
    }>;
    updateUser(id: number, data: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: null;
    } | {
        success: boolean;
        message: string;
        status: number;
        data: {
            id: number;
            email: string;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            uuid: string;
            password: string;
            username: string;
            firstName: string;
            middleName: string | null;
            lastName: string;
            lastLogin: Date | null;
        };
    }>;
    deleteUser(id: number): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    listUsers(query: Record<string, any>): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: import("shared-types").PaginatedData<any>;
    }>;
    getUserById(id: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: null;
    } | {
        success: boolean;
        message: string;
        status: number;
        data: import("shared-types").UserDetail;
    }>;
}
