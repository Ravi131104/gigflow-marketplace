# GigFlow - Freelance Marketplace

GigFlow is a full-stack MERN application connecting Clients and Freelancers. It features secure authentication, job posting, bidding, and an atomic hiring system that prevents race conditions.

## 🚀 Features
* **User Authentication:** JWT-based secure login with HttpOnly Cookies.
* **Role-Fluid System:** Users can act as both Clients (posting jobs) and Freelancers (bidding).
* **Gig Management:** Browse open gigs, search by title, and post new opportunities.
* **Atomic Hiring Logic:** Uses MongoDB Transactions to ensure only one freelancer is hired per gig, automatically rejecting others.

## 🛠️ Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Redux Toolkit
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <your-repo-link>
    cd gigflow
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    
    # Create .env file
    cp .env.example .env
    # (Edit .env with your MongoDB URI and JWT_Secret)
    
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open `http://localhost:5173` in your browser.

## ✅ API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & set HttpOnly Cookie |
| GET | `/api/gigs` | Fetch all open gigs |
| POST | `/api/gigs` | Post a new gig (Auth required) |
| POST | `/api/bids` | Submit a bid (Auth required) |
| PATCH | `/api/bids/:id/hire` | **Atomic Hire** (Client only) |