import React from "react";
import { AiOutlineEye, AiOutlineDownload, AiOutlineDelete, AiOutlineFile } from "react-icons/ai";
import api from "../lib/axios";

export default function AnalysisCard({ analysis, onDelete }) {
  const handleDelete = async () => {
    if (!confirm("Supprimer cette analyse ?")) return;

    try {
      await api.delete(`http://127.0.0.1:8000/api/analyses/${analysis.id}`);
      onDelete(analysis.id);
    } catch (err) {
      console.error(err);
      alert("Erreur suppression !");
    }
  };

  const handleDownload = () => {
  if (!analysis.result_file) return alert("Résultat non disponible !");
  const url = `http://127.0.0.1:8000/${analysis.result_file.replace('public/', '')}`;
  window.open(url, "_blank");
};


  return (
    <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-6 w-[320px] flex flex-col items-center">
      
      {/* Filename avec icône */}
      <div className="flex items-center w-full mb-2 gap-2">
        <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white flex-shrink-0">
          <AiOutlineFile size={20} />
        </div>
        <h3
          className="text-lg font-semibold text-gray-800 truncate break-all"
          title={analysis.filename}
        >
          {analysis.filename}
        </h3>
      </div>

      {/* Date */}
      <p className="text-sm text-gray-500 mb-4">
        📅 {new Date(analysis.created_at).toLocaleString()}
      </p>

      {/* Boutons */}
      <div className="flex gap-2 w-full">
        <button
          onClick={() => alert(analysis.result)}
          className="flex-[10] flex items-center justify-center gap-2 text-base px-3 py-2 bg-blue-100 text-black rounded-lg hover:bg-blue-300 transition"
        >
          <AiOutlineEye size={20} />
          Voir
        </button>

        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 text-base px-3 py-2 bg-blue-100 text-black rounded-lg hover:bg-blue-300 transition"
        >
          <AiOutlineDownload size={20} /> 
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 flex items-center justify-center gap-2 text-base px-3 py-2 bg-blue-100 text-red-500 rounded-lg hover:bg-blue-300 transition"
        >
          <AiOutlineDelete size={20} /> 
        </button>
      </div>
    </div>
  );
}
