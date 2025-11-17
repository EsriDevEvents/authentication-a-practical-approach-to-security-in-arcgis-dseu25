import { geocode } from "@esri/arcgis-rest-geocoding";
import { ApiKeyManager, ArcGISIdentityManager, ApplicationCredentialsManager } from "@esri/arcgis-rest-request";
import { handleError, printError, logging } from "./errorHandling";
import { ACCOUNT_SETTINGS } from "./config";
import { createNewService } from "./createFS";

// load the calcite components
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";
defineCustomElements(window, {
  resourcesUrl: "https://js.arcgis.com/calcite-components/3.3.3/assets",
});

let product = null;
let tokenType = null;
let token = null;
let serviceName = null;
let settings = null;

document.getElementById("account-type").addEventListener("calciteSelectChange",  (e) => {
  product = e.target.value;
  updateInterface();
});
document.getElementById("token-type").addEventListener("calciteSelectChange",  (e) => {
  tokenType = e.target.value
  updateInterface();
});


function updateInterface(){
  if(product && tokenType){
    settings = ACCOUNT_SETTINGS[product];
    
    // Token OAuth login if OAuth type selected
    document.getElementById("loginEl").style.display= tokenType=="oauth-token"? "block":"none";
    document.getElementById("access-token").value = "";
    document.getElementById("tokenEl").style.display = "none";
    
    //If Username and password is selected, disable adding token
    if(tokenType=="get-token"){
      
      document.getElementById('run-btn').disabled = false
    }else if(tokenType=="app-credentials" || tokenType=="api-key"){
      document.getElementById('run-btn').disabled = false
      if(tokenType=="api-key"){
        
        document.getElementById("tokenEl").style.display = "block";
        document.getElementById("access-token").value = settings.apiKey
      }
    }else{  
      document.getElementById("access-token").disabled = false
    }
  }
  
}

document.getElementById("run-btn").addEventListener("click",async function(e) {
  
  // Clean previous results
  const els = document.getElementsByClassName("response");
  [].forEach.call(els, function (el) {el.innerHTML = ""});
  
  // product = document.getElementById("account-type").value;
  // tokenType = document.getElementById("token-type").value;
  
  serviceName = document.getElementById("feature-service-name").value;
  
  let authentication;

  try{
    
    switch(tokenType){
      
      case 'get-token':
      
      // 1. 👤 OAuth 2.0: Resource owner password credentials grant
      authentication = await ArcGISIdentityManager.signIn({
        username: settings.username,
        password: settings.password,
        portal: `https://${settings.portalUrl}/sharing/rest`
      });
      
      
      document.getElementById("tokenEl").style.display = "block";
      document.getElementById("access-token").value = authentication.token;
      // authentication = new ArcGISIdentityManager({
      //   token, // Construct from an existing token
      //   username: settings.username,
      //   portal:  `https://${settings.portalUrl}/sharing/rest`
      // });
      runTests(authentication);

      break;

      case 'app-credentials':
      
      // 2. 🖥️ OAuth 2.0 App credentials
      authentication = ApplicationCredentialsManager.fromCredentials({
        clientId: settings.clientId,
        clientSecret: settings.clientSecret,
        portal:  `https://${settings.portalUrl}/sharing/rest`
      });
      token = await authentication.getToken()
      document.getElementById("tokenEl").style.display = "block";
      document.getElementById("access-token").value = authentication.token;
      // Construct token manually added to the input field
      // authentication = new ArcGISIdentityManager({
      //   token,
      //   portal:  `https://${settings.portalUrl}/sharing/rest`
      // });
      runTests(authentication);

      break;
      
      case 'oauth-token':
      
      // 3. 🧑‍💻 OAuth 2.0 User authentication - Authentication Grant Flow with PKCE (SHA256) | ⭐ Recommended
      token = document.getElementById("access-token").value;
      authentication = ArcGISIdentityManager.fromToken({
        token,
        portal: `https://${settings.portalUrl}/sharing/rest`,
      }).then(runTests);
      
      break;
      
      case 'api-key':
      
      // 4. 🔑 API Keys authentication
      authentication = await ApiKeyManager.fromKey({
        // key: token, // Token manually added to the input field
        key: settings.apiKey, // Token from config file
        username: settings.username // (Optional) for this specific requests
      });
      runTests(authentication);

      break;
      
    }
  }catch(e){
    console.error(e);
  }
})

let testGeocode = function(authentication){
  const element = 'geocoding-response';
  geocode({
    address: "1600 Pennsylvania Ave",
    postal: "20500",
    countryCode: "USA",
    authentication
  })
  .then((response) => {
    response = JSON.stringify(response.candidates, null, 2);
    logging(element, response);
  }).catch(e => {
    handleError(e, element);
  });
}

import { getPortal } from "@esri/arcgis-rest-portal";
let testGetPortal = async function(authentication){
  const element = 'portal-info-response';
  try {
    const portalInfo = await getPortal(null, { 
      portal: `https://${settings.portalUrl}/sharing/rest` 
    });
    logging(element, JSON.stringify(portalInfo));
  } catch (e) {
    printError(e, element);
  }
};

import { searchItems } from "@esri/arcgis-rest-portal";
let testOwnedItems = async function(authentication){
  const element = 'query-items-response';
  
  // Search for feature layers owned by the specified user
  const items = await searchItems({
    q: `owner:${settings.username}`,
    num: 10, // Limit the number of results
    portal: `https://${settings.portalUrl}/sharing/rest`,
    authentication: authentication
  }).catch(e => {
    printError(e, element);
  });
  
  let res = "";
  if(items && items?.results){
    items.results.forEach((item) => {
      const output = `- ${item.title} (Owner: ${item.owner})`;
      res += output + "<br/>"
    });
    logging(element, res);
  }
  
  
}

function runTests(authentication){
  console.log("Tests running...");
  testGetPortal(authentication);
  testGeocode(authentication);
  testOwnedItems(authentication);
  createNewService(authentication, serviceName, settings)
}

