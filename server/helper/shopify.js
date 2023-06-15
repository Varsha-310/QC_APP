import Shopify from 'shopify-api-node';
import axios from 'axios';
import store from "../models/store";


const getshopifyObject = (store) => {
    const shopify = new Shopify({
        shopName: process.env.SHOPIFY_SHOP_URL,
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN
      });
    return shopify;
}

//Function to create a Shopify Object from the Private APP Credentials - Used to communicate with Shopify APIs
export function getShopifyObject(store_url) {
    console.log("getShopifyObject start");
    return new Promise(async (resolve, reject) => {
      console.log("Promise start");
      let settings = await store.findOne({ store_url: store_url }); //Fetch Store Details
      console.log("-----------------------------------------", settings)
    //   if (settings && settings.shopify_private_app) {
        //If Shopify private App credentials are added
  
        // let initalizeDate = settings.qwikcilver_account.DateAtClient;
        // initalizeDate = new Date(initalizeDate);
        // let initalizeTime = initalizeDate.getTime();
        // console.log(initalizeTime);
        // if (initalizeTime > 1659312000000) {
          console.log("time if condition");
          const shopify = new Shopify({
            //Create a shopify object and resolve it
            shopName: settings.store_url,
            accessToken: settings.access_token,
            // apiKey: settings.shopify_private_app.api_key,
            // password: settings.shopify_private_app.password,
          });
          resolve(shopify);
        // }
        // else {
        //   console.log("time else condition");
        //   const shopify = new Shopify({
        //     //Create a shopify object and resolve it
        //     shopName: store.substr(0, store.length - 14),
        //     // accessToken: settings.shopify_private_app.shared_secret,
        //     apiKey: settings.shopify_private_app.api_key,
        //     password: settings.shopify_private_app.password,
        //   });
        //   resolve(shopify);
        // }
  
    //   } else {
    //     reject("No details found");
    //   }
    });
  }