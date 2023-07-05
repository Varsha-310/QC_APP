import store from "../models/store";
import axios from "axios"

const webhooks = [
  { topic: "customers/data_request", endpoint: "/gdpr/customer/data" },
  { topic: "customers/redact", endpoint: "/gdpr/customer/delete" },
  { topic: "shop/redact", endpoint: "/gdpr/store/delete" },
  { topic: "orders/create", endpoint: "/webhooks/ordercreated" },
  { topic: "orders/updated", endpoint: "/webhooks/orderupdated" },
  { topic: "orders/cancelled", endpoint: "/webhooks/orderdeleted" },
  { topic: "app/uninstalled", endpoint: "/shopify/uninstall" },
  { topic: "products/create",  endpoint:"/webhooks/productcreated"},
  { topic: "products/delete", endpoint: "/webhooks/productdeleted"},
  { topic: "products/update", endpoint: "/webhooks/productupdated" }
];

/**
 * cron to check webhooks
 */
export const cronToCheckWebhooks = async () => {
  let stores = await store.find();
  console.log(stores);
  for (const store of stores) {
    console.log(store);
    await checkWebhooks(store.store_url, store.access_token);
  }
};

/**
 * Check and update weebhook
 * @param {*} req
 * @param {*} res
 */
export const checkWebhooks = async (storeUrl, accessToken) => {
  try {
    console.log(storeUrl,accessToken)
    const webhooksList = webhooks;
    console.log(webhooksList, "webhooksList");
    const URL = `https://${storeUrl}/admin/api/${process.env.API_VERSION}/webhooks.json`;
    const options = ({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": `${accessToken}`,
      },
      url: URL,
    });
     let result = await axios(options);
     console.log(result.data.webhooks, "1234567898765432123456789");
    for (const iterator of webhooksList) {
      const flag = result.data.webhooks.find((item) => item.topic == iterator.topic);
      if (!flag) {
        console.log(iterator);
        const config = {
          method: "POST",
          url: URL,
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": `${accessToken}`,
          },
          data: {
            webhook: {
              topic: iterator.topic,
              address: `${process.env.APP_URL}${iterator.endpoint}`,
              format: "json",
            },
          },
        };
        await axios(config).catch((err) => {
          console.log("-------error in creating webhook-----", err.data);
        });
        
      }
    }
  } catch (err) {
    console.log(err);
  }
};
