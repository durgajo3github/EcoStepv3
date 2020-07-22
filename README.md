# EcoStepApp for API Hackathon 21-Jul-2020
# Getting started
	1.Clone this repository
	2.Run npm install to install dependencies
	3.Edit config.json (see Configuration)
	4.Run npm start to fetch carbon footprint details for customer accounts (see Running the app)
# Running the app
	1.Run npm run start
	2.Browse to http://localhost:8080
	3.Press Get Carbon FootPrint button to fetch details
	4.Click on transactions hyperlink to get the transactions that contributed to carbon footprint calculation

# Configuration
	1.The config.json file needs to contain some key information to allow the example app to communicate with the sandbox api:
	2.Enter the Client ID and Client Secret from the Credentials section of your app's page (dashboard -> EcoStepApp-... -> Credentials)
	3.Enter the Domain from the Team Information section of your team's page (dashboard ->EcoStepApp-team-... -> Team Information)

# docker
	1.This repository contains the dockerfile for: docker build
	2.Image location durgajo3docker/ecostepapp_nodejs:ecostepimage for : docker pull
	

© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
