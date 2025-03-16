# Epharmacy API Documentation

## Overview

API documentation for Epharmacy application. This API provides comprehensive endpoints for managing a pharmacy system, including inventory, sales, purchases, and user management.

Base URL: `http://localhost:8000/api`

## Authentication

The API uses Basic Authentication. All endpoints require authentication unless specified otherwise.

### Authentication Endpoints

#### Register User
- **POST** `/auth/register/`
- Creates a new user account
- Required fields:
  - username (string)
  - password (string)
  - password2 (string)
- Optional fields:
  - email (string)
  - role (ADMIN/STAFF/CUSTOMER)
  - phone_number (string)
  - address (string)
  - first_name (string)
  - last_name (string)

#### Get Token
- **POST** `/auth/token/`
- Obtain authentication token
- Required fields:
  - username (string)
  - password (string)

#### Refresh Token
- **POST** `/auth/token/refresh/`
- Refresh an expired access token
- Required fields:
  - refresh (string)

## Users

### User Management
- **GET** `/auth/users/`
  - List all users
  - Supports pagination and search
- **GET** `/auth/users/{id}/`
  - Get specific user details
- **PUT/PATCH** `/auth/users/{id}/`
  - Update user information

## Pharmacies

### Pharmacy Management
- **GET** `/pharmacies/`
  - List all pharmacies
- **POST** `/pharmacies/`
  - Create new pharmacy
  - Required fields:
    - name (string)
    - address (string)
    - contact_phone (string)
    - contact_email (string)
- **GET** `/pharmacies/{id}/`
  - Get specific pharmacy details
- **PUT/PATCH** `/pharmacies/{id}/`
  - Update pharmacy information
- **DELETE** `/pharmacies/{id}/`
  - Delete pharmacy

#### Staff Management
- **POST** `/pharmacies/{id}/add_staff/`
  - Add staff to pharmacy
- **POST** `/pharmacies/{id}/remove_staff/`
  - Remove staff from pharmacy

## Inventory

### Inventory Management
- **GET** `/inventory/`
  - List all inventory items
- **POST** `/inventory/`
  - Add new inventory item
  - Required fields:
    - unit_price (decimal)
    - cost_price (decimal)
- **GET** `/inventory/low_stock/`
  - Get items with low stock
- **GET** `/inventory/{id}/`
  - Get specific inventory item
- **PUT/PATCH** `/inventory/{id}/`
  - Update inventory item
- **DELETE** `/inventory/{id}/`
  - Delete inventory item
- **POST** `/inventory/{id}/adjust_stock/`
  - Adjust stock levels

## Medicines

### Medicine Management
- **GET** `/medicines/`
  - List all medicines
- **POST** `/medicines/`
  - Add new medicine
  - Required fields:
    - name (string)
    - generic_name (string)
    - description (string)
    - manufacturer (string)
    - dosage_form (string)
    - strength (string)
- **GET** `/medicines/{id}/`
  - Get specific medicine details
- **PUT/PATCH** `/medicines/{id}/`
  - Update medicine information
- **DELETE** `/medicines/{id}/`
  - Delete medicine

## Orders

### Order Management
- **GET** `/orders/`
  - List all orders
- **POST** `/orders/`
  - Create new order
  - Required fields:
    - shipping_address (string)
    - phone_number (string)
- **GET** `/orders/{id}/`
  - Get specific order details
- **PUT/PATCH** `/orders/{id}/`
  - Update order information
- **DELETE** `/orders/{id}/`
  - Delete order
- **POST** `/orders/{id}/cancel/`
  - Cancel order
- **POST** `/orders/{id}/update_status/`
  - Update order status

### Cart Management
- **GET** `/cart/`
  - List all carts
- **POST** `/cart/`
  - Create new cart
- **GET** `/cart/{id}/`
  - Get specific cart details
- **PUT/PATCH** `/cart/{id}/`
  - Update cart
- **DELETE** `/cart/{id}/`
  - Delete cart
- **POST** `/cart/{id}/add_item/`
  - Add item to cart
- **POST** `/cart/{id}/remove_item/`
  - Remove item from cart
- **POST** `/cart/{id}/update_item/`
  - Update cart item
- **POST** `/cart/{id}/checkout/`
  - Checkout cart
- **POST** `/cart/{id}/clear/`
  - Clear cart

## Sales

### Sales Management
- **GET** `/sales/`
  - List all sales
- **POST** `/sales/`
  - Create new sale
  - Required fields:
    - pharmacy (integer)
    - items (array)
- **GET** `/sales/{id}/`
  - Get specific sale details
