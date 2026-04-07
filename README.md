# Smart Institution Decision Support System (Smart Insight Hub)

A comprehensive data-driven decision support system designed for educational institutions to manage and oversee student and staff performance, department metrics, and institutional analytics.

## Tech Stack

### Frontend
* **Framework**: React with Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Components**: shadcn/ui
* **Charts**: Recharts

### Backend
* **Environment**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose)
* **Language**: TypeScript

## Getting Started

### Prerequisites
* Node.js & npm installed
* A running MongoDB instance (or MongoDB Atlas URI)

### Local Development Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Rakshana274/smart_institution_decision_support_system.git
   cd smart_institution_decision_support_system
   ```

2. **Backend Setup:**
   Navigate into the backend directory, install packages, and set up your environment variables.
   ```sh
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory based on required variables like `MONGODB_URI` and `PORT`.
   To start the backend dev server:
   ```sh
   npm run dev
   ```

3. **Frontend Setup:**
   In a new terminal window, navigate into the frontend directory:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

## Deployment

### Backend
The backend is configured for deployment on Render. The `render.yaml` configuration is located in the `backend` folder. To deploy:
1. Connect this GitHub repository to Render.
2. Render will automatically detect the blueprint and deploy the Node.js service.

### Frontend
The frontend can be deployed seamlessly to platforms like Vercel or Netlify via direct import from the GitHub repository.

## Project Structure
* `/frontend` - Contains the React application, UI elements, and API client scripts.
* `/backend` - Contains the Express application, models, routes, and controllers.
