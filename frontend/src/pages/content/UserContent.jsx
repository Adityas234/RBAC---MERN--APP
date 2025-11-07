import { useEffect, useState } from "react";
import { API } from "../../utils/api";

export default function MyContent() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await API.get("/content/my");
      setContent(res.data.content);
    } catch (error) {
      console.log("Error fetching content", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Your Content</h1>

      {content.length === 0 ? (
        <p className="text-gray-400">No content yet.</p>
      ) : (
        <div className="space-y-4">
          {content.map((item) => (
            <div
              key={item._id}
              className="bg-[#111] border border-gray-700 rounded p-4 hover:border-blue-600 transition"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-300 mt-2">{item.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
