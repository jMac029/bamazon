const mysql = require("mysql")
const inquirer = require("inquirer")

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err
        // run the start function after the connection is made to prompt the user
    displayInventory()
});

let displayInventory = () => {
    //console.log("SQL Connection Established")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            console.log(" - - - - - - - - - - - - - - - ")
            console.log("item number: " + res[i].item_id)
            console.log("item: " + res[i].product_name)
            console.log("price: $" + res[i].price)
                //console.log(" - - - - - - - - - - - - - - - ")
        }
        //connection.end();
        purchase()
    })
};

// validateInput makes sure that the user is supplying only positive integers for their inputs
let validateInput = (value) => {
    var integer = Number.isInteger(parseFloat(value))
    var sign = Math.sign(value)

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.'
    }
}

let purchase = () => {
    inquirer.prompt([{
                type: "input",
                name: "item_id",
                message: "Select the item you would like to purchase by item number.",
                validate: validateInput,
                filter: Number
            },
            {
                type: "input",
                name: "quantity",
                message: "How many of this item would you like to purchase?",
                validate: validateInput,
                filter: Number
            }
        ])
        .then(function(purchase) {
            let item = purchase.item_id
            let quantity = purchase.quantity

            let queryStr = 'SELECT * FROM products WHERE ?';

            connection.query(queryStr, { item_id: item }, function(err, res) {
                if (err) throw err

                if (res.length === 0) {
                    console.log("ERROR: Invalid Item ID. Please select a valid Item ID.")
                    displayInventory()
                } else {

                    let productInfo = res[0]

                    if (quantity <= productInfo.stock_quantity) {
                        console.log(productInfo.product_name + "is in stock! Placing order now!")

                        // Construct the updating query string
                        var updateQueryStr = "UPDATE products SET stock_quantity = " + (productInfo.stock_quantity - quantity) + " WHERE item_id = " + item
                            // console.log('updateQueryStr = ' + updateQueryStr);

                        // Update the inventory
                        connection.query(updateQueryStr, function(err, data) {
                            if (err) throw err;

                            console.log("Your oder has been placed!");
                            console.log("Your total is $" + productInfo.price * quantity)
                            console.log("Thank you for shopping with bamazon!")
                            console.log("\n---------------------------------------------------------------------\n")

                            // End the database connection
                            connection.end();
                        })
                    } else {
                        console.log("Sorry, there is not enough" + productInfo.product_name + " in stock, your order can not be placed as is.")
                        console.log("Please modify your order or select another item.")
                        console.log("\n---------------------------------------------------------------------\n")

                        displayInventory()
                    }


                }
            })


        })
}