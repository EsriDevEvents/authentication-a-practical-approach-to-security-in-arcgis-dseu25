import { handleError, logging } from "./errorHandling";
import { ACCOUNT_SETTINGS } from "./config";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

// Attach a listener to the sign in buttons.
document.getElementById('login').addEventListener('click', function (event) {
  
  // Configure OAuth2 login
  const product = document.getElementById("account-type").value;
  if(!product){
    alert("Select a product, token");
    return false;
  }

  const settings = ACCOUNT_SETTINGS[product];
  
  // Begin an OAuth2 login
  ArcGISIdentityManager.beginOAuth2({
    clientId: settings.clientId,
    portal: `https://${settings.portalUrl}/sharing/rest`,
    popup:  true,
    redirectUri: settings.redirectUri,
  })
  .then(function (newSession) {
    // Upon a successful login, update the session with the new session.
    document.getElementById("access-token").value = newSession.token
    document.getElementById("tokenEl").style.display = "block"
    document.getElementById('run-btn').disabled = false
    
  }).catch(e => {
    handleError(e, 'login');
  });
});


