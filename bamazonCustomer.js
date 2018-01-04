const mysql = require("mysql");
const inquirer = require("inquirer");

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
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

let start = function() {
    //console.log("SQL Connection Established")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(" - - - - - - - - - - - - - - - ");
            console.log("item number: " + res[i].item_id);
            console.log("item: " + res[i].product_name);
            console.log("price: $" + res[i].price);
            //console.log(" - - - - - - - - - - - - - - - ")
        }
        connection.end();
    });
};

// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.';
    }
}

function purchase() {
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
            let item = purchase.item_id;
            let quantity = purchase.quantity;

            let queryStr = 'SELECT * FROM products WHERE ?';

            connection.query(queryStr, { item_id: item }, function(err, data) {
                if (err) throw err;


            })


        });
};