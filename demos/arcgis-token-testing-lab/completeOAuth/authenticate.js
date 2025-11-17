import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { ACCOUNT_SETTINGS } from "../config";

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

const product = searchParams.get("product");
const settings = ACCOUNT_SETTINGS[product];

ArcGISIdentityManager.completeOAuth2({
  clientId: settings.clientId,
  portal: `https://${settings.portalUrl}/sharing/rest`,
  redirectUri: settings.redirectUri,
  popup: true,
});