import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { ScrapedData, Match } from '../types';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scrape');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result: ScrapedData = await response.json();
      
      // Combine all matches
      const allMatches = [
        ...(result.upcomingMatches || []),
        ...(result.completedMatches || []),
        ...(result.liveMatch ? [result.liveMatch] : [])
      ];
      
      setMatches(allMatches);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return match.status === 'upcoming';
    if (filter === 'completed') return match.status === 'completed';
    return true;
  });

  return (
    <Layout>
      <Head>
        <title>IPL Matches - IPL T20 Live Dashboard</title>
        <meta name="description" content="IPL T20 match schedule, results and live scores" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IPL Matches</h1>
          <p className="text-gray-600 mt-2">Schedule, results and live scores</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            All Matches
          </button>
          <button
            className={`py-2 px-4 font-medium ${filter === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`py-2 px-4 font-medium ${filter === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('completed')}
          >
            Results
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={fetchData}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">No matches found</p>
              </div>
            ) : (
              filteredMatches.map((match) => (
                <div key={match.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <img src={match.teamA.logo} alt={match.teamA.name} className="w-10 h-10 mr-3" />
                          <span className="font-semibold">{match.teamA.shortName}</span>
                        </div>
                        
                        <div className="text-center mx-2">
                          <div className="text-xs text-gray-500">{match.time}</div>
                          <div className="font-bold text-lg">VS</div>
                          <div className="text-xs text-gray-500">
                            {new Date(match.date).toLocaleDateString('en-US', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <img src={match.teamB.logo} alt={match.teamB.name} className="w-10 h-10 mr-3" />
                          <span className="font-semibold">{match.teamB.shortName}</span>
                        </div>
                      </div>
                      
                      <div className="text-center text-sm text-gray-600 mb-4">
                        {match.venue}
                      </div>
                      
                      {match.status === 'completed' && match.result && (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-800">{match.result}</p>
                          {match.mom && (
                            <p className="text-xs text-gray-600 mt-1">MOM: {match.mom}</p>
                          )}
                        </div>
                      )}
                      
                      {match.status === 'live' && (
                        <div className="text-center">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <span className="flex h-2 w-2 mr-2">
                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            LIVE
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-xl font-bold">{match.scoreA}/{match.wicketsA}</p>
                              <p className="text-xs text-gray-500">{match.oversA} overs</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-bold">{match.scoreB}/{match.wicketsB}</p>
                              <p className="text-xs text-gray-500">{match.oversB} overs</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        match.status === 'live' 
                          ? 'bg-red-100 text-red-800' 
                          : match.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {match.status === 'live' ? 'LIVE' : match.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}