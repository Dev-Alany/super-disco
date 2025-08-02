'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { PulseLoader } from 'react-spinners';

interface Query {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

export default function HistoryList() {
  const [history, setHistory] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/history`);
      setHistory(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    setError(null);
    // Note: This clears the UI only; backend storage persists
    // For a real app, add a DELETE /api/history endpoint
  };

  if (loading) return (
    <div className="text-center">
      <PulseLoader color="#38a169" size={10} />
      <p>Loading history...</p>
    </div>
  );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (history.length === 0) return <p className="text-center">No queries yet.</p>;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Query History</h2>
        <button
          onClick={handleClearHistory}
          className="py-1 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear History
        </button>
      </div>
      {history.map((query) => (
        <div key={query.id} className="p-4 mb-4 bg-white rounded-lg shadow-md">
          <p className="font-semibold">{query.question}</p>
          <div className="markdown mt-2">
            <ReactMarkdown>{query.answer}</ReactMarkdown>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Asked on {new Date(query.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}