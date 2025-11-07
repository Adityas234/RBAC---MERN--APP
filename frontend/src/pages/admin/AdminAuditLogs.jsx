import { useEffect, useState } from "react";
import { API } from "../../utils/api";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/audit");
      setLogs(res.data.logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-semibold mb-6">Audit Logs</h1>

      <div className="bg-[#111] border border-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#161616] border-b border-gray-800">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-gray-800">
                <td className="p-3">{log.user?.name}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.target?.name || "-"}</td>
                <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
