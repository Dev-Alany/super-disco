'use client';

import { useState } from 'react';
import QueryForm from '../components/QueryForm';
import ChatList from '../components/ChatList';
import ChatContent from '../components/ChatContent';

export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [latestResponse, setLatestResponse] = useState<{
    id: string;
    question: string;
    answer: string;
    created_at: string;
    chat_id: string;
  } | null>(null);

  return (
    <main className="min-h-screen flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 bg-accent">
      <div className="w-full lg:w-1/3 lg:max-w-sm border-r border-gray-200 pr-4 mb-4 lg:mb-0">
        <h1 className="text-2xl font-bold mb-4">Personal Finance Q&A</h1>
        <QueryForm
          onQuerySubmit={(response) => {
            setLatestResponse(response);
            setSelectedChatId(response.chat_id);
          }}
        />
        <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
      </div>
      <div className="w-full lg:w-2/3 pl-0 lg:pl-4">
        <ChatContent chatId={selectedChatId} latestResponse={latestResponse} />
      </div>
    </main>
  );
}