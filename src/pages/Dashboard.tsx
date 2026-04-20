import React, { useEffect, useState } from "react";
import { dashboardData, returnWageAPI } from "../api/authApi";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from "chart.js";
import {
  Activity, ArrowUpRight, Clock, CheckCircle2
} from "lucide-react";
import { useLocation } from "react-router-dom";
import QuickActions from "../components/QuickActions";
import UserProfile from "../components/User"; // Import the profile component
import { MoneyGiven, DashboardData } from "../types/authTypes";

import "./Dashboard.css"; 

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
);

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    dashboard: [],
    ExpenseList: [],
    PendingWages: [],
    LifeScores: [],
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isOn = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  useEffect(() => {
    const cached = localStorage.getItem("dashboardData");
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    }
    fetchDashboard();
  }, []);
      

  const fetchDashboard = async () => {
    try {
      const d = await dashboardData();
      const parseDateValue = (val: any) => {
        if (!val) return "";
        const msMatch = /\/Date\((\d+)(?:[+-]\d+)?\)\//.exec(String(val));
        if (msMatch && msMatch[1]) return new Date(parseInt(msMatch[1], 10)).toISOString();
        const dt = new Date(String(val));
        return isNaN(dt.getTime()) ? String(val) : dt.toISOString();
      };

      const pickDate = (obj: any, keys: string[]) => {
        for (const k of keys) if (obj && obj[k]) return parseDateValue(obj[k]);
        return "";
      };

      const mapped: DashboardData = {
        dashboard: (d.dashboard ?? []).map((h: any) => ({
          Id: h.Id ?? h.id ?? 0,
          Mood: String(h.Mood ?? h.mood ?? ""),
          SleepHours: Number(h.SleepHours ?? h.sleepHours ?? 0),
          Drink: h.Drink ?? h.drink ?? 0,
          CreatedAt: pickDate(h, ["CreatedAt", "createdAt"]),
        })),
        ExpenseList: (d.expenseList ?? []).map((e: any) => ({
          Id: e.Id ?? e.id ?? 0,
          UserId: e.UserId ?? e.userId ?? null,
          Amount: Number(e.Amount ?? e.amount ?? 0),
          Category: e.Category ?? e.category ?? "",
          Note: e.Note ?? e.note ?? "",
          CreatedAt: pickDate(e, ["CreatedAt", "createdAt", "created_at"]),
        })),
        PendingWages: (d.pendingWages ?? []).map((w: any) => ({
          Id: w.Id ?? w.id ?? 0,
          userId: w.UserId ?? w.userId ?? w.user_id ?? 0,
          Amount: Number(w.Amount ?? w.amount ?? 0),
          PersonName: w.PersonName ?? w.personName ?? w.Name ?? "",
          IsReturned: Boolean(w.IsReturned ?? w.isReturned ?? w.returned ?? false),
          GivenAt: pickDate(w, ["GivenAt", "givenAt", "CreatedAt", "createdAt"]),
          ReturnedAt: pickDate(w, ["ReturnedAt", "returnedAt"]),
        } as MoneyGiven)),
        LifeScores: (d.lifeScores ?? []).map((s: any) => ({
          HealthScore: Number(s.HealthScore ?? s.healthScore ?? 0),
          ExpenseScore: Number(s.ExpenseScore ?? s.expenseScore ?? 0),
          TotalScore: Number(s.TotalScore ?? s.totalScore ?? 0),
          Message: s.Message ?? s.message ?? "",
          Date: pickDate(s, ["Date", "date"]),
        })),
      };
      setData(mapped);
      localStorage.setItem("dashboardData", JSON.stringify(mapped));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const returnWage = async (id: number) => {
    try {
      const res = await returnWageAPI(id);
      if (res.status === 200) {
        setData(prev => ({
          ...prev,
          PendingWages: prev.PendingWages.filter(w => w.Id !== id)
        }));
      }
    } catch (err) {
      console.error("Error returning wage:", err);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-2026"></div>
      <p>Analyzing Data Layers...</p>
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#6b7280' } },
      x: { grid: { display: false }, ticks: { color: '#6b7280' } }
    }
  };

  const healthLineData = {
    labels: data.dashboard.map(d => new Date(d.CreatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: "Sleep",
      data: data.dashboard.map(d => d.SleepHours),
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }]
  };

  const expenseBarData = {
    labels: data.ExpenseList.map(e => new Date(e.CreatedAt).toLocaleDateString('en-US', { day: 'numeric' })),
    datasets: [{
      data: data.ExpenseList.map(e => e.Amount),
      backgroundColor: "#10b981",
      borderRadius: 6,
    }]
  };

  return (
    <div className="dashboard-root">
      <div className="glow-1" />
      <div className="glow-2" />

      <header className="dash-header">
        <div className="welcome-section">
          <h1>System Overview</h1>
          <p>Real-time metrics for your health and finances.</p>
        </div>
        <div className="header-actions">
           <QuickActions />
           <UserProfile />
        </div>
      </header>

      <div className="bento-container">
        {/* Main Health Card */}
        <div className="bento-item span-lg-2">
          <div className="card-header">
            <h3><Activity size={18} color="#6366f1"/> Health Momentum</h3>
            <span className="trend-up"><ArrowUpRight size={14}/> 12%</span>
          </div>
          <div className="chart-box">
            <Line data={healthLineData} options={chartOptions} />
          </div>
        </div>

        {/* Life Score Doughnut */}
        <div className="bento-item doughnut-card">
          <div className="doughnut-wrapper">
            <Doughnut
              data={{
                datasets: [{
                  data: [Number(data.LifeScores[0]?.TotalScore ?? 0), 100 - Number(data.LifeScores[0]?.TotalScore ?? 0)],
                  backgroundColor: ['#6366f1', 'rgba(255,255,255,0.03)'],
                  borderWidth: 0,
                }]
              }}
              options={{
                cutout: '80%',
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                maintainAspectRatio: false,
                responsive: true
              }}
            />
            <div className="doughnut-label">
              <span className="score-val">{Number(data.LifeScores[0]?.TotalScore ?? 0)}</span>
              <span className="score-unit">INDEX</span>
            </div>
          </div>
        </div>

        {/* Expense History */}
        <div className="bento-item span-lg-2">
          <h3>Financial Distribution</h3>
          <div className="chart-box">
            <Bar data={expenseBarData} options={chartOptions} />
          </div>
        </div>

        {/* Pending Wages */}
        <div className="bento-item scroll-y">
          <h3><Clock size={18} color="#f59e0b"/> Pending Settlements</h3>
          <div className="wage-stack">
            {data.PendingWages.length > 0 ? data.PendingWages.map(wage => (
              <div key={wage.Id} className="wage-card">
                <div className="wage-info">
                  <span className="wage-name">{wage.PersonName}</span>
                  <span className="wage-amt">₹{wage.Amount}</span>
                </div>
                {!wage.IsReturned && (
                  <button className="wage-done" onClick={() => returnWage(wage.Id)}><CheckCircle2 size={16}/></button>
                )}
              </div>
            )) : <p className="empty-msg">Clear for now.</p>}
          </div>
        </div>

        {/* Weekly Logbook */}
        <div className="bento-item span-full">
          <h3>Weekly Logbook</h3>
          <div className="score-strip">
            {data.LifeScores.map((item, idx) => (
              <div key={idx} className="log-card">
                 <div className="log-top">
                    <span className="log-day">{new Date(item.Date).toLocaleDateString("en-US", { weekday: 'short' })}</span>
                    <span className="log-pts">{item.TotalScore}%</span>
                 </div>
                 <div className="log-progress"><div style={{width: `${item.TotalScore}%`}}></div></div>
                 <p className="log-msg">"{item.Message}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;