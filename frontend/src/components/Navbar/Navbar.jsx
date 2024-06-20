import React, { useState } from "react";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../utilities/constant";

const Navbar = ({ userInfo, onSearchNotes , handleClearSearch}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const onLogOut = (e) => {
    // Cookies.remove('token');
    // navigate("/login");

    e.preventDefault();
    axios
      .get(`${BASE_URL}/logout`, { withCredentials: true })
      .then((res) => {
        // toast.success(res.data.message);
        // used before navigate otherwise you back click back page arrow again you see you are still logged in
        // window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const handleSearch = () => {
    if (searchQuery) {
      // console.log(searchQuery)
      onSearchNotes(searchQuery);
    }
  };

  const onClearSearch = () => {
    //
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      {userInfo ? (
        <ProfileInfo onLogout={onLogOut} userInfo={userInfo} />
      ) : (
        <button className="text-sm text-slate-700 underline" onClick={onLogin}>
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
