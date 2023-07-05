import Shopify from 'shopify-api-node';
import Store from "../models/store";

/**
 * Get shopify object
 * @param {*} store 
 * @returns 
 */
export const getShopifyObject = async(store) =>{
  console.log(store,"======================================")
    console.log("getShopifyObject start" , store);
    // return new Promise(async (resolve, reject) => {
    //   console.log("Promise start");
      let settings = await Store.findOne({ store_url: store}); //Fetch Store Details
      console.log("-----------------------------------------", settings)
    
          // console.log("time if condition");
          const shopify = new Shopify({
            //Create a shopify object and resolve it
            shopName: settings.store_url,
            accessToken: settings.access_token,
       
          });
          // resolve(shopify);
          console.log(shopify,"-------------------------------")
          return shopify
      

    // });
  }