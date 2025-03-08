import { Resend } from 'resend';
import AnnouncementEmail from '@/emails/AnnouncementEmail';
import prisma from '@/lib/prisma';
import { getStudentsInClass, getTeachersInClass } from './data';

// Only initialize Resend if we're on the server side
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function getRecipientsByClass(classId: number | null) {
  try {
    let recipients: string[] = [];

    if (classId) {
      // Get students and teachers for specific class
      const [students, teachers] = await Promise.all([
        getStudentsInClass(classId),
        getTeachersInClass(classId)
      ]);
      
      recipients = [
        ...students.map(s => s.email),
        ...teachers.map(t => t.email)
      ];
    } else {
      // Get all students and teachers
      const [students, teachers] = await Promise.all([
        prisma.student.findMany({ select: { email: true } }),
        prisma.teacher.findMany({ select: { email: true } })
      ]);
      
      recipients = [
        ...students.map(s => s.email),
        ...teachers.map(t => t.email)
      ];
    }

    return recipients.filter(Boolean); // Remove any null/undefined emails
  } catch (error) {
    console.error('Error getting recipients:', error);
    return [];
  }
}

export async function sendAnnouncementEmail({ 
  to, 
  title, 
  description, 
  className 
}: { 
  to: string[];
  title: string;
  description: string;
  className?: string | null;
}) {
  if (!resend) {
    console.warn('Resend is not initialized. Skipping email send.');
    return;
  }

  try {
    if (!to.length) {
      console.log('No recipients found for announcement');
      return;
    }

    if (!process.env.EMAIL_FROM) {
      console.warn('EMAIL_FROM environment variable is not set. Skipping email send.');
      return;
    }

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: `School Announcement: ${title}`,
      react: AnnouncementEmail({ title, description, className }),
    });

    return data;
  } catch (error) {
    console.error('Error sending announcement email:', error);
    // Don't throw the error, just log it
    return null;
  }
}
