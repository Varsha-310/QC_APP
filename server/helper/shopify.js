import Shopify from 'shopify-api-node';
import store from "../models/store";

/**
 * Get shopify object
 * @param {*} store 
 * @returns 
 */
export function getShopifyObject(store_url) {
    console.log("getShopifyObject start" , store_url);
    return new Promise(async (resolve, reject) => {
      console.log("Promise start");
      let settings = await store.findOne({ store_url: store_url }); //Fetch Store Details
      console.log("-----------------------------------------", settings)
    
          console.log("time if condition");
          const shopify = new Shopify({
            //Create a shopify object and resolve it
            shopName: settings.store_url,
            accessToken: settings.access_token,
       
          });
          resolve(shopify);
      

    });
  }