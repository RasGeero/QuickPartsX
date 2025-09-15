import {
  users,
  parts,
  ratings,
  type User,
  type UpsertUser,
  type Part,
  type InsertPart,
  type PartWithSeller,
  type Rating,
  type InsertRating,
  type UserWithStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, count, avg, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserWithStats(id: string): Promise<UserWithStats | undefined>;
  updateUserProfile(id: string, updates: Partial<User>): Promise<User>;
  
  // Parts operations
  getAllParts(filters?: {
    search?: string;
    carModel?: string;
    condition?: string;
    location?: string;
    sellerType?: string;
    maxPrice?: number;
  }): Promise<PartWithSeller[]>;
  getPartById(id: string): Promise<PartWithSeller | undefined>;
  getPartsBySeller(sellerId: string): Promise<Part[]>;
  createPart(part: InsertPart): Promise<Part>;
  updatePart(id: string, updates: Partial<Part>): Promise<Part>;
  deletePart(id: string): Promise<void>;
  
  // Rating operations
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsBySeller(sellerId: string): Promise<Rating[]>;
  getAverageRating(sellerId: string): Promise<number>;
  
  // Admin operations
  getAllSellers(): Promise<UserWithStats[]>;
  toggleSellerVerification(sellerId: string, isVerified: boolean): Promise<User>;
  getAllPartsForAdmin(): Promise<PartWithSeller[]>;
  removeSeller(sellerId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserWithStats(id: string): Promise<UserWithStats | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return undefined;

    const [stats] = await db
      .select({
        totalListings: count(parts.id),
        averageRating: avg(ratings.rating),
        totalRatings: count(ratings.id),
      })
      .from(users)
      .leftJoin(parts, eq(parts.sellerId, users.id))
      .leftJoin(ratings, eq(ratings.sellerId, users.id))
      .where(eq(users.id, id))
      .groupBy(users.id);

    return {
      ...user,
      totalListings: stats?.totalListings || 0,
      averageRating: Number(stats?.averageRating) || 0,
      totalRatings: stats?.totalRatings || 0,
    };
  }

  async updateUserProfile(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Parts operations
  async getAllParts(filters?: {
    search?: string;
    carModel?: string;
    condition?: string;
    location?: string;
    sellerType?: string;
    maxPrice?: number;
  }): Promise<PartWithSeller[]> {
    let query = db
      .select({
        id: parts.id,
        sellerId: parts.sellerId,
        name: parts.name,
        description: parts.description,
        carModel: parts.carModel,
        condition: parts.condition,
        price: parts.price,
        images: parts.images,
        isActive: parts.isActive,
        createdAt: parts.createdAt,
        updatedAt: parts.updatedAt,
        seller: {
          id: users.id,
          businessName: users.businessName,
          firstName: users.firstName,
          lastName: users.lastName,
          sellerType: users.sellerType,
          location: users.location,
          isVerified: users.isVerified,
        },
      })
      .from(parts)
      .innerJoin(users, eq(parts.sellerId, users.id))
      .where(eq(parts.isActive, true))
      .orderBy(desc(parts.createdAt));

    // Apply filters
    if (filters) {
      const conditions = [eq(parts.isActive, true)];

      if (filters.search) {
        conditions.push(
          sql`(${ilike(parts.name, `%${filters.search}%`)} OR ${ilike(parts.carModel, `%${filters.search}%`)})`
        );
      }

      if (filters.carModel) {
        conditions.push(ilike(parts.carModel, `%${filters.carModel}%`));
      }

      if (filters.condition) {
        conditions.push(eq(parts.condition, filters.condition as "new" | "used"));
      }

      if (filters.location) {
        conditions.push(ilike(users.location, `%${filters.location}%`));
      }

      if (filters.sellerType) {
        conditions.push(eq(users.sellerType, filters.sellerType as "private" | "business"));
      }

      if (filters.maxPrice) {
        conditions.push(sql`${parts.price} <= ${filters.maxPrice}`);
      }

      query = query.where(and(...conditions));
    }

    return await query;
  }

  async getPartById(id: string): Promise<PartWithSeller | undefined> {
    const [part] = await db
      .select({
        id: parts.id,
        sellerId: parts.sellerId,
        name: parts.name,
        description: parts.description,
        carModel: parts.carModel,
        condition: parts.condition,
        price: parts.price,
        images: parts.images,
        isActive: parts.isActive,
        createdAt: parts.createdAt,
        updatedAt: parts.updatedAt,
        seller: {
          id: users.id,
          businessName: users.businessName,
          firstName: users.firstName,
          lastName: users.lastName,
          sellerType: users.sellerType,
          location: users.location,
          isVerified: users.isVerified,
        },
      })
      .from(parts)
      .innerJoin(users, eq(parts.sellerId, users.id))
      .where(eq(parts.id, id));

    return part;
  }

  async getPartsBySeller(sellerId: string): Promise<Part[]> {
    return await db
      .select()
      .from(parts)
      .where(and(eq(parts.sellerId, sellerId), eq(parts.isActive, true)))
      .orderBy(desc(parts.createdAt));
  }

  async createPart(part: InsertPart): Promise<Part> {
    const [newPart] = await db.insert(parts).values(part).returning();
    return newPart;
  }

  async updatePart(id: string, updates: Partial<Part>): Promise<Part> {
    const [part] = await db
      .update(parts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(parts.id, id))
      .returning();
    return part;
  }

  async deletePart(id: string): Promise<void> {
    await db.update(parts).set({ isActive: false }).where(eq(parts.id, id));
  }

  // Rating operations
  async createRating(rating: InsertRating): Promise<Rating> {
    const [newRating] = await db.insert(ratings).values(rating).returning();
    return newRating;
  }

  async getRatingsBySeller(sellerId: string): Promise<Rating[]> {
    return await db
      .select()
      .from(ratings)
      .where(eq(ratings.sellerId, sellerId))
      .orderBy(desc(ratings.createdAt));
  }

  async getAverageRating(sellerId: string): Promise<number> {
    const [result] = await db
      .select({ average: avg(ratings.rating) })
      .from(ratings)
      .where(eq(ratings.sellerId, sellerId));

    return Number(result?.average) || 0;
  }

  // Admin operations
  async getAllSellers(): Promise<UserWithStats[]> {
    const sellersWithStats = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        businessName: users.businessName,
        sellerType: users.sellerType,
        location: users.location,
        phoneNumber: users.phoneNumber,
        whatsappNumber: users.whatsappNumber,
        isVerified: users.isVerified,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        totalListings: count(parts.id),
        averageRating: avg(ratings.rating),
        totalRatings: count(ratings.id),
      })
      .from(users)
      .leftJoin(parts, eq(parts.sellerId, users.id))
      .leftJoin(ratings, eq(ratings.sellerId, users.id))
      .where(sql`${users.sellerType} IS NOT NULL`)
      .groupBy(users.id)
      .orderBy(desc(users.createdAt));

    return sellersWithStats.map(seller => ({
      ...seller,
      totalListings: seller.totalListings || 0,
      averageRating: Number(seller.averageRating) || 0,
      totalRatings: seller.totalRatings || 0,
    }));
  }

  async toggleSellerVerification(sellerId: string, isVerified: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isVerified, updatedAt: new Date() })
      .where(eq(users.id, sellerId))
      .returning();
    return user;
  }

  async getAllPartsForAdmin(): Promise<PartWithSeller[]> {
    return await db
      .select({
        id: parts.id,
        sellerId: parts.sellerId,
        name: parts.name,
        description: parts.description,
        carModel: parts.carModel,
        condition: parts.condition,
        price: parts.price,
        images: parts.images,
        isActive: parts.isActive,
        createdAt: parts.createdAt,
        updatedAt: parts.updatedAt,
        seller: {
          id: users.id,
          businessName: users.businessName,
          firstName: users.firstName,
          lastName: users.lastName,
          sellerType: users.sellerType,
          location: users.location,
          isVerified: users.isVerified,
        },
      })
      .from(parts)
      .innerJoin(users, eq(parts.sellerId, users.id))
      .orderBy(desc(parts.createdAt));
  }

  async removeSeller(sellerId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, sellerId));
  }
}

export const storage = new DatabaseStorage();
