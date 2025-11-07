import { useEffect, useState } from "react";
import { API } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function ViewerDashboard() {
  const { logout, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/content"); // public content
      setPosts(res.data.content);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // ✅ Filter posts by title or author
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.createdBy?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-semibold">Posts Feed</h1>
          <p className="text-gray-400">Viewing as: {user?.name} (Viewer)</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 bg-[#181818] border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400 focus:border-blue-600 outline-none"
          placeholder="Search posts by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <p className="text-gray-500 text-center mt-14">No posts found.</p>
      ) : (
        <div className="space-y-5">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-[#111] p-5 rounded-lg border border-gray-800 hover:border-gray-600 transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>

              <p className="text-gray-300 mb-4 whitespace-pre-line">
                {post.body.length > 250
                  ? post.body.substring(0, 250) + "..."
                  : post.body}
              </p>

              <div className="text-sm text-gray-400 flex justify-between items-center">
                <span>👤 {post.createdBy?.name || "Unknown author"}</span>
                <span className="opacity-60">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
