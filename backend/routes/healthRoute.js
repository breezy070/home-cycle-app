import { Router } from "express";
const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({ ok: true, service: "api", uptime: process.uptime() });
});

export default router;
