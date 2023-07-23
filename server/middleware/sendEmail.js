import NodeMailer from "nodemailer";
import template from "../views/email_template.js";

export const sendEmailViaSendGrid = async (
  shopName,
  order,
  giftCardDetails,
  receiver,
  email_id,
  message
) => {;
console.log("in the mail sender");
// const email_id = "varshaa@marmeto.com"

var mail_id = "GC@qwikcilver.com";
var subject = "Your Qwikcilver GiftCard is ready to use!";
order.line_items[0].properties.forEach(obj => {
  if(obj.name === "image_url"){
    email_template = email_template.replace(
      "image_url", obj.value
    );
  }
})
console.log("----------", giftCardDetails);
let email_template = template;
email_template = email_template.replace(
  "__CardPIN__",
  giftCardDetails["CardPin"]
);
email_template = email_template.replace(
  "__Amount__",
  giftCardDetails["Balance"]
);
email_template = email_template.replace(
  "__Expiry__",
  giftCardDetails["ExpiryDate"]
);
email_template = email_template.replace(
  "__receiver__", receiver
);
email_template = email_template.replace(
  "__message__", message
);
// Framing the mail options
const options = {
  to: email_id,
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
