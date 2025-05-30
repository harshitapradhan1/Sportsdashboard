import React, { useEffect, useState } from 'react';
import { Match, MatchesResponse } from '../types/match';
import './UpcomingMatches.css';

const API_BASE_URL = 'http://localhost:3001';

const UpcomingMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // First check if the server is running
        const healthCheck = await fetch(`${API_BASE_URL}/health`);
        if (!healthCheck.ok) {
          throw new Error('Server is not responding');
        }

        const response = await fetch(`${API_BASE_URL}/api/upcoming-matches`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to fetch matches');
        }
        
        const data: MatchesResponse = await response.json();
        setMatches(data.events || []);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upcoming matches';
        setError(errorMessage);
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return (
    <div className="loading">
      <h2>Loading Matches</h2>
      <p>Fetching the latest fixtures...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <h2>Error Loading Matches</h2>
      <p>{error}</p>
      <p>Please make sure the server is running on port 3001</p>
    </div>
  );

  if (!matches.length) return (
    <div className="no-matches">
      <h2>No Upcoming Matches</h2>
      <p>Check back later for new fixtures</p>
    </div>
  );

  return (
    <div className="upcoming-matches">
      <h1>Premier League Fixtures</h1>
      <div className="matches-grid">
        {matches.map((match) => (
          <div key={match.idEvent} className="match-card">
            <div className="match-teams">
              <span className="team home">{match.strHomeTeam}</span>
              <span className="vs">VS</span>
              <span className="team away">{match.strAwayTeam}</span>
            </div>
            <div className="match-info">
              <div className="date" data-label="Match Date">
                {new Date(match.dateEvent).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
              <div className="time" data-label="Kick-off">
                {match.strTime}
              </div>
              <div className="venue" data-label="Venue">
                {match.strVenue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMatches; 