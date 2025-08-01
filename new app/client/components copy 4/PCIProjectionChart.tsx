import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ProjectionData } from '@/lib/pci-calculations';

interface PCIProjectionChartProps {
  data: ProjectionData[];
  activeTab: "both" | "asphalt" | "concrete";
}

export function PCIProjectionChart({ data, activeTab }: PCIProjectionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-slate-50 rounded">
        <p className="text-slate-600">No data available for chart</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800">{`Year ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  try {
    return (
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              label={{ 
                value: 'PCI Score', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#64748b' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Reference lines for PCI thresholds */}
            <ReferenceLine 
              y={70} 
              stroke="#10b981" 
              strokeDasharray="5 5" 
              opacity={0.7}
            />
            <ReferenceLine 
              y={60} 
              stroke="#f59e0b" 
              strokeDasharray="5 5" 
              opacity={0.7}
            />
            <ReferenceLine 
              y={40} 
              stroke="#ef4444" 
              strokeDasharray="5 5" 
              opacity={0.7}
            />

            {/* Asphalt Lines */}
            {(activeTab === "both" || activeTab === "asphalt") && (
              <>
                <Line
                  type="monotone"
                  dataKey="asphaltNoMaintenance"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  name="Asphalt - No Maintenance"
                />
                <Line
                  type="monotone"
                  dataKey="asphaltWithMaintenance"
                  stroke="#d97706"
                  strokeWidth={3}
                  dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
                  name="Asphalt - With Maintenance"
                />
              </>
            )}

            {/* Concrete Lines */}
            {(activeTab === "both" || activeTab === "concrete") && (
              <>
                <Line
                  type="monotone"
                  dataKey="concreteNoMaintenance"
                  stroke="#64748b"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={{ fill: '#64748b', strokeWidth: 2, r: 4 }}
                  name="Concrete - No Maintenance"
                />
                <Line
                  type="monotone"
                  dataKey="concreteWithMaintenance"
                  stroke="#475569"
                  strokeWidth={3}
                  dot={{ fill: '#475569', strokeWidth: 2, r: 4 }}
                  name="Concrete - With Maintenance"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } catch (error) {
    console.error('Chart rendering error:', error);
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 rounded">
        <p className="text-red-600">Error rendering chart</p>
      </div>
    );
  }
}
