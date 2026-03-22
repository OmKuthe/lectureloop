import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const { quizCode } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/quiz/${quizCode}/analytics`);
      setData(res.data);
    };

    fetchData();
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[350px]">

        <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

        <p className="mb-2">
          👨‍🎓 Total Students: <strong>{data.totalStudents}</strong>
        </p>

        <p>
          📊 Average Score: <strong>{data.averageScore}</strong>
        </p>

      </div>
    </div>
  );
}

export default Dashboard;