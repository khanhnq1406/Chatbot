export const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL
    : process.env.REACT_APP_BACKEND_URL;
