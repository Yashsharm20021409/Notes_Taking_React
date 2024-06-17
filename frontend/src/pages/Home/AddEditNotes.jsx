import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import TagInput from "../../Input/TagInput";

const AddEditNotes = ({ noteData, type, onClose }) => {
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState(null);

  // add note
  const addNote = async()=>{}

  // edit note
  const editNote = async()=>{}

  const handleAddNote = ()=>{
    if(!title){
      setError("Please Enter the title");
      return;
    }

    if(!content){
      setError("Please Enter the content");
      return;
    }
    setError("");

    if(type === "edit"){
      editNote()
    }
    else{
      addNote()
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="input-label">TITLE</label>
          <IoMdClose
            className="text-slate-400 cursor-pointer hover:text-black text-xl"
            onClick={onClose}
          />
        </div>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none bg-slate-100 "
          placeholder="ADD TITLE..."
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className=" input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded"
          placeholder="Content"
          rows={10}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        ADD
      </button>
    </div>
  );
};

export default AddEditNotes;
