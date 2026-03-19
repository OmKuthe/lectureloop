import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, total, percentage } = location.state || {};

  const getMessage = () => {
    if (percentage >= 80) return "🔥 Excellent!";
    if (percentage >= 50) return "👍 Good Effort!";
    return "📚 Revise Again!";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">

      <div className="bg-white text-black p-8 rounded-xl shadow-lg text-center w-[350px]">

        <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>

        <p className="text-lg">Score</p>
        <h2 className="text-4xl font-bold mb-4">
          {score} / {total}
        </h2>

        <p className="text-lg mb-2">Percentage</p>
        <h2 className="text-2xl font-semibold mb-4">
          {percentage}%
        </h2>

        <p className="text-xl font-bold text-blue-600">
          {getMessage()}
        </p>

        <button
          onClick={() => navigate("/join")}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Another Quiz
        </button>

      </div>
    </div>
  );
}

export default ResultPage;