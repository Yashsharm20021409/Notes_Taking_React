import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utilis/helper";
import axios from "axios";
import { BASE_URL } from "../../utilities/constant";

const Signup = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setName] = useState("");
  const [error, setError] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullname) {
      setError("Please Enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please Enter a valid Email address.");
      return;
    }

    if (!password) {
      setError("Please Enter Password");
      return;
    }

    if (password.length < 5) {
      setError("Please Keep password Length atleast 5.");
      return;
    }

    setError("");

    // Register Api calls
    try {
      const response = await axios.post(
        `${BASE_URL}/register`,
        {
          fullname,
          email,
          password,
        },
        // {withCredentials:true}
      );

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.token) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured. please try again.");
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 7000);

      return () => clearInterval(timer);
    }
  }, [error]);

  return (
    <>
      <Navbar />
      <div className="flex item-center justify-center mt-16">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Register</h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={fullname}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                className="input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex top-4 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {isShowPassword ? (
                  <FaRegEye
                    size={22}
                    className="text-primary cursor-pointer"
                  ></FaRegEye>
                ) : (
                  <FaRegEyeSlash
                    FaRegEye
                    size={22}
                    className="text-primary cursor-pointer"
                  ></FaRegEyeSlash>
                )}
              </span>
            </div>

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
