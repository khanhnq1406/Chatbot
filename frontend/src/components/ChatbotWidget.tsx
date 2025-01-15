import React, { useState, useRef, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";

interface Message {
  sender: string;
  text: string;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);
  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages([...messages, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to fetch response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await sendMessage();
    }
  };

  useEffect(() => {
    const element = messagesRef.current;
    if (element) {
      element["scrollTop"] = element["scrollHeight"];
    }
  }, [messages]);
  return (
    <div className="chatbot-widget">
      {!isOpen && (
        <button className="chat-toggle" onClick={toggleChat}>
          Chat
        </button>
      )}

      {isOpen && (
        <div className="chat-interface">
          <ChatHeader onToggleChat={toggleChat} />

          <div className="messages" ref={messagesRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="text">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message typing">
                Typing
                <span className="dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            )}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage} disabled={loading}>
              <img style={{ width: "20px" }} src="/send.png" alt="Send" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
