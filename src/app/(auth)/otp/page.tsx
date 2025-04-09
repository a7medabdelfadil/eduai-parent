/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef, type ChangeEvent, type RefObject, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "~/_components/Spinner";
import { baseUrl } from "~/APIs/axios";

const OTP = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(180);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs: RefObject<HTMLInputElement>[] = Array.from(
    { length: 6 },
    () => useRef<HTMLInputElement>(null),
  );

  useEffect(() => {
    const emailFromCookie = Cookie.get("email") || "";
    setEmail(emailFromCookie);

    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInput = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (index === undefined || !inputRefs) return;
    
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const prevInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    if (!value && index > 0 && prevInput && prevInput.current) {
      prevInput.current.focus();
    } else if (value && index < inputRefs.length - 1 && nextInput && nextInput.current) {
      nextInput.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const code = otp.join("");

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/email/confirm`, {
        params: {
          email,
          code
        }
      });
      
      if (response.status === 200) {
        Cookie.set("otp", code);
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtpAgain = async () => {
    try {
      const userId = Cookie.get("userId");
      await axios.post(`${baseUrl}/api/v1/auth/resend-otp`, {
        id: userId,
        email
      });
      toast.success(" successfully");
      setTimer(180);
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="grid h-screen grid-cols-2 items-center justify-center bg-bgSecondary duration-300 ease-in max-[1040px]:grid-cols-1">
      <div className="grid items-center justify-center text-center">
        <div className="mb-10 grid">
          <h1 className="font-sans text-[28px] font-bold text-primary">
            Check your Email
          </h1>
          <p className="font-sans text-[20px] font-semibold text-secondary">
            OTP code has been sent to {email}
          </p>
        </div>
        <div className="grid items-center justify-center">
          <form onSubmit={handleSubmit}>
            <div className="mb-12 flex items-center justify-center gap-3">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  className="h-14 w-14 appearance-none rounded-lg border-2 border-borderPrimary p-4 text-center text-2xl font-extrabold text-textPrimary outline-none focus:border-indigo-400 focus:bg-bgPrimary focus:ring-indigo-100"
                  pattern="\d*"
                  maxLength={1}
                  value={value}
                  onChange={e => handleInput(index, e)}
                  required
                />
              ))}
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="grid justify-center gap-3 text-center">
                <button
                  type="submit"
                  className="w-[140px] rounded-xl bg-primary px-4 py-2 text-[18px] font-bold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                >
                  Verify
                </button>
                <p className="font-sans text-[17px] font-semibold text-warning">
                  {formatTime(timer)}
                </p>
                <button
                  onClick={sendOtpAgain}
                  type="button"
                  className="w-[140px] rounded-xl border-2 border-primary px-4 py-2 text-[18px] font-bold text-primary duration-300 ease-in hover:shadow-xl"
                >
                  Send Again
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="flex h-full w-full justify-end">
        <div className="flex h-full w-[600px] items-center  max-[1040px]:hidden">
          <img
            className="-translate-x-[260px]"
            src="images/login.png"
            alt="#"
          />
        </div>
      </div>
    </div>
  );
};

export default OTP;