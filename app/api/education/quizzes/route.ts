import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        const quizzes = await prisma.quiz.findMany({
            include: {
                _count: {
                    select: { questions: true }
                }
            }
        });
        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
    }
}
