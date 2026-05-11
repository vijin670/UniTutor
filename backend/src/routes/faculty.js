import express from 'express';
import prisma from '../prismaClient.js';
import { authMiddleware } from './admin.js';

const router = express.Router();

// Faculty dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  if (req.user.role !== 'FACULTY') return res.status(403).json({ error: 'Forbidden' });
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        university: true,
        coursesTaught: {
          include: {
            marks: { include: { student: { select: { id: true, name: true, enrollmentNo: true, department: true, year: true } } } },
            attendance: { include: { student: { select: { id: true, name: true } } } },
            _count: { select: { marks: true } }
          }
        },
        escalations: true
      }
    });

    // Get escalations for this faculty's university
    const escalations = await prisma.queryEscalation.findMany({
      where: { universityId: req.user.universityId, resolved: false },
      include: { student: { select: { name: true, enrollmentNo: true } } }
    });

    // Get unique students from courses
    const studentIds = new Set();
    user.coursesTaught.forEach(c => {
      c.marks.forEach(m => studentIds.add(m.student.id));
    });

    res.json({ ...user, escalations, totalStudents: studentIds.size });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get students in faculty's courses
router.get('/students', authMiddleware, async (req, res) => {
  if (req.user.role !== 'FACULTY') return res.status(403).json({ error: 'Forbidden' });
  try {
    const courses = await prisma.course.findMany({
      where: { facultyId: req.user.id },
      include: {
        marks: {
          include: { student: { select: { id: true, name: true, email: true, enrollmentNo: true, department: true, year: true, semester: true } } }
        }
      }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
