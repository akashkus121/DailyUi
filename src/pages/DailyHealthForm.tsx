import { useState } from "react";
import { DailyHealthSubmit } from "../api/authApi";

const DailyHealthForm = () => {
  const [sleepHours, setSleepHours] = useState(0);
  const [foodItems, setFoodItems] = useState("");
  const [mood, setMood] = useState(0);
  const [drink, setDrink] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await DailyHealthSubmit({ SleepHours: sleepHours, FoodItems: foodItems, Mood: mood, Drink: drink });
      alert("Daily health check submitted successfully!");
      // Optional: reset form
      setSleepHours(0);
      setFoodItems("");
      setMood(0);
      setDrink(0);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Sleep Hours:</label>
        <input
          type="number"
          value={sleepHours}
          onChange={(e) => setSleepHours(parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Food Items:</label>
        <input
          type="text"
          value={foodItems}
          onChange={(e) => setFoodItems(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Mood (1-10):</label>
        <input
          type="number"
          min={1}
          max={10}
          value={mood}
          onChange={(e) => setMood(parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Drink (glasses of water):</label>
        <input
          type="number"
          value={drink}
          onChange={(e) => setDrink(parseInt(e.target.value))}
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default DailyHealthForm;