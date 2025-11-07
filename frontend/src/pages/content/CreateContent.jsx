import { useState } from "react";
import { API } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreateContent() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/content", { title, body });
      navigate("/content");
    } catch (error) {
      alert("Error publishing content");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Create Content</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <input
          className="w-full p-3 rounded bg-[#111] border border-gray-700 text-white focus:border-blue-500"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-3 h-48 rounded bg-[#111] border border-gray-700 text-white focus:border-blue-500"
          placeholder="Write your content here…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition">
          Publish
        </button>
      </form>
    </div>
  );
}
