# Preparation


* Postman (Desktop if possible): https://winter-water-5421-2.postman.co/workspace/2025-Auth%253A-A-Practical-Approach~cbdc5b60-f2e5-430c-b268-46f5a2728810/overview
* Remove:
  * Clear Postman environment variables: 
    * ALP: username, password, portal-url
    * Enterprise and Online: username, password, portal-url, client_id, client_secret
  * Delete feature layer `New_service_from_REST_JS` in three accounts (AGOL, ALP, Enterprise) (**including recycle bin**)
  
* Connect to VPN
* Run `npm start` in `arcgis-token-testing-lab` 
* Open:
  2025-Auth%253A-A-Practical-Approach~cbdc5b60-f2e5-430c-b268-46f5a2728810/overview
  * Open/Create three **group tabs** -> Open "DSEU25: A Practical Approach to Security in ArcGIS" folder in three products:
    * **ArcGIS Enterprise**: DevExp Enterprise: 
      * https://rextdevxlnx01pt.esri.com/portal/home/content.html
      * https://rextdevxlnx01pt.esri.com/portal/home/organization.html#overview
    * **ArcGIS Online**: 
      * https://arcgis-devlabs.maps.arcgis.com/home/content.html
      * Member roles: https://arcgis-devlabs.maps.arcgis.com/home/organization.html?tab=memberRoles#settings
    * **ArcGIS Location Platform**:  <--- geodata
      * https://geodataproviderg.maps.arcgis.com/home/content.html?sortField=modified&sortOrder=desc&view=table&folder=252a8e4e6c8b4f488c103eee191ffa68#my
  * Review client IDs:
    * Redirect URL: https://www.rauljimenez.info/arcgis-oauth-callback/
    * Enterprise Privileges:
      * Personal (All)?? Geocoding & Content creation

# Demos

## Demo 0: The tools

* Postman to see raw request to API REST to understand enpoints, flows and get tokens
* Test lab to try to execute tasks with these tokens easily acrosss products (REST JS)

* Show postman
  1. Show environment variables:
      * ALP, Online and Enterprise; Just -> username, password, portal-url
  1. Show I'm using postman scripts to storing and saving enviroment variables
  1. Run: Direct -> Test credentials -> User self
      * Show two ways of sending the token: X-Esri-Authorization and  Query Params
      * Show that it return basic public information
* Show Test lab code      

## Demo 1: Create token with user and pass (Enterprise)

* Explain use cases & security concerns
* Get token with User & Pass (with three products)
* Show test lab code
* Run Enterprise (check how it fails for geocoding & create the layer)

## Demo 2: Create API key in ALP test in  (ALP)

* Explain use cases & security concerns
* Create API Key in ALP
* Show test lab code
* Geocode and create layers
* Rotate
* Check expiration

# Demo 3: Create OAuth credential (AGOL)

* Explain use cases & security concerns
* Create oauth credential with redirect to rauljimenez (postman) & localhost
* App credentials Test in Postman and show in test lab and run script
* Use client id to follow user auth, then show test lab code and run script

# Resources

## Create developer credentials manually

* **ArcGIS Location Platform**: New developer credentials
  * API key: 
  * OAuth: 
    * Redirect URL (Test Lab): http://localhost:5173/completeOAuth/authenticate.html?product=arcgis-location-platform
    * Redirect URL (Postman): https://www.rauljimenez.info/arcgis-oauth-callback/
  * Privileges for both:
    * Privileges:
    * Create and remove content: Create, update, and delete; Publish hosted feature layers
* Enterprise
  * Enterprise can't geocode (not federated)
  * Show limitations


## 🔬 ArcGIS Token Testing Lab

1. Show environment variables:
    * ALP, Online and Enterprise; Just -> username, password, portal-url
1. Show I'm using postman scripts to storing and saving enviroment variables
1. Run: Direct -> Test credentials -> User self
    * Show two ways of sending the token: X-Esri-Authorization and  Query Params
    * Show that it return basic public information
1. Run: ⚠️ Generate token flow (user & pass)
    * Show documetantion
    * check valid tests (**carefull!**: Online token set to expire in 3min -> environment variables)
    * 
1. Org Admin: Show how to set privileges
    * Create role -> Check under: General privileges > Content (**Creator or higher**)
      * Generate API keys: Allow member to generate API keys.
      * Assign privileges to OAuth 2.0 applications
1. Show how to Auth2 flow works (behind the scenes)
    1. Quickly explain paramenters -> Open & clear console, and run request
    1. Copy the URL from console and open URL
    1. Copy the code and paste it in request 2.
1. Testing lab
  
|Auth method|Enterprise|ArcGIS Online|ArcGIS Location Platform|
|---|---|---|---|
|User & Pass|✅ Create&, ✅ Delete|✅ Create, ⚠️Delete (recycle bin)|✅ Create, ✅Delete
|API key|❌ Create, ❌ Delete<sup>1</sup>|✅ Create, ⚠️Delete (recycle bin)|✅ Create, ✅Delete
|App credential|❌ Create, ❌ Delete<sup>1</sup>|✅ Create, ⚠️Delete (recycle bin)|✅ Create, ✅Delete
|User auth|❌ Create, ❌ Delete<sup>1</sup>|✅ Create, ⚠️Delete|✅ Create, ✅Delete