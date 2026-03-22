import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TeacherUpload from "./pages/TeacherUpload";
import StudentJoin from "./pages/StudentJoin";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<TeacherUpload />} />
        <Route path="/join" element={<StudentJoin />} />
        <Route path="/quiz/:quizCode" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/dashboard/:quizCode" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;