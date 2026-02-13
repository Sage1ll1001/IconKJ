import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, stockId, type, amount, priceAtTransaction } = body;

        if (!userId || !stockId || !type || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const tradeAmount = Number(amount);

        // Execute trade atomically
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch User and Stock
            const user = await tx.user.findUnique({ where: { id: userId } });
            const stock = await tx.stock.findUnique({ where: { id: stockId } });

            if (!user) throw new Error("User not found");
            if (!stock) throw new Error("Stock not found");

            const currentPrice = Number(stock.pricePerShare);
            const quantity = tradeAmount / currentPrice;

            // 2. Validate Balance / Holdings
            if (type === 'BUY') {
                if (Number(user.balance) < tradeAmount) {
                    throw new Error(`Insufficient balance. You have ₹${user.balance}`);
                }

                // Deduct Balance
                await tx.user.update({
                    where: { id: userId },
                    data: { balance: { decrement: tradeAmount } }
                });

                // Add to Holdings (Upsert)
                const existingHolding = await tx.holding.findUnique({
                    where: { userId_stockId: { userId, stockId } }
                });

                if (existingHolding) {
                    // Calculate new average price
                    const totalCostOld = Number(existingHolding.quantity) * Number(existingHolding.avgBuyPrice);
                    const totalCostNew = totalCostOld + tradeAmount;
                    const totalQuantity = Number(existingHolding.quantity) + quantity;
                    const newAvgPrice = totalCostNew / totalQuantity;

                    await tx.holding.update({
                        where: { id: existingHolding.id },
                        data: {
                            quantity: { increment: quantity },
                            avgBuyPrice: newAvgPrice
                        }
                    });
                } else {
                    await tx.holding.create({
                        data: {
                            userId,
                            stockId,
                            quantity,
                            avgBuyPrice: currentPrice
                        }
                    });
                }
            } else if (type === 'SELL') {
                // Check if user has enough holdings
                const holding = await tx.holding.findUnique({
                    where: { userId_stockId: { userId, stockId } }
                });

                // Simple check: Allow sell by amount for now, convert to quantity estimate
                // In real app, we should check quantity precisely. 
                // For hackathon, if they SELL ₹X, we check if they have enough equivalent quantity
                const quantityToSell = tradeAmount / currentPrice;

                if (!holding || Number(holding.quantity) < quantityToSell) {
                    throw new Error("Insufficient holdings to sell");
                }

                // Add Balance
                await tx.user.update({
                    where: { id: userId },
                    data: { balance: { increment: tradeAmount } }
                });

                // Deduct Holdings
                await tx.holding.update({
                    where: { id: holding.id },
                    data: { quantity: { decrement: quantityToSell } }
                });
            }

            // 3. Record Transaction
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    stockId,
                    type,
                    amount: tradeAmount,
                    price: currentPrice,
                    status: 'SUCCESS'
                }
            });

            return transaction;
        });

        return NextResponse.json({
            success: true,
            message: `${type} order processed successfully`,
            data: result
        });

    } catch (error: any) {
        console.error('Trade Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Transaction failed' }, { status: 400 });
    }
}
