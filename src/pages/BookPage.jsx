import { useState, useMemo, useEffect } from "react";
import BookForm from "../features/BookForm";
import BookList from "../features/BookList/BookList";
import BookViewForm from "../features/BookViewForm";
import styles from "./BookPage.module.css";

function BookPage({
  bookList,
  isLoading,
  isSaving,
  errorMessage,
  sortField,
  sortDirection,
  queryString,
  addBook,
  updateBook,
  setSortField,
  setSortDirection,
  setQueryString,
  clearError,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  // Reset to page 1 whenever search or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [queryString, sortField, sortDirection]);

  // --- Add new book handler ---
  const handleAddBook = async (newBook) => {
    try {
      await addBook({ ...newBook, rating: newBook.rating ?? 1 });
      setCurrentPage(1); // always show page 1 for new book
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // --- Filter books ---
  const filteredList = useMemo(() => {
    if (!queryString) return bookList;
    return bookList.filter(
      (book) => book.title?.toLowerCase().includes(queryString.toLowerCase())
    );
  }, [bookList, queryString]);

  // --- Sort books ---
  const sortedList = useMemo(() => {
    const sorted = [...filteredList];

    switch (sortField) {
      case "title":
        sorted.sort((a, b) =>
          sortDirection === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        );
        break;

      case "author":
        sorted.sort((a, b) =>
          sortDirection === "asc"
            ? a.author.localeCompare(b.author)
            : b.author.localeCompare(a.author)
        );
        break;

      case "rating":
        sorted.sort((a, b) =>
          sortDirection === "asc"
            ? (a.rating ?? 0) - (b.rating ?? 0)
            : (b.rating ?? 0) - (a.rating ?? 0)
        );
        break;

      default:
        // Default: newest first
        sorted.sort(
          (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
        );
        break;
    }

    return sorted;
  }, [filteredList, sortField, sortDirection]);

  // --- Pagination ---
  const totalPages = Math.ceil(sortedList.length / booksPerPage);
  const startIdx = (currentPage - 1) * booksPerPage;
  const currentBooks = sortedList.slice(startIdx, startIdx + booksPerPage);

  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePrevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className={styles.bookPage}>
      <BookViewForm
        sortField={sortField}
        sortDirection={sortDirection}
        queryString={queryString}
        setSortField={setSortField}
        setSortDirection={setSortDirection}
        setQueryString={setQueryString}
        clearError={clearError}
        setCurrentPage={setCurrentPage}
      />

      <BookForm onAddBook={handleAddBook} isSaving={isSaving} />

      {isLoading && <p>Loading books...</p>}
      {errorMessage && <p className={styles.error}>Error: {errorMessage}</p>}

      <BookList bookList={currentBooks} onUpdateBook={updateBook} />

      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookPage;
