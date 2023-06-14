import { getShopifyObject } from "../helper/shopify";
import Product from "../models/product";
import { respondInternalServerError, respondSuccess } from "../helper/response"; 
import store from "../models/store";
import axios from "axios";

//Create QC Giftcard Product
export const createGiftcardProducts = async (req, res, next) => {
  console.log("createGiftcardProducts function start");
  try {
    let shopify = await getShopifyObject(req.body.store); //Get Shopify Object
    console.log("createGiftcardProducts test1");
    // console.log(shopify);
    let tags = "cpgn_" + req.body.cpg_name;
    tags = tags.replace(/\s/g, "_");
    console.log("createGiftcardProducts shopify call start");
    let body = {
      // Create a product in Shopify with the details sent in API
      title: req.body.title,
      body_html: "",
      vendor: req.body.vendor
        ? req.body.vendor
        : "asdfghjkl",
      product_type: "qwikcilver_gift_card", //The product type is hardcode. This will be used to detect the product later
      published: JSON.parse(req.body.published),
      images: req.body.images,
      tags: tags,
      variants: req.body.variants,
    };
    console.log("Body shopify");
    // console.log(body);
    let newProduct = await shopify.product.create({
      // Create a product in Shopify with the details sent in API
      title: req.body.title,
      body_html: "",
      vendor: req.body.vendor
        ? req.body.vendor
        : "asdfghjkl",
      product_type: "qwikcilver_gift_card", //The product type is hardcode. This will be used to detect the product later
      published: JSON.parse(req.body.published),
      images: req.body.images,
      tags: tags,
      variants: req.body.variants,
    });
    // await Product.create( newProduct );
       console.log("createGiftcardProducts response shopify");
    console.log(newProduct);
    res.json(respondSuccess("Product created in shopify successfully"))
  } catch (error) {
    console.log(error)
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

//Update QC Giftcard Product
export const updateGiftcardProduct = async (req, res, next) => {
  try {
    let shopify = await getShopifyObject(req.body.store); // Get Shopify Object
    let updateObj = {};
    //Update only the fields sent in request
    if (req.body.images && req.body.images.length >= 0) {
      updateObj["images"] = req.body.images;
    }
    if (req.body.published) {
      updateObj["published"] = JSON.parse(req.body.published);
    }
    if (req.body.title) {
      updateObj["title"] = req.body.title;
    }
    if (req.body.body_html) {
      updateObj["body_html"] = req.body.body_html;
    }
    if (req.body.variants) {
      updateObj["variants"] = req.body.variants;
    }
    console.log(updateObj);
    let updatedProduct = await shopify.product.update(
      req.body.product_id,
      updateObj
    );
    res.json(respondSuccess("Product updated in shopify successfully"));
  } catch (error) {
    console.log(error)
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

//Retrieve QC Giftcard Products.
export const getGiftcardProducts = async (req, res, next) => {
    console.log(req.body)
      try {
        console.log(req.body.store);
        let products = await Product.find({ store_url: req.body.store }); //Get Store Object
        console.log(products.length);
        //Since this API is used in the dashboard, the redemption status is also sent along in the response
        // if (products && products.length) {
        //   if (req.token.store !== "plumgoodness-2.myshopify.com") {
        //     var qcRedemptionEnabled = await checkQcRedemption(req.token.store);
        //   }
        //   if (req.token.store == "plumgoodness-2.myshopify.com") {
        //     var qcRedemptionEnabled = true;
        //   }
    
          //Check the status of the QC Redemption Snippet
          res.status(200).send({
            success: true,
            message: "Giftcard Products fetched successfully",
            code: "200",
            data: products
          });
        // } else {
        //   res.status(400).send({
        //     success: false,
        //     message: "No products found for the store",
        //   });
        // }
      } catch (error) {
        console.log(error);
        res.json(
          respondInternalServerError("Something went wrong try after sometime")
        );
      }
    };

    export const storeTemplate = async (req,res) => {
      try{
        let {image , store_url , image_name} = req.body;
        let themeId = "116488863943";
        let storeData = await store.findOne({store_url: store_url});
        console.log(storeData, "---------------------------------------------------------------");
        let accessToken = storeData.access_token
        const URL = `https://${store_url}/admin/api/${process.env.API_VERSION}/themes/${themeId}/assets.json`;
        const options = ({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": `${accessToken}`,
          },
          data : {
            "asset": {
              "key": `assets/${image_name}.jpg`,
              "attachment": image
            }
          },
          url: URL,
        });
         let result = await axios(options);
         console.log( "------------------",result);
      }
      catch(err){
        console.log(err, "------------------------------err-------------------------");
        res.json(
          respondInternalServerError("Something went wrong try after sometime")
        );

      }

    }
    