import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import Uploader from "./Uploader";
import AnalysisCard from "./AnalysisCard";

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      const res = await api.get("http://127.0.0.1:8000/api/analyses");
      setAnalyses(res.data);
    };
    fetchAnalyses();
  }, []);

  const handleUploaded = (newAnalysis) => {
    setAnalyses([newAnalysis, ...analyses]);
  };

  const handleDelete = (id) => {
    setAnalyses(analyses.filter((a) => a.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-[#F8FBFE]">
      <Uploader onUploaded={handleUploaded} />

      <div className="flex flex-wrap justify-center items-center min-h-screen gap-6 pt-24">
  {analyses.map((analysis) => (
    <AnalysisCard
      key={analysis.id}
      analysis={analysis}
      onDelete={handleDelete}
    />
  ))}
</div>

    </div>
  );
}
