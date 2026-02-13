import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import yahooFinance from 'yahoo-finance2';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const stock = await prisma.stock.findUnique({
            where: { id }
        });

        if (!stock) {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }

        // Live Fetch Strategy
        let livePrice = Number(stock.pricePerShare);
        let liveChange = 0;

        try {
            // Yahoo Finance symbol for NSE is usually SYMBOL.NS
            // We use the stored symbol (e.g., RELIANCE) and append .NS
            const symbolToFetch = `${stock.symbol}.NS`;
            const quote = await yahooFinance.quote(symbolToFetch);

            if (quote && quote.regularMarketPrice) {
                livePrice = quote.regularMarketPrice;
                liveChange = quote.regularMarketChangePercent || 0;

                // Fire and forget update to keep DB fresh-ish
                await prisma.stock.update({
                    where: { id: stock.id },
                    data: { pricePerShare: livePrice }
                });
            }
        } catch (err) {
            console.warn(`Yahoo Finance fetch failed for ${stock.symbol}. Using DB price.`);
            // Fallback to random simulation if Yahoo fails (e.g. rate limit or network issue)
            liveChange = (Math.random() * 5 - 2.5);
        }

        return NextResponse.json({
            ...stock,
            price: livePrice,
            change: Number(liveChange.toFixed(2))
        });

    } catch (error) {
        console.error('Failed to fetch stock:', error);
        return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
    }
}
