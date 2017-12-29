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
    console.log("SQL Connection Established")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res)
        connection.end();
    });
};