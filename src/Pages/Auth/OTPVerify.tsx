import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useResendOTPMutation, useVerifyOTPMutation } from "../../redux/features/auth/authApi";
import { useOtpTimer } from "../../hooks/useOtpTimer";


const OTPVerify: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifyOTP] = useVerifyOTPMutation()
  const [resendOTP] = useResendOTPMutation()
  const [timerKey, setTimerKey] = useState(0);

  const secondsLeft = useOtpTimer(timerKey);
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");


  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // keep only last digit
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOTPVerify = async (e: any) => {
    e.preventDefault();

    const email = Cookies.get("resetEmail");

    if (!email) {
      toast.error("Reset Email Not Found!");
      return;
    }

    const otpCode = otp.join("");

    if (otpCode.length < 5) {
      toast.error("Please enter the complete OTP");
      return;
    }

    try {

      const res = await verifyOTP({ email, oneTimeCode: Number(otpCode) }).unwrap();
      if (res?.data) {
        Cookies.set("verifyToken", res?.data?.verifyToken)
        Cookies.remove("resetEmail")
        toast.success(res?.message);
        navigate("/new-password");
      }
    } catch (error: any) {
      console.error("OTP Verify Error:", error);
      toast.error(error?.data?.message);
    }
  };



  const handleResendOtp = async () => {
    setOtp(["", "", "", "", "", ""]);

    try {
      const email = Cookies.get("resetEmail");
      const res = await resendOTP({ email }).unwrap();

      if (res?.success) {
        toast.success(res.message);

        // ⏱ reset expiry
        const expiryTime = Date.now() + 3 * 60 * 1000;
        Cookies.set("otpExpiry", expiryTime.toString());

        // 🔥 force timer restart
        setTimerKey((prev) => prev + 1);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  }


  return (
    <div
      style={{ backgroundImage: `url('/authBg.png')` }}
      className="bg-cover bg-center h-screen flex items-center justify-center relative"
    >
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-[4px] z-5" />

      <Grid
        className="absolute w-full top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
        maxWidth="sm"
        container
        justifyContent="center"
        alignItems="center"
      >
        <div className="bg-cardBg rounded-lg p-6 border border-slate-500/50 w-full">
          <img src="/logo.png" alt="Logo" className="w-20 mb-3 mx-auto" />

          <p className="text-3xl text-center text-primary font-semibold mb-3">
            Verify OTP
          </p>

          <p className="text-center text-textColor text-base mb-7">
            Enter the verification code sent to your email.
          </p>

          <form onSubmit={handleOTPVerify}>
            {/* OTP Inputs */}
            <Box display="flex" justifyContent="center" mb={5} gap={3}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "20px",
                    },
                  }}
                  sx={{
                    width: 60,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-black-200)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffffff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ededed",
                        borderWidth: 2,
                      },
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Box>

            {/* Timer */}
            <div className="text-center mb-5">
              <span className="text-xl font-semibold text-red-200">
                {secondsLeft > 0 ? `${minutes}:${seconds}` : "OTP Expired"}
              </span>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="!bg-primary"
              sx={{
                height: 50,
                borderRadius: "20px",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "16px",
                mb: 2,
              }}
            >
              Verify
            </Button>

            {/* Resend */}
            <Button
              disabled={secondsLeft ? true: false}
              fullWidth
              variant="outlined"
              onClick={handleResendOtp}
              sx={{
                color: "#FF6F61",
                borderColor: "#FF6F61",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "16px",
                borderRadius: "20px",
                background: secondsLeft ? "rgba(2555,255,255, 0.3)" : "transparent"
              }}
            >
              Resend OTP
            </Button>
          </form>
        </div>
      </Grid>
    </div>
  );
};

export default OTPVerify;
