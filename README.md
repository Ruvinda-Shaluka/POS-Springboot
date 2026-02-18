# NextGen POS System

NextGen POS is a full-stack Point of Sale system built using Spring Boot (Backend) and React + Vite (Frontend).  
This project demonstrates a complete POS workflow including Customer Management, Item Management, and Order Processing with automatic stock updates.

----------------------------------------
PROJECT STRUCTURE
----------------------------------------

NextGen-POS/
  Backend/   -> Spring Boot REST API
  Frontend/  -> Vite + React Application

----------------------------------------
FEATURES
----------------------------------------

Customer Management
- Add new customers
- Update customers
- Delete customers
- Search customers
- Data stored in MySQL database

Item Management
- Add new items
- Update items
- Delete items
- Search items
- Sort by price and quantity
- Low stock indicator
- Stock automatically updates after placing orders

Order Management
- Auto-generated Order ID
- Current date included
- Select customer
- Add items to cart
- Quantity validation
- Discount (percentage or fixed)
- Optional tax calculation
- Backend stock reduction
- Items auto-refresh after order placement

----------------------------------------
TECHNOLOGY STACK
----------------------------------------

Backend:
- Java 17+
- Spring Boot
- Spring Web
- Spring Data JPA (Hibernate)
- MySQL
- Maven

Frontend:
- Vite
- React
- TailwindCSS
- React Router DOM
- Axios
- Lucide React (Icons)

----------------------------------------
API ENDPOINTS
----------------------------------------

Customers
GET     /api/v1/customers
POST    /api/v1/customers
PUT     /api/v1/customers/{id}
DELETE  /api/v1/customers/{id}

Items
GET     /api/v1/items
POST    /api/v1/items
PUT     /api/v1/items/{id}
DELETE  /api/v1/items/{id}

Orders
POST    /api/v1/orders

----------------------------------------
SAMPLE ORDER PAYLOAD
----------------------------------------

{
  "orderId": 1,
  "date": "2026-02-16",
  "customerId": 1,
  "orderDetails": [
    {
      "itemId": 2,
      "qty": 3,
      "unitPrice": 1500.00
    }
  ]
}

----------------------------------------
DATABASE DESIGN OVERVIEW
----------------------------------------

Customer
- id (Long)
- name
- address

Item
- id (Long)
- description
- unitPrice
- qtyOnHand

Order
- orderId (Long)
- date
- customer
- orderDetails

OrderDetail
- id
- item
- qty
- unitPrice

----------------------------------------
INSTALLATION GUIDE
----------------------------------------

Backend Setup

1. Navigate to Backend folder
2. Configure application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/nextgen_pos
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

3. Run:
mvn spring-boot:run

Backend runs on:
http://localhost:8080

Frontend Setup

1. Navigate to Frontend folder
2. Install dependencies:

npm install
npm install axios react-router-dom lucide-react

3. Run:
npm run dev

Frontend runs on:
http://localhost:5173

----------------------------------------
SYSTEM ARCHITECTURE
----------------------------------------

React Frontend
      ↓
Spring Boot REST API
      ↓
MySQL Database

Order Flow:
1. User selects customer
2. Adds items to cart
3. Places order
4. Backend saves order
5. Backend reduces stock
6. Frontend refreshes items

----------------------------------------
AUTHOR
----------------------------------------

Dilshan Thilina 
