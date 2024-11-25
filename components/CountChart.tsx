"use client"
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from 'recharts';

const CountChart = ({ boys, girls }: { boys: number, girls: number }) => {
  const data = [
    {
      name: 'Total',
      count: boys + girls,
      fill: '#FFFFFF',
    },
    {
      name: 'Girls',
      count: girls,
      fill: '#FAE27C',
    },
    {
      name: 'Boys',
      count: boys,
      fill: '#C3EBFA',
    },
  ];

  return (
      <div className=" relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={28} data={data}>
            <RadialBar
              label={{ position: 'insideStart', fill: '#fff' }}
              background
              dataKey="count"
              legendType='circle'
            />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
          </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CountChart;