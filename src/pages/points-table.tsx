import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import PointsTable from '../components/PointsTable';
import { PointsTableEntry } from '../types';

export default function PointsTablePage() {
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPointsTableData();
  }, []);

  const fetchPointsTableData = async () => {
    try {
      setLoading(true);
      // Use the dedicated points table API endpoint
      const response = await fetch('/api/points-table');
      if (!response.ok) throw new Error('Failed to fetch points table data');
      const data = await response.json();
      setPointsTable(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching points table:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>IPL Points Table - IPL T20 Live Dashboard</title>
        <meta name="description" content="Current IPL T20 points table and team standings" />
      </Head>

      <div className="w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">IPL Points Table</h1>
          <p className="text-gray-600 mt-2">Current team standings and performance metrics</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading points table...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={fetchPointsTableData}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <PointsTable pointsTable={pointsTable} />
        )}
      </div>
    </Layout>
  );
}