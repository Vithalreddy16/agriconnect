import React, { useState } from "react";
import "./Chatbot.css";
import API from "../api";

function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm AgriBot, ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsgs = [...messages, { from: "user", text: input }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chat", { message: input });
      setMessages([...newMsgs, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error("Frontend chat error:", err.message);
      setMessages([...newMsgs, { from: "bot", text: "⚠️ Error contacting AgriBot!" }]);
    }
    setLoading(false);
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">🌾 AgriBot</div>
      <div className="chatbot-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.from}`}>{m.text}</div>
        ))}
        {loading && <div className="msg bot">🤔 Thinking...</div>}
      </div>
      <form onSubmit={handleSend} className="chatbot-input">
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ask me something..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;