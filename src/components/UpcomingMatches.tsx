
import { Match } from '../types';

interface UpcomingMatchesProps {
  matches: Match[];
}

export default function UpcomingMatches({ matches }: UpcomingMatchesProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Matches</h2>
        <p className="text-gray-600 text-center py-4">No upcoming matches scheduled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Matches</h2>
      <div className="space-y-4">
        {matches.slice(0, 3).map((match) => (
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
            <div className="text-center text-xs text-gray-500 mt-1">
              {match.venue}
            </div>
          </div>
        ))}
      </div>
      {matches.length > 3 && (
        <div className="text-center mt-4">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Upcoming Matches →
          </button>
        </div>
      )}
    </div>
  );
}