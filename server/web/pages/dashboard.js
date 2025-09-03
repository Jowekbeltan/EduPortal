import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard(){
  const [leaders, setLeaders] = useState([]);
  useEffect(()=>{ axios.get('http://localhost:4000/leaderboard').then(r=>setLeaders(r.data)); },[]);
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <ol className="space-y-2">
        {leaders.map(l => (
          <li key={l.id} className="border p-3 rounded flex justify-between">
            <span>{l.displayName || 'Anon'} • Streak {l.currentStreak}</span>
            <span className="font-semibold">{l.points} pts</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
