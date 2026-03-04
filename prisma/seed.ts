import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create subjects
  const javaSubject = await prisma.subject.upsert({
    where: { slug: 'java' },
    update: {},
    create: {
      title: 'Java Programming',
      slug: 'java',
      description: 'Complete Java course from basics to advanced concepts',
      isPublished: true,
    },
  });

  const pythonSubject = await prisma.subject.upsert({
    where: { slug: 'python' },
    update: {},
    create: {
      title: 'Python Programming',
      slug: 'python',
      description: 'Learn Python from scratch with hands-on projects',
      isPublished: true,
    },
  });

  const javascriptSubject = await prisma.subject.upsert({
    where: { slug: 'javascript' },
    update: {},
    create: {
      title: 'JavaScript Development',
      slug: 'javascript',
      description: 'Master JavaScript for web development',
      isPublished: true,
    },
  });

  console.log('✓ Subjects created');

  // Create sections for Java
  const javaSections = await Promise.all([
    prisma.section.create({
      data: {
        subjectId: javaSubject.id,
        title: 'Introduction to Java',
        orderIndex: 1,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: javaSubject.id,
        title: 'Java Basics',
        orderIndex: 2,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: javaSubject.id,
        title: 'Object-Oriented Programming',
        orderIndex: 3,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: javaSubject.id,
        title: 'Advanced Java Concepts',
        orderIndex: 4,
      },
    }),
  ]);

  // Create sections for Python
  const pythonSections = await Promise.all([
    prisma.section.create({
      data: {
        subjectId: pythonSubject.id,
        title: 'Getting Started with Python',
        orderIndex: 1,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: pythonSubject.id,
        title: 'Python Fundamentals',
        orderIndex: 2,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: pythonSubject.id,
        title: 'Data Structures in Python',
        orderIndex: 3,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: pythonSubject.id,
        title: 'Python Projects',
        orderIndex: 4,
      },
    }),
  ]);

  // Create sections for JavaScript
  const javascriptSections = await Promise.all([
    prisma.section.create({
      data: {
        subjectId: javascriptSubject.id,
        title: 'JavaScript Basics',
        orderIndex: 1,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: javascriptSubject.id,
        title: 'DOM Manipulation',
        orderIndex: 2,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: javascriptSubject.id,
        title: 'Async JavaScript',
        orderIndex: 3,
      },
    }),
    prisma.section.create({
      data: {
        subjectId: javascriptSubject.id,
        title: 'Modern JavaScript (ES6+)',
        orderIndex: 4,
      },
    }),
  ]);

  console.log('✓ Sections created');

  // Create videos for Java sections
  await Promise.all([
    // Java Section 1 Videos
    prisma.video.create({
      data: {
        sectionId: javaSections[0].id,
        title: 'Welcome to Java Course',
        description: 'Introduction to the Java programming language and course overview',
        youtubeUrl: 'https://youtu.be/bm0OyhwFDuY',
        orderIndex: 1,
        durationSeconds: 300,
      },
    }),
    prisma.video.create({
      data: {
        sectionId: javaSections[0].id,
        title: 'Setting Up Java Environment',
        description: 'Install JDK and configure your development environment',
        youtubeUrl: 'https://youtu.be/9RCuKrze_-k',
        orderIndex: 2,
        durationSeconds: 420,
      },
    }),

    // Java Section 2 Videos
    prisma.video.create({
      data: {
        sectionId: javaSections[1].id,
        title: 'Variables and Data Types',
        description: 'Learn about Java variables, primitive types, and type conversion',
        youtubeUrl: 'https://youtu.be/Znmz_WxMxp4',
        orderIndex: 1,
        durationSeconds: 540,
      },
    }),
    prisma.video.create({
      data: {
        sectionId: javaSections[1].id,
        title: 'Control Flow Statements',
        description: 'If-else, switch, loops and control structures in Java',
        youtubeUrl: 'https://youtu.be/74Q7POjS7mQ',
        orderIndex: 2,
        durationSeconds: 600,
      },
    }),

    // Java Section 3 Videos
    prisma.video.create({
      data: {
        sectionId: javaSections[2].id,
        title: 'Classes and Objects',
        description: 'Understanding classes, objects, and constructors',
        youtubeUrl: 'https://youtu.be/Q3v2OpOgof8',
        orderIndex: 1,
        durationSeconds: 720,
      },
    }),
    prisma.video.create({
      data: {
        sectionId: javaSections[2].id,
        title: 'Inheritance and Polymorphism',
        description: 'Master inheritance, method overriding, and polymorphism',
        youtubeUrl: 'https://youtu.be/cV-sOpOgof8',
        orderIndex: 2,
        durationSeconds: 660,
      },
    }),
  ]);

  // Create videos for Python sections
  await Promise.all([
    // Python Section 1 Videos
    prisma.video.create({
      data: {
        sectionId: pythonSections[0].id,
        title: 'Introduction to Python',
        description: 'What is Python and why learn it?',
        youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        orderIndex: 1,
        durationSeconds: 240,
      },
    }),
    prisma.video.create({
      data: {
        sectionId: pythonSections[0].id,
        title: 'Installing Python',
        description: 'Install Python and set up your development environment',
        youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        orderIndex: 2,
        durationSeconds: 360,
      },
    }),

    // Python Section 2 Videos
    prisma.video.create({
      data: {
        sectionId: pythonSections[1].id,
        title: 'Python Variables and Types',
        description: 'Working with variables, numbers, strings in Python',
        youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        orderIndex: 1,
        durationSeconds: 480,
      },
    }),
    prisma.video.create({
      data: {
        sectionId: pythonSections[1].id,
        title: 'Functions in Python',
        description: 'Define and use functions, parameters, and return values',
        youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        orderIndex: 2,
        durationSeconds: 540,
      },
    }),
  ]);

  // Create videos for JavaScript sections
  await Promise.all([
    // JavaScript Section 1 Videos
    prisma.video.create({
      data: {
        sectionId: javascriptSections[0].id,
        title: 'JavaScript Introduction',
        description: 'What is JavaScript and how it powers the web',
        youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        orderIndex: 1,
        durationSeconds: 300,
      },
    }),
    prisma.video.create({
      data: {
        sectionId: javascriptSections[0].id,
        title: 'Variables and Data Types',
        description: 'let, const, var and JavaScript data types',
        youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        orderIndex: 2,
        durationSeconds: 420,
      },
    }),

    // JavaScript Section 2 Videos
    prisma.video.create({
      data: {
        sectionId: javascriptSections[1].id,
        title: 'DOM Basics',
        description: 'Introduction to Document Object Model',
        youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        orderIndex: 1,
        durationSeconds: 540,
      },
    }),
    prisma.video.create({
      data: {
        sectionId: javascriptSections[1].id,
        title: 'Event Handling',
        description: 'Working with events and event listeners',
        youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        orderIndex: 2,
        durationSeconds: 600,
      },
    }),
  ]);

  console.log('✓ Videos created');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
