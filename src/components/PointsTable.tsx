
import { PointsTableEntry } from '../types';

interface PointsTableProps {
  pointsTable: PointsTableEntry[];
}

export default function PointsTable({ pointsTable }: PointsTableProps) {
    

  if (!pointsTable || pointsTable.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Points Table</h2>
        <p className="text-gray-600 text-center py-4">Points table data not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Points Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NRR</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pointsTable.map((entry, index) => (
              <tr key={entry.team.id} className={index < 4 ? 'bg-green-50' : index >= pointsTable.length - 2 ? 'bg-red-50' : ''}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{entry.position}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <img src={entry.team.logo} alt={entry.team.name} className="w-6 h-6 mr-2" />
                    {entry.team.shortName}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{entry.matches}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{entry.wins}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{entry.losses}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-center">{entry.points}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-center ${entry.nrr > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.nrr > 0 ? '+' : ''}{entry.nrr.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-green-100 mr-2"></div>
          <span>Qualification zone</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 mr-2"></div>
          <span>Relegation zone</span>
        </div>
      </div>
    </div>
  );
}