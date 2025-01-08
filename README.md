# SIMS

Create a RESTful API for managing an inventory of products. The API should support basic CRUD operations and include some business logic for managing stock levels and creating

## Setup

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- MongoDB and lowdb for data persistence

### Installation

1. Clone the repository
    ```bash
    git clone https://github.com/michal513717/Simple-Inventory-Management-System
    cd Simple-Inventory-Management-System
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables
    ```env
    PORT = Port number
    MONGO_URI = Your mongo db uri
    ELASTICSEARCH_CLOUD_ID = Cloud id from elastic search
    ELASTICSEARCH_ID = Id from elastic search
    ELASTICSEARCH_API_KEY = Api key from elastic search
    ```

4. Start the server
    ```bash
    npm run dev
    ```

## API

### Products

- `GET /products` - Retrieve a list of all products 
- `POST /products` - Create a new product 
    - **Fields:** 
        - `name` (string, required, max length 50) 
        - `description` (string, required, max length 50) 
        - `price` (number, required, must be positive) 
        - `stock` (integer, required, must be non-negative)

### Stock Management

- `POST /products/:id/restock` - Increase the stock level of a product.
    - **Fields:**
        - `id` (id of the product)
        - `quantity` (number, must be positive)
- `POST /products/:id/sell` - Decrease the stock level of a product.
    - **Fields:**
        - `id` (id of the product)
        - `quantity` (number, must be positive)

### Order Management

- `POST /orders` - Create a new order (fields: customerId, products)
    - **Fields:**
        - `customerId` (id of the customer or name)
        - `products` (array of products - productId and quantity)

## Validation

Implemented input validation for all endpoints using `express-validator`.

## Error Handling

- Implemented proper error handling for cases such as invalid input, resource not found, and server errors.
- Returns appropriate HTTP status codes and error messages.

## Technology Stack

- Node.js
- Express.js
- MongoDB (mongoose) and lowdb
- TypeScript
- CQRS pattern
- Elastic search
- `express-validator` for validation
- log4js for logging