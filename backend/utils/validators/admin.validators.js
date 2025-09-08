import { body, param } from "express-validator";

export const idParamRule = [
  param("id").isMongoId().withMessage("Invalid id parameter"),
];

export const technicianIdParamRule = [
  param("technicianId").isMongoId().withMessage("Invalid technicianId parameter"),
];

export const addUsersRules = [
  body("role").isIn(["user", "technician", "admin"]).withMessage("role must be user|technician|admin"),
  body("first_name").trim().isLength({ min: 2, max: 80 }),
  body("last_name").trim().isLength({ min: 2, max: 80 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 8, max: 128 }),
  body("address").trim().isLength({ min: 5, max: 200 }),
];

export const assignTechnicianZoneRules = [
  body("technicianId").isMongoId().withMessage("technicianId must be a valid MongoID"),
  // coordinates: GeoJSON Polygon => [[[lng,lat], [lng,lat], ...]]
  body("coordinates")
    .isArray({ min: 1 }).withMessage("coordinates must be an array")
    .custom((v) => Array.isArray(v[0]) && Array.isArray(v[0][0]) && v[0][0].length === 2)
    .withMessage("coordinates must be a Polygon ring: [[[lng,lat],...]]"),
  body("coordinates.*.*").custom((pair) => {
    if (!Array.isArray(pair) || pair.length !== 2) return false;
    const [lng, lat] = pair.map(Number);
    return Number.isFinite(lng) && Number.isFinite(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
  }).withMessage("each coordinate must be [lng, lat]"),
];
