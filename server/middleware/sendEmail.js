import NodeMailer from "nodemailer";
import template from "../views/email_template.js";

//Function to convert the Javascript Date Object to a readable format
function getReadableDate(dateObj) {
  var d = new Date(dateObj),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
    let hours = "" + d.getHours();
    let minutes = "" + d.getMinutes();
    let seconds = "" + d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hours.length < 2) hours = "0" + hours;
  if (minutes.length < 2) minutes = "0" + minutes;
  if (seconds.length < 2) seconds = "0" + seconds;
  return `${day}-${month}-${year}  ${hours}:${minutes}`;
}

export const sendEmailViaSendGrid = async (
  shopName,
  order,
  giftCardDetails,
  receiver,
  email_id,
  message,
  image_url
) => {;
console.log("in the mail sender");

var mail_id = "GC@qwikcilver.com";
var subject = "Your Qwikcilver GiftCard is ready to use!";
// order.line_items[0].properties.forEach(obj => {
//   if(obj.name === "image_url"){
//     email_template = email_template.replace(
//       "image_url", obj.value
//     );
//   }
// })
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
  getReadableDate(giftCardDetails["ExpiryDate"])
);
email_template = email_template.replace(
  "__receiver__", receiver
);
email_template = email_template.replace(
  "__message__", message
);
email_template = email_template.replace(
  "template_image", image_url
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
