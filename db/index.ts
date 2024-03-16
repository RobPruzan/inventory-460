import { Client } from 'pg';

const client = new Client({
  connectionString: "postgresql://inventory_user:inventory_password@localhost:5432/inventory_db"
});

type ProductCategory = {
  ProductCategoryID: number;
  CategoryName: string;
}

type Supplier = {
  SupplierID: number;
  SupplierName: string;
  ContactName?: string;
  PhoneNumber?: string;
  Address?: string;
}

type Product = {
  ProductID: number;
  ProductName: string;
  ProductCategoryID: number;
}

type Warehouse = {
  WarehouseID: number;
  WarehouseName: string;
  Location: string;
  ManagerEmployeeID?: number;
}

type Employee = {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  Position?: string;
  Email?: string;
  ManagerID?: number;
  WorkingWarehouseID?: number;
}

type Inventory = {
  ProductID: number;
  WarehouseID: number;
  QuantityAvailable: number;
}

type Customer = {
  CustomerID: number;
  CustomerName: string;
  ContactName?: string;
  PhoneNumber?: string;
  Address?: string;
}

type Order = {
  OrderID: number;
  CustomerID: number;
  OrderDate: Date;
  ShipmentDate?: Date;
  Status: string;
}

type OrderDetail = {
  OrderID: number;
  ProductID: number;
  Quantity: number;
  UnitPrice: number;
}

type SupplierProduct = {
  SupplierID: number;
  ProductID: number;
  Price: number;
  DeliveryTimeDays: number;
}

(async () => {
  try {
    console.log('start');
    await client.connect();

    // Create tables
    await client.query(`
      CREATE TABLE ProductCategories (
        ProductCategoryID SERIAL PRIMARY KEY,
        CategoryName VARCHAR(255) NOT NULL
      );

      CREATE TABLE Suppliers (
        SupplierID SERIAL PRIMARY KEY,
        SupplierName VARCHAR(255) NOT NULL,
        ContactName VARCHAR(255),
        PhoneNumber VARCHAR(20),
        Address TEXT
      );

      CREATE TABLE Products (
        ProductID SERIAL PRIMARY KEY,
        ProductName VARCHAR(255) NOT NULL,
        ProductCategoryID INT NOT NULL REFERENCES ProductCategories(ProductCategoryID)
      );

      CREATE TABLE Warehouses (
        WarehouseID SERIAL PRIMARY KEY,
        WarehouseName VARCHAR(255) NOT NULL,
        Location TEXT NOT NULL,
        ManagerEmployeeID INT
      );

      CREATE TABLE Employees (
        EmployeeID SERIAL PRIMARY KEY,
        FirstName VARCHAR(255) NOT NULL,
        LastName VARCHAR(255) NOT NULL,
        Position VARCHAR(255),
        Email VARCHAR(255),
        ManagerID INT REFERENCES Employees(EmployeeID),
        WorkingWarehouseID INT REFERENCES Warehouses(WarehouseID)
      );

      ALTER TABLE Warehouses
      ADD CONSTRAINT FK_Warehouses_ManagerEmployeeID FOREIGN KEY (ManagerEmployeeID) REFERENCES Employees(EmployeeID);

      CREATE TABLE Inventory (
        ProductID INT NOT NULL REFERENCES Products(ProductID),
        WarehouseID INT NOT NULL REFERENCES Warehouses(WarehouseID),
        QuantityAvailable INT NOT NULL,
        PRIMARY KEY (ProductID, WarehouseID)
      );

      CREATE TABLE Customers (
        CustomerID SERIAL PRIMARY KEY,
        CustomerName VARCHAR(255) NOT NULL,
        ContactName VARCHAR(255),
        PhoneNumber VARCHAR(20),
        Address TEXT
      );

      CREATE TABLE Orders (
        OrderID SERIAL PRIMARY KEY,
        CustomerID INT NOT NULL REFERENCES Customers(CustomerID),
        OrderDate DATE NOT NULL,
        ShipmentDate DATE,
        Status VARCHAR(50) NOT NULL
      );

      CREATE TABLE OrderDetails (
        OrderID INT NOT NULL REFERENCES Orders(OrderID),
        ProductID INT NOT NULL REFERENCES Products(ProductID),
        Quantity INT NOT NULL,
        UnitPrice NUMERIC(10, 2) NOT NULL,
        PRIMARY KEY (OrderID, ProductID)
      );

      CREATE TABLE SupplierProducts (
        SupplierID INT NOT NULL REFERENCES Suppliers(SupplierID),
        ProductID INT NOT NULL REFERENCES Products(ProductID),
        Price NUMERIC(10, 2) NOT NULL,
        DeliveryTimeDays INT NOT NULL,
        PRIMARY KEY (SupplierID, ProductID)
      );
    `);

    await client.end();
    console.log('end');
  } catch (err) {
    console.error('An error occurred:', err);
  }
})();