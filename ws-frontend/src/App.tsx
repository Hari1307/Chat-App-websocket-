import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState(["hello"]);

  const inputRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages((a) => [...a, event.data]);
    }

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
  }, []);

  const sendMessage = () => {
    const inputMessage = inputRef.current?.value;
    wsRef.current.send(JSON.stringify({
      type: "chat",
      payload: {
        message: inputMessage
      }
    }))
    inputRef.current.value = null;
  }
  return (
    <div>
      <div>
        {messages.map((m, key) => (
          <div key={key}>
            <h1>{m}</h1>
          </div>
        ))}
      </div>
      <div>
        <input ref={inputRef} type="text" placeholder='Enter message' />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default App
