
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Match Schedule</h2>
      
      <div className="space-y-6">
        {Object.entries(matchesByDate).map(([date, matches]) => (
          <div key={date}>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            
            <div className="space-y-3">
              {matches.map(match => (
                <div key={match.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center w-32 justify-end">
                      <img src={match.teamA.logo} alt={match.teamA.name} className="w-8 h-8 mr-2" />
                      <span className="font-medium">{match.teamA.shortName}</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500">{match.time}</div>
                      <div className="font-bold text-gray-700">VS</div>
                      <div className="text-xs text-gray-500">{match.venue}</div>
                    </div>
                    
                    <div className="flex items-center w-32">
                      <img src={match.teamB.logo} alt={match.teamB.name} className="w-8 h-8 mr-2" />
                      <span className="font-medium">{match.teamB.shortName}</span>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === 'live' 
                      ? 'bg-red-100 text-red-800' 
                      : match.status === 'completed'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {match.status === 'live' ? 'LIVE' : match.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {schedule.length > 5 && (
        <div className="text-center mt-6">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showAll ? 'Show Less' : `View Full Schedule (${schedule.length} matches)`}
          </button>
        </div>
      )}
    </div>
  );
}