# Marketplace Web — Project Specification

## 1. Tổng quan dự án

Xây dựng một nền tảng web mua bán hàng hóa theo mô hình Marketplace.

Mục tiêu chính của phiên bản đầu tiên là xây dựng một hệ thống mua bán hàng hóa hoàn chỉnh, có thể:

- Đăng ký / đăng nhập tài khoản
- Quản lý thông tin cá nhân
- Đăng bán sản phẩm
- Tìm kiếm sản phẩm
- Xem chi tiết sản phẩm
- Phân loại sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng
- Theo dõi đơn hàng
- Quản lý sản phẩm đã đăng bán
- Quản lý đơn hàng của người bán
- Đánh giá sản phẩm / người bán
- Quản trị hệ thống

Sau khi Marketplace MVP ổn định, hệ thống sẽ mở rộng thêm:

1. Kết bạn / Follow
2. Chat realtime
3. Thông báo realtime
4. Nghe nhạc
5. Social Feed
6. Các tính năng cộng đồng khác

---

# 2. Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- Tailwind CSS
- Zustand hoặc Context API

## Backend

- Java
- Spring Boot
- Spring Web
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Bean Validation
- Lombok
- Maven

## Database

- PostgreSQL

## ORM

- Hibernate / JPA

## Deployment

Frontend:

- Vercel

Backend:

- Render

Database:

- PostgreSQL

Source code:

- GitHub

---

# 3. Kiến trúc hệ thống

Hệ thống sử dụng kiến trúc Client — REST API — Database.

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ React +          │
                         │ TypeScript       │
                         └────────┬─────────┘
                                  │ HTTPS
                                  │ REST API
                                  ▼
                         ┌──────────────────┐
                         │ Spring Boot      │
                         │ REST API         │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
               PostgreSQL      Security       Services
                                  │
                                  ▼
                             JWT Auth
```

Frontend và Backend phải được tách biệt hoàn toàn.

Frontend không được truy cập trực tiếp Database.

```text
React
  ↓
REST API
  ↓
Spring Boot
  ↓
PostgreSQL
```

---

# 4. Nguyên tắc phát triển

## 4.1. Backend

Backend sử dụng mô hình Layered Architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Không đặt business logic trong Controller.

Controller chỉ chịu trách nhiệm:

- Nhận request
- Validate input cơ bản
- Gọi Service
- Trả response

Service chịu trách nhiệm:

- Business logic
- Transaction
- Kiểm tra quyền
- Xử lý nghiệp vụ

Repository chịu trách nhiệm:

- Database access

---

# 5. Package structure Backend

Dự kiến:

```text
src/main/java/com/example/marketplace/

├── config/
│
├── security/
│
├── common/
│   ├── exception/
│   ├── response/
│   └── util/
│
├── user/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   └── mapper/
│
├── product/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   └── mapper/
│
├── category/
│
├── cart/
│
├── order/
│
├── review/
│
└── admin/
```

Ưu tiên **feature-based package structure** thay vì gom tất cả Controller vào một folder, tất cả Service vào một folder.

---

# 6. Database Design

Database sử dụng PostgreSQL.

Các bảng chính của MVP:

```text
users
roles
user_roles

categories

products
product_images

carts
cart_items

orders
order_items

reviews

addresses

notifications
```

---

# 7. User

## users

Thông tin người dùng.

Các field dự kiến:

```text
id
username
email
password_hash
full_name
avatar_url
phone
status
created_at
updated_at
```

Không lưu password dạng plaintext.

Password phải được hash bằng BCrypt hoặc cơ chế password encoder phù hợp của Spring Security.

---

# 8. Role

Hệ thống có tối thiểu:

```text
USER
ADMIN
```

Sau này có thể mở rộng:

```text
SELLER
MODERATOR
```

Tuy nhiên không cần tạo Seller account riêng trong MVP.

Một USER có thể vừa:

- Mua hàng
- Bán hàng

---

# 9. Authentication

Sử dụng:

```text
Spring Security
+
JWT
```

Flow:

```text
Register
   ↓
Login
   ↓
Spring Security xác thực
   ↓
Generate JWT
   ↓
Frontend lưu authentication state
   ↓
Gửi JWT trong Authorization Header
```

Header:

```text
Authorization: Bearer <token>
```

Các API cần authentication phải kiểm tra JWT.

Các API public:

```text
GET /api/products
GET /api/products/{id}
GET /api/categories
```

Các API protected:

```text
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}

POST /api/cart/items

POST /api/orders

