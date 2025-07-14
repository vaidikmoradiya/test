require('dotenv').config();
const user = require('../Model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

exports.userRegister = async (req, res) => {
    try {
        const { firstName, mobileNo, lastName, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await user.findOne({email});
        console.log('user',existingUser)
        if (existingUser) {
            return res.status(400).json({ status: false, message: 'User already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Store registration data temporarily
        const tempUserData = {
            firstName,
            lastName,
            email,
            mobileNo,
            password: hashPassword,
            role,
            otp,
            otpExpiry,
            isVerified: false
        };

        // Create temporary user document
        let tempUser;
        if (!existingUser && !existingUser?.isVerified) {
            tempUser = await user.create(tempUserData);
        }

        await sendOtpEmail(email, otp);
        return res.status(200).json({ 
            status: true, 
            message: 'OTP sent to email', 
            data: { email: tempUser?.email , id : tempUser?._id} 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

const sendOtpEmail = async (toEmail, otp) => {

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 5000,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.verify();
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Your Otp Code',
            text: `Your OTP code is ${otp}`,
        }


        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        throw new Error('Failed to send OTP email');
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const userData = await user.findOne({ email });

        if (!userData) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        // First check if OTP expired
        if (userData.otpExpiry < Date.now()) {
            return res.status(400).json({ status: false, message: 'OTP has expired' });
        }

        // Then check if OTP is correct
        if (userData.otp != otp) {
            return res.status(400).json({ status: false, message: 'Invalid OTP' });
        }

        // Update user verification status
        userData.isVerified = true;
        userData.otp = null;
        userData.otpExpiry = null;
        await userData.save();

        // Generate JWT token for immediate login
        const token = jwt.sign({ _id: userData._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        return res.status(200).json({
            status: true,
            message: 'Registration completed successfully',
            user: userData,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}


exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const userData = await user.findOne({ email });

        if (!userData) {
            return res.status(404).json({ status: false, message: 'User Not Found' });
        }
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        userData.otp = newOtp;
        userData.otpExpiry = otpExpiry;
        await userData.save();

        await sendOtpEmail(email, newOtp);

        return res.status(200).json({ status: true, message: "OTP Resent Successfully......" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password, isAdmin } = req.body; // Add isAdmin flag

        const checkEmail = await user.findOne({ email });

        if (!checkEmail) {
            return res.status(400).json({ status: false, message: "Email not found" });
        }

        // Check if user is verified
        if (!checkEmail.isVerified) {
            return res.status(400).json({ status: false, message: "Please verify your email first" });
        }

        // Check role-based access
        if (isAdmin && checkEmail.role !== "Admin") {
            return res.status(403).json({ status: false, message: "Access denied. Admin access required." });
        }
        if (!isAdmin && checkEmail.role === "Admin") {
            return res.status(403).json({ status: false, message: "Access denied. User access required." });
        }

        const passwordCompare = await bcrypt.compare(password, checkEmail.password);

        if (!passwordCompare) {
            return res.status(400).json({ status: false, message: "Password does not match" });
        }

        const token = jwt.sign({ _id: checkEmail._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        // Optionally omit password from the returned user object
        const { password: _, ...userWithoutPassword } = checkEmail.toObject();

        return res.status(200).json({
            status: true,
            message: "User login successful",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        let userData = await user.findOne({ email });

        if (!userData) {
            return res.status(404).json({ status: false, message: 'User Not Found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        userData.otp = otp;
        userData.otpExpiry = otpExpiry;

        await sendOtpEmail(email, otp);

        await userData.save();

        return res.status(200).json({ status: true, message: 'OTP sent to email' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        // const id = req.user.id;
        const { email } = req.body;

        let userData = await user.findOne({ email });

        if (!userData) {
            return res.status(404).json({ status: false, message: 'User Not Found' });
        }
        let { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.json({ status: 400, message: "New Password And Confirm Password Not Match" })
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(newPassword, salt);

        await user.findOneAndUpdate({ email }, { password: hashPassword }, { new: true })

        return res.json({ status: 200, message: "Password Changed SuccessFully..." })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.socialLogin = async (req, res) => {
    console.log('user', req.body);
    const { firstName, email } = req.body;
    if (!firstName || !email) {
      return res.status(400).json({ error: 'firstName  email are required' });
    }
    const existingUser = await user.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (!process.env.SECRET_KEY) {
        console.error('JWT_SECRET is not configured');
        return res.status(500).json({ error: 'Server configuration error' });
      }
   
      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email
        },
        process.env.SECRET_KEY,
        {
          issuer: 'your-app-name',
          audience: 'your-app-users'
        }
      );
   
      // Update last login time
      existingUser.lastLogin = new Date();
      await existingUser.save();
   
      res.json({
        status: true,
        message: "User login successful",
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          lastLogin: existingUser.lastLogin,
          role: existingUser.role
        }
      });
    }
    else {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      const userData = new user({
        firstName,
        email: email.toLowerCase(),
        otp,
        otpExpiry
      });
      const otpData = await sendOtpEmail(userData.email,otp);
      await userData.save();
      res.status(201).json({
        message: 'User registered successfully',
        user: { firstName: userData.firstName, email: userData.email, id: userData._id },
        otpData
      });
    }
  }