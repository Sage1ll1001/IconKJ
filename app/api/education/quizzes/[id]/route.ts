import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        // In a real app, we might want to hide isCorrect from options until submission
        // For simplicity, we send it, but frontend should not inspect it easily
        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Failed to fetch quiz details:', error);
        return NextResponse.json({ error: 'Failed to fetch quiz details' }, { status: 500 });
    }
}
