import type { FetchParams, PaginatedData } from "shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { SponsorCreateDto, SponsorUpdateDto } from "./sponsor.dto";
export declare class SponsorService {
    private readonly db;
    constructor(db: PrismaService);
    private getLogoPath;
    getAllSponsors(params: FetchParams): Promise<PaginatedData<any>>;
    getSponsorById(id: number): Promise<({
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
    }) | null>;
    createSponsor(data: SponsorCreateDto, file?: Express.Multer.File): Promise<{
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
    }>;
    updateSponsor(id: number, data: SponsorUpdateDto, file?: Express.Multer.File): Promise<({
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
    }) | null>;
    getPublicSponsors(): Promise<any[]>;
}
