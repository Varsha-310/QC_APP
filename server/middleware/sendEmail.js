import NodeMailer from "nodemailer";
import email_template from "../views/email_template";

export const sendEmailViaSendGrid = async (
  // giftCardDetails,
  order,
  shopName,
  email_id,
  message,
  sender,
  receiver
) => {;
console.log("in the mail sender");
let foundTemplate ;
order.line_items[0].properties.forEach((obj) => {
  // console.log(obj)
  if (obj.name === "template_image") {
    console.log("Found object:", obj);
    foundTemplate = obj;
  }
});

console.log(order.line_items, "order.line_items[0].template_image");

// import  email_template from ("../views/email_template").template;
// email_template = email_template.replace("__message__", message);
// email_template = email_template.replace("__sender__", sender);
// email_template = email_template.replace("__receiver__", receiver);
// if (foundTemplate) {
//   email_template = email_template.replace(
//     "template_image",
//     foundTemplate.value
//   );
// }
// email_template = email_template.replace(
//   "template_image",
//   "https://cdn.shopify.com/s/files/1/0265/7687/9691/files/image_58.png?v=1599111008"
// );
var mail_id = "helpdesk@qwikcilver.com";
var subject = "Your Qwikcilver GiftCard is ready to use!";

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
// Framing the mail options
const options = {
  to: email,
  from: mail_id,
  subject: subject,
  html: email_template,
};
console.log(options);

var smtpTransporter = NodeMailer.createTransport({
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
    console.log("mail sent successfully !");
    // Resolve if the mail is sent successfully
    
  } else {
    console.log(error);
  
  }
})
};
