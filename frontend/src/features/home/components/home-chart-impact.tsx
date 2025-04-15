'use client';

import { useEffect, useState } from 'react';
import { Label, Pie, PieChart } from 'recharts';

const data = [
  {
    data: [{ name: 'Adopt Donation Tree', value: 200 }],
    label: 'Donasi Adopsi Pohon Terkumpul',
    unit: 'Pohon',
    color: '#28b2e0',
  },
  {
    data: [{ name: 'Adopters', value: 300 }],
    label: 'Orang / Instansi Adopsi Pohon',
    unit: 'Orang / Instansi',
    color: '#28b2e0',
  },
  {
    data: [{ name: 'Komunitas', value: 4 }],
    label: 'Komunitas Lokasi Perhutanan Sosial',
    unit: 'Komunitas',
    color: '#28b2e0',
  },
  {
    data: [{ name: 'Tree Adopted', value: 300 }],
    label: 'Batang Pohon Telah Teradopsi',
    unit: 'Pohon',
    color: '#28b2e0',
  },
];

export function HomeChartImpact() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(data.map(() => 0));

  useEffect(() => {
    data.forEach((item, index) => {
      const targetValue = item.data[0].value;
      let currentValue = 0;

      const interval = setInterval(() => {
        currentValue += Math.ceil(targetValue / 50);
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(interval);
        }
        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = currentValue;
          return newValues;
        });
      }, 20);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-4xl font-semibold" style={{ color: '#237277' }}>
          Dampak <span style={{ color: 'black' }}>Tree</span> Adopt
        </h3>
        <p className="text-sm text-muted-foreground">Kolaborasi Jaga Hutan Kita</p>
      </div>
      <div className="flex flex-row gap-4 justify-center mt-12 mb-12">
        {data.map((item, index) => {
          const animatedValue = animatedValues[index];

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <PieChart width={180} height={180}>
                <Pie
                  data={item.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill={item.color}
                  dataKey="value"
                  stroke="none">
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle">
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold">
                              {Math.floor(animatedValue)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-xs">
                              {item.unit}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
              <span className="text-sm">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
