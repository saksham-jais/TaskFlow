import React, { useState, useEffect } from "react";

export default function Dashboard({ username = "", logout, token }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://task-flow-eight-rho.vercel.app/api";

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", date: "", time: "", status: "Pending" });

  const getWeekStart = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return start;
  };
  const [calendarStart, setCalendarStart] = useState(getWeekStart(new Date()));

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDates = Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + idx);
    return date;
  });

  const todayString = new Date().toDateString();
  const defaultSelected = calendarDates.find((d) => d.toDateString() === todayString) || calendarDates[0];
  const [selectedDate, setSelectedDate] = useState(defaultSelected.toDateString());

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data);
    }
    fetchTasks();
  }, [token]);

  async function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.date || !newTask.time) return;
    const payload = {
      title: newTask.title,
      date: newTask.date,
      time: newTask.time,
      status: "Pending",
    };
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    setTasks([...tasks, created]);
    setNewTask({ title: "", date: "", time: "", status: "Pending" });
  }

  async function toggleComplete(idx) {
    const task = filteredTasks[idx];
    const updatedStatus = task.status === "Completed" ? "Pending" : "Completed";
    const res = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: updatedStatus }),
    });
    const updatedTask = await res.json();
    setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  }

  const filteredTasks = tasks.filter((t) => t.dateString === selectedDate);

  const completedCount = filteredTasks.filter((t) => t.status === "Completed").length;
  const progressPercent = filteredTasks.length ? Math.floor((100 * completedCount) / filteredTasks.length) : 0;

  function previousWeek() {
    setCalendarStart((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() - 7);
      return newStart;
    });
    setSelectedDate((prev) => {
      const date = new Date(prev);
      date.setDate(date.getDate() - 7);
      return date.toDateString();
    });
  }
  function nextWeek() {
    setCalendarStart((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() + 7);
      return newStart;
    });
    setSelectedDate((prev) => {
      const date = new Date(prev);
      date.setDate(date.getDate() + 7);
      return date.toDateString();
    });
  }

  return (
    <div
      className="min-h-screen w-full py-12 px-4 flex flex-col items-center bg-gradient-to-br from-[#101926] via-[#202e47] to-[#1f3350]"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Top Bar */}
      <div className="w-full max-w-4xl mx-auto mb-8 animate-fade-in">
        <div className="relative md:flex md:items-center md:justify-between">
          <span
            className="
              block md:inline font-extrabold
              text-2xl md:text-4xl
              text-[#e4ff3c]
              text-center md:text-left
              tracking-wide select-none truncate
              py-4 pr-20 md:pr-0
            "
          >
            Welcome, {username}
          </span>
          <button
            className="
              absolute top-2 right-0
              bg-gradient-to-br from-[#232d3f] via-gray-800 to-[#232d3f]
              px-6 py-3 md:px-8 md:py-3 rounded-2xl
              text-[#e4ff3c] text-base md:text-lg font-bold
              border-none hover:scale-105 transition-transform select-none
              z-10
            "
            onClick={logout}
            aria-label="Logout"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center mb-10">
        <div className="flex items-center justify-between w-full mb-4 px-2">
          <button
            className="text-[#e4ff3c] px-5 py-3 rounded-lg hover:bg-[#232d3f] transition-colors font-extrabold text-xl"
            onClick={previousWeek}
            aria-label="Previous Week"
          >
            &lt;
          </button>
          <span className="text-2xl font-bold text-center flex-1 tracking-widest text-[#e4ff3c] select-none truncate px-2">
            {calendarDates[0].getDate()} {calendarDates[0].toLocaleString("default", { month: "short" })} - {calendarDates[6].getDate()}{" "}
            {calendarDates[6].toLocaleString("default", { month: "short" })}
          </span>
          <button
            className="text-[#e4ff3c] px-5 py-3 rounded-lg hover:bg-[#232d3f] transition-colors font-extrabold text-xl"
            onClick={nextWeek}
            aria-label="Next Week"
          >
            &gt;
          </button>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#232d3f] pb-4">
          <div className="flex w-full justify-center gap-3">
            {calendarDates.map((dateObj) => {
              const highlight = dateObj.toDateString() === selectedDate;
              return (
                <button
                  key={dateObj.toDateString()}
                  className={`flex flex-col items-center px-4 py-3 min-w-[64px] rounded-xl transition
                    ${highlight
                      ? "bg-[#e4ff3c] text-[#101926] border-2 border-[#e4ff3c] ring-2 ring-[#e4ff3c]"
                      : "bg-[#232d3f] text-white border-2 border-transparent hover:bg-[#2c3a56]"
                    }
                  `}
                  onClick={() => setSelectedDate(dateObj.toDateString())}
                  aria-pressed={highlight}
                >
                  <span className={`font-bold text-base mb-1 ${highlight ? "text-[#101926]" : "text-gray-100"}`}>
                    {daysOfWeek[dateObj.getDay()]}
                  </span>
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold
                    ${highlight ? "bg-black text-[#e4ff3c]" : "bg-[#101926] text-white"}`}>
                    {dateObj.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="w-full max-w-4xl bg-[rgba(26,35,50,0.95)] rounded-3xl p-8 mb-12 backdrop-blur-lg border border-[#232d3f] flex flex-col md:flex-row items-center justify-between gap-8 animate-slide-in">
        <div>
          <div className="text-6xl font-extrabold text-[#e4ff3c] mb-2 text-center tracking-tight animate-count-up truncate">
            {progressPercent}%
          </div>
          <div className="text-xl font-semibold text-center text-[#e4ff3c] tracking-wide truncate">Your Progress</div>
          <div className="text-gray-300 mt-3 text-lg text-center truncate max-w-full select-text">
            {completedCount}/{filteredTasks.length} Tasks complete on <span className="font-semibold truncate">{selectedDate}</span>
          </div>
        </div>
        <div>
          <button
            className="bg-[#232d3f] px-10 py-3 rounded-2xl text-[#e4ff3c] text-xl font-bold mt-6 md:mt-0 select-none"
            disabled
          >
            {completedCount === filteredTasks.length && filteredTasks.length > 0 ? "All Completed" : "Completed"}
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      <form
        className="w-full max-w-4xl mb-12 flex flex-col md:flex-row gap-6 items-center"
        onSubmit={handleAddTask}
        aria-label="Add a new task form"
      >
        <input
          className="bg-[#232d3f] text-white rounded-3xl px-6 py-4 flex-1 min-w-0 w-full md:w-auto placeholder-gray-400 placeholder-semibold focus:outline-none focus:ring-4 focus:ring-[#e4ff3c] transition-shadow font-semibold"
          type="text"
          placeholder="Add new task"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          aria-required="true"
          aria-label="Task title"
        />
        <input
          className="bg-[#232d3f] text-white rounded-3xl px-6 py-4 w-full md:w-44 placeholder-gray-400 placeholder-semibold focus:outline-none focus:ring-4 focus:ring-[#e4ff3c] transition-shadow font-semibold"
          type="date"
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
          aria-required="true"
          aria-label="Task date"
        />
        <input
          className="bg-[#232d3f] text-white rounded-3xl px-6 py-4 w-full md:w-40 placeholder-gray-400 placeholder-semibold focus:outline-none focus:ring-4 focus:ring-[#e4ff3c] transition-shadow font-semibold"
          type="time"
          value={newTask.time}
          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
          aria-required="true"
          aria-label="Task time"
        />
        <button
          type="submit"
          className="w-full md:w-auto bg-gradient-to-r from-[#e4ff3c] to-yellow-400 text-[#101926] font-extrabold py-4 px-8 rounded-3xl hover:scale-110 hover:brightness-110 transition-transform text-xl"
        >
          Add
        </button>
      </form>

      {/* History Section */}
      <div className="w-full max-w-4xl">
        <div className="text-2xl font-extrabold text-[#e4ff3c] mb-6 tracking-wide select-none">History</div>
        <div className="max-h-[26rem] overflow-y-auto custom-scrollbar pr-2 space-y-6">
          {filteredTasks.length === 0 ? (
            <div className="text-gray-400 italic text-center">No tasks on selected date.</div>
          ) : (
            filteredTasks.map((task, i) => (
              <div
                key={i}
                className="flex flex-row items-center w-full relative border-2 border-[#e4ff3c] rounded-2xl bg-[#1a2332]/95 px-6 py-5 transition-all"
              >
                {/* Serial badge left side, vertical middle */}
                <div className="flex flex-col items-center justify-center mr-6 bg-[#101926] rounded-md px-6 py-4 min-w-[56px] select-none">
                  <span className="text-2xl font-extrabold text-[#e4ff3c]">{i + 1}</span>
                  <span className="text-sm text-[#e4ff3c]">Task</span>
                </div>
                {/* Task details right side */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-lg text-white truncate">{task.title}</span>
                    <div className="flex flex-row gap-2 items-center mt-2">
                      <span className={`rounded-full px-4 py-2 text-xs font-bold ${task.status === "Completed" ? "bg-green-500 text-white" : "bg-[#e4ff3c] text-[#101926]"}`}>
                        {task.status}
                      </span>
                      <span className="text-sm text-gray-300 tracking-wide truncate">
                        {task.dateString}, {task.time}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleComplete(i)}
                    className={`rounded-lg px-6 py-3 text-base font-bold border-2 transition hover:scale-105
                      ${task.status === "Completed"
                        ? "bg-gradient-to-r from-yellow-400 to-[#e4ff3c] text-black border-none"
                        : "bg-transparent text-[#e4ff3c] border-[#e4ff3c]"
                      }`}
                  >
                    {task.status === "Completed" ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn .7s both; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .animate-slide-in { animation: slideInUp .7s both; }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(32px);} to { opacity: 1; transform: none; } }
        .animate-count-up { animation: countUp .7s both; }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar { height: 10px; width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #232d3f; border-radius: 10px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #232d3f transparent; }
      `}</style>
    </div>
  );
}
