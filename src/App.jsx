import './App.css';
import { useEffect, useCallback, useReducer, useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import BookPage from './pages/BookPage';
import Header from './shared/Header';
import About from './pages/About';
import NotFound from './pages/NotFound';
import {
  bookReducer,
  actions as bookActions,
  initialState as initialBookState,
} from './reducer/book.reducer.jsx';

function App() {
  const [bookState, dispatch] = useReducer(bookReducer, initialBookState);
  const { bookList, isLoading, isSaving, errorMessage, sortField, sortDirection, queryString } = bookState;

  const [title, setTitle] = useState("Book List");
  const location = useLocation();

  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

  // Update header title based on route
  useEffect(() => {
    switch (location.pathname) {
      case "/": setTitle("Book List"); break;
      case "/about": setTitle("About"); break;
      default: setTitle("Not Found");
    }
  }, [location]);

  // Build Airtable URL with sort/search
  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=createdTime&sort[0][direction]=desc`;
    const searchQuery = queryString
      ? `&filterByFormula=SEARCH("${encodeURIComponent(queryString)}",{title})`
      : "";
    return `${baseUrl}?${sortQuery}${searchQuery}`;
  }, [queryString, baseUrl]);

  // Fetch books from Airtable
  const fetchBooks = useCallback(async () => {
    dispatch({ type: bookActions.fetchBook });
    try {
      const response = await fetch(encodeUrl(), {
        headers: { Authorization: token, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      const data = await response.json();

      const normalizedRecords = data.records.map(rec => ({
        ...rec,
        createdTime: rec.createdTime,
      }));

      dispatch({ type: bookActions.loadBook, records: normalizedRecords });
    } catch (error) {
      dispatch({ type: bookActions.setLoadError, error: { message: error.message } });
    }
  }, [encodeUrl, token]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  // Add a new book
  const addBook = async (newBook) => {
    dispatch({ type: bookActions.startRequest });
    dispatch({ type: bookActions.clearError });

    try {
      const payload = {
        records: [
          {
            fields: {
              title: String(newBook.title),
              author: String(newBook.author),
              about: newBook.about ? String(newBook.about) : "",
              like: newBook.like ? String(newBook.like) : "",
              isCompleted: !!newBook.isCompleted,
              rating: newBook.rating != null ? Number(newBook.rating) || 1 : 1,
            },
          },
        ],
      };

      console.log("Payload for Airtable:", JSON.stringify(payload, null, 2));

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);

      const data = await response.json();
      const newRecord = data.records[0];

      // Add new book to state immediately (no need to fetch all again)
      dispatch({ type: bookActions.addBook, record: { ...newRecord, createdTime: newRecord.createdTime } });

    } catch (error) {
      console.error("Error adding book:", error);
      dispatch({ type: bookActions.setLoadError, error: { message: error.message } });
    } finally {
      dispatch({ type: bookActions.endRequest });
    }
  };

  // Update an existing book
  const updateBook = async (editedBook) => {
    const originalBook = bookList.find(b => b.id === editedBook.id);
    const fields = {
      title: String(editedBook.title),
      author: String(editedBook.author),
      about: editedBook.about ? String(editedBook.about) : "",
      like: editedBook.like ? String(editedBook.like) : "",
      isCompleted: !!editedBook.isCompleted,
      rating: editedBook.rating != null ? Number(editedBook.rating) : 0,
    };

    const payload = { records: [{ id: editedBook.id, fields }] };

    try {
      const response = await fetch(baseUrl, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);

      const data = await response.json();
      const rec = data.records[0];

      const normalized = {
        id: rec.id,
        title: rec.fields.title || "",
        author: rec.fields.author || "",
        about: rec.fields.about || "",
        like: rec.fields.like || "",
        isCompleted: rec.fields.isCompleted || false,
        rating: rec.fields.rating || 0,
        createdTime: rec.createdTime,
      };

      dispatch({ type: bookActions.updateBook, editedBook: normalized });

    } catch (error) {
      dispatch({
        type: bookActions.revertBook,
        editedBook: originalBook,
        error: { message: error.message },
      });
    }
  };

  return (
    <>
      <Header title={title} />
      <Routes>
        <Route
          path="/"
          element={
            <BookPage
              bookList={bookList}
              isLoading={isLoading}
              isSaving={isSaving}
              errorMessage={errorMessage}
              sortField={sortField}
              sortDirection={sortDirection}
              queryString={queryString}
              addBook={addBook}
              updateBook={updateBook}
              setSortField={field => dispatch({ type: bookActions.setSortField, payload: field })}
              setSortDirection={dir => dispatch({ type: bookActions.setSortDirection, payload: dir })}
              setQueryString={q => dispatch({ type: bookActions.setQueryString, payload: q })}
              clearError={() => dispatch({ type: bookActions.clearError })}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
