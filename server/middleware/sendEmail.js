import nodemailer from ('nodemailer');

export const sendEmailViaSendGrid = async(
    // giftCardDetails,
    order,
    shopName,
    email_id,
    message,
    sender,
    receiver
  ) =>
      console.log("in the mail sender");
      let template = require("../views/email_template").template;
      let foundTemplate;
      order.line_items[0].properties.forEach(obj => {
        // console.log(obj)
        if (obj.name === "template_image") {
          console.log('Found object:', obj);
          foundTemplate = obj;
        }
      });
  
      const searchString = "fox";
      const replaceString = "cat";
      console.log(order.line_items, "order.line_items[0].template_image");
  
  
      // const email_template = template.replace(/src="[^"]*"/, `src="${order.line_items[0].template_image}"`);
      let email_template = require("../views/email_template").template;
      email_template = email_template.replace("__message__", message);
        email_template = email_template.replace("__sender__", sender);
        email_template = email_template.replace("__receiver__", receiver);
      if (foundTemplate) {
        email_template = email_template.replace("template_image", foundTemplate.value);
      }
      email_template = email_template.replace("template_image", "https://cdn.shopify.com/s/files/1/0265/7687/9691/files/image_58.png?v=1599111008");
      varmail_id = "helpdesk@qwikcilver.com";
      var subject = "Your Qwikcilver GiftCard is ready to use!";
  
      if (shopName.includes("birkenstock-india.myshopify.com")) {
        email_template = require("../views/birkenstock").template;
        if (foundTemplate) {
          email_template = email_template.replace("template_image", foundTemplate.value);
        }
        email_template = email_template.replace("template_image", "https://qwikcilver.marmeto.com/public/images/Birkenstock.jpeg");
        var subject = "Your Birkenstock GiftCard is ready to use !"
      }
      if (shopName.includes("blue-tokai-coffee-roasters")) {
        email_template = require("../views/bluetokai_email_template").template;
        if (foundTemplate) {
          email_template = email_template.replace("template_image", foundTemplate.value);
        }
        email_template = email_template.replace("template_image", "https://stage.woohoo.in/media/Gift_card_2020-07.jpg");
        (mail_id = "getcoffee@bluetokaicoffee.com"),
          (subject = "Your Bluetokai e-Gift Card is ready to use!");
      }
      if (shopName.includes("hidesignstore")) {
        email_template = require("../views/hidesign_email_template").template;
        if (foundTemplate) {
          email_template = email_template.replace("template_image", foundTemplate.value);
        }
        email_template = email_template.replace("template_image", "https://stage.woohoo.in/media/Hidesign_e-gift-card_emailer_Final.jpg");
      }
      if (shopName.includes("giva-jewelry")) {
        mail_id = "giftcards@giva.co";
        subject = "Your Giva GiftCard is ready to use!";
        email_template = require("../views/giva_email_template").template;
        if (foundTemplate) {
          email_template = email_template.replace("template_image", foundTemplate.value);
        }
        email_template = email_template.replace("template_image", "https://static-uat.woohoo.in/media/GIVA_2.png");
      }
      if (shopName.includes("plumgoodness-2")) {
        email_template = require("../views/hidesign_email_template");
        if (foundTemplate) {
          email_template = email_template.replace("template_image", foundTemplate.value);
        }
        email_template = email_template.replace("template_image", "https://static-uat.woohoo.in/media/Gift-Card.jpg");
      }
      if (shopName.includes("iamcaffeine")) {
        email_template = require("../views/mcaffine_email_template").template;
        email_template = email_template.replace("__message__", message);
        email_template = email_template.replace("__sender__", sender);
        email_template = email_template.replace("__receiver__", receiver);
        if (foundTemplate) {
          email_template = email_template.replace("template_image", foundTemplate.value);
        }
        email_template = email_template.replace("template_image", "https://static-uat.woohoo.in/media/CRM-Banner_002_.jpg");
        subject = `${sender} sent you a mCaffeine E-Gift Card!`;
        mail_id = "woot@mcaffeine.com";
      }
      if(shopName.includes("u-s-polo-assn-india.myshopify.com")){
        email_template = require("../views/us_polo_email_template").template;
        email_template = email_template.replace("__message__", message);
        email_template = email_template.replace("__sender__", sender);
        subject = "Your us-polo GiftCard is ready to use!";
        mail_id = "care@uspoloassn.in";
      }
      var email;
      if (order.email) {
        //Check for the email ID in the order data
        email = order.email;
      } else if (order.customer && order.customer.email) {
        //If not get it from the customer field in order data
        email = order.customer.email;
      }
      if (email_id) {
        email = email_id;
      }
      console.log(email);
      // email_template = email_template.replace(
      //   "__CardNumber__",
      //   giftCardDetails["CardNumber"]
      // );
      // email_template = email_template.replace(
      //   "__CardPIN__",
      //   giftCardDetails["CardPIN"]
      // );
      // email_template = email_template.replace(
      //   "__Amount__",
      //   giftCardDetails["Amount"]
      // );
      // email_template = email_template.replace(
      //   "__Expiry__",
      //   getReadableDate(giftCardDetails["CardExpiry"])
      // );
      //Framing the mail options
      const options = {
        to: email,
        from: mail_id,
        subject: subject,
        html: email_template,
      };
      console.log(options);
  
      var smtpTransporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.sendgrid.net",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
  
      // console.log(options);
      smtpTransporter.sendMail(options, async function (error, info) {
        if (!error) {
          console.log("mail sent successfully !")
          // Resolve if the mail is sent successfully
          resolve(true);
        } else {
          console.log(error);
          reject(error);
        }
      });
    });
  