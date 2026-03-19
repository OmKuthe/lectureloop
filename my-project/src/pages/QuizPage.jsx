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
  const [timer, setTimer] = useState(15);

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await API.get(`/quiz/${quizCode}`);
      setQuestions(res.data.questions);
    };
    fetchQuiz();
  }, []);

  // Timer
  useEffect(() => {
    if (timer === 0) {
      handleNext();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswer = (index) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);
    handleNext();
  };

  const handleNext = () => {
    setTimer(15);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const res = await API.post(`/quiz/${quizCode}/submit`, {
      studentName,
      answers,
    });

    navigate("/result", { state: res.data });
  };

  if (!questions.length) return <h2 className="text-center mt-10">Loading...</h2>;

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-300 absolute top-0">
        <div
          className="h-2 bg-green-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-1 bg-red-200 absolute top-2">
        <div
          className="h-1 bg-red-500 transition-all duration-1000"
          style={{ width: `${(timer / 15) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white text-black p-8 rounded-2xl shadow-xl w-[500px] text-center">

        <h2 className="text-lg font-semibold mb-2">
          Question {current + 1} / {questions.length}
        </h2>

        <p className="text-xl font-bold mb-6">{q.question}</p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`p-3 rounded-xl text-white font-semibold transition transform hover:scale-105
                ${i === 0 && "bg-yellow-500 hover:bg-yellow-600"}
                ${i === 1 && "bg-green-500 hover:bg-green-600"}
                ${i === 2 && "bg-purple-500 hover:bg-purple-600"}
                ${i === 3 && "bg-red-500 hover:bg-red-600"}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default QuizPage;