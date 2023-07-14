import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { event: 'Event 1', time: '10:23' },
  { event: 'Event 2', time: '02:34' },
  { event: 'Event 3', time: '03:45' },
  // More data...
];

// Convert "mm:ss" to total seconds
data.forEach((d) => {
  const parts = d.time.split(':');
  d.seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
});

console.log(data)

const formatTick = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const MyLineChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <XAxis dataKey="event" />
      <YAxis tickFormatter={formatTick} />
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />
      <Line type="monotone" dataKey="seconds" stroke="#ff7300" yAxisId={0} />
    </LineChart>
  </ResponsiveContainer>
);

export default MyLineChart;