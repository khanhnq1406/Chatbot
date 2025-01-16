declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_BACKEND_URL: string;
      REACT_APP_BACKEND_LOCAL: string;
    }
  }
}

export {};
