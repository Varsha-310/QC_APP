import Shopify from 'shopify-api-node';
import Store from "../models/store.js";

/**
 * Get shopify object
 * @param {*} store 
 * @returns 
 */
export const getShopifyObject = async(store) =>{
  try{
  console.log(store,"======================================")
    console.log("getShopifyObject start" , store);
      let settings = await Store.findOne({ store_url: store}); //Fetch Store Details
      console.log("-----------------------------------------", settings)
              const shopify = new Shopify({
            //Create a shopify object and resolve it
            shopName: settings.store_url,
            accessToken: settings.access_token,
       
          });
          console.log(shopify,"-------------------------------")
          return shopify
        }
        catch(err){
          console.log(err);
          return false;
        }
  }