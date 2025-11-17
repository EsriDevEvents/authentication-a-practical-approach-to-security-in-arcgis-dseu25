import {
  createFeatureService,
  addToServiceDefinition,
} from "@esri/arcgis-rest-feature-service"
import { searchItems, removeItem, getSelf } from "@esri/arcgis-rest-portal"
import { logging } from "./errorHandling";

const element = "create-feature-service-response";

const removeItems = async (authentication, settings, serviceName) => {
  
  // check for existing items and delete them if they exist
  // this is for this demo to make sure it can be re-run continuously
  logging(element, '⏳ Checking for existing items...');
  
  const searchQuery = {
    q: `title:${serviceName} AND owner:"${settings.username}"`,
    portal: `https://${settings.portalUrl}/sharing/rest`,
    authentication,
  };

  const existingItems = await searchItems(searchQuery)
  
  if (existingItems.results.length > 0) {
    
    await Promise.all([
      existingItems.results.map(({ id, title, type }) => {
        logging(element, `\n⏳ Deleting ${type} ${id} with title ${title}...`);
        return removeItem({ 
          id, 
          authentication,
          portal: `https://${settings.portalUrl}/sharing/rest`,
        }).catch(e =>{
          logging(element, `⚠️ Problem deleting service (check privileges)<br/> ${JSON.stringify(e.response)}`);
        });
      }),
    ])
    
    // Wait (maxAttempts) to allow time for the items to be deleted
    let timeout = 10;
    let checkingExistingItems;
    
    do{
      await new Promise((r) => setTimeout(r, 1000))
      checkingExistingItems = await searchItems(searchQuery);
      timeout--;
    }while(checkingExistingItems.results.length > 0 && timeout > 0);
    console.log("No items. checkingExistingItems=", checkingExistingItems);

    logging(element, `\n⏳ Deleted ${existingItems.results.length} existing items...`)
  } else {
    logging(element, "\n⏳ No existing items found...")
  }
}

const createNewService = async (auth, serviceName, settings) => {
  // login to the portal
  
  console.log(`\nLogged in as ${auth.username}`)
  
  // const portalSelf = await getSelf({ 
  //   authentication: auth,
  //   portal: `https://${settings.portalUrl}/sharing/rest`,
  // })
  
  await removeItems(auth, settings, serviceName);
  console.log("Items removed");
  
  // define layer schema
  // https://developers.arcgis.com/rest/services-reference/enterprise/add-to-definition-feature-service/#example-usage
  const layerSchema = [
    {
      name: serviceName,
      type: "Feature Layer",
      defaultVisibility: true,
      isDataVersioned: false,
      supportsRollbackOnFailureParameter: true,
      supportsAdvancedQueries: false,
      geometryType: "esriGeometryPoint",
      minScale: 0,
      maxScale: 0,
      extent: {
        spatialReference: {
          wkid: 4326,
        },
        xmin: -118.84764718980026,
        ymin: 33.99799168307417,
        xmax: -118.7618165013238,
        ymax: 34.026450333167524,
      },
      drawingInfo: {
        transparency: 0,
        labelingInfo: null,
        renderer: {
          type: "simple",
          symbol: {
            color: [20, 158, 206, 130],
            size: 18,
            angle: 0,
            xoffset: 0,
            yoffset: 0,
            type: "esriSMS",
            style: "esriSMSCircle",
            outline: {
              color: [255, 255, 255, 220],
              width: 2.25,
              type: "esriSLS",
              style: "esriSLSSolid",
            },
          },
        },
      },
      allowGeometryUpdates: true,
      hasAttachments: true,
      htmlPopupType: "esriServerHTMLPopupTypeNone",
      hasM: false,
      hasZ: false,
      objectIdField: "OBJECTID",
      fields: [
        {
          name: "OBJECTID",
          type: "esriFieldTypeOID",
          alias: "OBJECTID",
          sqlType: "sqlTypeOther",
          nullable: false,
          editable: false,
          domain: null,
          defaultValue: null,
        },
        {
          name: "id",
          type: "esriFieldTypeInteger",
          alias: "id",
          sqlType: "sqlTypeInteger",
          nullable: true,
          editable: true,
          domain: null,
          defaultValue: null,
        },
        {
          name: "name",
          type: "esriFieldTypeString",
          alias: "name",
          sqlType: "sqlTypeNVarchar",
          nullable: true,
          editable: true,
          domain: null,
          defaultValue: null,
          length: 256,
        },
        {
          name: "rating",
          type: "esriFieldTypeString",
          alias: "rating",
          sqlType: "sqlTypeNVarchar",
          nullable: true,
          editable: true,
          domain: null,
          defaultValue: null,
          length: 256,
        },
      ],
      templates: [
        {
          name: "New Feature",
          description: "",
          drawingTool: "esriFeatureEditToolPoint",
          prototype: {
            attributes: {
              id: null,
              name: null,
              rating: null,
            },
          },
        },
      ],
      supportedQueryFormats: "JSON",
      hasStaticData: true,
      maxRecordCount: 10000,
      capabilities: "Query,Extract",
    },
  ]
  
  
  logging(element, "\n⏳ Creating new service...")
  // debugger
  // create the service
  const newService = await createFeatureService({
    authentication: auth,
    item: {
      name: serviceName,
      capabilities: "Query, Extract",
      description:
      "Programmatically generated feature service using ArcGIS REST JS",
      units: "esriMeters",
      initialExtent: {
        xmin: -134.74729261792592,
        ymin: 23.56096242376989,
        xmax: -55.695547615409396,
        ymax: 50.309217030288835,
        spatialReference: { wkid: 4326 },
      },
      spatialReference: { wkid: 4326 },
    },
    portal: `https://${settings.portalUrl}/sharing/rest`,
  }).catch(e =>{
    logging(element, `\n⚠️ Service "${serviceName}" couldn't be created. Check if your key have enough permission or if it exists in the recycle bin`)
  });
  
  // If the creation didn't fail
  if(newService){
    logging(element, "\n⏳ Adding schema to new service...")
    // create layer
    const newFeatureLayer = await addToServiceDefinition(newService.serviceurl, {
      authentication: auth,
      layers: layerSchema,
      portal: `https://${settings.portalUrl}/sharing/rest`,
    }).catch(e =>{
      logging(element, `\n⚠️ Error adding schema to service: ${e}`)
    });

    // If layers created successfully
    if(newFeatureLayer?.layers){
      logging(element, `\n⏳ Added layer ${newFeatureLayer.layers[0].name} to feature service...`)
      
      const serviceUrl = `https://${settings.portalUrl}/home/item.html?id=${newService.itemId}&token=${auth.token}`;
      logging(element, `\n✅ New service created:\n <a href="${serviceUrl}">${newService.itemId}</a>`)
    }
  }
}

export{
  createNewService
}
