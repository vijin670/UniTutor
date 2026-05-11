import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.mark.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.queryEscalation.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.university.deleteMany();

  const hash = await bcrypt.hash('password123', 10);
  const superHash = await bcrypt.hash('superadmin123', 10);

  // Super Admin
  await prisma.user.create({
    data: { email: 'superadmin@unitutor.com', passwordHash: superHash, name: 'Vijin Raj', role: 'SUPER_ADMIN', bio: 'Platform super administrator', phone: '+91 9876543210' }
  });

  // Universities
  const srm = await prisma.university.create({
    data: { name: 'SRM Institute of Science and Technology', domain: 'srm.edu.in', location: 'Kattankulathur, Chennai', established: 1985, description: 'One of India\'s top-ranked private universities offering world-class education in engineering, medicine, management, and sciences.', type: 'Deemed', website: 'https://www.srmist.edu.in' }
  });
  const sju = await prisma.university.create({
    data: { name: 'St. Joseph\'s University', domain: 'sju.edu.in', location: 'Bengaluru, Karnataka', established: 1882, description: 'A prestigious institution with over 140 years of academic excellence in arts, science, commerce, and management.', type: 'Private', website: 'https://www.sju.edu.in' }
  });
  const vit = await prisma.university.create({
    data: { name: 'VIT University', domain: 'vit.ac.in', location: 'Vellore, Tamil Nadu', established: 1984, description: 'A leading research-intensive university known for innovation in technology and engineering education.', type: 'Deemed', website: 'https://www.vit.ac.in' }
  });
  const anna = await prisma.university.create({
    data: { name: 'Anna University', domain: 'annauniv.edu', location: 'Guindy, Chennai', established: 1978, description: 'Tamil Nadu\'s premier technical university and one of India\'s most respected government engineering institutions.', type: 'Government', website: 'https://www.annauniv.edu' }
  });

  // College Admins
  const admins = await Promise.all([
    prisma.user.create({ data: { email: 'admin@srm.edu.in', passwordHash: hash, name: 'Dr. Rajesh Kumar', role: 'ADMIN', universityId: srm.id, department: 'Administration', designation: 'Dean of Academics', phone: '+91 9001100110' } }),
    prisma.user.create({ data: { email: 'admin@sju.edu.in', passwordHash: hash, name: 'Sr. Maria Thomas', role: 'ADMIN', universityId: sju.id, department: 'Administration', designation: 'Principal', phone: '+91 9002200220' } }),
    prisma.user.create({ data: { email: 'admin@vit.ac.in', passwordHash: hash, name: 'Dr. Sundar Rajan', role: 'ADMIN', universityId: vit.id, department: 'Administration', designation: 'Vice Chancellor', phone: '+91 9003300330' } }),
    prisma.user.create({ data: { email: 'admin@annauniv.edu', passwordHash: hash, name: 'Dr. Meena Devi', role: 'ADMIN', universityId: anna.id, department: 'Administration', designation: 'Registrar', phone: '+91 9004400440' } }),
  ]);

  // SRM Faculty
  const srmF1 = await prisma.user.create({ data: { email: 'priya.cs@srm.edu.in', passwordHash: hash, name: 'Dr. Priya Sharma', role: 'FACULTY', universityId: srm.id, department: 'Computer Science', designation: 'Professor', qualification: 'Ph.D Computer Science, IIT Madras', bio: 'Expert in AI/ML with 15+ years of teaching experience. Published 40+ research papers.', phone: '+91 9111000001', joinDate: new Date('2012-06-15') } });
  const srmF2 = await prisma.user.create({ data: { email: 'arjun.ece@srm.edu.in', passwordHash: hash, name: 'Dr. Arjun Nair', role: 'FACULTY', universityId: srm.id, department: 'Electronics', designation: 'Associate Professor', qualification: 'Ph.D VLSI Design, NIT Trichy', bio: 'Specialist in embedded systems and IoT. Industry experience at Texas Instruments.', phone: '+91 9111000002', joinDate: new Date('2015-08-01') } });
  const srmF3 = await prisma.user.create({ data: { email: 'kavitha.math@srm.edu.in', passwordHash: hash, name: 'Dr. Kavitha Rangan', role: 'FACULTY', universityId: srm.id, department: 'Mathematics', designation: 'Assistant Professor', qualification: 'Ph.D Applied Mathematics, Anna University', bio: 'Research focus on numerical methods and mathematical modelling.', phone: '+91 9111000003', joinDate: new Date('2018-01-10') } });

  // SJU Faculty
  const sjuF1 = await prisma.user.create({ data: { email: 'david.cs@sju.edu.in', passwordHash: hash, name: 'Prof. David Mathew', role: 'FACULTY', universityId: sju.id, department: 'Computer Science', designation: 'Professor', qualification: 'Ph.D Software Engineering, IISc Bangalore', bio: 'Pioneer in software architecture research. 20+ years in academia.', phone: '+91 9222000001', joinDate: new Date('2008-07-01') } });
  const sjuF2 = await prisma.user.create({ data: { email: 'anjali.comm@sju.edu.in', passwordHash: hash, name: 'Dr. Anjali Desai', role: 'FACULTY', universityId: sju.id, department: 'Commerce', designation: 'Associate Professor', qualification: 'Ph.D Finance, Christ University', bio: 'Expert in financial analytics and corporate governance.', phone: '+91 9222000002', joinDate: new Date('2014-06-15') } });

  // VIT Faculty
  const vitF1 = await prisma.user.create({ data: { email: 'ramesh.cs@vit.ac.in', passwordHash: hash, name: 'Dr. Ramesh Babu', role: 'FACULTY', universityId: vit.id, department: 'Computer Science', designation: 'Professor', qualification: 'Ph.D Data Science, IIT Bombay', bio: 'Leading researcher in big data analytics. Google Scholar h-index: 25.', phone: '+91 9333000001', joinDate: new Date('2010-01-01') } });
  const vitF2 = await prisma.user.create({ data: { email: 'deepa.mech@vit.ac.in', passwordHash: hash, name: 'Dr. Deepa Krishnan', role: 'FACULTY', universityId: vit.id, department: 'Mechanical', designation: 'Associate Professor', qualification: 'Ph.D Thermal Engineering, IIT Delhi', bio: 'Specialist in renewable energy systems and thermal management.', phone: '+91 9333000002', joinDate: new Date('2016-08-15') } });

  // Anna Faculty
  const annaF1 = await prisma.user.create({ data: { email: 'senthil.cs@annauniv.edu', passwordHash: hash, name: 'Dr. Senthil Murugan', role: 'FACULTY', universityId: anna.id, department: 'Computer Science', designation: 'Professor', qualification: 'Ph.D Network Security, Anna University', bio: 'Cybersecurity expert with government advisory roles. 30+ publications.', phone: '+91 9444000001', joinDate: new Date('2005-07-01') } });
  const annaF2 = await prisma.user.create({ data: { email: 'lakshmi.ece@annauniv.edu', passwordHash: hash, name: 'Dr. Lakshmi Narayanan', role: 'FACULTY', universityId: anna.id, department: 'Electronics', designation: 'Associate Professor', qualification: 'Ph.D Signal Processing, IIT Kharagpur', bio: 'Research in digital signal processing and communication systems.', phone: '+91 9444000002', joinDate: new Date('2013-01-15') } });

  // Courses - SRM
  const srmC1 = await prisma.course.create({ data: { title: 'Data Structures & Algorithms', code: 'CS201', description: 'Fundamental data structures and algorithmic paradigms', credits: 4, semester: 3, department: 'Computer Science', facultyId: srmF1.id, universityId: srm.id } });
  const srmC2 = await prisma.course.create({ data: { title: 'Machine Learning', code: 'CS401', description: 'Introduction to supervised and unsupervised learning', credits: 4, semester: 7, department: 'Computer Science', facultyId: srmF1.id, universityId: srm.id } });
  const srmC3 = await prisma.course.create({ data: { title: 'Digital Electronics', code: 'EC201', description: 'Logic gates, combinational and sequential circuits', credits: 3, semester: 3, department: 'Electronics', facultyId: srmF2.id, universityId: srm.id } });
  const srmC4 = await prisma.course.create({ data: { title: 'Engineering Mathematics III', code: 'MA201', description: 'Complex analysis, transforms and PDE', credits: 4, semester: 3, department: 'Mathematics', facultyId: srmF3.id, universityId: srm.id } });

  // Courses - SJU
  const sjuC1 = await prisma.course.create({ data: { title: 'Object Oriented Programming', code: 'CS101', description: 'OOP concepts using Java', credits: 4, semester: 2, department: 'Computer Science', facultyId: sjuF1.id, universityId: sju.id } });
  const sjuC2 = await prisma.course.create({ data: { title: 'Database Management Systems', code: 'CS301', description: 'Relational databases, SQL, normalization', credits: 4, semester: 5, department: 'Computer Science', facultyId: sjuF1.id, universityId: sju.id } });
  const sjuC3 = await prisma.course.create({ data: { title: 'Financial Accounting', code: 'CO201', description: 'Principles of accounting and financial statements', credits: 3, semester: 3, department: 'Commerce', facultyId: sjuF2.id, universityId: sju.id } });

  // Courses - VIT
  const vitC1 = await prisma.course.create({ data: { title: 'Artificial Intelligence', code: 'CSE3001', description: 'Search algorithms, knowledge representation, expert systems', credits: 4, semester: 5, department: 'Computer Science', facultyId: vitF1.id, universityId: vit.id } });
  const vitC2 = await prisma.course.create({ data: { title: 'Cloud Computing', code: 'CSE4001', description: 'Virtualization, cloud services, deployment models', credits: 3, semester: 7, department: 'Computer Science', facultyId: vitF1.id, universityId: vit.id } });
  const vitC3 = await prisma.course.create({ data: { title: 'Thermodynamics', code: 'MEE2001', description: 'Laws of thermodynamics and heat transfer', credits: 4, semester: 3, department: 'Mechanical', facultyId: vitF2.id, universityId: vit.id } });

  // Courses - Anna
  const annaC1 = await prisma.course.create({ data: { title: 'Computer Networks', code: 'CS8591', description: 'OSI model, TCP/IP, routing protocols', credits: 4, semester: 5, department: 'Computer Science', facultyId: annaF1.id, universityId: anna.id } });
  const annaC2 = await prisma.course.create({ data: { title: 'Cryptography & Network Security', code: 'CS8792', description: 'Encryption algorithms, digital signatures, firewalls', credits: 4, semester: 7, department: 'Computer Science', facultyId: annaF1.id, universityId: anna.id } });
  const annaC3 = await prisma.course.create({ data: { title: 'VLSI Design', code: 'EC8095', description: 'CMOS technology, FPGA programming', credits: 4, semester: 7, department: 'Electronics', facultyId: annaF2.id, universityId: anna.id } });

  // Helper
  const d = (iso) => new Date(iso);

  // SRM Students
  const srmStudents = await Promise.all([
    prisma.user.create({ data: { email: 'arun.kumar@srm.edu.in', passwordHash: hash, name: 'Arun Kumar', role: 'STUDENT', universityId: srm.id, department: 'Computer Science', year: 2, semester: 3, enrollmentNo: 'SRM2024CS001', bio: 'Passionate about AI and open-source development.', phone: '+91 8001000001', address: 'Hostel Block A, SRM Campus' } }),
    prisma.user.create({ data: { email: 'sneha.reddy@srm.edu.in', passwordHash: hash, name: 'Sneha Reddy', role: 'STUDENT', universityId: srm.id, department: 'Computer Science', year: 2, semester: 3, enrollmentNo: 'SRM2024CS002', bio: 'Full-stack developer and hackathon enthusiast.', phone: '+91 8001000002', address: 'Hostel Block C, SRM Campus' } }),
    prisma.user.create({ data: { email: 'vikram.singh@srm.edu.in', passwordHash: hash, name: 'Vikram Singh', role: 'STUDENT', universityId: srm.id, department: 'Electronics', year: 2, semester: 3, enrollmentNo: 'SRM2024EC001', bio: 'IoT and robotics enthusiast.', phone: '+91 8001000003', address: '12 Anna Nagar, Chennai' } }),
    prisma.user.create({ data: { email: 'divya.menon@srm.edu.in', passwordHash: hash, name: 'Divya Menon', role: 'STUDENT', universityId: srm.id, department: 'Computer Science', year: 4, semester: 7, enrollmentNo: 'SRM2022CS003', bio: 'Research intern at Microsoft. Focus on NLP.', phone: '+91 8001000004', address: 'Hostel Block D, SRM Campus' } }),
  ]);

  // SJU Students
  const sjuStudents = await Promise.all([
    prisma.user.create({ data: { email: 'rahul.jain@sju.edu.in', passwordHash: hash, name: 'Rahul Jain', role: 'STUDENT', universityId: sju.id, department: 'Computer Science', year: 1, semester: 2, enrollmentNo: 'SJU2025CS001', bio: 'First-year CS student exploring web development.', phone: '+91 8002000001', address: '45 MG Road, Bengaluru' } }),
    prisma.user.create({ data: { email: 'meera.patel@sju.edu.in', passwordHash: hash, name: 'Meera Patel', role: 'STUDENT', universityId: sju.id, department: 'Computer Science', year: 3, semester: 5, enrollmentNo: 'SJU2023CS002', bio: 'Database enthusiast and SQL competition winner.', phone: '+91 8002000002', address: 'SJU Hostel, Bengaluru' } }),
    prisma.user.create({ data: { email: 'karthik.rao@sju.edu.in', passwordHash: hash, name: 'Karthik Rao', role: 'STUDENT', universityId: sju.id, department: 'Commerce', year: 2, semester: 3, enrollmentNo: 'SJU2024CO001', bio: 'Aspiring chartered accountant.', phone: '+91 8002000003', address: '78 Brigade Road, Bengaluru' } }),
  ]);

  // VIT Students
  const vitStudents = await Promise.all([
    prisma.user.create({ data: { email: 'pradeep.v@vit.ac.in', passwordHash: hash, name: 'Pradeep Venkatesh', role: 'STUDENT', universityId: vit.id, department: 'Computer Science', year: 3, semester: 5, enrollmentNo: 'VIT2023CS001', bio: 'Cloud computing and DevOps enthusiast.', phone: '+91 8003000001', address: 'Men\'s Hostel B, VIT Vellore' } }),
    prisma.user.create({ data: { email: 'nisha.gupta@vit.ac.in', passwordHash: hash, name: 'Nisha Gupta', role: 'STUDENT', universityId: vit.id, department: 'Computer Science', year: 4, semester: 7, enrollmentNo: 'VIT2022CS002', bio: 'AI researcher, published 2 papers on computer vision.', phone: '+91 8003000002', address: 'Women\'s Hostel A, VIT Vellore' } }),
    prisma.user.create({ data: { email: 'suresh.m@vit.ac.in', passwordHash: hash, name: 'Suresh Mohan', role: 'STUDENT', universityId: vit.id, department: 'Mechanical', year: 2, semester: 3, enrollmentNo: 'VIT2024ME001', bio: 'Interested in sustainable energy and automotive design.', phone: '+91 8003000003', address: 'Men\'s Hostel C, VIT Vellore' } }),
  ]);

  // Anna Students
  const annaStudents = await Promise.all([
    prisma.user.create({ data: { email: 'tamil.selvan@annauniv.edu', passwordHash: hash, name: 'Tamil Selvan', role: 'STUDENT', universityId: anna.id, department: 'Computer Science', year: 3, semester: 5, enrollmentNo: 'AU2023CS001', bio: 'Cybersecurity enthusiast and CTF player.', phone: '+91 8004000001', address: 'AU Hostel, Guindy' } }),
    prisma.user.create({ data: { email: 'pooja.n@annauniv.edu', passwordHash: hash, name: 'Pooja Narayanan', role: 'STUDENT', universityId: anna.id, department: 'Computer Science', year: 4, semester: 7, enrollmentNo: 'AU2022CS002', bio: 'Blockchain developer and open-source contributor.', phone: '+91 8004000002', address: '23 T Nagar, Chennai' } }),
    prisma.user.create({ data: { email: 'manoj.k@annauniv.edu', passwordHash: hash, name: 'Manoj Kumar', role: 'STUDENT', universityId: anna.id, department: 'Electronics', year: 4, semester: 7, enrollmentNo: 'AU2022EC001', bio: 'VLSI design specialist with internship at Intel.', phone: '+91 8004000003', address: 'AU Hostel Block 3, Guindy' } }),
  ]);

  // Marks
  const allMarks = [];
  const exams = ['Midterm 1', 'Midterm 2', 'Quiz 1', 'Assignment 1', 'Final'];
  const addMarks = (studentId, courseId, scores) => {
    scores.forEach((s, i) => allMarks.push({ studentId, courseId, examName: exams[i], score: s, maxScore: i === 4 ? 100 : 50, date: d(`2026-0${i+1}-15`) }));
  };

  // SRM marks
  addMarks(srmStudents[0].id, srmC1.id, [42, 38, 45, 40, 78]);
  addMarks(srmStudents[0].id, srmC4.id, [35, 40, 38, 42, 72]);
  addMarks(srmStudents[1].id, srmC1.id, [48, 45, 47, 44, 92]);
  addMarks(srmStudents[1].id, srmC4.id, [40, 42, 39, 45, 85]);
  addMarks(srmStudents[2].id, srmC3.id, [38, 35, 40, 37, 70]);
  addMarks(srmStudents[3].id, srmC2.id, [46, 48, 44, 47, 95]);

  // SJU marks
  addMarks(sjuStudents[0].id, sjuC1.id, [40, 38, 42, 39, 76]);
  addMarks(sjuStudents[1].id, sjuC2.id, [44, 46, 43, 45, 88]);
  addMarks(sjuStudents[2].id, sjuC3.id, [36, 38, 35, 40, 68]);

  // VIT marks
  addMarks(vitStudents[0].id, vitC1.id, [43, 45, 42, 44, 86]);
  addMarks(vitStudents[1].id, vitC2.id, [47, 49, 46, 48, 94]);
  addMarks(vitStudents[2].id, vitC3.id, [37, 35, 38, 36, 65]);

  // Anna marks
  addMarks(annaStudents[0].id, annaC1.id, [41, 43, 40, 42, 82]);
  addMarks(annaStudents[1].id, annaC2.id, [45, 47, 44, 46, 90]);
  addMarks(annaStudents[2].id, annaC3.id, [39, 41, 38, 40, 75]);

  await prisma.mark.createMany({ data: allMarks });

  // Attendance
  const allAttendance = [];
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'LATE', 'PRESENT', 'PRESENT', 'EXCUSED', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT'];
  const addAttendance = (studentId, courseId, startDay) => {
    statuses.forEach((s, i) => allAttendance.push({ studentId, courseId, date: d(`2026-03-${String(startDay + i).padStart(2, '0')}`), status: s }));
  };

  addAttendance(srmStudents[0].id, srmC1.id, 1);
  addAttendance(srmStudents[1].id, srmC1.id, 1);
  addAttendance(srmStudents[2].id, srmC3.id, 1);
  addAttendance(srmStudents[3].id, srmC2.id, 1);
  addAttendance(sjuStudents[0].id, sjuC1.id, 1);
  addAttendance(sjuStudents[1].id, sjuC2.id, 1);
  addAttendance(sjuStudents[2].id, sjuC3.id, 1);
  addAttendance(vitStudents[0].id, vitC1.id, 1);
  addAttendance(vitStudents[1].id, vitC2.id, 1);
  addAttendance(vitStudents[2].id, vitC3.id, 1);
  addAttendance(annaStudents[0].id, annaC1.id, 1);
  addAttendance(annaStudents[1].id, annaC2.id, 1);
  addAttendance(annaStudents[2].id, annaC3.id, 1);

  await prisma.attendance.createMany({ data: allAttendance });

  // Fee Payments
  const allFees = [];
  const addFee = (studentId, due, paid, status) => allFees.push({ studentId, amountDue: due, amountPaid: paid, dueDate: d('2026-06-01'), status });

  [srmStudents, sjuStudents, vitStudents, annaStudents].flat().forEach((s, i) => {
    if (i % 3 === 0) addFee(s.id, 75000, 75000, 'PAID');
    else if (i % 3 === 1) addFee(s.id, 75000, 40000, 'PENDING');
    else addFee(s.id, 75000, 0, 'OVERDUE');
  });

  await prisma.feePayment.createMany({ data: allFees });

  // Schedules
  const allSchedules = [
    { eventName: 'DSA Lecture', date: d('2026-05-05T09:00:00'), courseId: srmC1.id, universityId: srm.id },
    { eventName: 'ML Lab Session', date: d('2026-05-05T14:00:00'), courseId: srmC2.id, universityId: srm.id },
    { eventName: 'Semester Exams Begin', date: d('2026-06-15T09:00:00'), universityId: srm.id },
    { eventName: 'OOP Workshop', date: d('2026-05-06T10:00:00'), courseId: sjuC1.id, universityId: sju.id },
    { eventName: 'Annual Day', date: d('2026-05-20T17:00:00'), universityId: sju.id },
    { eventName: 'AI Guest Lecture', date: d('2026-05-07T11:00:00'), courseId: vitC1.id, universityId: vit.id },
    { eventName: 'Tech Fest - Riviera', date: d('2026-05-25T09:00:00'), universityId: vit.id },
    { eventName: 'Networks Lab', date: d('2026-05-05T10:00:00'), courseId: annaC1.id, universityId: anna.id },
    { eventName: 'Convocation Ceremony', date: d('2026-07-15T10:00:00'), universityId: anna.id },
  ];

  await prisma.schedule.createMany({ data: allSchedules });

  console.log('Seed completed successfully with rich multi-university data.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
