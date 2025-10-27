import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import BookForm from "../features/BookForm.jsx";
import BookList from "../features/BookList/BookList.jsx";
import BookViewForm from "../features/BookViewForm.jsx";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 10;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // --- Sorting ---
  let sortedList = [...bookList];

  if (sortField === "newest" || sortField === "createdTime") {
    sortedList.sort(
      (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
    );
  } else if (sortField === "title") {
    sortedList.sort((a, b) =>
      sortDirection === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  } else if (sortField === "author") {
    sortedList.sort((a, b) =>
      sortDirection === "asc"
        ? a.author.localeCompare(b.author)
        : b.author.localeCompare(a.author)
    );
  }

  // --- Filtering (if queryString exists) ---
  const filteredList = sortedList.filter((book) =>
    book.title.toLowerCase().includes(queryString.toLowerCase())
  );

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const indexOfFirstBook = (safeCurrentPage - 1) * itemsPerPage;
  const indexOfLastBook = indexOfFirstBook + itemsPerPage;
  const currentBooks = filteredList.slice(indexOfFirstBook, indexOfLastBook);

  // --- Add new book ---
  const handleAddBook = async (newBook) => {
    try {
      await addBook(newBook);
      
      setSortField("newest");
      setSearchParams({ page: "1" });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // --- Validate current page ---
  useEffect(() => {
    if (
      totalPages > 0 &&
      (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages)
    ) {
      setSearchParams({ page: "1" });
    }
  }, [currentPage, totalPages, setSearchParams]);

  // --- Page navigation ---
  const goToPage = (pageNumber) => {
    const safePage = Math.min(Math.max(pageNumber, 1), totalPages);
    setSearchParams({ page: String(safePage) });
  };

  return (
    <div className={styles.bookPageContainer}>
      {/* Add new book */}
      <BookForm onAddBook={handleAddBook} isSaving={isSaving} />

      {/* Books list */}
      <BookList
        bookList={currentBooks}
        onUpdateBook={updateBook}
        isLoading={isLoading}
      />

      {/* Sorting & search */}
      <BookViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => goToPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={i + 1 === safeCurrentPage ? styles.activePage : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className={styles.error}>
          <p>{errorMessage}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default BookPage;

