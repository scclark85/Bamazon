var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_DB"
});

function start() {
    inquirer.prompt([
        {
            name: "goTo",
            type: "list",
            message: "Please choose what you would like to do.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (action) {
        const goTo = action.goTo;

        switch (goTo) {
            case "View Products for Sale":
                console.log("We made it!");
                viewProducts(goTo);
                break;

            case "View Low Inventory":
                lowInventory(goTo);
                break;

            case "Add to Inventory":
                addInventory(goTo);
                break;

            case "Add New Product":
                addProduct(goTo);
                break;
        };

    });
}

// view products for sale
function viewProducts() {
    queryStr = "SELECT * FROM bamazon_DB.products";

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.table(data);

        start();
    })
}


// view low inventory
function lowInventory() {
    queryStr = "SELECT * FROM bamazon_DB.products";

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        for (var i = 0; i < data.length; i++) {
            if (data[i].stock_quantity < 5) {
                console.log("ID: " + data[i].item_id + " | " + "Product Name: " + data[i].product_name + " | " + "Department: " + data[i].department_name + " | " + "Price: " + data[i].price);
                console.log("\n");
            }
            else if (data[i].stock_quantity > 5) {
                console.log("ID: " + data[i].item_id + " | " + data[i].product_name + " - " + "quantity is above 5.")
            }
        }
        start();
    })

}

// add to inventory
function addInventory() {
    queryStr = "SELECT * FROM bamazon_DB.products";

    connection.query(queryStr, function (err, data) {
        if (err) throw err;
        var itemArray = [];
        //pushes each item into an itemArray
        for (var i = 0; i < data.length; i++) {
            itemArray.push(data[i].product_name);
        }

        inquirer.prompt([{
            type: "list",
            name: "product",
            choices: itemArray,
            message: "Which item would you like to add inventory?"
        }, {
            type: "input",
            name: "qty",
            message: "How much would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) { return true; }
                else { return false; }
            }
        }]).then(function (ans) {
            var currentQty;
            for (var i = 0; i < data.length; i++) {
                if (data[i].product_name === ans.product) {
                    currentQty = data[i].stock_quantity;
                }
            }
            connection.query("UPDATE bamazon_DB.products SET ? WHERE ?", [
                { stock_quantity: currentQty + parseInt(ans.qty) },
                { product_name: ans.product }
            ], function (err, data) {
                if (err) throw err;
                console.log("The quantity was updated.");
                start();
            });
        })
    })
}

// add new product
function addProduct() {
    queryStr = "SELECT * FROM bamazon_DB.products";

    connection.query(queryStr, function (err, data) {
        if (err) throw err;
        var departArray = [];
        //pushes each item into an itemArray
        for (var i = 0; i < data.length; i++) {
            departArray.push(data[i].department_name);
        }

        inquirer.prompt([{
            type: "input",
            name: "product",
            message: "Product: ",
            validate: function (value) {
                if (value) { return true; }
                else { return false; }
            }
        },
        {
            type: "list",
            name: "department",
            message: "Department: ",
            choices: departArray
        },
        {
            type: "input",
            name: "Price: ",
            message: "Price",
            validate: function (value) {
                if (isNaN(value) === false) { return true; }
                else { return false; }
            }
        },
        {
            type: "input",
            name: "Quantity: ",
            message: "Quantity",
            validate: function (value) {
                if (isNaN(value) === false) { return true; }
                else { return false; }
            }
        }]).then(function (ans) {
            connection.query("INSERT INTO bamazon_DB.products SET ? ", {
                product_name: ans.product,
                department_name: ans.department,
                price: ans.price,
                stock_quantity: ans.quantity
            }, function (err, data) {
                if (err) throw err;
                console.log("Another item was added to the store.");
            })
        })

    });
}
start();