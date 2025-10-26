import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../../../../authentication/axios";

export default function DynamicMedicationsChart({ period }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get("/api/patient/medication-intakes/percentages")
      .then((res) => {
        console.log("API Response:", res.data);
        
        let rawData = res.data[period] || [];
        if (!Array.isArray(rawData)) rawData = Object.values(rawData);

        console.log(`Raw ${period} data:`, rawData);

        // Don't filter daily data - show ALL dates
        const grouped = {};
        
        rawData.forEach((item) => {
          let key;
          let sortDate;

          if (period === "daily") {
            // Format: 2025-10-26
            const dateObj = new Date(item.date + "T00:00:00");
            sortDate = dateObj.getTime();
            
            // Format date nicely: "lun. 26 oct"
            key = dateObj.toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
          } else if (period === "weekly") {
            // Backend sends: "20 Oct - 26 Oct"
            key = item.week;
            
            // Parse for sorting
            const currentYear = new Date().getFullYear();
            const startPart = item.week.split(" - ")[0]; // "20 Oct"
            const match = startPart.match(/(\d+)\s+(\w+)/);
            
            if (match) {
              const day = parseInt(match[1]);
              const monthStr = match[2].toLowerCase();
              const months = {
                'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
                'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
                'jan': 0, 'fév': 1, 'mar': 2, 'avr': 3, 'mai': 4, 'juin': 5,
                'juil': 6, 'aoû': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'déc': 11
              };
              const month = months[monthStr] || 9; // default to Oct
              const dateObj = new Date(currentYear, month, day);
              sortDate = dateObj.getTime();
            } else {
              sortDate = Date.now();
            }
          } else if (period === "monthly") {
            // Format: "2025-10"
            const dateObj = new Date(item.month + "-01T00:00:00");
            sortDate = dateObj.getTime();
            
            // Format: "oct. 2025"
            key = dateObj.toLocaleDateString("fr-FR", {
              month: "short",
              year: "numeric",
            });
          }

          if (!key) return;

          if (!grouped[key]) {
            grouped[key] = { 
              date: key, 
              __sortDate: sortDate,
              __rawDate: period === 'daily' ? item.date : null
            };
          }
          
          grouped[key][item.medication_name] = item.percentage;
        });

        // Sort by date
        const groupedArray = Object.values(grouped).sort(
          (a, b) => a.__sortDate - b.__sortDate
        );

        console.log("Final chart data:", groupedArray);
        setData(groupedArray);
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
        setError("Impossible de récupérer les données du serveur.");
      })
      .finally(() => setLoading(false));
  }, [period]);

  const medicationNames = Array.from(
    new Set(
      data.flatMap((d) =>
        Object.keys(d).filter((key) => 
          key !== "date" && 
          key !== "__sortDate" && 
          key !== "__rawDate"
        )
      )
    )
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-3 shadow-lg border rounded-lg">
        <p className="font-bold mb-2 text-gray-900">{label}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-80 text-red-500">
        <div className="text-center">
          <p className="text-xl mb-2">⚠️</p>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!data.length)
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        <div className="text-center">
          <p className="text-xl mb-2">📊</p>
          <p>Aucune donnée disponible pour cette période.</p>
        </div>
      </div>
    );

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

  return (
    <div className="w-full" style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ 
            top: 5, 
            right: 30, 
            left: 20, 
            bottom: 5 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={period === 'weekly' ? -45 : 0}
            textAnchor={period === 'weekly' ? 'end' : 'middle'}
            height={period === 'weekly' ? 80 : 60}
          />
          
          <YAxis 
            domain={[0, 100]} 
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 12 }}
          />
          
          <Tooltip content={CustomTooltip} />
          
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {medicationNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              name={name}
              strokeWidth={2}
              stroke={colors[index % colors.length]}
              dot={{ 
                r: 4, 
                fill: colors[index % colors.length]
              }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}