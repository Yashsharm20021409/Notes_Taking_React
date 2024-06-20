import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/NoteCard/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utilities/constant";
import Cookies from "js-cookie";
import moment from "moment";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/images/add-notes.svg";
import NoDataImg from "../../assets/images/no-data.svg"

const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [notes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [showToastMsg, setToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const navigate = useNavigate();

  // handle Edit
  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({
      isShown: true,
      data: noteDetails,
      type: "edit",
    });
  };

  // Get user Info
  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-user`, {
        withCredentials: true,
      });

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }

      // console.log(userInfo);
    } catch (error) {
      if (error.response.status === 401) {
        Cookies.remove("token");
        navigate("/login");
      }
    }
  };

  // Get all Notes
  const getAllNotes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-all-notes`, {
        withCredentials: true,
      });

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
        // console.log(response.data.notes);
      }

      // console.log(response);
    } catch (error) {
      console.log("An unexpected error occured. please try again later");
    }
  };

  // delete Note
  const deleteNote = async (data) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/delete-note/${data?._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data && !response.data.error) {
        showToastMessage("Note deleted Successfully", "delete");
        getAllNotes();
        // onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occured. please try again later");
      }
    }
  };

  // Seach notes
  const onSearchNotes = async (query) => {
    // console.log(query)
    try {
      const response = await axios.get(
        `${BASE_URL}/search-notes`,
        {
          params: { query },
          withCredentials: true,
        }
      );

      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) =>{
    // console.log("ok",!noteData?._id?.isPinned);
    try {
      const response = await axios.put(
        `${BASE_URL}/update-note-pinned/${noteData?._id}`,
        {
          isPinned:!noteData?._id?.isPinned
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully","edit")
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const showToastMessage = (message, type) => {
    setToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setToastMsg({
      isShown: false,
      message: "",
    });
  };

  const handleClearSearch = () =>{
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();

    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNotes={onSearchNotes} handleClearSearch={handleClearSearch}/>

      <div className="container mx-auto">
        {notes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8 ml-3 mr-3">
            {notes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={moment(item.createdOn).format("Do MMM YYYY")}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinned={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg :AddNotesImg}
            message={isSearch ? `Oops! No notes found matching your search`:`Start Creating your first note! Click the  'ADD' button to note down your thoughts , 
              ideas and remainders. Let's get started! `}
          />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-2 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          setOpenAddEditModel={setOpenAddEditModel}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
