const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample Premier League teams
const teams = [
  'Arsenal',
  'Aston Villa',
  'Brighton',
  'Burnley',
  'Chelsea',
  'Crystal Palace',
  'Everton',
  'Leeds United',
  'Leicester City',
  'Liverpool',
  'Manchester City',
  'Manchester United',
  'Newcastle United',
  'Norwich City',
  'Southampton',
  'Tottenham Hotspur',
  'Watford',
  'West Ham United',
  'Wolverhampton Wanderers',
  'Nottingham Forest'
];

const venues = [
  'Emirates Stadium',
  'Villa Park',
  'Amex Stadium',
  'Turf Moor',
  'Stamford Bridge',
  'Selhurst Park',
  'Goodison Park',
  'Elland Road',
  'King Power Stadium',
  'Anfield',
  'Etihad Stadium',
  'Old Trafford',
  'St James\' Park',
  'Carrow Road',
  'St Mary\'s Stadium',
  'Tottenham Hotspur Stadium',
  'Vicarage Road',
  'London Stadium',
  'Molineux Stadium',
  'City Ground'
];

// Function to generate random matches
function generateMatches(count = 10) {
  const matches = [];
  const usedTeams = new Set();
  const today = new Date();

  for (let i = 0; i < count; i++) {
    // Get random teams that haven't played yet
    let homeTeam, awayTeam;
    do {
      homeTeam = teams[Math.floor(Math.random() * teams.length)];
      do {
        awayTeam = teams[Math.floor(Math.random() * teams.length)];
      } while (homeTeam === awayTeam);
    } while (usedTeams.has(homeTeam) || usedTeams.has(awayTeam));

    usedTeams.add(homeTeam);
    usedTeams.add(awayTeam);

    // Generate random date within next 14 days
    const matchDate = new Date(today);
    matchDate.setDate(today.getDate() + Math.floor(Math.random() * 14));
    
    // Generate random time between 12:30 and 20:00
    const hours = Math.floor(Math.random() * (20 - 12 + 1)) + 12;
    const minutes = [0, 30][Math.floor(Math.random() * 2)];
    matchDate.setHours(hours, minutes);

    matches.push({
      idEvent: (i + 1).toString(),
      strEvent: `${homeTeam} vs ${awayTeam}`,
      strHomeTeam: homeTeam,
      strAwayTeam: awayTeam,
      dateEvent: matchDate.toISOString().split('T')[0],
      strTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      strVenue: venues[teams.indexOf(homeTeam)]
    });
  }

  // Sort matches by date and time
  return matches.sort((a, b) => {
    const dateA = new Date(`${a.dateEvent} ${a.strTime}`);
    const dateB = new Date(`${b.dateEvent} ${b.strTime}`);
    return dateA - dateB;
  });
}

// Route to get upcoming soccer events
app.get('/api/upcoming-matches', (req, res) => {
  try {
    console.log('Generating upcoming matches...');
    const matches = generateMatches(10);
    console.log('Matches generated:', matches);
    res.json({ events: matches });
  } catch (error) {
    console.error('Error generating matches:', error.message);
    res.status(500).json({ error: 'Failed to generate matches', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 