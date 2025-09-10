import React from 'react';

interface ChartProps {
  data: any[];
  type?: 'line' | 'bar' | 'revenue';
}

function Chart({ data, type = 'line' }: ChartProps) {
  if (type === 'revenue') {
    return (
      <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-blue-600 w-12 rounded-t-lg mb-2 transition-all hover:bg-blue-700"
              style={{ 
                height: `${(item.revenue / Math.max(...data.map(d => d.revenue))) * 180}px` 
              }}
            />
            <div className="text-sm font-medium">{item.name}</div>
            <div className="text-xs text-gray-600">${item.revenue}M</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="bg-green-500 w-8 rounded-t-lg mb-2"
            style={{ 
              height: `${(item.engagement / 100) * 180}px` 
            }}
          />
          <div className="text-sm font-medium">{item.name}</div>
          <div className="text-xs text-gray-600">{item.engagement}%</div>
        </div>
      ))}
    </div>
  );
}

export default Chart;