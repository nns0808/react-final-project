import { useState, useEffect } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import styles from "./BookListItem.module.css";

function BookListItem({ book, onUpdateBook }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(book.title);
  const [workingAuthor, setWorkingAuthor] = useState(book.author);
  const [workingAbout, setWorkingAbout] = useState(book.about || "");
  const [workingLike, setWorkingLike] = useState(book.like || "");

  useEffect(() => {
    setWorkingTitle(book.title);
    setWorkingAuthor(book.author);
    setWorkingAbout(book.about || "");
    setWorkingLike(book.like || "");
  }, [book]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!isEditing) return;

    onUpdateBook({
      ...book,
      title: workingTitle,
      author: workingAuthor,
      about: workingAbout,
      like: workingLike,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setWorkingTitle(book.title);
    setWorkingAuthor(book.author);
    setWorkingAbout(book.about || "");
    setWorkingLike(book.like || "");
    setIsEditing(false);
  };

  const handleToggleCompleted = () => {
    onUpdateBook({ ...book, isCompleted: !book.isCompleted });
  };

  return (
    <li className={styles.bookListItem}>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <TextInputWithLabel
            elementId={`edit-title-${book.id}`}
            labelText="Title"
            value={workingTitle}
            onChange={(e) => setWorkingTitle(e.target.value)}
          />
          <TextInputWithLabel
            elementId={`edit-author-${book.id}`}
            labelText="Author"
            value={workingAuthor}
            onChange={(e) => setWorkingAuthor(e.target.value)}
          />
          <TextInputWithLabel
            elementId={`edit-about-${book.id}`}
            labelText="About"
            value={workingAbout}
            onChange={(e) => setWorkingAbout(e.target.value)}
          />
          <TextInputWithLabel
            elementId={`edit-like-${book.id}`}
            labelText="Like"
            value={workingLike}
            onChange={(e) => setWorkingLike(e.target.value)}
          />
          <button type="submit">Update</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <input
            type="checkbox"
            checked={!!book.isCompleted}
            onChange={handleToggleCompleted}
          />
          <span className={book.isCompleted ? styles.completed : ""}>
            {book.title} by {book.author}
          </span>

          {book.about && <span className={styles.about}> — {book.about}</span>}
          {book.like && <span className={styles.like}> | {book.like}</span>}

          {book.createdTime && (
            <span className={styles.createdTime}>
              {" "}
              | Added: {new Date(book.createdTime).toLocaleDateString()}
            </span>
          )}

          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </>
      )}
    </li>
  );
}

export default BookListItem;
