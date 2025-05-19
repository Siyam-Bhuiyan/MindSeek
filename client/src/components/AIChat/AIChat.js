import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AIChat.css";

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Fetch chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("/api/chat/history");
      setMessages(response.data.reverse());
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    setIsLoading(true);

    // Close any existing event source
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("content", input);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Add message history for context
      const messageHistory = messages.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      formData.append("messageHistory", JSON.stringify(messageHistory));

      // Add user message immediately
      const userMessage = {
        role: "user",
        content: input,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Create placeholder for assistant's response
      const assistantMessage = {
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Send the initial request using POST with authentication
      const token = localStorage.getItem('token');
      await axios.post("/api/chat/stream", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });

      // Set up SSE connection with authentication
      const evtSource = new EventSource(`/api/chat/stream?message=${encodeURIComponent(input)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      eventSourceRef.current = evtSource;

      evtSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.content) {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (lastMessage.role === "assistant") {
              lastMessage.content += data.content;
            }
            return updated;
          });
        }
      };

      evtSource.onerror = (error) => {
        console.error("SSE Error:", error);
        evtSource.close();
        setIsLoading(false);

        // Check if the connection was properly established
        if (evtSource.readyState === EventSource.CLOSED) {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (lastMessage.role === "assistant") {
              lastMessage.content = lastMessage.content || "Connection lost. Please try again.";
            }
            return updated;
          });
        }
      };

      // Add onopen handler to confirm connection
      evtSource.onopen = () => {
        console.log("SSE Connection established");
      };

      // Reset input and file
      setInput("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
      
      // Show error in chat
      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.content = "Sorry, there was an error processing your message. Please try again.";
        }
        return updated;
      });
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user" : "assistant"
            }`}
          >
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,.pdf"
          className="file-input"
        />
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="text-input"
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className="send-button"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
