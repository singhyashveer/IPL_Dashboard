
import { useState } from 'react';
import { Match } from '../types';

interface ScheduleProps {
  schedule: Match[];
}

export default function Schedule({ schedule }: ScheduleProps) {
  const [showAll, setShowAll] = useState(false);

  if (!schedule || schedule.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Match Schedule</h2>
        <p className="text-gray-600 text-center py-4">Schedule data not available</p>
      </div>
    );
  }

  const displayedMatches = showAll ? schedule : schedule.slice(0, 5);


  const matchesByDate: { [key: string]: Match[] } = {};
  displayedMatches.forEach(match => {
    const date = match.date;
    if (!matchesByDate[date]) {
      matchesByDate[date] = [];
    }
    matchesByDate[date].push(match);
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center sm:text-left">Match Schedule</h2>

  <div className="space-y-4 sm:space-y-6">
    {Object.entries(matchesByDate).map(([date, matches]) => (
      <div key={date}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 border-b pb-1 sm:pb-2 text-center sm:text-left">
          {new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h3>

        <div className="space-y-2 sm:space-y-3">
          {matches.map(match => (
            <div
              key={match.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-2 sm:mb-0">
                {/* Team A */}
                <div className="flex items-center justify-center sm:justify-end w-full sm:w-32">
                  <img src={match.teamA.logo} alt={match.teamA.name} className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                  <span className="text-sm sm:text-base font-medium">{match.teamA.shortName}</span>
                </div>

                {/* Match Info */}
                <div className="text-center sm:text-left">
                  <div className="text-xs text-gray-500">{match.time}</div>
                  <div className="font-bold text-gray-700 text-sm sm:text-base">VS</div>
                  <div className="text-xs text-gray-500">{match.venue}</div>
                </div>

                {/* Team B */}
                <div className="flex items-center justify-center sm:justify-start w-full sm:w-32">
                  <img src={match.teamB.logo} alt={match.teamB.name} className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                  <span className="text-sm sm:text-base font-medium">{match.teamB.shortName}</span>
                </div>
              </div>

              {/* Match Status */}
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium text-center w-fit mx-auto sm:mx-0 ${
                  match.status === 'live'
                    ? 'bg-red-100 text-red-800'
                    : match.status === 'completed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {match.status === 'live'
                  ? 'LIVE'
                  : match.status === 'completed'
                  ? 'COMPLETED'
                  : 'UPCOMING'}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* Show More/Less Button */}
  {schedule.length > 5 && (
    <div className="text-center mt-4 sm:mt-6">
      <button
        onClick={() => setShowAll(!showAll)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
      >
        {showAll ? 'Show Less' : `View Full Schedule (${schedule.length} matches)`}
      </button>
    </div>
  )}
</div>

  );
}