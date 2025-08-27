import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import LiveMatch from '../components/LiveMatch';
import UpcomingMatches from '../components/UpcomingMatches';
import PointsTable from '../components/PointsTable';
import Schedule from '../components/Schedule';
import { ScrapedData, Match, PointsTableEntry } from '../types';

export default function Home() {
  const [data, setData] = useState<ScrapedData | null>(null);
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchPointsData();
    fetchMatchesData();
    
    // Set up interval to fetch data periodically
    const interval = setInterval(() => {
      fetchData();
      fetchPointsData();
      fetchMatchesData();
    }, 60000); // Update every minute
    
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

  const fetchPointsData = async () => {
    try {
      const response = await fetch('/api/points-table');
      if (response.ok) {
        const data = await response.json();
        setPointsTable(data);
      }
    } catch (error) {
      console.error('Error fetching points table:', error);
    }
  };

  const fetchMatchesData = async () => {
    try {
      const response = await fetch('/api/match-links?season=2025&type=men');
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-600">Loading IPL data...</span>
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
          <button 
            onClick={fetchData}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  // Get live match if available
  const liveMatch = matches.find(match => match.status === 'live') || data?.liveMatch;
  
  // Get upcoming matches (next 3)
  const upcomingMatches = matches
    .filter(match => match.status === 'upcoming')
    .slice(0, 3);
  
  // Get recent completed matches (last 3)
  const recentMatches = matches
    .filter(match => match.status === 'completed')
    .slice(0, 3);

  return (
    <Layout>
      <Head>
        <title>IPL T20 Live Dashboard</title>
        <meta name="description" content="Real-time IPL T20 match information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">IPL T20 Live Dashboard</h1>
        
        <div className="mb-8">
          {liveMatch ? (
            <LiveMatch match={liveMatch} />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Live Match</h2>
              <p className="text-gray-600">Check back during match hours</p>
              {upcomingMatches.length > 0 && (
                <p className="text-blue-600 mt-2">
                  Next match: {upcomingMatches[0].teamA.shortName} vs {upcomingMatches[0].teamB.shortName} on {' '}
                  {new Date(upcomingMatches[0].date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {matches.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-gray-600">Matches Played</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {matches.filter(m => m.status === 'upcoming').length}
            </div>
            <div className="text-gray-600">Upcoming Matches</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {liveMatch ? 1 : 0}
            </div>
            <div className="text-gray-600">Live Matches</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Upcoming Matches</h2>
                  <Link legacyBehavior href="/matches">
                    <a className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All Matches →
                    </a>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {upcomingMatches.length > 0 ? (
                  <UpcomingMatches matches={upcomingMatches} />
                ) : (
                  <p className="text-gray-600 text-center py-4">No upcoming matches scheduled</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Points Table</h2>
                  <Link legacyBehavior href="/points-table">
                    <a className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Full Table →
                    </a>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {pointsTable.length > 0 ? (
                  <PointsTable pointsTable={pointsTable.slice(0, 4)} />
                ) : (
                  <p className="text-gray-600 text-center py-4">Points table data not available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Recent Matches</h2>
                <Link legacyBehavior href="/matches">
                  <a className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Matches →
                  </a>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentMatches.length > 0 ? (
                <div className="space-y-4">
                  {recentMatches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <img src={match.teamA.logo} alt={match.teamA.name} className="w-8 h-8 mr-2" />
                          <span className="font-medium">{match.teamA.shortName}</span>
                        </div>
                        <span className="text-gray-500 font-bold">VS</span>
                        <div className="flex items-center">
                          <img src={match.teamB.logo} alt={match.teamB.name} className="w-8 h-8 mr-2" />
                          <span className="font-medium">{match.teamB.shortName}</span>
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-600">
                        {new Date(match.date).toLocaleDateString()} • {match.time}
                      </div>
                      {match.result && (
                        <div className="text-center text-xs text-green-600 mt-1 font-medium">
                          {match.result}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No recent matches</p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Match Schedule</h2>
                <Link legacyBehavior href="/matches">
                  <a className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Full Schedule →
                  </a>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {matches.length > 0 ? (
                <Schedule schedule={matches.slice(0, 5)} />
              ) : (
                <p className="text-gray-600 text-center py-4">Schedule data not available</p>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Explore More IPL Statistics</h2>
          <p className="mb-6">Dive deeper into player performances, team stats, and match analytics</p>
          <Link legacyBehavior href="/stats">
            <a className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              View Detailed Stats
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}