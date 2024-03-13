# Kuandorwear

Kuandorwear is an ecommerce website that provides a platform for users to browse and purchase clothing items online. It is built using React for the frontend, Django for the backend, integrates PayPal for client-side payments, and utilizes a PostgreSQL database hosted on Railway.

## Features

- Browse through a catalog of clothing items
- View detailed information and images for each product
- Add items to the shopping cart
- Proceed to checkout and make payments using PayPal
- User authentication and authorization for secure access
- Admin panel for managing products, orders, and users

## Technologies Used

- React: Frontend user interface
- Django: Backend server and API development
- PostgreSQL: Database for storing product and user information
- PayPal API: Integration for processing payments
- Railway: Hosting platform for PostgreSQL database
- Redux: State management for React application
- Material-UI: React component library for UI design
- Axios: HTTP client for making API requests

## Getting Started

To get started with Kuandorwear, follow these steps:

1. Clone the repository:
2. Install dependencies for both frontend and backend:
   cd kuandorwear/store
    npm install
    cd ../backend
    pip install -r requirements.txt
3. Set up environment variables:
   - Create a `.env` file in the frontend directory and configure the PayPal client ID.
   - Configure Django settings to connect to your PostgreSQL database.
  
4. Run the frontend and backend servers:
   cd kuandorwear/store
    npm start
    cd ../backend
    python manage.py runserver
5. Access the application in your web browser:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
