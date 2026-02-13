import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        const stocks = await prisma.stock.findMany({
            orderBy: { symbol: 'asc' }
        });

        // Calculate simple mock "change" percentage for display since we don't have historical data driven by cron yet
        const stocksWithChange = stocks.map(stock => ({
            ...stock,
            price: Number(stock.pricePerShare), // Convert Decimal to Number for JSON
            change: (Math.random() * 5 - 2.5).toFixed(2) // Random mock change between -2.5% and +2.5%
        }));

        return NextResponse.json(stocksWithChange);
    } catch (error) {
        console.error('Failed to fetch stocks:', error);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}
