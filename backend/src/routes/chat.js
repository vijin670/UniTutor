import express from 'express';
import { getChatbotResponse } from '../services/ai.js';
import prisma from '../prismaClient.js';
import { authMiddleware } from './admin.js';

const router = express.Router();

router.post('/ask', authMiddleware, async (req, res) => {
  if (req.user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' });
  
  const { question } = req.body;
  
  try {
    // Fetch basic context for the student's university and courses
    const student = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        university: { include: { courses: true, schedules: true } },
        marks: { include: { course: true } },
        attendance: true,
        feePayments: true
      }
    });

    const context = {
        name: student.name,
        profileInfo: { bio: student.bio, phone: student.phone, address: student.address },
        universityName: student.university?.name || "N/A",
        coursesOffered: student.university?.courses.map(c => c.title) || [],
        schedules: student.university?.schedules.map(s => `${s.eventName} at ${s.date}`) || [],
        marks: student.marks.map(m => `${m.examName} in ${m.course.title}: ${m.score}/${m.maxScore} on ${m.date}`),
        attendance: student.attendance.map(a => `${a.date}: ${a.status}`),
        fees: student.feePayments.map(f => `Due: ${f.amountDue}, Paid: ${f.amountPaid}, Deadline: ${f.dueDate}, Status: ${f.status}`)
    };

    const aiResponse = await getChatbotResponse(question, context);

    if (aiResponse === 'ESCALATE') {
      // Create escalation
      const escalation = await prisma.queryEscalation.create({
        data: {
          question,
          studentId: student.id,
          universityId: student.universityId,
        }
      });
      return res.json({ 
        answer: "I'm not sure about that. I have escalated this question to the faculty. They will get back to you shortly.",
        escalated: true
      });
    }

    res.json({ answer: aiResponse, escalated: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Faculty gets escalations
router.get('/escalations', authMiddleware, async (req, res) => {
  if (req.user.role !== 'FACULTY') return res.status(403).json({ error: 'Forbidden' });
  
  try {
    const escalations = await prisma.queryEscalation.findMany({
      where: { universityId: req.user.universityId, resolved: false },
      include: { student: { select: { name: true } } }
    });
    res.json(escalations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/resolve', authMiddleware, async (req, res) => {
    if (req.user.role !== 'FACULTY') return res.status(403).json({ error: 'Forbidden' });
    const { escalationId, answer } = req.body;
    try {
        const escalation = await prisma.queryEscalation.update({
            where: { id: escalationId },
            data: { resolved: true, answer }
        });
        res.json({ success: true, escalation });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
