'use client';

import { useState } from 'react';

export default function TestGitHubPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testMainEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/github');
      const data = await response.json();
      setResults({ endpoint: 'GET /api/github', data, status: response.status });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testDebugEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/github', { method: 'POST' });
      const data = await response.json();
      setResults({ endpoint: 'POST /api/github', data, status: response.status });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testDirectGitHub = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.github.com/rate_limit', {
        headers: {
          'User-Agent': 'GitHub-Portfolio-App',
        },
      });
      const data = await response.json();
      setResults({ endpoint: 'Direct GitHub API', data, status: response.status });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">GitHub API Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testMainEndpoint}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Main Endpoint
          </button>
          
          <button
            onClick={testDebugEndpoint}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Debug Endpoint
          </button>
          
          <button
            onClick={testDirectGitHub}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Direct GitHub
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Testing...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-600 p-4 rounded mb-4">
            <h3 className="font-bold text-red-200">Error:</h3>
            <p className="text-red-100">{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-gray-800 border border-gray-600 p-4 rounded mb-4">
            <h3 className="font-bold mb-2">Results from: {results.endpoint}</h3>
            <p className="text-gray-300 mb-2">Status: {results.status}</p>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-gray-800 border border-gray-600 p-4 rounded">
          <h3 className="font-bold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Make sure your <code className="bg-gray-700 px-1 rounded">GITHUB_TOKEN</code> is set in <code className="bg-gray-700 px-1 rounded">.env.local</code></li>
            <li>Click the test buttons above to test different endpoints</li>
            <li>Check your terminal console for detailed logging</li>
            <li>Compare results to identify where the issue occurs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
