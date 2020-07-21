
const colors = require('colors/safe');
const express = require ("express");
const path = require("path");


const ConfigError = require('./config-error');
const config = require('./config.json');

const {
	retrieveAccessToken,
	createAccountAccessConsent,
	authoriseProgramatically,
	authoriseManually,
	getAccounts,
	getTransactions
} = require('./api');

const app = express();

app.use(express.static(path.join(__dirname,"public")));

app.get("/carbonfootprint", (req, res) => authoriseAndGetAccounts (req, res)) ;

app.get("/transactions/:category", (req, res) => getCategoryTransactions (req, res));
 	
app.listen(8080, ()=> console.log ("EcoStep application listening on port 8080"));

/** Functions used */

async function authoriseAndGetAccounts(req, res) {
	try {
		console.log('Getting initial access token...');
		const accessToken = await retrieveAccessToken();

		console.log(`Access Token: ${format(accessToken)}. Creating consent...`);
		const consentId = await createAccountAccessConsent(accessToken);

		console.log(`Consent ID: ${consentId}. Authorising...`);
		const authorisationCode = await authoriseProgramatically(consentId);

		console.log(`Authorisation code received: ${format(authorisationCode)}. Retrieving authorised access token...`);
		const authorisedAccessToken = await retrieveAccessToken(authorisationCode);

		console.log(`Access Token: ${format(authorisedAccessToken)}. Retrieving users accounts...`)
		const accounts = await getAccounts(authorisedAccessToken);
		
		
		console.log('Transactions for:', accounts[0].AccountId);

		const transactions = await getTransactions(authorisedAccessToken, accounts[0].AccountId);
		
		/** Filter all debit transactions */
		let debitTransactions = transactions.filter( 
									(element)=> {
										let indicator = element.CreditDebitIndicator;
										if ( "Debit" == indicator)
											return element ;
									}
								);
		
		
		/* Check for Travel */
		
		let travelCarbonValue = calculateCarbonCredit(debitTransactions, config.Category.Travel) ;
		travelCarbonValue.category ="Travel" ;
	
		/* Check for Home */

		let homeCarbonValue = calculateCarbonCredit(debitTransactions, config.Category.Home) ;
		homeCarbonValue.category = "Home";

		/* Check for Food */

		let foodCarbonValue = calculateCarbonCredit(debitTransactions, config.Category.Food) ;
		foodCarbonValue.category = "Food";
		
		let results = new Array();

		results.push(travelCarbonValue) ;
		results.push(homeCarbonValue) ;
		results.push(foodCarbonValue) ;

	  	res.send(results);
			
	} catch (error) {
		if (error instanceof ConfigError)
			console.log('Configuration error: ', error.message);
		else
			throw error;
	}
}

function calculateCarbonCredit (transactions, configparams){
		
	let carbonPTransactions = transactions.filter(
		(element)=> {
			let trandesc = element.TransactionInformation;
			if (configparams.CarbonPositive.includes(trandesc)){
				return element;
			}
		}
	)

	let carbonNTransactions = transactions.filter(
		(element)=> {
			let trandesc = element.TransactionInformation;
			if (configparams.CarbonNegative.includes(trandesc)){
				return element;
			}
		}
	)

	/** Update the Carbon Value */

	let PCarbonValue = carbonPTransactions.reduce (
			(totvalue, element)=> {
				totvalue = totvalue + parseInt(element.Amount.Amount);
				return totvalue;
			}
			,0 //Initial value
	)

	let NCarbonValue = carbonNTransactions.reduce (
		(totvalue, element)=> {
			totvalue = totvalue + parseInt(element.Amount.Amount);
			return totvalue;
		}
		,0 //Initial value
	)

	console.log(' Carbon Credit:', PCarbonValue - NCarbonValue);

	let netValue  = PCarbonValue - NCarbonValue;
	let totalTransactions = carbonPTransactions.length + carbonNTransactions.length ;

	return { "carbonFootprint":netValue , "transactions":totalTransactions};
}

function format(item) {
	return colors.magenta(item.length > 50
		? (item.substring(0, 50) + '…')
		: item);
}

// '/transactions/:category' is the URL 

async function getCategoryTransactions(req, res) {
	try {
		
		let category = "Travel" ;//Default to travel 
		
		category = req.params.category;  //Copy from route parameters

		console.log('Getting initial access token...');
		const accessToken = await retrieveAccessToken();

		console.log(`Access Token: ${format(accessToken)}. Creating consent...`);
		const consentId = await createAccountAccessConsent(accessToken);

		console.log(`Consent ID: ${consentId}. Authorising...`);
		const authorisationCode = await authoriseProgramatically(consentId);

		console.log(`Authorisation code received: ${format(authorisationCode)}. Retrieving authorised access token...`);
		const authorisedAccessToken = await retrieveAccessToken(authorisationCode);

		console.log(`Access Token: ${format(authorisedAccessToken)}. Retrieving users accounts...`)
		const accounts = await getAccounts(authorisedAccessToken);
		
		
		console.log('Transactions for:', accounts[0].AccountId);

		const transactions = await getTransactions(authorisedAccessToken, accounts[0].AccountId);
		
		/** Filter all debit transactions */
		let debitTransactions = transactions.filter( 
									(element)=> {
										let indicator = element.CreditDebitIndicator;
										if ( "Debit" == indicator)
											return element ;
									}
								);

		/** Filter all category transaction */
		
		let configObject = eval(`config.Category.${category}`);

		let categoryTransactions = debitTransactions.filter( 
			(element)=> {
				let trandesc = element.TransactionInformation;

				if (configObject.CarbonNegative.includes(trandesc)
					||configObject.CarbonPositive.includes(trandesc)){
						return element;
				}
			}
		);
		
		return  res.send(categoryTransactions);

	}catch (error) {
		if (error instanceof ConfigError)
			console.log('Configuration error: ', error.message);
		else
			throw error;
	}
}
