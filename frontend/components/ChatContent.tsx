'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { PulseLoader } from 'react-spinners';

interface Query {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  chat_id: string;
}

interface ChatContentProps {
  chatId: string | null;
  latestResponse: Query | null;
}

export default function ChatContent({ chatId, latestResponse }: ChatContentProps) {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      const fetchChat = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`);
          setQueries(response.data);
          setError(null);
        } catch (err: any) {
          setError(err.response?.data?.detail || 'Failed to load chat');
          toast.error('Failed to load chat');
        } finally {
          setLoading(false);
        }
      };
      fetchChat();
    } else {
      setQueries([]);
    }
  }, [chatId]);

  useEffect(() => {
    if (latestResponse && latestResponse.chat_id === chatId) {
      setQueries((prev) => {
        const existingIndex = prev.findIndex((q) => q.id === latestResponse.id);
        if (existingIndex >= 0) {
          return prev.map((q, i) => (i === existingIndex ? latestResponse : q));
        }
        return [...prev, latestResponse];
      });
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [latestResponse, chatId]);

  const handleEdit = (query: Query) => {
    setEditingQueryId(query.id);
    setEditedQuestion(query.question);
  };

  const handleRegenerate = async (queryId: string) => {
    if (!editedQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/query`, {
        question: editedQuestion,
        chat_id: chatId,
      });
      setQueries((prev) =>
        prev.map((q) => (q.id === queryId ? response.data : q))
      );
      setEditingQueryId(null);
      toast.success('Query regenerated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to regenerate query');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (answer: string) => {
    navigator.clipboard.writeText(answer);
    toast.success('Answer copied to clipboard!');
  };

  if (!chatId) return <p className="text-center mt-8">Select a chat to view details.</p>;
  if (loading) return (
    <div className="text-center mt-8">
      <PulseLoader color="#38a169" size={10} />
      <p>Loading chat...</p>
    </div>
  );
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (queries.length === 0) return <p className="text-center mt-8">No queries in this chat.</p>;

  return (
    <div className="flex-1 overflow-y-auto p-4 mb-20">
      {queries.map((query) => (
        <div key={query.id} className="mb-6">
          {/* User Message */}
          <div className="flex justify-end mb-2">
            <div className="max-w-md bg-secondary text-white p-3 rounded-lg shadow-md">
              {editingQueryId === query.id ? (
                <div>
                  <textarea
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                    className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
                    rows={2}
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleRegenerate(query.id)}
                      disabled={loading}
                      className={`py-1 px-3 bg-white text-secondary rounded-lg hover:bg-gray-100 transition-colors ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? <PulseLoader color="#38a169" size={6} /> : 'Regenerate'}
                    </button>
                    <button
                      onClick={() => setEditingQueryId(null)}
                      className="py-1 px-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{query.question}</p>
                  <button
                    onClick={() => handleEdit(query)}
                    className="mt-2 text-sm text-white underline hover:text-gray-200"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* AI Response */}
          <div className="flex justify-start">
            <div className="max-w-md  p-3 rounded-lg shadow-md">
              <div className="markdown">
                <ReactMarkdown>{query.answer}</ReactMarkdown>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {new Date(query.created_at).toLocaleString()}
                </p>
                <button
                  onClick={() => handleCopy(query.answer)}
                  className="text-sm text-secondary underline hover:text-green-700"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={contentRef} />
    </div>
  );
}