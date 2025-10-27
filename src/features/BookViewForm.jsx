import { useState, useEffect } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
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

function BookViewForm({ 
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      console.log("Debounced query:", localQueryString);
      setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  useEffect(() => {
    setLocalQueryString(queryString);
  }, [queryString]);

  function preventRefresh(e) {
    e.preventDefault();
  }

  function handleSortFieldChange(e) {
    setSortField(e.target.value);
  }

  function handleSortDirectionChange(e) {
    setSortDirection(e.target.value);
  }

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledLabel>
        Search book:
        <StyledInput
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
          placeholder="Type to filter..."
        />
      </StyledLabel>
      <StyledButton type="button" onClick={() => setLocalQueryString("")}>
        Clear
      </StyledButton>

      <StyledLabel>
        Sort by:
        <StyledSelect value={sortField} onChange={handleSortFieldChange}>
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
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