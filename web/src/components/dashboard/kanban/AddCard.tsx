import React, { useState } from "react";

const AddCard = ({ addCard }) => {
  const [title, setTitle] = useState("");

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        <input
          className="w-1/5 rounded-lg border-2 px-2"
          placeholder="Card Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="w-1/6 rounded-lg bg-[#004aad] px-3 py-2 text-white"
          onClick={() => {
            addCard(title);
            setTitle("");
          }}
        >
          Add Card
        </button>
      </div>
    </div>
  );
};

export default AddCard;
