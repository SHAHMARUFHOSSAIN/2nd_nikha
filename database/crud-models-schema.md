# 2nd Chance Matrimonial Platform — Complete CRUD Models & MySQL Database Architecture

This document specifies all **21 Production CRUD Models**, their MySQL Table Schemas, Primary/Foreign Keys, and Laravel 11 Eloquent Model mappings for the 2nd Chance Matrimonial Platform.

---

## 1. User & Authentication Domain

### Table: `users` (Laravel Model: `App\Models\User`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR 255)
- `email` (VARCHAR 255, UNIQUE)
- `phone` (VARCHAR 30, UNIQUE, NULLABLE)
- `password` (VARCHAR 255)
- `role` (ENUM: `'GUEST'`, `'FREE'`, `'PREMIUM'`, `'ADMIN'`)
- `status` (ENUM: `'ACTIVE'`, `'SUSPENDED'`, `'BLOCKED'`)
- `email_verified_at` (TIMESTAMP, NULLABLE)
- `remember_token` (VARCHAR 100, NULLABLE)
- `created_at`, `updated_at` (TIMESTAMP)

### Table: `admin_users` (Laravel Model: `App\Models\AdminUser`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `role` (ENUM: `'SUPER_ADMIN'`, `'ADMIN'`, `'MODERATOR'`, `'SUPPORT'`, `'FINANCE'`, `'CONTENT_MANAGER'`)
- `permissions` (JSON)
- `last_login_at` (TIMESTAMP, NULLABLE)
- `created_at`, `updated_at` (TIMESTAMP)

---

## 2. Profile & Verification Domain

### Table: `profiles` (Laravel Model: `App\Models\Profile`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (BIGINT, FOREIGN KEY -> `users.id`, UNIQUE)
- `full_name` (VARCHAR 255)
- `age` (INT)
- `gender` (ENUM: `'Male'`, `'Female'`)
- `marital_status` (ENUM: `'Divorced'`, `'Widowed'`, `'Single Parent'`, `'Never Married'`)
- `has_children` (BOOLEAN, DEFAULT FALSE)
- `children_count` (INT, DEFAULT 0)
- `height` (VARCHAR 50)
- `religion` (VARCHAR 50)
- `education` (VARCHAR 255)
- `profession` (VARCHAR 255)
- `income` (VARCHAR 100, NULLABLE)
- `city` (VARCHAR 100)
- `location` (VARCHAR 255)
- `photo_url` (TEXT)
- `photo_privacy` (ENUM: `'PUBLIC'`, `'PRIVATE'`, `'MATCH_ONLY'`)
- `is_verified` (BOOLEAN, DEFAULT FALSE)
- `trust_score` (INT, DEFAULT 80)
- `bio` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### Table: `profile_verifications` (Laravel Model: `App\Models\ProfileVerification`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `profile_id` (BIGINT, FOREIGN KEY -> `profiles.id`)
- `nid_number` (VARCHAR 50)
- `nid_doc_url` (TEXT)
- `status` (ENUM: `'PENDING'`, `'VERIFIED'`, `'REJECTED'`, `'CHANGES_REQUESTED'`)
- `review_notes` (TEXT, NULLABLE)
- `reviewed_by` (BIGINT, FOREIGN KEY -> `admin_users.id`, NULLABLE)
- `reviewed_at` (TIMESTAMP, NULLABLE)

---

## 3. Connections & Matches Domain

### Table: `interests` (Laravel Model: `App\Models\Interest`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `sender_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `receiver_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `status` (ENUM: `'DRAFT'`, `'PAYMENT_PENDING'`, `'SENT'`, `'ACCEPTED'`, `'REJECTED'`, `'EXPIRED'`, `'CANCELLED'`)
- `payment_transaction_id` (VARCHAR 100, NULLABLE)
- `created_at`, `updated_at` (TIMESTAMP)

### Table: `matches` (Laravel Model: `App\Models\MatchModel`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `user_one_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `user_two_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `compatibility_score` (INT)
- `status` (ENUM: `'ACTIVE'`, `'BLOCKED'`, `'ENDED'`)
- `matched_at` (TIMESTAMP)

---

## 4. Communication & Messaging Domain

### Table: `conversations` (Laravel Model: `App\Models\Conversation`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `match_id` (BIGINT, FOREIGN KEY -> `matches.id`)
- `user_one_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `user_two_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `last_message` (TEXT, NULLABLE)
- `last_message_at` (TIMESTAMP, NULLABLE)
- `status` (ENUM: `'ACTIVE'`, `'BLOCKED'`, `'ENDED'`)

### Table: `messages` (Laravel Model: `App\Models\Message`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `conversation_id` (BIGINT, FOREIGN KEY -> `conversations.id`)
- `sender_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `receiver_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `content` (TEXT)
- `type` (ENUM: `'TEXT'`, `'IMAGE'`, `'CONTACT'`, `'SYSTEM'`)
- `media_url` (TEXT, NULLABLE)
- `contact_details` (JSON, NULLABLE)
- `status` (ENUM: `'SENT'`, `'DELIVERED'`, `'READ'`)
- `created_at` (TIMESTAMP)

---

## 5. Payments & Subscriptions Domain

### Table: `membership_plans` (Laravel Model: `App\Models\MembershipPlan`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR 255)
- `price` (DECIMAL 10, 2) — Baseline `৳1,499.00`
- `currency` (VARCHAR 10, DEFAULT `'BDT'`)
- `billing_period` (VARCHAR 50)
- `features` (JSON)
- `status` (ENUM: `'DRAFT'`, `'ACTIVE'`, `'INACTIVE'`)

### Table: `payment_transactions` (Laravel Model: `App\Models\PaymentTransaction`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `transaction_id` (VARCHAR 100, UNIQUE)
- `user_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `purpose` (ENUM: `'subscription'`, `'interest'`)
- `amount` (DECIMAL 10, 2)
- `currency` (VARCHAR 10, DEFAULT `'BDT'`)
- `status` (ENUM: `'PENDING'`, `'SUCCESS'`, `'PAID'`, `'FAILED'`, `'CANCELLED'`, `'REFUNDED'`)
- `gateway` (ENUM: `'MOCK'`, `'SSLCOMMERZ'`)
- `paid_at` (TIMESTAMP, NULLABLE)
- `created_at`, `updated_at` (TIMESTAMP)

---

## 6. Moderation & Audit Domain

### Table: `moderation_reports` (Laravel Model: `App\Models\ModerationReport`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `reporter_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `target_type` (ENUM: `'PROFILE'`, `'MESSAGE'`, `'PHOTO'`)
- `target_id` (BIGINT)
- `reason` (ENUM: `'FAKE_PROFILE'`, `'SCAM'`, `'HARASSMENT'`, `'INAPPROPRIATE_CONTENT'`, `'SPAM'`, `'ABUSE'`, `'OTHER'`)
- `status` (ENUM: `'NEW'`, `'UNDER_REVIEW'`, `'RESOLVED'`, `'DISMISSED'`, `'ESCALATED'`)
- `details` (TEXT)
- `resolved_by` (BIGINT, NULLABLE)
- `resolution_notes` (TEXT, NULLABLE)
- `created_at`, `updated_at` (TIMESTAMP)

### Table: `audit_logs` (Laravel Model: `App\Models\AuditLog`)
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `admin_id` (BIGINT, FOREIGN KEY -> `users.id`)
- `action` (VARCHAR 100)
- `target` (VARCHAR 255)
- `description` (TEXT)
- `ip_address` (VARCHAR 45, NULLABLE)
- `created_at` (TIMESTAMP)
