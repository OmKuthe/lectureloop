// ResultPage.jsx
import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    navigate("/");
    return null;
  }

  const {
    score,
    total,
    percentage,
    passed,
    feedback,
    detailedResults,
    weakAreas
  } = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Result Card */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 mb-6 text-center ${
          passed ? 'border-green-500 border-t-8' : 'border-red-500 border-t-8'
        }`}>
          <h1 className="text-3xl font-bold mb-4">
            {passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
          </h1>
          
          <div className="text-6xl font-bold mb-4">
            <span className={passed ? 'text-green-600' : 'text-red-600'}>
              {percentage}%
            </span>
          </div>
          
          <p className="text-xl mb-2">
            You scored {score} out of {total}
          </p>
          
          <p className="text-gray-600 mb-6">
            {feedback}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{total - score}</div>
              <div className="text-sm text-gray-600">Wrong Answers</div>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
          >
            Back to Home
          </button>
        </div>

        {/* Weak Areas Section */}
        {weakAreas && weakAreas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">📝 Areas to Review</h2>
            <div className="space-y-4">
              {weakAreas.map((area, idx) => (
                <div key={idx} className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                  <p className="font-semibold mb-2">{area.question}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Correct Answer:</span> {area.correctAnswer}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Explanation:</span> {area.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4">📊 Detailed Results</h2>
          <div className="space-y-4">
            {detailedResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  result.isCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold mb-2">
                      Question {idx + 1}: {result.questionText}
                    </p>
                    <p className="text-sm text-gray-600">
                      Your answer: <span className="font-medium">{result.userAnswer}</span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm text-green-600 mt-1">
                        Correct answer: {result.correctAnswer}
                      </p>
                    )}
                    {result.explanation && (
                      <p className="text-sm text-gray-500 mt-2">
                        📖 {result.explanation}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    {result.isCorrect ? (
                      <span className="text-2xl">✅</span>
                    ) : (
                      <span className="text-2xl">❌</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;