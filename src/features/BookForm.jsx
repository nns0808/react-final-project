// src/features/BookForm.jsx
import { useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styles from "./BookForm.module.css";

function BookForm({ onAddBook, isSaving }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [about, setAbout] = useState("");
  const [like, setLike] = useState("");
  const [error, setError] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation
    if (!title.trim() || !author.trim()) {
      setError("Please fill out both Title and Author.");
      return;
    }

    setError(""); // Clear previous error

    await onAddBook({
      title,
      author,
      about,
      like,
      isCompleted: false,
      rating: 1,
    });

    setTitle("");
    setAuthor("");
    setAbout("");
    setLike("");
  };

  return (
    <form className={styles.bookForm} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>} {/* <-- display error */}
      
      <TextInputWithLabel
        elementId="title"
        labelText="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextInputWithLabel
        elementId="author"
        labelText="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <TextInputWithLabel
        elementId="about"
        labelText="About"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />
      <TextInputWithLabel
        elementId="like"
        labelText="Like"
        value={like}
        onChange={(e) => setLike(e.target.value)}
      />
      <button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Add Book"}
      </button>
    </form>
  );
}

export default BookForm;
