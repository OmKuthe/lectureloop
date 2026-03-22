import { useState } from "react";
import API from "../services/api";

function TeacherUpload() {
  const [file, setFile] = useState(null);
  const [quizCode, setQuizCode] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/quiz/create", formData);
      setQuizCode(res.data.quizCode);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      
      <h1 className="text-4xl font-bold mb-6">LectureLoop</h1>

      <div className="bg-white text-black p-6 rounded-xl shadow-lg">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Generate Quiz
        </button>

        {quizCode && (
  <div className="mt-4 text-center">
    <p className="font-semibold">Quiz Code:</p>
    <p className="text-2xl font-bold text-blue-600">{quizCode}</p>

    <button
      onClick={() => window.location.href = `/dashboard/${quizCode}`}
      className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      View Dashboard
    </button>
  </div>
)}
      </div>
      
    </div>
  );
}

export default TeacherUpload;