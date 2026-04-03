import { SponsorService } from "./sponsor.service";
import { SponsorCreateDto, SponsorUpdateDto } from "./sponsor.dto";
export declare class SponsorController {
    private readonly sponserService;
    constructor(sponserService: SponsorService);
    publicList(): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: any[];
    }>;
    publicDetail(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: null;
    } | {
        success: boolean;
        message: string;
        status: number;
        data: {
            links: {
                url: string;
                id: number;
                createdAt: Date;
                sponsorId: number;
                label: string;
            }[];
        } & {
            id: number;
            email: string;
            name: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            order: number | null;
            logo: string;
            contribution: string | null;
        };
    }>;
    listSponsors(query: Record<string, any>): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: import("shared-types").PaginatedData<any>;
    }>;
    getSponsorById(id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: null;
    } | {
        success: boolean;
        message: string;
        status: number;
        data: {
            links: {
                url: string;
                id: number;
                createdAt: Date;
                sponsorId: number;
                label: string;
            }[];
        } & {
            id: number;
            email: string;
            name: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            order: number | null;
            logo: string;
            contribution: string | null;
        };
    }>;
    createSponsor(body: SponsorCreateDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: {
            links: {
                url: string;
                id: number;
                createdAt: Date;
                sponsorId: number;
                label: string;
            }[];
        } & {
            id: number;
            email: string;
            name: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            order: number | null;
            logo: string;
            contribution: string | null;
        };
    }>;
    updateSponsor(id: string, body: SponsorUpdateDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        status: number;
        data: null;
    } | {
        success: boolean;
        message: string;
        status: number;
        data: {
            links: {
                url: string;
                id: number;
                createdAt: Date;
                sponsorId: number;
                label: string;
            }[];
        } & {
            id: number;
            email: string;
            name: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            order: number | null;
            logo: string;
            contribution: string | null;
        };
    }>;
}
