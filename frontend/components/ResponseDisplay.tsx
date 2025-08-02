import ReactMarkdown from 'react-markdown';

interface ResponseDisplayProps {
  response: { question: string; answer: string } | null;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  if (!response) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Question:</h2>
      <p className="mb-4">{response.question}</p>
      <h2 className="text-xl font-semibold mb-4">Answer:</h2>
      <div className="markdown">
        <ReactMarkdown>{response.answer}</ReactMarkdown>
      </div>
    </div>
  );
}