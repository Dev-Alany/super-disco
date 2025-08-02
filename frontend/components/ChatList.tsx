'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';

interface Chat {
  chat_id: string;
  question: string;
  created_at: string;
}

interface ChatListProps {
  onSelectChat: (chatId: string | null) => void;
  selectedChatId: string | null;
}

export default function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`);
        setChats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) return (
    <div className="text-center">
      <PulseLoader color="#38a169" size={10} />
      <p>Loading chats...</p>
    </div>
  );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (chats.length === 0) return <p className="text-center">No chats yet.</p>;

  return (
    <div className="mt-4 space-y-2">
      {chats.map((chat) => (
        <div
          key={chat.chat_id}
          onClick={() => onSelectChat(chat.chat_id)}
          className={`p-3  rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors ${
            selectedChatId === chat.chat_id ? 'border-l-4 border-secondary bg-gray-50' : ''
          }`}
        >
          <p className="font-medium truncate text-sm">{chat.question}</p>
          <p className="text-xs text-gray-500">
            {new Date(chat.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}