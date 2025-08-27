import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import LiveMatch from '../components/LiveMatch';
import UpcomingMatches from '../components/UpcomingMatches';
import PointsTable from '../components/PointsTable';
import Schedule from '../components/Schedule';
import { ScrapedData } from '../types';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState<ScrapedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    
    // Set up interval to fetch data periodically
    const interval = setInterval(fetchData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scrape');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result: ScrapedData = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>IPL T20 Live Dashboard</title>
        <meta name="description" content="Real-time IPL T20 match information" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">IPL T20 Live Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-2">
            {data && <LiveMatch match={data.liveMatch} />}
          </div>
          
          <div>
            {data && <UpcomingMatches matches={data.upcomingMatches} />}
          </div>
          
          <div>
            {data && <PointsTable pointsTable={data.pointsTable} />}
          </div>
          <div className="mb-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-gray-800">Points Table</h2>
    <Link legacyBehavior href="/points-table">
      <a className="text-blue-600 hover:text-blue-800 text-sm font-medium">
        View Full Table →
      </a>
    </Link>
  </div>
  {data && <PointsTable pointsTable={data.pointsTable} />}
</div>

        </div>
        
        <div className="mb-8">
          {data && <Schedule schedule={data.schedule} />}
        </div>
      </div>
    </Layout>
  );
}