import React from "react";
import { BiSolidUserCircle } from "react-icons/bi";

function Comments({ datas }) {
  console.log(datas);
  return (
    <>
      {datas?.comments?.map((textObj) => (
        <div
          className=" px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-md w-[90%] mb-3"
          key={textObj?.commentId}
        >
          <p>
            <BiSolidUserCircle size={20} />
          </p>
          <p>{textObj?.text}</p>
        </div>
      ))}
    </>
  );
}

export default Comments;