GET /api/me
```

---

# 10. Product

## products

Field dự kiến:

```text
id
seller_id
category_id
name
description
price
stock
status
created_at
updated_at
```

Status:

```text
ACTIVE
INACTIVE
SOLD_OUT
DELETED
```

Seller chỉ được sửa / xóa sản phẩm do chính mình tạo.

Admin có quyền quản lý toàn bộ sản phẩm.

---

# 11. Product Images

Một sản phẩm có thể có nhiều ảnh.

```text
product_images

id
product_id
image_url
display_order
created_at
```

Quan hệ:

```text
Product 1 ─── N ProductImages
```

Không lưu file ảnh trực tiếp vào PostgreSQL.

Chỉ lưu URL.

Có thể sử dụng cloud storage miễn phí / free tier ở giai đoạn MVP.

---

# 12. Category

```text
categories

id
name
description
parent_id
created_at
```

Hỗ trợ category dạng cây.

Ví dụ:

```text
Điện tử
├── Điện thoại
├── Laptop
├── Tablet
└── Phụ kiện

Thời trang
├── Nam
├── Nữ
└── Trẻ em
```

MVP có thể bắt đầu với category đơn giản.

---

# 13. Product Search

Marketplace phải hỗ trợ:

- Search theo tên
- Filter theo category
- Filter theo khoảng giá
- Sort theo giá
- Sort theo thời gian đăng
- Pagination

Ví dụ:

```text
GET /api/products?keyword=iphone
GET /api/products?category=phone
GET /api/products?minPrice=1000000&maxPrice=5000000
GET /api/products?page=0&size=20
```

Không load toàn bộ sản phẩm một lần.

Phải sử dụng pagination.

---

# 14. Cart

Một user có một cart active.

```text
carts

id
user_id
created_at
updated_at
```

Cart item:

```text
cart_items

id
cart_id
product_id
quantity
created_at
updated_at
```

Quan hệ:

```text
User
 ↓
Cart
 ↓
CartItem
 ↓
Product
```

API:

```text
GET    /api/cart

POST   /api/cart/items

PUT    /api/cart/items/{id}

DELETE /api/cart/items/{id}

DELETE /api/cart
```

---

# 15. Order

Khi checkout:

```text
Cart
 ↓
Checkout
 ↓
Create Order
 ↓
Create Order Items
 ↓
Update stock
 ↓
Clear Cart
```

Order:

```text
orders

id
buyer_id
shipping_address_id
total_amount
status
created_at
updated_at
```

Order status:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

Order item:

```text
order_items

id
order_id
product_id
seller_id
product_name
price
quantity
subtotal
```

Quan trọng:

`order_items` phải lưu snapshot của:

```text
product_name
price
```

Không phụ thuộc hoàn toàn vào dữ liệu Product hiện tại.

Ví dụ:

```text
Product hiện tại:
iPhone 15 = 15.000.000

Order cũ:
iPhone 15 = 16.000.000
```

Order cũ vẫn phải giữ nguyên giá lúc mua.

---

# 16. Transaction

Checkout phải chạy trong transaction.

Pseudo flow:

```text
BEGIN TRANSACTION

1. Validate cart
2. Validate product
3. Validate stock
4. Create order
5. Create order items
6. Decrease stock
7. Clear cart

COMMIT
```

Nếu bất kỳ bước nào lỗi:

```text
ROLLBACK
```

Không được xảy ra tình trạng:

```text
Order đã tạo
nhưng stock chưa giảm
```

hoặc:

```text
Stock đã giảm
nhưng order không tồn tại
```

---

# 17. Address

User có thể lưu nhiều địa chỉ.

```text
addresses

id
user_id
recipient_name
phone
province
district
ward
address_detail
is_default
created_at
updated_at
```

MVP có thể chỉ hỗ trợ:

- Thêm địa chỉ
- Sửa địa chỉ
- Xóa địa chỉ
- Chọn địa chỉ mặc định

---

# 18. Review

Sau khi đơn hàng ở trạng thái:

```text
DELIVERED
```

buyer có thể đánh giá sản phẩm.

```text
reviews

id
product_id
user_id
order_item_id
rating
comment
created_at
updated_at
```

Rating:

```text
1 - 5
```

Một `order_item` chỉ được review một lần.

---

# 19. API Design

API sử dụng RESTful convention.

Ví dụ:

```text
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Cart:

```text
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/{id}
DELETE /api/cart/items/{id}
```

Order:

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/{id}
PATCH /api/orders/{id}/status
```

Review:

```text
GET  /api/products/{id}/reviews
POST /api/products/{id}/reviews
```

---

# 20. API Response Format

API nên thống nhất response.

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "message": "Product not found",
  "errors": []
}
```

Không expose exception stack trace cho client production.

---

# 21. Global Exception Handling

Sử dụng:

```text
@RestControllerAdvice
```

Các lỗi cần xử lý:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Ví dụ:

```text
ProductNotFoundException
UserNotFoundException
InsufficientStockException
UnauthorizedException
DuplicateEmailException
```

---

# 22. Frontend Structure

Dự kiến:

```text
src/

├── api/
│
├── components/
│
├── layouts/
│
├── pages/
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Product/
│   ├── Cart/
│   ├── Checkout/
│   ├── Orders/
│   ├── Profile/
│   └── Seller/
│
├── hooks/
│
├── stores/
│
├── types/
│
├── utils/
│
├── routes/
│
└── App.tsx
```

---

# 23. Frontend Pages

## Public

```text
/
Home

/products
Product listing

/products/:id
Product detail

/login
Login

/register
Register
```

## User

```text
/profile
User profile

/cart
Shopping cart

/checkout
Checkout

/orders
My orders

/orders/:id
Order detail

/sell
Create product

/my-products
My products
```

## Admin

```text
/admin
/admin/users
/admin/products
/admin/orders
/admin/categories
```

---

# 24. Homepage

Homepage MVP:

```text
Header
├── Logo
├── Search
├── Categories
├── Login/Profile
└── Cart

Hero / Banner

Categories

Featured Products

Newest Products

Footer
```

Ưu tiên UI đơn giản, responsive và dễ sử dụng.

Không cần làm animation phức tạp ở MVP.

---

# 25. Product Detail

Trang product detail gồm:

```text
Product images

Product name

Price

Stock

Seller information

Description

Quantity selector

Add to cart

Buy now

Reviews
```

Nếu chưa login:

```text
Add to cart
```

có thể yêu cầu login.

---

# 26. Seller

Một user có thể đăng sản phẩm.

Seller dashboard:

```text
My Products

Create Product

Edit Product

Delete Product

Product Stock

Orders containing my products
```

Seller chỉ được truy cập dữ liệu của mình.

---

# 27. Security Rules

Các nguyên tắc bắt buộc:

### User

User chỉ được:

```text
GET own profile
UPDATE own profile
```

### Product

Seller chỉ được:

```text
CREATE product
UPDATE own product
DELETE own product
```

Không được:

```text
UPDATE product của seller khác
DELETE product của seller khác
```

### Order

Buyer chỉ được xem order của mình.

Seller chỉ được xem phần order liên quan tới sản phẩm của mình.

Admin có quyền xem tất cả.

---

# 28. Pagination

Tất cả danh sách có khả năng lớn phải pagination.

Ví dụ:

```text
GET /api/products?page=0&size=20
```

Response:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

Không trả về hàng nghìn record trong một request.

---

# 29. Validation

Backend phải validate request.

Ví dụ:

```text
Product name:
@NotBlank

Price:
@NotNull
@Positive

Stock:
@NotNull
@Min(0)

Email:
@Email

Password:
minimum length
```

Frontend validation chỉ nhằm cải thiện UX.

Backend validation vẫn bắt buộc.

---

# 30. Database Rules

Sử dụng:

```text
Primary Key
Foreign Key
Unique Constraint
Not Null
Index
```

Các field thường xuyên search/filter cần xem xét index.

Ví dụ:

```text
products.category_id
products.seller_id
products.status
products.created_at
users.email
```

Không tạo index một cách tùy tiện.

---

# 31. Environment Variables

Không hard-code:

```text
Database password
JWT secret
API keys
Cloud storage credentials
```

Development:

```text
.env
```

Production:

```text
Render Environment Variables
```

Ví dụ:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET
```

---

# 32. Git Workflow

Repository:

```text
GitHub
```

Branch:

```text
main
develop
feature/*
```

Ví dụ:

```text
feature/authentication
feature/product-api
feature/cart
feature/order
feature/review
```

Commit message nên rõ ràng:

```text
feat: add product creation API
feat: implement JWT authentication
fix: prevent checkout with insufficient stock
refactor: improve product service
```

---

# 33. MVP Development Order

Không phát triển tất cả cùng lúc.

Thứ tự bắt buộc:

## Phase 1 — Project Setup

```text
Spring Boot
React
PostgreSQL
Git
GitHub
```

Thiết lập:

```text
Backend
Frontend
Database
CORS
Environment variables
```

---

## Phase 2 — Authentication

Implement:

```text
Register
Login
JWT
Spring Security
Role
Current user
```

---

## Phase 3 — Category

Implement:

```text
Create category
List category
Update category
Delete category
```

Admin only cho create/update/delete.

---

## Phase 4 — Product

Implement:

```text
Create product
Update product
Delete product
List products
Product detail
Search
Filter
Sort
Pagination
```

---

## Phase 5 — Cart

Implement:

```text
Add product
Update quantity
Remove product
Clear cart
Calculate total
```

---

## Phase 6 — Address

Implement:

```text
Add address
Update address
Delete address
Set default address
```

---

## Phase 7 — Order

Implement:

```text
Checkout
Create order
Create order items
Update stock
Clear cart
Order history
Order detail
Cancel order
```

---

## Phase 8 — Seller

Implement:

```text
Seller dashboard
My products
My orders
Update order status
```

---

## Phase 9 — Review

Implement:

```text
Rating
Comment
Review list
Average rating
```

---

## Phase 10 — Admin

Implement:

```text
User management
Product management
Category management
Order management
```

---

# 34. Testing

Backend cần có test cho các nghiệp vụ quan trọng.

Ưu tiên:

```text
Authentication
Product CRUD
Cart
Checkout
Stock
Authorization
Order
Review
```

Đặc biệt test:

```text
User A không thể sửa Product của User B
```

và:

```text
Không thể checkout khi stock không đủ
```

---

# 35. API Documentation

Sử dụng:

```text
OpenAPI
Swagger UI
```

API phải có documentation rõ ràng.

Mục tiêu:

```text
/api-docs
```

hoặc Swagger UI tương ứng.

---

# 36. Deployment

## Frontend

Deploy:

```text
React
 ↓
Vercel
```

## Backend

Deploy:

```text
Spring Boot
 ↓
Render
```

## Database

Deploy:

```text
PostgreSQL
 ↓
Free-tier PostgreSQL provider
```

Production architecture:

```text
                 Internet
                     │
                     ▼
             ┌──────────────┐
             │    Vercel    │
             │    React     │
             └──────┬───────┘
                    │ HTTPS
                    ▼
             ┌──────────────┐
             │    Render    │
             │ Spring Boot  │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ PostgreSQL   │
             └──────────────┘
```

---

# 37. Future Features

Các tính năng sau KHÔNG thuộc MVP.

Chỉ bắt đầu sau khi Marketplace core ổn định.

## Social / Friendship

```text
Friend request
Accept friend
Remove friend
Follow
Followers
Following
```

Database dự kiến:

```text
friendships
follows
```

---

# 38. Chat

Sau này bổ sung realtime chat.

Technology dự kiến:

```text
WebSocket
Spring WebSocket
STOMP
```

Architecture:

```text
React
   ↓
WebSocket
   ↓
Spring Boot
   ↓
PostgreSQL
```

Có thể bổ sung:

```text
Redis
```

khi cần scale.

Chat features:

```text
1-1 chat
Group chat
Message
Image
File
Read status
Typing status
Online status
```

Không triển khai trong MVP.

---

# 39. Music

Sau khi Marketplace + Social ổn định mới xây Music.

Các chức năng dự kiến:

```text
Music player
Playlist
Favorite
Recently played
Search music
Artist
Album
```

Cần đặc biệt lưu ý bản quyền.

Không tự ý upload hoặc phân phối nhạc có bản quyền.

Nếu triển khai thật, phải sử dụng nguồn nội dung có quyền sử dụng hợp pháp hoặc API/dịch vụ được cấp phép.

---

# 40. Social Feed

Sau này có thể xây:

```text
Posts
Likes
Comments
Shares
Friends
Following
```

Homepage có thể trở thành:

```text
Marketplace
+
Social Feed
```

---

# 41. Redis — Future

Không cần Redis trong MVP.

Chỉ thêm Redis khi có nhu cầu thực tế:

```text
Caching
Session
Rate limiting
Online status
Chat
Pub/Sub
```

MVP ưu tiên:

```text
Spring Boot
+
PostgreSQL
```

để giảm độ phức tạp.

---

# 42. Performance

MVP cần đảm bảo:

- Pagination
- Database indexing hợp lý
- Không N+1 query
- Lazy/Eager relationship được sử dụng có chủ đích
- DTO thay vì expose Entity trực tiếp
- Không query database không cần thiết
- Image URL thay vì lưu binary image trong DB

---

# 43. DTO

Không trả Entity trực tiếp từ Controller.

Không làm:

```text
return productRepository.findById(id);
```

theo kiểu expose trực tiếp Entity.

Nên:

```text
Entity
 ↓
Mapper
 ↓
DTO
 ↓
Response
```

Ví dụ:

```text
ProductEntity
ProductResponseDTO
CreateProductRequest
UpdateProductRequest
```

---

# 44. Business Rules

## Product

```text
price > 0
stock >= 0
seller phải tồn tại
category phải tồn tại
```

## Cart

```text
quantity > 0
quantity <= stock
```

## Checkout

```text
cart không được empty
stock phải đủ
address phải hợp lệ
```

## Review

```text
Chỉ buyer đã mua sản phẩm mới được review.
Chỉ review sau khi order DELIVERED.
Mỗi order item chỉ được review một lần.
rating từ 1 đến 5.
```

---

# 45. Definition of Done — MVP

MVP được coi là hoàn thành khi user có thể thực hiện flow:

```text
Register
   ↓
Login
   ↓
Browse products
   ↓
Search / Filter
   ↓
Product detail
   ↓
Add to cart
   ↓
Manage cart
   ↓
Add shipping address
   ↓
Checkout
   ↓
Create order
   ↓
View order
   ↓
Seller receives order
   ↓
Seller updates status
   ↓
Order delivered
   ↓
Buyer reviews product
```

Đây là flow quan trọng nhất của project.

---

# 46. AI Development Rules

AI khi hỗ trợ phát triển project phải tuân thủ:

1. Không tự ý thay đổi architecture nếu chưa được yêu cầu.
2. Không thêm dependency nếu không cần thiết.
3. Ưu tiên Spring Boot best practices.
4. Không expose database entity trực tiếp ra API.
5. Không hard-code secret.
6. Không bỏ qua validation.
7. Không bỏ qua authorization.
8. Không viết business logic trong Controller.
9. Không tạo API trùng chức năng.
10. Không phá vỡ API hiện tại khi thêm feature.
11. Mỗi feature nên có:
   - Entity
   - Repository
   - Service
   - Controller
   - DTO
   - Validation
   - Exception handling
12. Với nghiệp vụ quan trọng phải xem xét transaction.
13. Ưu tiên code dễ đọc hơn code quá phức tạp.
14. Chỉ tối ưu performance khi có lý do cụ thể.
15. Không thêm Redis, Kafka, Microservices hoặc các công nghệ phức tạp vào MVP nếu chưa có nhu cầu.

---

# 47. AI Coding Workflow

Khi được yêu cầu implement một feature, AI phải làm theo thứ tự:

```text
1. Phân tích requirement
        ↓
2. Kiểm tra architecture hiện tại
        ↓
3. Kiểm tra database model
        ↓
4. Xác định API cần thêm/thay đổi
        ↓
5. Implement Backend
        ↓
6. Implement Frontend
        ↓
7. Validation
        ↓
8. Error handling
        ↓
9. Security / Authorization
        ↓
10. Test
        ↓
11. Update documentation
```

Không viết code ngay nếu requirement còn mơ hồ và có khả năng gây thay đổi lớn đến architecture.

---

# 48. Development Priority

Luôn ưu tiên:

```text
Correctness
   ↓
Security
   ↓
Maintainability
   ↓
Performance
   ↓
UI polish
```

Không hy sinh security hoặc data integrity để làm UI nhanh hơn.

---

# 49. Current Scope

## Đang làm

```text
Marketplace
Authentication
User
Category
Product
Cart
Address
Order
Seller
Review
Admin
```

## Chưa làm

```text
Friend
Chat
Realtime notification
Music
Social feed
Redis
Microservices
Payment gateway
Recommendation system
```

Những tính năng chưa làm sẽ được phát triển sau khi MVP hoàn thành.

---

# 50. Long-term Vision

Mục tiêu cuối cùng là phát triển Marketplace thành một nền tảng kết hợp:

```text
Marketplace
      +
Social Network
      +
Chat
      +
Music
```

Tuy nhiên hệ thống phải được xây dựng theo hướng **modular**, để các tính năng tương lai có thể được thêm vào mà không phải rewrite toàn bộ hệ thống.

Kiến trúc MVP phải đủ đơn giản để một Fresher có thể hiểu và maintain, nhưng đủ tốt để mở rộng trong các phase tiếp theo.