import express from 'express';
import prisma from '../prismaClient.js';
import { authMiddleware } from './admin.js';

const router = express.Router();

router.put('/profile', authMiddleware, async (req, res) => {
  const { bio, phone, address } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { bio, phone, address }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        university: { include: { courses: true, schedules: true } },
        marks: { include: { course: true } },
        attendance: true,
        feePayments: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
