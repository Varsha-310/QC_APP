import store from "../models/store";

const webhooks = [
  { topic: "customers/data_request", endpoint: "/gdpr/customer/data" },
  { topic: "customers/redact", endpoint: "/gdpr/customer/delete" },
  { topic: "shop/redact", endpoint: "/gdpr/store/delete" },
  { topic: "orders/created", endpoint: "/webhooks/ordercreated" },
  { topic: "orders/updated", endpoint: "/webhooks/orderupdated" },
  { topic: "orders/cancelled", endpoint: "/webhooks/orderdeleted" },
  { topic: "app/uninstalled", endpoint: "shopify/uninstall" },
];

/**
 * cron to check webhooks
 */
export const cronToCheckWebhooks = async () => {
  let stores = await store.find();
  console.log(stores);
  for (const store of stores) {
    console.log(store);
    await checkWebhooks(store.storeUrl, store.accessToken);
  }
};

/**
 * Check and update weebhook
 * @param {*} req
 * @param {*} res
 */
export const checkWebhooks = async (storeUrl, accessToken) => {
  try {
    const webhooksList = webhooks;
    console.log(webhooksList, "webhooksList");
    const URL = `https://${storeUrl}/admin/api/${process.env.API_VERSION}/webhooks.json`;
    const result = await request({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": `${accessToken}`,
      },
      url: URL,
    }).then((response) => JSON.parse(response));

    //console.log(result.webhooks);
    for (const iterator of webhooksList) {
      const flag = result.webhooks.find((item) => item.topic == iterator.topic);
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
              address: `${process.env.DOMAIN}${iterator.endpoint}`,
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
