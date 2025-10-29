export const initialState = {
  bookList: [],
  sortField: "createdTime",
  sortDirection: "asc",
  queryString: "",
  isSaving: false,
  isLoading: false,
  errorMessage: null,
};

export const actions = {
  addBook: "addBook",
  fetchBook: "fetchBook",
  loadBook: "loadBook",
  setLoadError: "setLoadError",
  startRequest: "startRequest",
  endRequest: "endRequest",
  updateBook: "updateBook",
  revertBook: "revertBook",
  clearError: "clearError",
  setSortField: "setSortField",
  setSortDirection: "setSortDirection",
  setQueryString: "setQueryString",
};

export function bookReducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchBook:
      return { ...state, isLoading: true, errorMessage: null };

    case actions.loadBook:
      return {
        ...state,
        isLoading: false,
        bookList: action.records.map((record) => ({
          id: record.id,
          title: record.fields.title,
          author: record.fields.author,
          about: record.fields.about || "",
          like: record.fields.like || "",
          isCompleted: record.fields.isCompleted || false,
          rating: record.fields.rating || 0, 
          createdTime: record.createdTime,
        })),
        errorMessage: null,
      };

    case actions.setLoadError:
      return { ...state, isLoading: false, isSaving: false, errorMessage: action.error.message };

    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.addBook: {
      const savedBook = {
        id: action.record.id,
        title: action.record.fields.title,
        author: action.record.fields.author,
        about: action.record.fields.about || "",
        like: action.record.fields.like || "",
        isCompleted: action.record.fields.isCompleted || false,
        rating: action.record.fields.rating || 0, 
        createdTime: action.record.createdTime,
      };
      return { ...state, bookList: [savedBook, ...state.bookList], isSaving: false };
    }

    case actions.endRequest:
      return { ...state, isSaving: false };

    case actions.updateBook:
    case actions.revertBook: {
      const updatedList = state.bookList.map((book) =>
        book.id === action.editedBook.id ? { ...action.editedBook } : book
      );
      const updatedState = { ...state, bookList: updatedList, isSaving: false };
      if (action.error) updatedState.errorMessage = action.error.message;
      return updatedState;
    }

    case actions.clearError:
      return { ...state, errorMessage: null };

    case actions.setSortField:
      return { ...state, sortField: action.payload };

    case actions.setSortDirection:
      return { ...state, sortDirection: action.payload };

    case actions.setQueryString:
      return { ...state, queryString: action.payload };

    default:
      return state;
  }
}


