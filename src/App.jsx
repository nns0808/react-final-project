// src/App.jsx
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
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    const searchQuery = queryString
      ? `&filterByFormula=SEARCH("${encodeURIComponent(queryString)}",{title})`
      : "";
    return `${baseUrl}?${sortQuery}${searchQuery}`;
  }, [sortField, sortDirection, queryString]);

  // Fetch books from Airtable
  const fetchBooks = useCallback(async () => {
    dispatch({ type: bookActions.fetchBook });
    try {
      const response = await fetch(encodeUrl(), {
        headers: { Authorization: token, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      const data = await response.json();
      dispatch({ type: bookActions.loadBook, records: data.records });
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
      const payload = { records: [{ fields: newBook }] };
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      const data = await response.json();
      dispatch({ type: bookActions.addBook, record: data.records[0] });
      fetchBooks();
    } catch (error) {
      dispatch({ type: bookActions.setLoadError, error: { message: error.message } });
    } finally {
      dispatch({ type: bookActions.endRequest });
    }
  };

  // Update an existing book (title, author, about, like, isCompleted)

const updateBook = async (editedBook) => {
  const originalBook = bookList.find((b) => b.id === editedBook.id);

  // Only editable fields 
  const fields = {
    title: editedBook.title,
    author: editedBook.author,
    about: editedBook.about || "",
    like: editedBook.like || "",
    isCompleted: !!editedBook.isCompleted,
  };

  const payload = {
    records: [
      {
        id: editedBook.id,
        fields,
      },
    ],
  };

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

    // Normalize to the flat shape your reducer expects:
    const normalized = {
      id: rec.id,
      title: rec.fields.title || "",
      author: rec.fields.author || "",
      about: rec.fields.about || "",
      like: rec.fields.like || "",
      isCompleted: rec.fields.isCompleted || false,
      createdTime: rec.createdTime,
    };

    // Update local state with correct shape
    dispatch({ type: bookActions.updateBook, editedBook: normalized });

    // Refresh list from server so filters/pagination reflect updated state
    await fetchBooks();
  } catch (error) {
    // revert local optimistic update (if any) and report error
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
        <Route path="/" element={
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
            setSortField={(field) => dispatch({ type: bookActions.setSortField, payload: field })}
            setSortDirection={(dir) => dispatch({ type: bookActions.setSortDirection, payload: dir })}
            setQueryString={(q) => dispatch({ type: bookActions.setQueryString, payload: q })}
            clearError={() => dispatch({ type: bookActions.clearError })}
          />
        }/>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
