import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { validateEmail } from "../../utilis/helper";
// import { farregeye, faregeyeslash } from "react-icons/fa6";

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please Enter a valid Email address.");
      return;
    }

    if (password.length < 5) {
      setError("Please Keep password Length atleast 5.");
      return;
    }

    setError("");

    // Login Api call
  };

  // remove visible error after 7 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 7000); // 5 seconds

      // Cleanup the timeout if the component unmounts before the timeout is complete
      return () => clearTimeout(timer); // means jab time pura hojay to object jo create hua hai time ka use delete krdo
    }
  }, [error]);

  return (
    <>
      <Navbar />
      <div className="flex item-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
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
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not Registered yet?{" "}
              <Link
                to="/register"
                className="font-medium text-primary underline"
              >
                Create an Account
              </Link>
            </p>
            
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
