import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Heart, Wallet, Loader2 } from "lucide-react";
import axios from "axios";
import { useUser } from "../context/UserContext"; // Assuming user id is here
import "./FloatingChat.css";

interface ChatMessage {
  sender: "user" | "AI";
  text: string;
}

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send custom user message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://localhost:5001/api/Chat/GetResponse",
        {
          userId: user.id,
          type: "custom",
          message: userMessage,
        },
        { withCredentials: true }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: response.data.response }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Error connecting to AI." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Send quick messages (health / expense)
  const sendQuickMessage = async (type: "health" | "expense") => {
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://localhost:5001/api/Chat/GetResponse",
        {
          UserId: user.id,
          Type: type,
          Message: "", // No custom message for quick actions
        },
        { withCredentials: true }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: response.data.response }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Error connecting to AI." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container-fixed">
      {isOpen && (
        <div className="chat-window glass-card">
          <div className="chat-header">
            <div className="chat-title">
              <Sparkles size={18} className="text-indigo-400" />
              <span>AI Oracle</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {/* Initial AI Welcome */}
            {messages.length === 0 && (
              <div className="message ai">
                Welcome, {user?.name || "User"}. Select a data stream or ask anything.
              </div>
            )}

            {/* Quick Action Chips (Only show if no messages yet) */}
            {messages.length === 0 && (
              <div className="quick-actions-box">
                <button className="chip health" onClick={() => sendQuickMessage("health")}>
                  <Heart size={14} /> Health Insight
                </button>
                <button className="chip expense" onClick={() => sendQuickMessage("expense")}>
                  <Wallet size={14} /> Expense Audit
                </button>
              </div>
            )}

            {/* Dynamic Messages */}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === "AI" ? "ai" : "user"}`}>
                {msg.text}
              </div>
            ))}

            {/* Loading Indicator */}
            {isTyping && (
              <div className="message ai typing">
                <Loader2 size={16} className="spinner" /> Thinking...
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-icon-btn" onClick={sendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        className={`chat-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default FloatingChat;