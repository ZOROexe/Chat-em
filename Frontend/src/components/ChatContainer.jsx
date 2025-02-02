import React, { useEffect, useRef, useState } from "react";
import { useMsgStore } from "../store/msgStore";
import { ChatHeader } from "./ChatHeader.jsx";
import { SendMsg } from "./SendMsg.jsx";
import { MsgLoading } from "./MsgLoading.jsx";
import { useAuth } from "../store/authStore.js";
import correctDate from "../lib/utils.js";
export const ChatContainer = () => {
  const {
    getUsers,
    messages,
    getMessages,
    selectedUser,
    markMessageAsRead,
    isGettingMessages,
    connectToMessages,
    disconnectFromMessages,
  } = useMsgStore();
  const { authUser } = useAuth();
  const messageRef = useRef(null);

  useEffect(() => {
    getUsers();
    getMessages(selectedUser._id);
    markMessageAsRead(selectedUser._id);
    connectToMessages();

    return () => disconnectFromMessages();
  }, [
    messages,
    selectedUser,
    getMessages,
    connectToMessages,
    disconnectFromMessages,
    markMessageAsRead,
    getUsers,
  ]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  if (isGettingMessages) return <MsgLoading />;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser.user._id ? "chat-end" : "chat-start"
            }`}
            /*  ref={messageRef} */
            ref={index === messages.length - 1 ? messageRef : null}
          >
            {" "}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser.user._id
                      ? authUser.user.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {correctDate(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageRef}></div>
      </div>
      <SendMsg />
    </div>
  );
};
