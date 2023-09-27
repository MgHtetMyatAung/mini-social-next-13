"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { BiLike, BiSolidLike, BiComment, BiSend } from "react-icons/bi";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import Comments from "./Comments";

async function getPosts() {
  const posts = await axios.get("https://jsonplaceholder.typicode.com/posts");
  return posts.data;
}

function Blogs() {
  const [likes, setLikes] = useState([]);
  const [savePosts, setSavePosts] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [openBox, setOpenBox] = useState({});
  const [openComment, setOpenComment] = useState({});
  const [reacts, setReacts] = useState([
    { emoji: "👍", name: "Like" },
    { emoji: "❤️", name: "Love" },
    { emoji: "🤣", name: "Ha ha" },
    { emoji: "😠", name: "Angry" },
  ]);

  // for react post
  const reactPost = (item) => {
    let alreadyAllExist = likes.find(
      (like) => like.id === item.id && like.emoji == item.emoji
    );
    let alreadyIdExist = likes.find((like) => like.id === item.id);
    if (alreadyAllExist) {
      let removeExistReact = likes.filter((like) => like.id !== item.id);
      setLikes(removeExistReact);
    } else if (alreadyIdExist) {
      setLikes(likes.map((like) => (like.id === item.id ? item : like)));
    } else {
      setLikes([...likes, item]);
    }
  };

  // react box popup
  const clickReactBtn = (id) => {
    if (openBox.id) {
      setOpenBox({});
    } else {
      setOpenBox({ id });
    }
  };

  // comment box popup
  const clickCommentBtn = (id) => {
    if (openComment.id) {
      setOpenComment({});
    } else {
      setOpenComment({ id });
    }
  };

  // add comment
  const addComment = (id) => {
    if (comment) {
      let textObj = {
        id,
        comments: [{ commentId: Math.random(), text: comment }],
      };
      let alreadyIdExist = comments.find((text) => text.id === id);
      if (alreadyIdExist) {
        let addNextComment = comments.map((item) =>
          item.id === id
            ? {
                ...item,
                comments: [
                  ...item.comments,
                  { commentId: Math.random(), text: comment },
                ],
              }
            : item
        );
        setComments(addNextComment);
      } else {
        setComments([...comments, textObj]);
      }

      setComment("");
    }
  };

  // save post
  const savePostFun = (post) => {
    let alreadyIdExist = savePosts.find((save) => save.id === post.id);
    if (alreadyIdExist) {
      let posts = savePosts.filter((data) => data.id !== post.id);
      setSavePosts(posts);
    } else {
      setSavePosts([...savePosts, post]);
    }
  };

  // data fetch
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  if (isLoading) return <p className="">Loading ...</p>;

  if (isError) return <p className="">Error ...</p>;
  return (
    <section className=" py-5">
      <div className=" md:max-w-[500px] mx-auto">
        <div className="">
          {posts.map((post) => (
            <article className=" px-3 py-5 shadow" key={post.id}>
              <h2 className=" text-lg font-semibold mb-3 text-gray-800">
                {post.title}
              </h2>
              <p className=" text-gray-600">{post.body}</p>
              <div className=" mt-8 flex justify-around relative pb-3">
                <div
                  className=" flex items-center gap-3 cursor-pointer text-gray-700 peer"
                  onClick={() => clickReactBtn(post.id)}
                >
                  {/* filter react for each post (will return jsx) */}
                  {likes.map((like) => {
                    if (like.id === post.id) {
                      if (like.name === "Like") {
                        return (
                          <React.Fragment key={like.id}>
                            <BiSolidLike key={like.id} />
                            <span>Like</span>
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment key={like.id}>
                            <span key={like.id}>{like.emoji}</span>
                            <span>{like.name}</span>
                          </React.Fragment>
                        );
                      }
                    }
                  })}
                  {likes.find((like) => like.id === post.id) ? null : (
                    <>
                      <BiLike />
                      <span>Like</span>
                    </>
                  )}
                </div>
                <div
                  className=" flex items-center gap-3 cursor-pointer text-gray-700"
                  onClick={() => clickCommentBtn(post.id)}
                >
                  <BiComment size={20} />
                  <span>comment</span>
                </div>
                <div
                  className=" flex items-center gap-3 cursor-pointer text-gray-700"
                  onClick={() => savePostFun(post)}
                >
                  {savePosts.find((save) => save.id === post.id) ? (
                    <MdFavorite size={20} />
                  ) : (
                    <MdFavoriteBorder size={20} />
                  )}
                  <span>Save</span>
                </div>
                {openBox?.id === post?.id ? (
                  <div className="absolute top-[-40px] left-0 px-3 py-2 items-center rounded-full flex gap-3 bg-gray-100">
                    {reacts.map((react) => (
                      <span
                        className=" hover:scale-105 cursor-pointer"
                        key={react.name}
                        onClick={() => {
                          reactPost({ id: post.id, ...react });
                          setOpenBox({});
                        }}
                      >
                        {react.emoji}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {openComment.id === post.id ? (
                <div className="">
                  <Comments
                    datas={comments.find((data) => data.id === post.id)}
                  />
                  <div className=" flex items-center justify-between rounded-full bg-gray-100 px-3 mt-4 text-sm">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className=" bg-transparent focus:outline-none p-2 w-[90%] text-gray-700"
                      placeholder="write something ..."
                    />
                    <button onClick={() => addComment(post.id)}>
                      <BiSend
                        size={20}
                        className={` ${
                          comment ? " text-gray-700" : "text-gray-500"
                        } transition-all duration-200 active:scale-105`}
                      />
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blogs;
