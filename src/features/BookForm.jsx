// src/features/BookForm.jsx
import { useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styles from "./BookForm.module.css";

function BookForm({ onAddBook, isSaving }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [about, setAbout] = useState("");
  const [like, setLike] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) return;

    await onAddBook({ title, author, about, like, isCompleted: false });

    setTitle("");
    setAuthor("");
    setAbout("");
    setLike("");
  };

  return (
    <form className={styles.bookForm} onSubmit={handleSubmit}>
      <TextInputWithLabel elementId="title" labelText="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextInputWithLabel elementId="author" labelText="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <TextInputWithLabel elementId="about" labelText="About" value={about} onChange={(e) => setAbout(e.target.value)} />
      <TextInputWithLabel elementId="like" labelText="Like" value={like} onChange={(e) => setLike(e.target.value)} />
      <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Add Book"}</button>
    </form>
  );
}

export default BookForm;
