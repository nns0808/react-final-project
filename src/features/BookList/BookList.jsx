import BookListItem from "./BookListItem";
import styles from "./BookList.module.css";

function BookList({ bookList, onUpdateBook, isLoading }) {
  if (isLoading) {
    return <p>Loading books...</p>;
  }

  if (!bookList || bookList.length === 0) {
    return <p>No books found.</p>;
  }

  // Filter out completed books
  const visibleBooks = bookList.filter((book) => !book.isCompleted);

  return (
    <ul className={styles.bookList}>
      {visibleBooks.map((book) => (
        <BookListItem key={book.id} book={book} onUpdateBook={onUpdateBook} />
      ))}
    </ul>
  );
}

export default BookList;


