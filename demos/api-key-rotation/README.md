# API key rotation demo

Demo setup:

* **Step 1**: Create an API key to be used in production. We will call it: "production key"
* **Step 2**: Create another API key, to rotate the "production key". We will call it: "admin key"
  * Privileges: 
    * Enable "Admin privileges" > **"Content" > "View all" + "Update"**
    * Restrict item scope to the "production key".
* **Step 3**: Rename `.env.template` to `.env` and `app-config.template.json` to `app-config.json` and set all variables.
* **Step 4**: Run `npm start`


> **Note**: 
> * With this approach, do not address how to rotate the secondary API key. Check the [api-keys-by-expiration demo](../api-keys-by-expiration) to learn how to automate the notification of API keys that are going to expire.

---

[Original demo](https://mediaspace.esri.com/media/t/1_vnwne3jf/368599242?st=613)
[Original source code](https://github.com/EsriDevEvents/2025-DTS-ArcGIS-REST-JS-scripting-and-automating/tree/main/Demos/api-key-rotation)