import { Router } from "express";

import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import instructorRoutes from "./instructor.routes.js";
import publicRoutes from "./public.routes.js";
import studentRoutes from "./student.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    data: {
      service: "skillshare-api",
      version: "v1",
      sections: ["public", "auth", "student", "instructor", "admin"]
    }
  });
});

router.use(authRoutes);
router.use(publicRoutes);
router.use(studentRoutes);
router.use(instructorRoutes);
router.use(adminRoutes);

export default router;
