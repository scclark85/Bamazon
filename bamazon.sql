DROP DATABASE IF EXISTS bamazon_DB;

-- creating the database  
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

-- table called products that will store the inventory
CREATE TABLE products(
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(10)NOT NULL,
  PRIMARY KEY (item_id)
);

-- selects data from database and moves it into the table
SELECT * FROM bamazon_DB.products;

-- products that will go into the table 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Crest", "Personal Care", 5.88, 500),
	   ("Hersheys", "Grocery", 9.48, 800),
       ("Bananas", "Produce", .22, 600), 
       ("Allied", "Entertainment", 13.99, 120),
       ("Pantene Shampoo", "Personal Care", 6.17, 300),
       ("Pantene Conditioner", "Personal Care", 6.17, 300),
       ("L'Oreal Mascara", "Beauty", 6.69, 550),
       ("Wellness Dog Food", "pet", 15.19, 350),
       ("Wellness Cat Food", "pet", 13.22, 425),
       ("Nike Socks", "Clothing", 8.34, 700),
       ("Band-Aid", "Pharmacy", 3.97, 783),
       ("Huggies Diapers", "Children", 1.87, 1000),
       ("Yoga Mat", "Sports", 18.64, 300);