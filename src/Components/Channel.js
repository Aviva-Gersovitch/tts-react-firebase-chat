import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { useFirestoreQuery } from "./Firebase";
//Components
import Message from "./Message";

const Channel = ({ user = null }) => {
  const db = getFirestore();
  const messagesRef = db.collection("messages");
  const messages = useFirestoreQuery(messagesRef.orderBy("createdAt", "desc"));

  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef();
  const bottomListRef = useRef();

  const { uid, displayName } = user;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
      messagesRef.add({
        text: trimmedMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        displayName
      });
      // Clear input field
      setNewMessage("");
      // Scroll down to the bottom of the list
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <ul>
        {messages
          ?.sort((first, second) =>
            first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
          )
          ?.map((message) => (
            <li key={message.id}>
              <Message {...message} />
            </li>
          ))}
      </ul>
      <div ref={bottomListRef} />
      <form onSubmit={handleOnSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={handleOnChange}
          placeholder="Enter your message here..."
        />
        <button type="submit" disabled={!newMessage}>
          Send
        </button>
      </form>
    </>
  );
};

Channel.propTypes = {
    user: PropTypes.shape({
      uid: PropTypes.string,
      displayName: PropTypes.string,
      photoURL: PropTypes.string,
    }),
  };

export default Channel;
