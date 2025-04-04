// src/app/page.tsx
'use client';

import { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import anime from 'animejs';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analysis data');
      }
      const result = await response.json();
      setData(result);
      anime({
        targets: '.score-bar',
        scaleY: [0, 1],
        duration: 1200,
        easing: 'easeOutElastic',
      });
    } catch (err) {
      setError('Error fetching analysis data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScore = (category: string) => {
    return data?.categories[category]?.score * 100 || 0;
  };

  const overallScore = (
    (getScore('performance') + getScore('accessibility') + getScore('seo') + getScore('best-practices')) / 4
  ).toFixed(0);

  const chartData = {
    labels: ['Performance', 'Accessibility', 'SEO', 'Best Practices'],
    datasets: [
      {
        data: [
          getScore('performance'),
          getScore('accessibility'),
          getScore('seo'),
          getScore('best-practices'),
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderRadius: 10,
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: ['Overall Score'],
    datasets: [
      {
        data: [overallScore, 100 - overallScore],
        backgroundColor: ['#4CAF50', '#E0E0E0'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-extrabold mb-6 text-blue-700">
        Smart Web Performance Analyzer
      </h1>
      <form onSubmit={analyzeUrl} className="flex flex-col gap-4 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="p-3 border rounded-lg w-full shadow-md"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      {data && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow score-bar">
              <h3 className="text-lg font-medium text-gray-700">Category Scores</h3>
              <Bar data={chartData} options={{ plugins: { legend: { display: false } }, animation: { duration: 2000 } }} />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow flex flex-col items-center score-bar">
              <h3 className="text-lg font-medium text-gray-700">Overall Score</h3>
              <div className="w-40 h-40">
                <Doughnut data={doughnutData} options={{ animation: { animateScale: true } }} />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-4">{overallScore}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
