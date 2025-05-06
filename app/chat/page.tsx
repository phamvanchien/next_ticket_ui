// 'use client';

// import { useState } from 'react';
// import { useSocket } from '@/hooks/useSocket';

// export default function Chat() {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [input, setInput] = useState('');

//   const { emit } = useSocket((msg: string) => {
//     console.log('📨 Received from server:', msg);
//     setMessages((prev) => [...prev, msg]);
//   });

//   const sendMessage = () => {
//     if (input.trim()) {
//       emit('message', input);
//       setInput('');
//     }
//   };

//   return (
//     <div>
//       <h2>Chat</h2>
//       <ul>
//         {messages.map((msg, i) => (
//           <li key={i}>{msg}</li>
//         ))}
//       </ul>
//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Nhập tin nhắn..."
//       />
//       <button onClick={sendMessage}>Gửi</button>
//     </div>
//   );
// }