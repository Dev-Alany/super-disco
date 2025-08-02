'use client';

import { useState } from 'react';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import toast from 'react-hot-toast';

interface QueryResponse {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  chat_id: string;
}

interface QueryFormProps {
  onQuerySubmit: (response: QueryResponse) => void;
}

export default function QueryForm({ onQuerySubmit }: QueryFormProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/query`, { question });
      onQuerySubmit(response.data);
      setQuestion('');
      toast.success('Query submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'An error occurred while processing your query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 p-4  shadow-lg border-t border-gray-200 lg:ml-[30%] lg:mr-4"
    >
      <div className="flex items-center max-w-3xl mx-auto">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a finance-related question (e.g., How should I create a budget for a $50,000 income?)"
          className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
          rows={2}
        />
        <button
          type="submit"
          disabled={loading}
          className={`ml-2 py-2 px-4 bg-green text-white rounded-lg hover:bg-green-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? <PulseLoader color="#fff" size={6} /> : 'Send'}
        </button>
      </div>
    </form>
  );
}