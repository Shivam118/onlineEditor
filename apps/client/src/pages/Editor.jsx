import React, { useCallback, useEffect, useState } from "react";
import styles from "../assets/styles/editor.module.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/userContext";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block", "strike", "link"],
  ["clean"],
  ["code"],
  ["image"],
];

export default function Editor() {
  const { id: documentId } = useParams();
  const { logoutUser } = useUser();
  const [title, setTitle] = useState("Untitled Document");
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const navigate = useNavigate();
  const [userRange, setUserRange] = useState({});

  const user = JSON.parse(localStorage.getItem("AuthUser"));

  useEffect(() => {
    if (localStorage.getItem("AuthToken") == null) {
      navigate("/");
    }
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // to Handle All the Document Changes
  useEffect(() => {
    if (socket == null || quill == null) return;

    quill.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    });

    quill.on("selection-change", (range) => {
      setUserRange(range);
      socket.emit("cursor-changes", { range, username: user.name });
    });

    return () => {
      quill.off("text-change");
      quill.off("selection-change");
    };
  }, [socket, quill]);

  // Load Document from Database
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (doc) => {
      setTitle(doc.title);
      quill.setContents(doc.data);
      quill.enable();
    });

    quill.hasFocus();

    socket.emit("get-document", documentId);
  }, [quill, socket, documentId]);

  // Receive Document Changes.
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.on("receive-changes", (changes) => {
      quill.updateContents(changes);
    });

    socket.on("receive-cursor-changes", (cursors) => {
      console.log(cursors);
      cursors.forEach((cursor) => {
        if (cursor.range === null) return;
        const prevCursors = document.querySelectorAll(".cursor");
        prevCursors.forEach((prevCursor) => {
          prevCursor.remove();
        });
        const cursorSpan = document.createElement("span");
        cursorSpan.className = "cursor";
        cursorSpan.style.opacity = "0.2";
        cursorSpan.style.color = "red";
        cursorSpan.style.position = "absolute";
        cursorSpan.textContent = "█"; // or use some other character
        quill.container.appendChild(cursorSpan);
        const cursorElement = quill.container.lastChild;
        const bounds = quill.getBounds(cursor.range.index);
        cursorElement.style.left = `${bounds.left}px`;
        cursorElement.style.top = `${bounds.top}px`;
      });
    });

    return () => {
      socket.off("receive-changes", (changes) => {
        quill.updateContents(changes);
      });
      socket.off("receive-cursor-changes");
    };
  }, [socket, quill]);

  //   TO SAVE THE DOCUMENT
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", {
        id: documentId,
        data: quill.getContents(),
        user,
        title,
        cursorPosition:
          userRange && userRange.index !== undefined
            ? userRange
            : { range: { index: quill.getLength() - 1 } },
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket, title]);

  const editorRef = useCallback((editor) => {
    if (editor === null) return;

    editor.innerHTML = "";
    const editorWindow = document.createElement("div");
    editor.append(editorWindow);
    const q = new Quill(editorWindow, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText("");
    setQuill(q);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    localStorage.removeItem("AuthUser");
    logoutUser();
    navigate("/");
  };

  return (
    <>
      <header className={styles.header}>
        <span className={styles._header}>
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-document-edit-2653323-2202995.png"
            alt="editor Logo"
            width="30px"
            height="30px"
          />
          <input
            type="text"
            className={styles._title}
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </span>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "150px",
          }}
        >
          <img
            src={user?.photo}
            alt="profile"
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </span>
      </header>
      <div className="editor" id="editor" ref={editorRef}></div>
    </>
  );
}
