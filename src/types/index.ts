export interface Team {
    id: number;
    name: string;
    shortName: string;
    logo: string;
  }
  
  export interface Match {
    id: number;
    teamA: Team;
    teamB: Team;
    date: string;
    time: string;
    venue: string;
    status: 'upcoming' | 'live' | 'completed';
    scoreA?: number;
    scoreB?: number;
    oversA?: number;
    oversB?: number;
  }
  
  export interface PointsTableEntry {
    position: number;
    team: Team;
    matches: number;
    wins: number;
    losses: number;
    points: number;
    nrr: number;
  }
  
  export interface ScrapedData {
    liveMatch: Match | null;
    upcomingMatches: Match[];
    pointsTable: PointsTableEntry[];
    schedule: Match[];
  }

export interface Team {
    id: number;
    name: string;
    shortName: string;
    logo: string;
  }
  
  export interface Match {
    id: number;
    teamA: Team;
    teamB: Team;
    date: string;
    time: string;
    venue: string;
    status: 'upcoming' | 'live' | 'completed';
    scoreA?: number;
    wicketsA?: number;
    oversA?: number;
    scoreB?: number;
    wicketsB?: number;
    oversB?: number;
    result?: string;
    mom?: string; // Man of the Match
  }
  
  export interface PointsTableEntry {
    position: number;
    team: Team;
    matches: number;
    wins: number;
    losses: number;
    points: number;
    nrr: number;
  }
  
  export interface Player {
    id: number;
    name: string;
    team: Team;
    role: string;
    image: string;
  }
  
  export interface PlayerStats {
    player: Player;
    matches: number;
    runs: number;
    average: number;
    strikeRate: number;
    fifties: number;
    hundreds: number;
    wickets?: number;
    economy?: number;
    bestBowling?: string;
  }
  
  export interface TeamStats {
    team: Team;
    matches: number;
    wins: number;
    losses: number;
    highestScore: number;
    lowestScore: number;
    averageScore: number;
    runRate: number;
  }
  
  export interface ScrapedData {
    liveMatch: Match | null;
    upcomingMatches: Match[];
    completedMatches: Match[];
    pointsTable: PointsTableEntry[];
    schedule: Match[];
    playerStats: PlayerStats[];
    teamStats: TeamStats[];
  }
  export interface MatchFilterOptions {
  seasons: number[];
  teams: Team[];
  venues: string[];
  types: string[]; // men, women
}

export interface MatchFilters {
  season: number;
  team: string | null;
  venue: string | null;
  type: string; // men, women
}

export interface MatchLink {
  id: number;
  title: string;
  date: string;
  time: string;
  teamA: Team;
  teamB: Team;
  venue: string;
  season: number;
  type: string;
  matchNumber: string;
  result?: string;
  status: 'upcoming' | 'live' | 'completed';
  scoreA?: number;
  wicketsA?: number;
  oversA?: number;
  scoreB?: number;
  wicketsB?: number;
  oversB?: number;
  mom?: string;
  toss?: string;
}

export interface PlayerStats {
  player: Player;
  matches: number;
  runs: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  wickets?: number;
  economy?: number;
  bestBowling?: string;
}

export interface TeamStats {
  team: Team;
  matches: number;
  wins: number;
  losses: number;
  highestScore: number;
  lowestScore: number;
  averageScore: number;
  runRate: number;
}