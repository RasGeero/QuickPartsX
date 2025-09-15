import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPartSchema, insertRatingSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 3, // Maximum 3 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded images
  app.use("/uploads", express.static("uploads"));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithStats(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      const user = await storage.updateUserProfile(userId, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Parts routes
  app.get('/api/parts', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        carModel: req.query.carModel as string,
        condition: req.query.condition as string,
        location: req.query.location as string,
        sellerType: req.query.sellerType as string,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      };

      const parts = await storage.getAllParts(filters);
      res.json(parts);
    } catch (error) {
      console.error("Error fetching parts:", error);
      res.status(500).json({ message: "Failed to fetch parts" });
    }
  });

  app.get('/api/parts/:id', async (req, res) => {
    try {
      const part = await storage.getPartById(req.params.id);
      if (!part) {
        return res.status(404).json({ message: "Part not found" });
      }
      res.json(part);
    } catch (error) {
      console.error("Error fetching part:", error);
      res.status(500).json({ message: "Failed to fetch part" });
    }
  });

  app.get('/api/seller/:sellerId/parts', async (req, res) => {
    try {
      const parts = await storage.getPartsBySeller(req.params.sellerId);
      res.json(parts);
    } catch (error) {
      console.error("Error fetching seller parts:", error);
      res.status(500).json({ message: "Failed to fetch seller parts" });
    }
  });

  app.post('/api/parts', isAuthenticated, upload.array('images', 3), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partData = insertPartSchema.parse({
        ...req.body,
        sellerId: userId,
        images: req.files ? req.files.map((file: any) => `/uploads/${file.filename}`) : [],
      });

      const part = await storage.createPart(partData);
      res.status(201).json(part);
    } catch (error) {
      console.error("Error creating part:", error);
      res.status(500).json({ message: "Failed to create part" });
    }
  });

  app.patch('/api/parts/:id', isAuthenticated, upload.array('images', 3), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const part = await storage.getPartById(req.params.id);
      
      if (!part || part.sellerId !== userId) {
        return res.status(403).json({ message: "Unauthorized to edit this part" });
      }

      const updates = {
        ...req.body,
        ...(req.files && req.files.length > 0 && {
          images: req.files.map((file: any) => `/uploads/${file.filename}`)
        }),
      };

      const updatedPart = await storage.updatePart(req.params.id, updates);
      res.json(updatedPart);
    } catch (error) {
      console.error("Error updating part:", error);
      res.status(500).json({ message: "Failed to update part" });
    }
  });

  app.delete('/api/parts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const part = await storage.getPartById(req.params.id);
      
      if (!part || part.sellerId !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete this part" });
      }

      await storage.deletePart(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting part:", error);
      res.status(500).json({ message: "Failed to delete part" });
    }
  });

  // Seller routes
  app.get('/api/seller/:sellerId', async (req, res) => {
    try {
      const seller = await storage.getUserWithStats(req.params.sellerId);
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }
      res.json(seller);
    } catch (error) {
      console.error("Error fetching seller:", error);
      res.status(500).json({ message: "Failed to fetch seller" });
    }
  });

  // Rating routes
  app.post('/api/ratings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ratingData = insertRatingSchema.parse({
        ...req.body,
        buyerId: userId,
      });

      const rating = await storage.createRating(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      console.error("Error creating rating:", error);
      res.status(500).json({ message: "Failed to create rating" });
    }
  });

  app.get('/api/seller/:sellerId/ratings', async (req, res) => {
    try {
      const ratings = await storage.getRatingsBySeller(req.params.sellerId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  // Admin routes
  app.get('/api/admin/sellers', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const sellers = await storage.getAllSellers();
      res.json(sellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      res.status(500).json({ message: "Failed to fetch sellers" });
    }
  });

  app.patch('/api/admin/sellers/:sellerId/verify', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { isVerified } = req.body;
      const seller = await storage.toggleSellerVerification(req.params.sellerId, isVerified);
      res.json(seller);
    } catch (error) {
      console.error("Error updating seller verification:", error);
      res.status(500).json({ message: "Failed to update seller verification" });
    }
  });

  app.delete('/api/admin/sellers/:sellerId', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.removeSeller(req.params.sellerId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing seller:", error);
      res.status(500).json({ message: "Failed to remove seller" });
    }
  });

  app.get('/api/admin/parts', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const parts = await storage.getAllPartsForAdmin();
      res.json(parts);
    } catch (error) {
      console.error("Error fetching parts for admin:", error);
      res.status(500).json({ message: "Failed to fetch parts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
