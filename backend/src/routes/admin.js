import express from 'express';
import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Create university (Super Admin only)
router.post('/university', authMiddleware, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { name, domain } = req.body;
  try {
    const university = await prisma.university.create({ data: { name, domain } });
    res.status(201).json(university);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all universities
router.get('/universities', async (req, res) => {
  try {
    const universities = await prisma.university.findMany();
    res.json(universities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin fetches data for their university
router.get('/dashboard', authMiddleware, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    const university = await prisma.university.findUnique({
      where: { id: req.user.universityId },
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true, department: true, designation: true, qualification: true, year: true, semester: true, enrollmentNo: true, phone: true, bio: true, joinDate: true }
        },
        courses: {
          include: {
            faculty: { select: { name: true, designation: true } },
            _count: { select: { marks: true, attendance: true } }
          }
        },
        schedules: true,
        _count: { select: { users: true, courses: true } }
      }
    });

    const students = university.users.filter(u => u.role === 'STUDENT');
    const faculty = university.users.filter(u => u.role === 'FACULTY');
    const departments = [...new Set(university.users.map(u => u.department).filter(Boolean))];

    res.json({ ...university, students, faculty, departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get student detail
router.get('/student/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    const student = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        marks: { include: { course: true } },
        attendance: { include: { course: true } },
        feePayments: true,
        university: true
      }
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
