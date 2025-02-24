const otpStorage = new Map();

// Function to generate OTP and store it in Map
function generateOTP(email) {
    // Check if OTP already exists and hasn't expired
    if (otpStorage.has(email)) {
       const storedOTP = otpStorage.get(email);
       if (storedOTP.expiresAt > Date.now()) {
          return { error: "OTP can only be generated once every 10 minutes" }
       }
   }
   const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
   otpStorage.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // Expires in 10 mins
   // Automatically delete OTP after 10 minutes
   setTimeout(() => {
      console.log("OTP deleted",email);
      otpStorage.delete(email)}, 10 * 60 * 1000);
   return otp;
}

// Function to verify OTP
function verifyOTP(email, otp) {
   const storedOTP = otpStorage.get(email);
   return storedOTP && storedOTP.otp === otp && storedOTP.expiresAt > Date.now();
}

// function to delete OTP
function deleteOTP(email) {
    // before deleting first check whether email exists in it or not
    if (otpStorage.has(email)) {
        otpStorage.delete(email);
    }
   return true;
}

module.exports = { generateOTP, verifyOTP, deleteOTP };