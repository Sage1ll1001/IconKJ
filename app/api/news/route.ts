import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        // Search Google News RSS for the stock symbol + "Stock India"
        const feedUrl = `https://news.google.com/rss/search?q=${symbol}+Stock+India&hl=en-IN&gl=IN&ceid=IN:en`;
        const feed = await parser.parseURL(feedUrl);

        return NextResponse.json({
            items: feed.items.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                source: item.creator
            }))
        });

    } catch (error) {
        console.error('RSS Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
