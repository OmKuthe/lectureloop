// QuizPage.jsx - Simplified version
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function QuizPage() {
  const { quizCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const studentName = location.state?.studentName;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(30);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quiz/${quizCode}`);
        console.log("Quiz loaded:", res.data);
        setQuestions(res.data.questions || []);
        setAnswers(new Array(res.data.questions?.length || 0).fill(null));
      } catch (error) {
        console.error("Error fetching quiz:", error);
        alert("Failed to load quiz. Please try again.");
      }
    };
    fetchQuiz();
  }, [quizCode]);

  // Timer
  useEffect(() => {
    if (timer === 0 && !quizSubmitted) {
      handleNext();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, quizSubmitted]);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[current] = answerIndex;
    setAnswers(newAnswers);
    handleNext();
  };

  const handleNext = () => {
    setTimer(30);
    
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setQuizSubmitted(true);
    try {
      const res = await API.post(`/quiz/${quizCode}/submit`, {
        studentName,
        answers
      });
      
      navigate("/result", { state: res.data });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
      setQuizSubmitted(false);
    }
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span>Time: {timer}s</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Multiple Choice
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <span className="font-semibold text-gray-700 mr-3">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-gray-800">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timer Warning */}
        {timer <= 10 && (
          <div className="text-center text-red-500 font-semibold animate-pulse">
            Hurry up! {timer} seconds remaining
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;