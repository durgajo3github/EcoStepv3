
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

 app.get("/carbonfootprint", (req, res) => {
	authoriseAndGetAccounts (req, res, false) ;

});

app.listen(8080);


async function authoriseAndGetAccounts(req, res, manualAuthorisation = false) {
	try {
		console.log('Getting initial access token...');
		const accessToken = await retrieveAccessToken();

		console.log(`Access Token: ${accessToken}. Creating consent...`);
		const consentId = await createAccountAccessConsent(accessToken);

		console.log(`Consent ID: ${consentId}. Authorising...`);
		const authorisationCode = manualAuthorisation
			? await startManualAuthorisation(consentId)
			: await authoriseProgramatically(consentId);

		console.log(`Authorisation code received: ${authorisationCode}. Retrieving authorised access token...`);
		const authorisedAccessToken = await retrieveAccessToken(authorisationCode);

		console.log(`Access Token: ${authorisedAccessToken}. Retrieving users accounts...`);
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
	
		/* Check for Home */

		let homeCarbonValue = calculateCarbonCredit(debitTransactions, config.Category.Home) ;

		/* Check for Food */

		let foodCarbonValue = calculateCarbonCredit(debitTransactions, config.Category.Food) ;
		
		let results = new Array();

		results.push({ "category":"Travel", "carbonFootprint":travelCarbonValue}) ;
		results.push({ "category":"Food", "carbonFootprint":homeCarbonValue}) ;
		results.push({ "category":"Home", "carbonFootprint":foodCarbonValue}) ;

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

	return PCarbonValue - NCarbonValue;



}
