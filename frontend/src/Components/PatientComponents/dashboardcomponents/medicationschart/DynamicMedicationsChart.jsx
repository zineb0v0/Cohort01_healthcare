// DynamicMedicationsChart.jsx
import React, { useEffect, useState } from "react";
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

  const getCurrentWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get("/api/patient/medication-intakes/percentages")
      .then((res) => {
        let rawData = res.data[period] || [];
        if (!Array.isArray(rawData)) rawData = Object.values(rawData);

        if (period === "daily") {
          const { startOfWeek, endOfWeek } = getCurrentWeekRange();
          rawData = rawData.filter((item) => {
            const date = new Date(item.date);
            return date >= startOfWeek && date <= endOfWeek;
          });
        }

        const grouped = {};
        rawData.forEach((item) => {
          let key;
          let sortDate;

          if (period === "daily") {
            const dateObj = new Date(item.date);
            sortDate = dateObj.getTime();
            key = dateObj.toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
          } else if (period === "weekly") {
            const [startStr, endStr] = item.week.split(" - ");
            const startDate = new Date(startStr + " 00:00:00");
            const endDate = new Date(endStr + " 00:00:00");
            sortDate = startDate.getTime();
            key = `${startDate.toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })} - ${endDate.toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}`;
          } else if (period === "monthly") {
            const dateObj = new Date(item.month + "-01");
            sortDate = dateObj.getTime();
            key = dateObj.toLocaleDateString("fr-FR", {
              month: "short",
              year: "numeric",
            });
          }

          if (!key) return;

          if (!grouped[key]) grouped[key] = { date: key, __sortDate: sortDate };
          grouped[key][item.medication_name] = item.percentage;
        });

        const groupedArray = Object.values(grouped).sort(
          (a, b) => a.__sortDate - b.__sortDate
        );

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
        Object.keys(d).filter((key) => key !== "date" && key !== "__sortDate")
      )
    )
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white p-3 shadow border rounded">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="font-semibold">
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        Chargement des données...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-80 text-red-500">
        {error}
      </div>
    );

  if (!data.length)
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        Aucune donnée disponible pour cette période.
      </div>
    );

  return (
    <div className="w-full min-h-[300px] min-w-[300px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={CustomTooltip} />
          <Legend />
          {medicationNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              strokeWidth={2}
              stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
                index % 5
              ]}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
