# 📚 MicroShare - Project Documentation

## 1. Project Overview
MicroShare is a fintech platform designed to democratize stock market access for students and minors. It combines **fractional investing** with **gamified financial education** to create a safe, engaging, and legal environment for young investors.

## 2. Key Features
- **Fractional Investing**: Buy high-value stocks in small monetary fractions (e.g., ₹100 of MRF).
- **Education First**: Users must complete quizzes to unlock trading features, ensuring informed decision-making.
- **Guardian Oversight**: Linked accounts allowing parents to monitor and approve minor's activities.
- **Real-time Portfolio**: Live tracking of invested value, profit/loss, and asset allocation.

## 3. Technology Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React (Icons).
- **Backend**: Next.js API Routes (Serverless Functions).
- **Database**: SQLite (Dev) / PostgreSQL (Prod) via Prisma ORM.
- **Language**: TypeScript throughout for type safety.
- **Authentication**: NextAuth.js (Planned/Scaffolded).

## 4. Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/microshare.git
    cd microshare
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Database**:
    ```bash
    # Generate Prisma Client
    npx prisma generate
    
    # Push Schema to Database (SQLite)
    npx prisma db push
    
    # Seed Initial Data (Stocks, Users, Quizzes)
    npx prisma db seed
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Open App**:
    Visit `http://localhost:3000`

## 5. API Documentation

### Market Data
- **GET** `/api/market`
  - Fetches list of all available stocks with current prices (randomized mock fluctuations).
  - **Response**: `[{ id, symbol, name, price, change, ... }]`

### Trading
- **POST** `/api/trade`
  - Executes a Buy or Sell order.
  - **Body**: `{ userId, stockId, type: 'BUY'|'SELL', amount: number }`
  - **Logic**: atomic transaction updating User Balance and Holdings.

### Education
- **GET** `/api/education/quizzes`
  - Returns list of available quizzes.
- **GET** `/api/education/quizzes/[id]`
  - Returns specific quiz with questions and options.

## 6. Database Schema (Prisma)
- **User**: Stores profile, balance, role (MINOR/GUARDIAN).
- **Stock**: Stores company details, price, available liquidity.
- **Holding**: Tracks how much of a stock a user owns.
- **Transaction**: Ledger of all money/stock movements.
- **Quiz/Question/UserProgress**: Manages educational content and scoring.

## 7. Future Improvements
- Integrate **Razorpay/Stripe** for real money loading.
- Implement **WebSockets** for live stock price updates.
- **AI Advisor**: Chatbot to explain financial terms in context.
