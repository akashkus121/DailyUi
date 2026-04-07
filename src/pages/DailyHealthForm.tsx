import { useEffect, useState } from "react";
import { DailyHealthSubmit, getHealthReport } from "../api/authApi";
import { Line } from "react-chartjs-2";
import { Activity, Moon, Coffee, Smile, Filter, Send, Sparkles, Table as TableIcon, User } from "lucide-react";
import QuickActions from "../components/QuickActions";
import "./DailyHealth.css"; // We'll create this next
import { useLocation } from "react-router-dom";
import UserProfile from "../components/User";

const DailyHealthForm = () => {
  const [sleepHours, setSleepHours] = useState(0);
  const [foodItems, setFoodItems] = useState("");
  const [mood, setMood] = useState(0);
  const [drink, setDrink] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const location = useLocation();

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await DailyHealthSubmit({ SleepHours: sleepHours, FoodItems: foodItems, Mood: mood, Drink: drink });
      alert("Health data synced to vault.");
      setSleepHours(0);
      setFoodItems("");
      setMood(0);
      setDrink(0);
      fetchData(); // Refresh report after submit
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getHealthReport(from, to);
      // Normalize axios response so `data.healthData` is always an array
      const payload = res?.data ?? res ?? {};
      const healthData = Array.isArray(payload.healthData)
        ? payload.healthData
        : Array.isArray(payload.data)
        ? payload.data
        : [];
      setData({ ...payload, healthData });
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return (
    <div className="loading-state">
      <div className="spinner-2026"></div>
      <p>Fetching Health Records...</p>
    </div>
  );

  return (
    <div className="health-container">
      <div className="glow-1" />
      
      <header className="health-header">
        <h1>Health Intelligence</h1>
        <p>Log your vitals and analyze AI-driven wellness patterns.</p>
        <QuickActions />
        <UserProfile />
      </header>

      <div className="health-grid">
        {/* LEFT: Submission Form */}
        <div className="glass-card form-section">
          <h3><Activity size={20} color="#6366f1"/> Log Daily Vitals</h3>
          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-field">
              <label><Moon size={16}/> Sleep Hours</label>
              <input type="number" value={sleepHours} onChange={(e) => setSleepHours(parseInt(e.target.value))} required />
            </div>

            <div className="input-field">
              <label><Coffee size={16}/> Water (Glasses)</label>
              <input type="number" value={drink} onChange={(e) => setDrink(parseInt(e.target.value))} required />
            </div>

            <div className="input-field">
              <label><Smile size={16}/> Mood (1-10)</label>
              <input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(parseInt(e.target.value))} className="modern-range" />
              <span className="range-val">{mood}</span>
            </div>

            <div className="input-field">
              <label>Food Intake</label>
              <textarea value={foodItems} onChange={(e) => setFoodItems(e.target.value)} placeholder="What did you eat today?" required />
            </div>

            <button type="submit" className="submit-btn-health" disabled={isLoading}>
              {isLoading ? "Syncing..." : <><Send size={18}/> Submit Stats</>}
            </button>
          </form>
        </div>

        {/* RIGHT: AI & Chart */}
        <div className="analytics-section">
          <div className="glass-card ai-suggestion-card">
            <h3><Sparkles size={20} color="#fbbf24"/> AI Health Advisor</h3>
            <div className="ai-content">
              <p>{data.aiSuggestion || "Log more data to receive personalized AI advice."}</p>
            </div>
          </div>

          <div className="glass-card chart-card-health">
            <div className="filter-bar">
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              <button onClick={fetchData} className="filter-btn"><Filter size={16}/></button>
            </div>
            <div className="chart-height">
              <Line 
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                data={{
                  labels: data.healthData.map((x: any) => new Date(x.CreatedAt ?? x.createdAt).toLocaleDateString()),
                  datasets: [
                    { label: "Sleep", data: data.healthData.map((x: any) => Number(x.SleepHours ?? x.sleepHours ?? 0)), borderColor: "#6366f1", tension: 0.4 },
                    { label: "Mood", data: data.healthData.map((x: any) => Number(x.Mood ?? x.mood ?? 0)), borderColor: "#f43f5e", tension: 0.4 },
                    { label: "Water", data: data.healthData.map((x: any) => Number(x.Drink ?? x.drink ?? 0)), borderColor: "#0ea5e9", tension: 0.4 },
                  ],
                }} 
              />
            </div>
          </div>
        </div>

        {/* BOTTOM: Table */}
        <div className="glass-card table-section span-full">
          <h3><TableIcon size={20} color="#9ca3af"/> Detailed History</h3>
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sleep</th>
                  <th>Mood</th>
                  <th>Water</th>
                  <th>Food</th>
                </tr>
              </thead>
              <tbody>
                {data.healthData.map((h: any, i: number) => (
                  <tr key={i}>
                    <td>{new Date(h.CreatedAt ?? h.createdAt).toLocaleDateString()}</td>
                    <td><span className="pill pill-purple">{h.SleepHours ?? h.sleepHours}h</span></td>
                    <td><span className="pill pill-rose">{h.Mood ?? h.mood}/10</span></td>
                    <td><span className="pill pill-blue">{h.Drink ?? h.drink} gl</span></td>
                    <td className="food-cell">{h.FoodItems ?? h.foodItems ?? h.food ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyHealthForm;