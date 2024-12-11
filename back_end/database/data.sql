-- 插入 customers 数据
INSERT INTO customers (first_name, last_name, email, date_joined)
VALUES
('John', 'Doe', 'john.doe@example.com', '2023-01-15'),
('Jane', 'Smith', 'jane.smith@example.com', '2023-02-25'),
('Alice', 'Johnson', 'alice.johnson@example.com', '2023-03-10');

-- 插入 products 数据
INSERT INTO products (product_name, price, stock_quantity)
VALUES
('Laptop', 999.99, 50),
('Smartphone', 599.99, 150),
('Headphones', 49.99, 200),
('Monitor', 299.99, 30);

-- 插入 orders 数据
INSERT INTO orders (customer_id, order_date, total_amount)
VALUES
(1, '2023-04-01', 1200.00),
(2, '2023-04-02', 650.00),
(3, '2023-04-03', 400.00);

-- 插入 order_items 数据
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
(1, 1, 1, 999.99),
(1, 3, 2, 49.99),
(2, 2, 1, 599.99),
(3, 4, 1, 299.99);
