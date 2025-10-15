// Uploader.jsx
import React, { useState } from "react";
import api from "../../../lib/axios";
export default function Uploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

 const handleUpload = async () => {
  if (!file) return alert("Choisir un fichier !");
  setLoading(true);

  try {
    const profileRes = await api.get("/api/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const patientId = profileRes.data.patient?.id;  
    if (!patientId) {
      alert("Impossible de récupérer l'ID du patient !");
      setLoading(false);
      return;
    }

    // 🔹 2. إعداد FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_id", patientId);

    // 🔹 3. Envoi vers API analyses
    const res = await api.post("http://127.0.0.1:8000/api/analyses", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    onUploaded(res.data);
    setFile(null);
    setIsOpen(false);
  } catch (err) {
    console.error(err);
    alert("Erreur upload !");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
        📂 Upload a File

        </button>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] shadow-lg relative">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                       📂 File Analysis

            </h2>
            {/* Input file */}
            <label
              htmlFor="file-upload"
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition mb-4"
            >
              <span className="text-gray-600">
                {file ? file.name : "Click to choose a file"}
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            {/* Boutons */}
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`flex-1 px-3 py-2 bg-blue-300 text-white rounded-lg hover:bg-blue-700 transition ${
                  loading || !file ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "⏳ Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
