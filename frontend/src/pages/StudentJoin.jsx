import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentJoin() {
  const [quizCode, setQuizCode] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleJoin = () => {
    if (!quizCode || !name) {
      alert("Enter all fields");
      return;
    }

    // Navigate to quiz page with data
    navigate(`/quiz/${quizCode}`, {
      state: { studentName: name }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Join Quiz</h2>

        <input
          type="text"
          placeholder="Enter Quiz Code"
          value={quizCode}
          onChange={(e) => setQuizCode(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleJoin}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Join
        </button>
      </div>
    </div>
  );
}

export default StudentJoin;