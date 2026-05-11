import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// Public: List all universities (for landing page)
router.get('/', async (req, res) => {
  try {
    const universities = await prisma.university.findMany({
      include: {
        _count: { select: { users: true, courses: true } }
      }
    });
    res.json(universities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: University community page
router.get('/:id/community', async (req, res) => {
  try {
    const university = await prisma.university.findUnique({
      where: { id: req.params.id },
      include: {
        users: {
          select: { id: true, name: true, role: true, department: true, designation: true, qualification: true, year: true, semester: true, enrollmentNo: true, bio: true }
        },
        courses: {
          include: { faculty: { select: { name: true, designation: true } } }
        },
        schedules: true,
        _count: { select: { users: true, courses: true } }
      }
    });
    if (!university) return res.status(404).json({ error: 'University not found' });

    const students = university.users.filter(u => u.role === 'STUDENT');
    const faculty = university.users.filter(u => u.role === 'FACULTY');
    const departments = [...new Set(university.users.map(u => u.department).filter(Boolean))];

    res.json({ ...university, students, faculty, departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: Platform stats
router.get('/stats/global', async (req, res) => {
  try {
    const [universities, students, faculty, courses] = await Promise.all([
      prisma.university.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'FACULTY' } }),
      prisma.course.count(),
    ]);
    res.json({ universities, students, faculty, courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
