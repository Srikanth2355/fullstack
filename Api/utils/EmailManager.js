const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Function to read HTML file and replace placeholders
const getOTPTemplate = (name, otp) => {
    const templatePath = path.join(__dirname, "../templates/sendotp.html");
    let template = fs.readFileSync(templatePath, "utf8");
  
    // Replace placeholders with actual values
    template = template.replace("{{name}}", name).replace("{{otp}}", otp);
    
    return template;
  };

async function sendEmail(email, otp,name,subject="OTP for Email Verification") {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL_1,
      pass: process.env.APP_PASSWORD_1,
    },
  })
  const mailOptions = { 
    from: process.env.APP_EMAIL_1, 
    to:email, 
    subject:subject,
    html: getOTPTemplate(name, otp), 
};
try{
    const response =await transporter.sendMail(mailOptions);
    return true;
}catch(err){
    console.log(err);
    return false;
}
}

module.exports = { sendEmail };

