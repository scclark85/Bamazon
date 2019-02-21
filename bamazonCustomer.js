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

var userItem;
var userUnits;
var userPrice;

// starts the app and runs the prompt questions
function runApp() {
    console.log("__________________________________________________________________________\n");
    console.log("         Welcome To Bamazon!  Check out whats available below:")
    console.log("__________________________________________________________________________\n");
    queryStr = "SELECT * FROM bamazon_DB.products";

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.table(data);
        // for (var i = 0; i < data.length; i++) {
        //     console.log("ID: " + data[i].item_id + " | " + "Product: " + data[i].product_name + " | " + "Department: " + data[i].department_name + " | " + "Price: " + data[i].price + " | " + "QTY: " + data[i].stock_quantity);

        // }

        // function will ask user questions after the items display giving them a choice
        function userPurchase() {
            inquirer.prompt([
                {
                    name: "item_id",
                    type: "input",
                    message: "Please enter the ID of the product you would like to purchase.",
                    filter: Number,
                    validate: function (value) {
                        if (isNaN(value) == false && parseInt(value) <= data.length && parseInt(value) > 0) {
                            return true;
                        } else {
                            console.log("  Please select an ID between 1-13.");
                            return false;
                        }
                    }
                },
                {
                    name: "stock_quantity",
                    type: "input",
                    message: "How many would you like to purchase?",
                    filter: Number,
                    validate: function (value) {
                        if (isNaN(value)) {
                            console.log("  Invalid.  Must enter a number only.")
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            ]).then(function (input) {
                userItem = input.item_id;
                userUnits = input.stock_quantity;
                checkAvailable();
            });
        }
        userPurchase();

        function checkAvailable() {
            connection.query("SELECT * FROM products WHERE ?", [

                { item_id: userItem }], function (err, data) {
                    console.log(data);
                    if (err) throw err;

                    if (userUnits <= data[0].stock_quantity) {
                        console.log("Item is available.  We are prepairing your order.");

                        // updating the string
                        var updateQueryStr = "UPDATE products SET stock_quantity = " + (data[0].stock_quantity - userUnits) + " WHERE item_id = " + userItem;

                        // Will update the inventory
                        connection.query(updateQueryStr, function (err, updatedata) {
                            userPrice = parseFloat(data[0].price);
                            if (err) throw err;
                            console.log("Your total is $" + userPrice * userUnits);
                            console.log("Thank you for shopping with us!");
                            userPurchase();
                        })
                    }
                    else if (data[0].stock_quantity < userUnits) {
                        console.log("Insufficient Quantity");
                        console.log("Please modify your order.")
                        userPurchase();

                    }

                }
            )
        }
    })
}
runApp();






