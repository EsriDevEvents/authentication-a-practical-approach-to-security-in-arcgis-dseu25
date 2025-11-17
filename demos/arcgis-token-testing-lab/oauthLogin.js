import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { handleError } from "./errorHandling";
import { ACCOUNT_SETTINGS } from "./config";

// Attach a listener to the sign in buttons.
document.getElementById('login').addEventListener('click', function (event) {
  
  const product = document.getElementById("accountType").value;
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
    document.getElementById("accessToken").value = newSession.token
    document.getElementById("tokenEl").style.display = "block"
    document.getElementById('runBtn').disabled = false
  }).catch(e => {
    handleError(e, 'login');
  });
});


