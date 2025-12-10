"use client";

import { useEffect, useState } from "react";

type LeaderboardEntry = {
  id: string;
  playerName: string;
  timeTaken: number;
  status: string;
  createdAt: string;
};

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const json = await res.json();

      const sorted = json.sort(
        (a: LeaderboardEntry, b: LeaderboardEntry) =>
          a.timeTaken - b.timeTaken
      );

      setData(sorted);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this score?")) return;

    await fetch(`/api/leaderboard/${id}`, {
      method: "DELETE",
    });

    fetchLeaderboard();
  };

  const updateName = async (id: string) => {
    if (!newName.trim()) return;

    await fetch(`/api/leaderboard/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: newName }),
    });

    setEditingId(null);
    setNewName("");
    fetchLeaderboard();
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading leaderboard...</div>;
  }

  return (
    <div style={pageWrap}>
      <h1 style={title}>🏆 Escape Room Leaderboard</h1>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Rank</th>
            <th style={th}>Player</th>
            <th style={th}>Time (sec)</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.id} style={tr}>
              <td style={td}>#{index + 1}</td>

              <td style={td}>
                {editingId === entry.id ? (
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={editInput}
                  />
                ) : (
                  entry.playerName
                )}
              </td>

              <td style={td}>{entry.timeTaken}s</td>

              <td style={td}>
                {editingId === entry.id ? (
                  <>
                    <button
                      onClick={() => updateName(entry.id)}
                      style={saveBtn}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={cancelBtn}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(entry.id);
                        setNewName(entry.playerName);
                      }}
                      style={editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageWrap = {
  padding: "40px",
  maxWidth: "900px",
  margin: "0 auto",
};

const title = {
  fontSize: "32px",
  fontWeight: 800,
  marginBottom: "24px",
  textAlign: "center" as const,
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  background: "white",
  borderRadius: "12px",
  overflow: "hidden",
};

const th = {
  background: "#111",
  color: "white",
  padding: "14px",
  textAlign: "left" as const,
};

const tr = {
  borderBottom: "1px solid #ddd",
};

const td = {
  padding: "12px",
};

const editInput = {
  padding: "6px",
  fontSize: "14px",
};

const editBtn = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginRight: "6px",
  borderRadius: "6px",
  cursor: "pointer",
};

const saveBtn = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginRight: "6px",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#95a5a6",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginRight: "6px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};
