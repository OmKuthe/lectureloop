import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">

      <h1 className="text-5xl font-bold mb-10">LectureLoop</h1>

      <div className="flex gap-8">

        {/* Create Quiz */}
        <div
          onClick={() => navigate("/create")}
          className="bg-white text-black p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-2">👨‍🏫 Create Quiz</h2>
          <p>Upload notes and generate quiz</p>
        </div>

        {/* Join Quiz */}
        <div
          onClick={() => navigate("/join")}
          className="bg-white text-black p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-2">👨‍🎓 Join Quiz</h2>
          <p>Enter code and attempt quiz</p>
        </div>

      </div>
    </div>
  );
}

export default Home;