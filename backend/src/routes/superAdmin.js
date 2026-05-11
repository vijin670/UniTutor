import express from 'express';
import prisma from '../prismaClient.js';
import { authMiddleware } from './admin.js';

const router = express.Router();

// Super Admin: Global dashboard stats
router.get('/dashboard', authMiddleware, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    const [totalUniversities, totalUsers, totalCourses, totalStudents, totalFaculty] = await Promise.all([
      prisma.university.count(),
      prisma.user.count(),
      prisma.course.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'FACULTY' } }),
    ]);
    const universities = await prisma.university.findMany({
      include: {
        _count: { select: { users: true, courses: true } }
      }
    });
    res.json({ totalUniversities, totalUsers, totalCourses, totalStudents, totalFaculty, universities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// All universities with details
router.get('/universities', authMiddleware, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    const universities = await prisma.university.findMany({
      include: {
        users: { select: { id: true, name: true, role: true, department: true, email: true } },
        courses: { include: { faculty: { select: { name: true } } } },
        _count: { select: { users: true, courses: true, schedules: true } }
      }
    });
    res.json(universities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Single university detail
router.get('/university/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    const university = await prisma.university.findUnique({
      where: { id: req.params.id },
      include: {
        users: true,
        courses: { include: { faculty: { select: { name: true } } } },
        schedules: true,
        _count: { select: { users: true, courses: true } }
      }
    });
    res.json(university);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// All users
router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    const users = await prisma.user.findMany({
      include: { university: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/user/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete university
router.delete('/university/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    await prisma.university.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
