import styled from "styled-components";

const StyledLabel = styled.label`
  font-weight: bold;
  font-size: 25px;
  color: #16b240ff;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const StyledInput = styled.input`
  padding: 0.3rem;
`;

function TextInputWithLabel({ elementId, labelText, value, inputRef, onChange }) {
  return (
    <StyledLabel htmlFor={elementId}>
      {labelText}
      <StyledInput
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
    </StyledLabel>
  );
}

export default TextInputWithLabel;