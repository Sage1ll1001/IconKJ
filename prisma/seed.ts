import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // 1. Create Users (if not exists) verified
    const guardian = await prisma.user.upsert({
        where: { email: 'guardian@example.com' },
        update: {},
        create: {
            email: 'guardian@example.com',
            name: 'Ramesh (Guardian)',
            role: 'GUARDIAN',
            kycStatus: 'verified',
        },
    })

    // Minor account
    await prisma.user.upsert({
        where: { email: 'aarav@example.com' },
        update: {},
        create: {
            email: 'aarav@example.com',
            name: 'Aarav',
            role: 'MINOR',
            balance: 5000.0,
            guardianId: guardian.id,
        },
    })

    // 2. NIFTY 50 Stocks (Static Snapshot for listing speed)
    // Symbols must match Yahoo Finance (NSE symbols usually end with .NS, but we store base symbol for UI and append .NS for fetching)
    const stocksData = [
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2350.00 },
        { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3450.00 },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1600.00 },
        { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 950.00 },
        { symbol: 'INFY', name: 'Infosys Ltd.', price: 1450.00 },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 2500.00 },
        { symbol: 'ITC', name: 'ITC Ltd.', price: 440.00 },
        { symbol: 'SBIN', name: 'State Bank of India', price: 580.00 },
        { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 850.00 },
        { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', price: 1800.00 },
        { symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: 2900.00 },
        { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 980.00 },
        { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', price: 3200.00 },
        { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 9500.00 },
        { symbol: 'TITAN', name: 'Titan Company Ltd.', price: 3000.00 },
        { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 7200.00 },
        { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', price: 1100.00 },
        { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', price: 22000.00 },
        { symbol: 'WIPRO', name: 'Wipro Ltd.', price: 400.00 },
        { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', price: 8200.00 },
        { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', price: 1500.00 },
        { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.', price: 800.00 },
        { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.', price: 250.00 },
        { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.', price: 1400.00 },
        { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', price: 1200.00 },
        { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', price: 120.00 },
        { symbol: 'NTPC', name: 'NTPC Ltd.', price: 240.00 },
        { symbol: 'CIPLA', name: 'Cipla Ltd.', price: 1200.00 },
        { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', price: 2400.00 },
        { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 600.00 },
        { symbol: 'GRASIM', name: 'Grasim Industries Ltd.', price: 1900.00 },
        { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd.', price: 180.00 },
        { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.', price: 650.00 },
        { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.', price: 4500.00 },
        { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', price: 3000.00 },
        { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.', price: 4600.00 },
        { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', price: 3400.00 },
        { symbol: 'COALINDIA', name: 'Coal India Ltd.', price: 280.00 },
        { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd.', price: 3600.00 },
        { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd.', price: 5400.00 },
        { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Ltd.', price: 800.00 },
        { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd.', price: 5000.00 },
        { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', price: 1550.00 },
        { symbol: 'SBI', name: 'State Bank of India', price: 590.00 },
        { symbol: 'UPL', name: 'UPL Ltd.', price: 600.00 },
        { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd.', price: 850.00 },
        { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.', price: 350.00 },
        { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.', price: 450.00 },
        { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', price: 1100.00 },
        { symbol: 'MRF', name: 'MRF Ltd.', price: 105000.00 } // Retaining MRF
    ]

    console.log(`Seeding ${stocksData.length} stocks...`);

    for (const stock of stocksData) {
        await prisma.stock.upsert({
            where: { symbol: stock.symbol },
            update: {}, // Don't overwrite if exists (to keep price if we updated it via live) -> actually for seed we might want to reset or keep. 
            // Let's keep existing to avoid overwriting live data if we ran that.
            create: {
                symbol: stock.symbol,
                name: stock.name,
                pricePerShare: stock.price,
                totalShares: 1000000,
                availableFractions: 100000,
            },
        })
    }

    // 3. Education Quizzes (Keeping previous 11 courses)
    const quizzesData = [
        {
            title: '1. Stock Market Basics',
            category: 'Beginner',
            description: 'Understanding what stocks are and how the market works.',
            questions: [
                { q: 'What is a stock?', o: [{ t: 'A loan to a bank', c: false }, { t: 'Ownership in a company', c: true }, { t: 'A type of bond', c: false }] },
                { q: 'Where are stocks traded?', o: [{ t: 'Supermarket', c: false }, { t: 'Stock Exchange', c: true }, { t: 'Bank', c: false }] },
            ]
        },
        // ... (We can keep the list shorter in this file for brevity, but let's assume the previous full list is desired. 
        // I will include a representative subset to avoid hitting token limits if the file gets too huge, 
        // but user asked for "all". The previous tool call had 11. I will paste the 11 from memory/previous turn or just 5 core ones if context is tight.
        // Actually, I should use the Full 11 from the previous turn to ensure no data loss.)
        {
            title: '2. Fractional Investing',
            category: 'Beginner',
            description: 'How to buy expensive stocks with small amounts.',
            questions: [
                { q: 'Can you buy less than 1 share?', o: [{ t: 'No', c: false }, { t: 'Yes, via fractional investing', c: true }, { t: 'Only for ETFs', c: false }] },
                { q: 'Benefit of fractional shares?', o: [{ t: 'Lower entry cost', c: true }, { t: 'Higher risk', c: false }, { t: 'No dividends', c: false }] },
            ]
        },
        {
            title: '3. Risk vs Reward',
            category: 'Beginner',
            description: 'Balancing potential gains with possible losses.',
            questions: [
                { q: 'Higher risk usually means?', o: [{ t: 'Lower reward', c: false }, { t: 'Higher potential reward', c: true }, { t: 'No reward', c: false }] },
                { q: 'Safe investment example?', o: [{ t: 'Crypto', c: false }, { t: 'Government Bonds', c: true }, { t: 'Penny Stocks', c: false }] },
            ]
        },
        {
            title: '4. Market Capitalization',
            category: 'Intermediate',
            description: 'Understanding company size and valuation.',
            questions: [
                { q: 'Formula for Market Cap?', o: [{ t: 'Price x Sales', c: false }, { t: 'Share Price x Total Shares', c: true }, { t: 'Assets - Liabilities', c: false }] },
                { q: 'Large Cap companies are?', o: [{ t: 'Risky', c: false }, { t: 'Stable and established', c: true }, { t: 'New startups', c: false }] },
            ]
        },
        {
            title: '5. P/E Ratio Explained',
            category: 'Intermediate',
            description: 'Is a stock expensive or cheap?',
            questions: [
                { q: 'What does P/E stand for?', o: [{ t: 'Price to Earnings', c: true }, { t: 'Profit to Equity', c: false }, { t: 'Public to Enterprise', c: false }] },
                { q: 'High P/E suggests?', o: [{ t: 'Undervalued', c: false }, { t: 'Growth expectation or Overvalued', c: true }, { t: 'Bankrupt', c: false }] },
            ]
        },
        {
            title: '6. Dividends & Earnings',
            category: 'Intermediate',
            description: 'How companies share profits with you.',
            questions: [
                { q: 'What is a dividend?', o: [{ t: 'Tax payment', c: false }, { t: 'Profit share paid to shareholders', c: true }, { t: 'Loan interest', c: false }] },
                { q: 'Do all stocks pay dividends?', o: [{ t: 'Yes', c: false }, { t: 'No, usually growth stocks don\'t', c: true }, { t: 'Only banks', c: false }] },
            ]
        },
        {
            title: '7. Mutual Funds vs Stocks',
            category: 'Intermediate',
            description: 'Direct investing vs managed baskets.',
            questions: [
                { q: 'Mutual funds are managed by?', o: [{ t: 'Robots only', c: false }, { t: 'Fund Managers', c: true }, { t: 'Government', c: false }] },
                { q: 'Benefit of Mutual Funds?', o: [{ t: 'Guaranteed returns', c: false }, { t: 'Diversification', c: true }, { t: 'Zero fees', c: false }] },
            ]
        },
        {
            title: '8. IPOs (Initial Public Offerings)',
            category: 'Advanced',
            description: 'How companies go public.',
            questions: [
                { q: 'Full form of IPO?', o: [{ t: 'Indian Public Office', c: false }, { t: 'Initial Public Offering', c: true }, { t: 'Internal Profit Org', c: false }] },
                { q: 'Who can invest in IPO?', o: [{ t: 'Only rich people', c: false }, { t: 'Retail investors and Institutions', c: true }, { t: 'Only employees', c: false }] },
            ]
        },
        {
            title: '9. Technical Analysis Basics',
            category: 'Advanced',
            description: 'Reading charts and patterns.',
            questions: [
                { q: 'What does a candlestick show?', o: [{ t: 'Only closing price', c: false }, { t: 'Open, High, Low, Close', c: true }, { t: 'Volume only', c: false }] },
                { q: 'Support level means?', o: [{ t: 'Price likely to bounce up', c: true }, { t: 'Price likely to fall', c: false }, { t: 'Company support', c: false }] },
            ]
        },
        {
            title: '10. Long-term Investing',
            category: 'Pro',
            description: 'The power of compounding.',
            questions: [
                { q: 'Compounding works best with?', o: [{ t: 'Time', c: true }, { t: 'Luck', c: false }, { t: 'Timing the market', c: false }] },
                { q: 'Ideal time horizon?', o: [{ t: '1 week', c: false }, { t: '5+ Years', c: true }, { t: '1 day', c: false }] },
            ]
        },
        {
            title: '11. Market Scams & Safety',
            category: 'Safety',
            description: 'Protecting your money from fraud.',
            questions: [
                { q: 'Someone guarantees 100% returns?', o: [{ t: 'Invest immediately', c: false }, { t: 'It\'s likely a scam', c: true }, { t: 'Tell friends', c: false }] },
                { q: 'Never share your?', o: [{ t: 'Stock picks', c: false }, { t: 'OTP and Password', c: true }, { t: 'Profit screenshots', c: false }] },
            ]
        }
    ]

    for (const quiz of quizzesData) {
        const existing = await prisma.quiz.findFirst({ where: { title: quiz.title } })
        if (!existing) {
            await prisma.quiz.create({
                data: {
                    title: quiz.title,
                    category: quiz.category,
                    description: quiz.description,
                    questions: {
                        create: quiz.questions.map(q => ({
                            text: q.q,
                            options: {
                                create: q.o.map(opt => ({ text: opt.t, isCorrect: opt.c }))
                            }
                        }))
                    }
                }
            })
        }
    }

    console.log('Seeding Finished: NIFTY 50 Stocks & 11 Courses.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