- **PUT/PATCH** `/sales/{id}/`
  - Update sale information
- **DELETE** `/sales/{id}/`
  - Delete sale

### Sales Reports
- **GET** `/sales/dashboard/`
  - Get sales dashboard data
- **GET** `/sales/sales_by_type/`
  - Get sales grouped by type
- **GET** `/daily-sales-reports/`
  - Get daily sales reports
- **GET** `/product-sales-reports/`
  - Get product-wise sales reports

## Purchases

### Purchase Orders
- **GET** `/purchase-orders/`
  - List all purchase orders
- **POST** `/purchase-orders/`
  - Create new purchase order
  - Required fields:
    - pharmacy (integer)
    - items (array)
- **GET** `/purchase-orders/{id}/`
  - Get specific purchase order
- **PUT/PATCH** `/purchase-orders/{id}/`
  - Update purchase order
- **DELETE** `/purchase-orders/{id}/`
  - Delete purchase order

#### Purchase Order Actions
- **POST** `/purchase-orders/{id}/approve/`
  - Approve purchase order
- **POST** `/purchase-orders/{id}/cancel/`
  - Cancel purchase order
- **POST** `/purchase-orders/{id}/mark_as_ordered/`
  - Mark order as ordered
- **POST** `/purchase-orders/{id}/submit_for_approval/`
  - Submit for approval
- **GET** `/purchase-orders/assigned_to_my_pharmacy/`
  - Get orders assigned to user's pharmacy
- **POST** `/purchase-orders/{id}/assign_to_pharmacy/`
  - Assign order to another pharmacy
- **GET** `/purchase-orders/{id}/fulfillment_summary/`
  - Get order fulfillment summary

### Inventory Receivals
- **GET** `/inventory-receivals/`
  - List all receivals
- **POST** `/inventory-receivals/`
  - Create new receival
- **GET** `/inventory-receivals/{id}/`
  - Get specific receival
- **PUT/PATCH** `/inventory-receivals/{id}/`
  - Update receival
- **DELETE** `/inventory-receivals/{id}/`
  - Delete receival
- **POST** `/inventory-receivals/{id}/complete_receival/`
  - Complete receival process
- **POST** `/inventory-receivals/{id}/report_discrepancy/`
  - Report discrepancy in receival

## Invoices

### Invoice Management
- **GET** `/invoices/`
  - List all invoices
- **POST** `/invoices/`
  - Create new invoice
  - Required fields:
    - sender_pharmacy (integer)
    - receiver_pharmacy (integer)
    - due_date (date)
    - subtotal (decimal)
    - tax (decimal)
    - total (decimal)
- **GET** `/invoices/{id}/`
  - Get specific invoice
- **PUT/PATCH** `/invoices/{id}/`
  - Update invoice
- **DELETE** `/invoices/{id}/`
  - Delete invoice
- **POST** `/invoices/{id}/mark_as_paid/`
  - Mark invoice as paid

### Invoice Items
- **GET** `/invoice-items/`
  - List all invoice items
- **GET** `/invoice-items/{id}/`
  - Get specific invoice item

## Transactions

### Transaction Management
- **GET** `/transactions/`
  - List all transactions
- **POST** `/transactions/`
  - Create new transaction
  - Required fields:
    - invoice (integer)
    - transaction_type (PAYMENT/REFUND)
    - amount (decimal)
    - reference_number (string)
- **GET** `/transactions/{id}/`
  - Get specific transaction
- **PUT/PATCH** `/transactions/{id}/`
  - Update transaction
- **DELETE** `/transactions/{id}/`
  - Delete transaction

## Suppliers

### Supplier Management
- **GET** `/suppliers/`
  - List all suppliers
- **POST** `/suppliers/`
  - Create new supplier
  - Required fields:
    - name (string)
- **GET** `/suppliers/{id}/`
  - Get specific supplier
- **PUT/PATCH** `/suppliers/{id}/`
  - Update supplier
- **DELETE** `/suppliers/{id}/`
  - Delete supplier

## Common Parameters

### Query Parameters
- `page`: Page number for pagination
- `search`: Search term for filtering results
- `ordering`: Field to order results by

### Response Format
All responses follow this general format:
```json
{
  "count": integer,
  "next": string (url),
  "previous": string (url),
  "results": array
}
```

## Status Codes

- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are specified in response headers:
- X-RateLimit-Limit
- X-RateLimit-Remaining
- X-RateLimit-Reset

## Versioning

The API is versioned through the URL path. The current version is v1.
Example: `http://localhost:8000/api/v1/endpoint` 