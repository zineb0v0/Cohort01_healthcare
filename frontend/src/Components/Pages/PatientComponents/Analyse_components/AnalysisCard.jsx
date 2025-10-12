import React, { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineDownload,
  AiOutlineDelete,
  AiOutlineFile,
  AiOutlineClose,
} from "react-icons/ai";
import api from "../../../../lib/axios.js";

export default function AnalysisCard({ analysis, onDelete }) {
  const [showPopup, setShowPopup] = useState(false); 
  const [showConfirm, setShowConfirm] = useState(false); 

  const handleDelete = async () => {
    try {
      await api.delete(`http://127.0.0.1:8000/api/analyses/${analysis.id}`);
      onDelete(analysis.id);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("Erreur suppression !");
    }
  };

  const handleDownload = () => {
    if (!analysis.result_file) return alert("Résultat non disponible !");
    const url = `http://127.0.0.1:8000/storage/${analysis.result_file}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-4 w-[300px] flex flex-col items-center relative">
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
          onClick={() => setShowPopup(true)}
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
          onClick={() => setShowConfirm(true)}
          className="flex-1 flex items-center justify-center gap-2 text-base px-3 py-2 bg-blue-100 text-red-500 rounded-lg hover:bg-blue-300 transition"
        >
          <AiOutlineDelete size={20} />
        </button>
      </div>

      {/* Popup Résultat */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-3 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
              <h2 className="text-xl font-bold text-blue-600">
                Résultat d’analyse IA
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
              {analysis.result || "Aucun résultat disponible."}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Confirmation de suppression */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[350px] animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              ❌ Supprimer cette analyse ?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Cette action est <span className="text-red-500 font-semibold">irréversible</span>.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
