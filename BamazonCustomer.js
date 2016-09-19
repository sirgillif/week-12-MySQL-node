/**
 * Created by Patrick
 *
 * running this application will
 * 1. display all of the items available for sale.
 *  *    Include the ids, names, and prices of products for sale.
 * 2. The app should then prompt users with two messages.
 * * The first should ask them the ID of the product they would like to buy.
 * * The second message should ask how many units of the product they would like to buy.
 *
 * 3. Once the customer has placed the order, your application should check if your store has enough of the product
 * to meet the customer's request.
 * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
 * 4. However, if your store *does* have enough of the product, you should fulfill the customer's order.
 * This means updating the SQL database to reflect the remaining quantity.
 * Once the update goes through, show the customer the total cost of their purchase.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root", //Your username
	password: "heLL@Wo Rld", //Your password
	database: "bamazon"
});
connection.connect(function(err) {
	if (err) throw err;
	//console.log("connected as id " + connection.threadId);
});
var idList=[];
function start() {
	connection.query('SELECT * FROM products', function (err, res) {
		if (err) throw err;
		for (var id=0;id<res.length;id++) {
			console.log("Product #"+res[id].ItemId+": "+res[id].ProductName+" Price: $"+res[id].Price);
			idList.push(res[id].ItemId.toString());
		}
		questions();
	});
}

function questions() {
	var inquirer=require('inquirer');

	// for(var i=0;i<idList.length;i++) {
	// 	console.log(idList[i]);
	// }
	inquirer.prompt([
		{
			type:"rawlist",
			name:"product",
			message:"Please choose a product that you'd like to purchase",
			choices:idList,
		},
		{
			type: "input",
			name: "quantRequest",
			message: "Enter the number of copies you would like to purchase.",
			validate: function (value) {
				var validInputs = /^[0-9]+$/i;
				if(value.length>=1&&validInputs.test(value)) {
					return true;
				}
				else{
					return "Please enter the number of copies you you like."
				}
			}
		}

	]).then(function(answer){
		console.log(answer.product);
		console.log(answer.quantRequest);
		var query="SELECT products.* FROM products WHERE products.ItemId =" + answer.product;
		connection.query(query, function (err, res) {
			if (err) throw err;

			if(answer.quantRequest<=res[0].StockQuantity)
			{
				console.log("buy it")
			}
			else{
				console.log("cant buy it");
			}

		});
	});
}
start();
