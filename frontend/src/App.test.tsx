import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

describe("Chatbot Component", () => {
  test("renders chatbot and opens/closes widget", () => {
    render(<App />);
    const openButton = screen.getByText("Chat");
    fireEvent.click(openButton);

    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();

    const closeButton = document.querySelector(".close");
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    expect(
      screen.queryByPlaceholderText("Type your message...")
    ).not.toBeInTheDocument();
  });

  test("sends a message and displays it", async () => {
    render(<App />);
    const openButton = screen.getByText("Chat");
    fireEvent.click(openButton);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = document.querySelector(".send");

    fireEvent.change(input, { target: { value: "Hello!" } });
    if (sendButton) {
      fireEvent.click(sendButton);
    }

    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
});
