"use client"
import Image from 'next/image';
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    name: 'Total',
    count: 150,
    fill: '#FFFFFF',
  },
  {
    name: 'Girls',
    count: 50,
    fill: '#FAE27C',
  },
  {
    name: 'Boys',
    count: 100,
    fill: '#C3EBFA',
  },
];

const CountChart = () => {
  return (
    <div className=' bg-white rounded-lg w-full h-full p-4'>
      {/* title */}
      <div className=" flex justify-between items-center">
        <h1 className=' text-xl font-semibold'>Students</h1>
        <Image src="/moreDark.png" alt='student chart' width={20} height={20} />
      </div>
      {/* chart */}
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
        { /*
        <Image
          src="/maleFemale.png"
          alt='maleFamale'
          width={50}
          height={50}
          className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        />
        */}
      </div>
      {/* bottom */}
      <div className=" flex justify-center gap-16">
        <div className=' flex flex-col gap-1'>
          <div className=" w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className=' font-bold'>1,234</h1>
          <h2 className=' text-xs text-gray-300'>Boys (55%)</h2>
        </div>
        <div className=' flex flex-col gap-1'>
          <div className=" w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className=' font-bold'>1,234</h1>
          <h2 className=' text-xs text-gray-300'>Girls (45%)</h2>
        </div>
      </div>
    </div>
  )
}

export default CountChart;