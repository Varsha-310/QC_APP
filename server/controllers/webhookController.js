import { respondSuccess } from "../helper/response";
import store from "../models/store";
import { webhooks } from "../config/custom";

/**
 * to handle order creation webhook
 * @param {*} req
 * @param {*} res
 */
export const ordercreated = (req, res) => {
  res.json(respondSuccess("webhook received"));
};

/**
 * to handle order update webhook
 * @param {*} req
 * @param {*} res
 */
export const orderupdated = (req, res) => {
  res.json(respondSuccess("webhook received"));
};

/**
 * to handle order delete webhook
 * @param {*} req
 * @param {*} res
 */
export const orderdeleted = (req, res) => {
  res.json(respondSuccess("webhook received"));
};

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
