import { ErrorTypes } from '@esri/arcgis-rest-request';

let res;
let printError = function(e, element){
  console.error("Error:", e);
  if(e && e?.response){
    try{
      res = JSON.stringify(e)
    }catch(error){
      console.log("Problem stringify", e)
    }
  }else{
    console.log("typeof(e)=",typeof(e));
    res = e;
  }
  logging(element, res);
}

let logging = function(element, msg){
  console.log(`\n${msg}`)
  document.getElementById(element).innerHTML = `<p style="word-wrap: break-word;width:calc(1200px)">${msg}</p>`;
}


let handleArcGISAuthError = function (e, element) {
  let res;
    switch (e.code) {
      case "no-auth-state":
        res = "No auth state found to complete sign in. This error can be ignored."  
        printError(res, element);
        break;
      
        case "access-denied-error":
        res = "The user hit cancel on the authorization screen.";
        printError(res, element);
      break;
      
      default:
        printError(e, element);

      break;
    }
    // debugger
  }

let handleError = function (e, element) {
  let res = null;
  // console.error("Error type/enum = ",e.name);
  // console.error("e = ",e);
  switch(e.name) {
    case ErrorTypes.ArcGISAccessDeniedError:
    // handle a user denying an authorization request in an oAuth workflow
      printError(e, element);
      break;
  

    case ErrorTypes.ArcGISAuthError:
      // handle an authentication error
      handleArcGISAuthError(e, element);
      break;

    case ErrorTypes.ArcGISRequestError:
      // handle a general error from the API
      printError(e, element);
      break;

    case ErrorTypes.ArcGISTokenRequestError:
      // ArcGIS REST JS could not generate an appropriate token for this request
      // All credentials are likely invalid and the authentication process should be restarted
      printError(e, element);
      break;

    default:
      // handle some other error (usually a network error)
  }
}
 




export {
  handleError,
  printError,
  logging
}