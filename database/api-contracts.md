# 2nd Chance Matrimonial Platform — REST API v1 Contracts & Specification

This document provides the complete API specification for the **2nd Chance Matrimonial Backend API (`/api/v1/*`)**. All endpoints require JSON request payload and return JSON responses adhering to a standard response schema.

---

## 1. Standard Response Schemas

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Validation Error Response (HTTP 422)
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Specific validation error message."]
  }
}
```

### Authorization Error Response (HTTP 403)
```json
{
  "success": false,
  "message": "Forbidden. You do not have permission to perform this action."
}
```

---

## 2. Authentication API (`/api/v1/auth/*`)

### `POST /api/v1/auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "Anika Rahman",
    "email": "anika@example.com",
    "phone": "+8801700000000",
    "gender": "Female",
    "password": "SecretPassword123!",
    "password_confirmation": "SecretPassword123!",
    "date_of_birth": "1994-06-15",
    "marital_status": "Divorced",
    "religion": "Islam",
    "city": "Dhaka"
  }
  ```
- **Response (HTTP 201)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "token": "1|sanctum_bearer_token_string",
      "user": {
        "id": 1,
        "name": "Anika Rahman",
        "email": "anika@example.com",
        "phone": "+8801700000000",
        "gender": "Female",
        "role": "FREE",
        "status": "ACTIVE"
      }
    }
  }
  ```

### `POST /api/v1/auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "anika@example.com",
    "password": "SecretPassword123!"
  }
  ```
- **Response (HTTP 200)**: Bearer Sanctum Token and User Object.

### `POST /api/v1/auth/logout`
- **Auth**: Sanctum Bearer Token
- **Response (HTTP 200)**: Token revoked.

### `GET /api/v1/auth/me`
- **Auth**: Sanctum Bearer Token
- **Response (HTTP 200)**: Current user details and profile info.

---

## 3. Profile & Search API (`/api/v1/profiles/*`, `/api/v1/search`)

### `GET /api/v1/search`
- **Auth**: Sanctum Bearer Token
- **Query Parameters**:
  - `gender`: `'Male'` | `'Female'`
  - `age_min`: Integer
  - `age_max`: Integer
  - `religion`: String
  - `city`: String
  - `marital_status`: String
  - `verified`: Boolean
  - `sort`: `'latest'` | `'trust_score'` | `'age'`
  - `page`: Integer (Default: 1)
  - `per_page`: Integer (Default: 15)
- **Response (HTTP 200)**: Paginated array of profile cards.

### `GET /api/v1/profiles/{id}`
- **Auth**: Sanctum / Public (scoped by privacy policy)
- **Response (HTTP 200)**: Full profile information permitted for caller's tier (Public, Registered, Premium, or Matched).

### `PUT /api/v1/profiles/me`
- **Auth**: Sanctum Bearer Token
- **Response (HTTP 200)**: Updated profile resource.

---

## 4. Interest API (`/api/v1/interests/*`)

### `POST /api/v1/interests`
- **Auth**: Sanctum Bearer Token
- **Permissions**: **Premium Members Only** (`membership_tier = 'PREMIUM'`). Cannot send to self or blocked users.
- **Request Body**:
  ```json
  {
    "receiver_id": 2
  }
  ```
- **Response (HTTP 201)**: Interest record created with status `'SENT'`.

### `GET /api/v1/interests/received` & `GET /api/v1/interests/sent`
- **Auth**: Sanctum Bearer Token
- **Response (HTTP 200)**: Array of interest records with profile cards.

### `POST /api/v1/interests/{id}/accept`
- **Auth**: Sanctum Bearer Token (Receiver of interest)
- **Business Rule**: Automatically creates an `ACTIVE` Match record and a `Conversation` room in an atomic DB transaction.
- **Response (HTTP 200)**:
  ```json
  {
    "success": true,
    "message": "Interest accepted. Match and Conversation created.",
    "data": {
      "interest_id": 5,
      "match_id": 12,
      "conversation_id": 8
    }
  }
  ```

### `POST /api/v1/interests/{id}/reject` & `POST /api/v1/interests/{id}/cancel`
- **Auth**: Sanctum Bearer Token.

---

## 5. Match & Conversation API (`/api/v1/matches/*`, `/api/v1/conversations/*`)

### `GET /api/v1/matches`
- **Auth**: Sanctum Bearer Token
- **Response**: List of active matches involving authenticated user.

### `GET /api/v1/conversations/{id}/messages`
- **Auth**: Sanctum Bearer Token
- **Permissions**: Authenticated user MUST be a participant in an `ACTIVE` match conversation room.

### `POST /api/v1/conversations/{id}/messages`
- **Auth**: Sanctum Bearer Token
- **Permissions**: Authenticated user MUST be an active match participant.
- **Request Body**:
  ```json
  {
    "type": "TEXT",
    "content": "Hello! I am glad we matched."
  }
  ```

---

## 6. Photo & Contact Sharing API

### `POST /api/v1/conversations/{id}/contacts`
- **Auth**: Sanctum Bearer Token
- **Permissions**: Active match participants ONLY.
- **Request Body**:
  ```json
  {
    "phone": "+8801700000000",
    "whatsapp": "+8801700000000",
    "email": "anika@example.com"
  }
  ```
- **Response**: Contact details created and scoped strictly inside active matched conversation.

---

## 7. Payments & Subscriptions API (`/api/v1/payments/*`, `/api/v1/subscription/*`)

### `POST /api/v1/payments/sslcommerz/initiate`
- **Auth**: Sanctum Bearer Token
- **Request Body**:
  ```json
  {
    "membership_plan_id": 1,
    "purpose": "subscription"
  }
  ```
- **Response (HTTP 200)**:
  ```json
  {
    "success": true,
    "data": {
      "gateway_url": "https://sandbox.sslcommerz.com/easycheckout.php?val_id=...",
      "transaction_id": "TXN_20260902_99182",
      "amount": 1499.00
    }
  }
  ```

### `POST /api/v1/payments/sslcommerz/ipn`
- **Auth**: Gateway IPN / Callback (Public)
- **Business Rule**: Server-side transaction validation. Subscription is activated ONLY after server verification passes.
