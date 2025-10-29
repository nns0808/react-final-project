// src/features/BookViewForm.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";

// --- Styled Components ---
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const StyledInput = styled.input`
  padding: 0.3rem;
`;

const StyledSelect = styled.select`
  padding: 0.3rem;
`;

const StyledButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
`;

// --- Component ---
function BookViewForm({ 
  sortField,
  sortDirection,
  queryString,
  setSortField,
  setSortDirection,
  setQueryString,
  clearError,
  setCurrentPage
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString || "");

  // --- Debounced search ---
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
      setCurrentPage(1); // reset page on search
      if (clearError) clearError();
    }, 300);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString, setCurrentPage, clearError]);

  // --- Sync local input with external queryString ---
  useEffect(() => {
    setLocalQueryString(queryString || "");
  }, [queryString]);

  // --- Sort change handlers ---
  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
    setCurrentPage(1); // reset page on sort
  };

  const handleSortDirectionChange = (e) => {
    setSortDirection(e.target.value);
    setCurrentPage(1); // reset page on sort
  };

  const preventRefresh = (e) => e.preventDefault();

 

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledLabel>
        Search book:
        <StyledInput
          type="text"
          placeholder="Type to filter..."
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
      </StyledLabel>

      <StyledButton
        type="button"
        onClick={() => {
          setLocalQueryString("");
          setCurrentPage(1);
        }}
      >
        Clear
      </StyledButton>

      <StyledLabel>
        Sort by:
        <StyledSelect value={sortField} onChange={handleSortFieldChange}>
          <option value="createdTime">Time added</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="rating">Rating</option>
        </StyledSelect>
      </StyledLabel>

      <StyledLabel>
        Direction:
        <StyledSelect value={sortDirection} onChange={handleSortDirectionChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </StyledLabel>
    </StyledForm>
  );
}

export default BookViewForm;
