import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
    try {
        const { name, email, role } = await request.json();

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                role: role || 'MINOR',
                balance: 1000.0, // Sign up bonus
                kycStatus: 'pending'
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                balance: user.balance
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
    }
}
