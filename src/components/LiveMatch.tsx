import { Match } from '../types';

interface LiveMatchProps {
  match: Match | null;
}

export default function LiveMatch({ match }: LiveMatchProps) {
  if (!match) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Live Match</h2>
        <p className="text-gray-600">Check back during match hours</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Live Match</h2>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
          LIVE
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-center">
          <img src={match.teamA.logo} alt={match.teamA.name} className="w-16 h-16 mx-auto" />
          <h3 className="text-lg font-semibold mt-2">{match.teamA.shortName}</h3>
          <p className="text-2xl font-bold">{match.scoreA}</p>
          <p className="text-sm text-gray-500">{match.oversA} overs</p>
        </div>
        
        <div className="text-center mx-4">
          <p className="text-gray-500">VS</p>
        </div>
        
        <div className="text-center">
          <img src={match.teamB.logo} alt={match.teamB.name} className="w-16 h-16 mx-auto" />
          <h3 className="text-lg font-semibold mt-2">{match.teamB.shortName}</h3>
          <p className="text-2xl font-bold">{match.scoreB}</p>
          <p className="text-sm text-gray-500">{match.oversB} overs</p>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">{match.venue}</p>
      </div>
    </div>
  );
}