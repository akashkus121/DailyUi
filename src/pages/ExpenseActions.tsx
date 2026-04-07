import React, { useEffect, useState } from "react";
import { createSalary, addExpense, giveWage, getExpenseReport } from "../api/authApi";
import { ExpenseReport } from "../types/authTypes";
import { Bar } from "react-chartjs-2";
import QuickActions from "../components/QuickActions";
import { Wallet, Landmark, Receipt, Users, Plus, Save, ArrowRight, TrendingDown } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ExpenseActions.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseActions: React.FC = () => {
  const [salary, setSalary] = useState(0);
  const [limit, setLimit] = useState(0);
  const [expense, setExpense] = useState(0);
  const [wageAmount, setWageAmount] = useState(0);
  const [person, setPerson] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [data, setData] = useState<ExpenseReport>({
    salary: 0,
    totalExpenses: 0,
    netSavings: 0,
    pendingWages: [],
    expenseList: [],
  });

  const fetchData = async () => {
    try {
      const res = await getExpenseReport();
      const payload = res ?? {};
      const expenseList = Array.isArray(payload.expenseList) ? payload.expenseList : payload.data || [];
      setData({
        salary: payload.salary ?? payload.totalSalary ?? 0,
        totalExpenses: payload.totalExpenses ?? 0,
        netSavings: payload.netSavings ?? 0,
        pendingWages: payload.pendingWages || [],
        expenseList,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSalary = async () => {
    await createSalary(salary, limit);
    alert("Financial profile updated");
    fetchData();
  };

  const handleExpense = async () => {
    await addExpense(expense, expenseDescription);
    alert("Expense logged");
    fetchData();
  };

  const handleWage = async () => {
    await giveWage(wageAmount, person);
    alert("Wage transaction complete");
    fetchData();
  };

  return (
    <div className="expense-root">
      <div className="glow-accent" />
      
      <header className="expense-header">
        <div className="welcome-section">
          <h1>Finance Engine</h1>
          <p>Manage your capital flow and daily spending limits.</p>
        </div>
        <QuickActions />
      </header>

      <main className="expense-grid">
        {/* TOP: Report Chart */}
        <section className="glass-tile report-tile span-3">
          <div className="tile-head">
            <h3><TrendingDown size={20} color="#10b981"/> Cashflow Visualization</h3>
            <div className="mini-stats">
              <div className="stat"><span>Savings:</span> <b>₹{data.netSavings}</b></div>
            </div>
          </div>
          <div className="chart-container-finance">
            <Bar
              data={{
                labels: data.expenseList.map((e) => new Date(((e as any).CreatedAt ?? e.createdAt)).toLocaleDateString()),
                datasets: [{
                  label: "Spending",
                  data: data.expenseList.map((e) => Number((e as any).Amount ?? e.amount ?? 0)),
                  backgroundColor: "#10b981",
                  borderRadius: 8,
                }],
              }}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' } },
                    x: { grid: { display: false }, ticks: { color: '#6b7280' } }
                }
              }}
            />
          </div>
        </section>

        {/* BOTTOM: Action Cards */}
        <div className="action-row-container span-3">
          
          {/* Salary Action */}
          <div className="glass-tile action-card">
            <div className="icon-box purple"><Landmark size={24}/></div>
            <h4>Configure Salary</h4>
            <div className="form-stack">
              <input type="number" placeholder="Salary Amount" onChange={(e) => setSalary(Number(e.target.value))} />
              <input type="number" placeholder="Daily Limit" onChange={(e) => setLimit(Number(e.target.value))} />
              <button className="btn-action purple" onClick={handleSalary}><Save size={18}/> Update Base</button>
            </div>
          </div>

          {/* Expense Action */}
          <div className="glass-tile action-card">
            <div className="icon-box rose"><Receipt size={24}/></div>
            <h4>Instant Expense</h4>
            <div className="form-stack">
              <input type="number" placeholder="Enter Amount" onChange={(e) => setExpense(Number(e.target.value))} />
              <input type="text" placeholder="Expense Description (optional)" onChange={(e) => setExpenseDescription(e.target.value)} />
              <div className="spacer">Log this transaction instantly to your ledger.</div>
              <button className="btn-action rose" onClick={handleExpense}><Plus size={18}/> Deduct Balance</button>
            </div>
          </div>

          {/* Wage Action */}
          <div className="glass-tile action-card">
            <div className="icon-box amber"><Users size={24}/></div>
            <h4>Transfer Wage</h4>
            <div className="form-stack">
              <input type="text" placeholder="Person Name" onChange={(e) => setPerson(e.target.value)} />
              <input type="number" placeholder="Amount" onChange={(e) => setWageAmount(Number(e.target.value))} />
              <button className="btn-action amber" onClick={handleWage}><ArrowRight size={18}/> Process Wage</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ExpenseActions;