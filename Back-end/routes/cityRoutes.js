import express from "express";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";
import {
  registerCity,
  getAllCities,
  getCityById,
  deleteCity,
  updateCity,
  getCitiesByCountryId,
} from "../controllers/cityController.js";

const router = express.Router();

// Register a new city

router.post(
  "/register-city",
  authenticateJWT,
  requireRole(["admin"]),
  registerCity
);

// Get all cities

router.get("/get-all-cities", getAllCities);

// Get city by ID

router.get("/get-city-by-id/:city_id", getCityById);

// Delete city by ID

router.delete(
  "/delete-city/:city_id",
  authenticateJWT,
  requireRole(["admin"]),
  deleteCity
);

// Update city

router.patch(
  "/update-city/:city_id",
  authenticateJWT,
  requireRole(["admin"]),
  updateCity
);

router.get("/get-cities-by-countryId/:country_id", getCitiesByCountryId);

export default router;
