
import React, { useEffect, useState } from "react";
import api from "../../../lib/axios";
import Uploader from "./Uploader";
import AnalysisCard from "./AnalysisCard";

export default function AnalysePage() {
  const [analyses, setAnalyses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const analysesPerPage = 6;

  // 🔹 Charger les analyses au montage
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await api.get("http://127.0.0.1:8000/api/analyses");
        setAnalyses(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };
    fetchAnalyses();
  }, []);

  // 🔹 Ajouter nouvelle analyse (mise à jour instantanée)
  const handleUploaded = (newAnalysis) => {
    setAnalyses((prev) => [newAnalysis, ...prev]);
  };

  // 🔹 Supprimer une analyse
  const handleDelete = (id) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  // 🔹 Pagination
  const indexOfLast = currentPage * analysesPerPage;
  const indexOfFirst = indexOfLast - analysesPerPage;
  const currentAnalyses = analyses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(analyses.length / analysesPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="relative min-h-screen bg-[#c8e0f8] p-6 flex flex-col items-center">
      <div className="mb-12">
        <Uploader onUploaded={handleUploaded} />
      </div>
      {/* 🔹 Liste des analyses */}
      <div className="flex flex-wrap gap-4 justify-center mt-10 w-full">
        {currentAnalyses.length > 0 ? (
          currentAnalyses.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-600 text-lg mt-8">Aucune analyse disponible.</p>
        )}
      </div>

      {/* 🔹 Pagination */}
      {analyses.length > analysesPerPage && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="font-medium text-gray-700">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
