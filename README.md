# EcoStepApp
EcoStepApp for API Hackathon 21-Jul-2020
Getting started
Clone this repository
Run npm install to install dependencies
Edit config.json (see Configuration)
Enter the Client ID and Client Secret from the Credentials section of your app's page (dashboard -> EcoStepApp-... -> Credentials)
Enter the Domain from the Team Information section of your team's page (dashboard ->EcoStepApp-team-... -> Team Information)

Run npm start to fetch carbon footprint details for customer accounts (see Running the app)
Running the app
Run npm run start

Browse to http://localhost:8080
Press Get Carbon FootPrint button to fetch details

Configuration
The config.json file needs to contain some key information to allow the example app to communicate with the sandbox api:

clientId & clientSecret: these keys need to match the app configuration. They are sent to the sandbox's API during the authentication process.
teamDomain: this domain needs to match the domain specified in the team configuration. For a WebApp this should be the domain that the app is hosted on to allow redirection after manual authentication. For a CLI app it can just be a fake domain.
customerNumber: this is the customer whose account information you wish to request. 
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
