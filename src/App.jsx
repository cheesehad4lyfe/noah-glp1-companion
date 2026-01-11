import React, { useState, useEffect, useRef } from 'react';
import { Heart, Home, BarChart3, MessageCircle, User, ChevronLeft, ChevronRight, Zap, AlertCircle, Pill, Clock, Droplet, CheckCircle, X, Scale, Send, Download, Trash2, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// SVG Avatar Components
const NoahAvatar = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#E3F2FD"/>
    <circle cx="50" cy="35" r="18" fill="#FFDBAC"/>
    <path d="M 30 75 Q 50 65 70 75 L 70 95 Q 50 90 30 95 Z" fill="#1976D2"/>
    <circle cx="42" cy="32" r="3" fill="#333"/>
    <circle cx="58" cy="32" r="3" fill="#333"/>
    <path d="M 42 42 Q 50 46 58 42" stroke="#333" strokeWidth="2" fill="none"/>
    <rect x="25" y="60" width="50" height="15" fill="white" rx="2"/>
    <line x1="30" y1="63" x2="70" y2="63" stroke="#1976D2" strokeWidth="1"/>
    <line x1="30" y1="68" x2="70" y2="68" stroke="#1976D2" strokeWidth="1"/>
    <line x1="30" y1="73" x2="70" y2="73" stroke="#1976D2" strokeWidth="1"/>
  </svg>
);

const NoeliaAvatar = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#F3E5F5"/>
    <circle cx="50" cy="35" r="18" fill="#FFDBAC"/>
    <path d="M 30 75 Q 50 65 70 75 L 70 95 Q 50 90 30 95 Z" fill="#7B1FA2"/>
    <circle cx="42" cy="32" r="3" fill="#333"/>
    <circle cx="58" cy="32" r="3" fill="#333"/>
    <path d="M 42 42 Q 50 46 58 42" stroke="#333" strokeWidth="2" fill="none"/>
    <path d="M 35 25 Q 40 18 45 25" fill="#8B4513"/>
    <path d="M 55 25 Q 60 18 65 25" fill="#8B4513"/>
    <rect x="25" y="60" width="50" height="15" fill="white" rx="2"/>
    <line x1="30" y1="63" x2="70" y2="63" stroke="#7B1FA2" strokeWidth="1"/>
    <line x1="30" y1="68" x2="70" y2="68" stroke="#7B1FA2" strokeWidth="1"/>
    <line x1="30" y1="73" x2="70" y2="73" stroke="#7B1FA2" strokeWidth="1"/>
    <circle cx="48" cy="85" r="2" fill="#FF1744"/>
  </svg>
);

export default function App() {
  // State Management
  const [view, setView] = useState('onboarding'); // onboarding, home, progress, chat, profile
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEndOfDayModal, setShowEndOfDayModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    companion: '', // 'noah' or 'noelia'
    personality: '', // 'motivational', 'straightforward', 'caring', 'scientific'
    reminderTime: '09:00',
    dose: '',
    currentWeight: '',
    goalWeight: ''
  });

  // Daily Logs - keyed by date (YYYY-MM-DD)
  const [dailyLogs, setDailyLogs] = useState({});

  // Weights Array - for progress tracking
  const [weights, setWeights] = useState([]);

  // Milestones tracking
  const [milestonesShown, setMilestonesShown] = useState([]);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);

  // Chat messages
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds

  // Timer Effect
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Get current day's log
  const getCurrentLog = () => dailyLogs[currentDate] || {};

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    let date = new Date();
    while (true) {
      const dateStr = date.toISOString().split('T')[0];
      if (dailyLogs[dateStr]?.pillTaken) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  // Format time for timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle pill taken
  const handlePillTaken = () => {
    setDailyLogs({
      ...dailyLogs,
      [currentDate]: {
        ...getCurrentLog(),
        pillTaken: true,
        pillTakenTime: new Date().toISOString()
      }
    });
    setTimerActive(true);
    setTimeRemaining(1800);

    // Check for milestones after a brief delay
    setTimeout(() => checkMilestones(), 500);
  };

  // Handle weight save
  const handleWeightSave = (weight) => {
    const weightValue = parseFloat(weight);

    // Update daily logs
    setDailyLogs({
      ...dailyLogs,
      [currentDate]: {
        ...getCurrentLog(),
        weight: weightValue
      }
    });

    // Format date for weights array (Mon DD, YYYY)
    const dateObj = new Date(currentDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Update weights array for progress chart
    const existingIndex = weights.findIndex(w => w.date === formattedDate);

    if (existingIndex !== -1) {
      // Update existing entry
      const updatedWeights = [...weights];
      updatedWeights[existingIndex] = {
        wt: weightValue,
        date: formattedDate,
        dose: userProfile.dose
      };
      setWeights(updatedWeights);
    } else {
      // Add new entry and sort by date
      const newWeights = [...weights, {
        wt: weightValue,
        date: formattedDate,
        dose: userProfile.dose
      }].sort((a, b) => new Date(a.date) - new Date(b.date));
      setWeights(newWeights);
    }

    // Check for milestones after a brief delay
    setTimeout(() => checkMilestones(), 500);

    // Show success toast
    showToast('Weight saved!');
  };

  // Handle end of day save
  const handleEndOfDaySave = (data) => {
    setDailyLogs({
      ...dailyLogs,
      [currentDate]: {
        ...getCurrentLog(),
        ...data
      }
    });
    setShowEndOfDayModal(false);
    showToast('Check-in saved!');
  };

  // Navigate date
  const navigateDate = (direction) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + direction);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date().toISOString().split('T')[0];

    if (dateStr === today) return { primary: 'Today', secondary: '' };

    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return { primary: weekday, secondary: formatted };
  };

  // Cancel timer
  const handleCancelTimer = () => {
    setTimerActive(false);
    setTimeRemaining(1800);
  };

  // Toast notification function
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Chat functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('side effect') || msg.includes('nausea') || msg.includes('symptom')) {
      return "Common side effects like nausea usually peak 24-72 hours after taking your pill. They often improve as your body adjusts. Try eating smaller, bland meals and staying hydrated. If symptoms are severe or persistent, contact your doctor.";
    }

    if (msg.includes('progress') || msg.includes('weight') || msg.includes('doing')) {
      const startWeight = parseFloat(userProfile.currentWeight) || 0;
      const currentWeight = weights.length > 0 ? weights[weights.length - 1].wt : startWeight;
      const progress = startWeight - currentWeight;
      const streak = calculateStreak();

      return `You've logged ${weights.length} weight entries and have a ${streak} day streak!${weights.length > 1 && progress > 0 ? ` You're ${progress.toFixed(1)} lbs down from your starting weight - that's amazing progress!` : ' Keep tracking consistently to see trends develop.'}`;
    }

    if (msg.includes('dose') || msg.includes('increase') || msg.includes('titration') || msg.includes('mg')) {
      return `Wegovy dosing typically starts at 1.5mg and increases every 30 days: 1.5mg → 4mg → 9mg → 25mg (maintenance). This gradual increase helps your body adjust and reduces side effects. You're currently on ${userProfile.dose}.`;
    }

    if (msg.includes('tired') || msg.includes('fatigue') || msg.includes('energy')) {
      return "Fatigue is common, especially in the first few weeks. Stay hydrated and get enough protein. Your energy levels should improve as your body adjusts. Track your energy in the end-of-day check-in to monitor patterns.";
    }

    if (msg.includes('hungry') || msg.includes('appetite') || msg.includes('craving') || msg.includes('food')) {
      return "Wegovy works by reducing appetite and slowing digestion. It's normal to feel less hungry. Focus on protein-rich foods and eat when genuinely hungry. Track your hunger levels daily to monitor the medication's effect.";
    }

    if (msg.includes('water') || msg.includes('hydration') || msg.includes('drink')) {
      return "Stay well-hydrated! Aim for 8+ glasses of water daily. Remember: after taking your pill, wait 30 minutes before drinking more than 4oz. Proper hydration helps manage side effects and supports overall health.";
    }

    return "I'm here to help with questions about Wegovy, tracking your progress, or managing side effects. What would you like to know? You can ask about common side effects, dosing schedules, or check on your progress.";
  };

  const sendMessage = (content) => {
    if (!content.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content }]);

    // Show typing indicator
    setTimeout(() => {
      const response = getAIResponse(content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  // Check for milestones
  const checkMilestones = () => {
    const milestones = [];

    // Calculate current stats
    const pillEntries = Object.values(dailyLogs).filter(log => log.pillTaken);
    const streak = calculateStreak();
    const startWeight = parseFloat(userProfile.currentWeight) || 0;
    const currentWeight = weights.length > 0 ? weights[weights.length - 1].wt : startWeight;
    const weightLost = startWeight - currentWeight;
    const goalWeight = parseFloat(userProfile.goalWeight) || 0;
    const halfwayPoint = (startWeight - goalWeight) / 2;

    // First pill
    if (pillEntries.length === 1 && !milestonesShown.includes('first-pill')) {
      milestones.push({
        id: 'first-pill',
        emoji: '🎉',
        title: 'First Pill Logged!',
        message: 'Great start! You took your first step on this journey!'
      });
    }

    // 7 day streak
    if (streak === 7 && !milestonesShown.includes('first-week')) {
      milestones.push({
        id: 'first-week',
        emoji: '🔥',
        title: 'First Week Complete!',
        message: 'You logged 7 days in a row! Consistency is key!'
      });
    }

    // 30 day streak
    if (streak === 30 && !milestonesShown.includes('thirty-days')) {
      milestones.push({
        id: 'thirty-days',
        emoji: '🏆',
        title: '30 Day Streak!',
        message: 'One month of consistent tracking! You\'re crushing it!'
      });
    }

    // 5 lbs lost
    if (weightLost >= 5 && !milestonesShown.includes('five-lbs')) {
      milestones.push({
        id: 'five-lbs',
        emoji: '🎉',
        title: '5 Pounds Lost!',
        message: 'You\'ve lost 5 pounds! Your hard work is paying off!'
      });
    }

    // 10 lbs lost
    if (weightLost >= 10 && !milestonesShown.includes('ten-lbs')) {
      milestones.push({
        id: 'ten-lbs',
        emoji: '🔥',
        title: '10 Pounds Lost!',
        message: 'Double digits! You\'ve lost 10 pounds! Amazing progress!'
      });
    }

    // 20 lbs lost
    if (weightLost >= 20 && !milestonesShown.includes('twenty-lbs')) {
      milestones.push({
        id: 'twenty-lbs',
        emoji: '🏆',
        title: '20 Pounds Lost!',
        message: 'Incredible! 20 pounds down! You\'re an inspiration!'
      });
    }

    // Halfway to goal
    if (weightLost >= halfwayPoint && halfwayPoint > 0 && !milestonesShown.includes('halfway-goal')) {
      milestones.push({
        id: 'halfway-goal',
        emoji: '🏆',
        title: 'Halfway There!',
        message: 'You\'re halfway to your goal weight! Keep going!'
      });
    }

    // Show first milestone if any
    if (milestones.length > 0) {
      setCurrentMilestone(milestones[0]);
      setShowMilestone(true);
      setMilestonesShown([...milestonesShown, milestones[0].id]);
    }
  };

  // Calendar functions
  const handleDateClick = (dateStr) => {
    setCurrentDate(dateStr);
    setShowCalendar(false);
  };

  const handleOpenCalendar = () => {
    // Set calendar month to the currently selected date
    setCalendarMonth(new Date(currentDate + 'T00:00:00'));
    setShowCalendar(true);
  };

  // Calendar Component
  const Calendar = () => {
    const today = new Date().toISOString().split('T')[0];
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    // Get days in month and first day of week
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    // Generate calendar days
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    // Navigate month
    const navigateMonth = (direction) => {
      const newDate = new Date(calendarMonth);
      newDate.setMonth(newDate.getMonth() + direction);
      setCalendarMonth(newDate);
    };

    // Get date string for a day
    const getDateStr = (day) => {
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // Check if date is in future
    const isFuture = (dateStr) => {
      return dateStr > today;
    };

    // Check if date has data
    const hasData = (dateStr) => {
      return dailyLogs[dateStr];
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-4">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dateStr = getDateStr(day);
                const isToday = dateStr === today;
                const isSelected = dateStr === currentDate;
                const isFutureDate = isFuture(dateStr);
                const data = hasData(dateStr);
                const hasPill = data?.pillTaken;
                const hasWeight = data?.weight;

                return (
                  <button
                    key={day}
                    onClick={() => !isFutureDate && handleDateClick(dateStr)}
                    disabled={isFutureDate}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition relative ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isToday
                        ? 'bg-blue-100 text-blue-700'
                        : isFutureDate
                        ? 'text-gray-300 cursor-not-allowed opacity-30'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>{day}</span>
                    {!isFutureDate && (hasPill || hasWeight) && (
                      <div className="flex gap-1 absolute bottom-1">
                        {hasPill && (
                          <div className="w-1 h-1 rounded-full bg-green-500" />
                        )}
                        {hasWeight && (
                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Pill logged</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Weight logged</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowCalendar(false)}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Onboarding Component
  const Onboarding = () => {
    const [tempData, setTempData] = useState({
      name: '',
      companion: '',
      personality: '',
      reminderTime: '09:00',
      dose: '',
      currentWeight: '',
      goalWeight: ''
    });

    const handleNext = () => {
      if (onboardingStep === 5) {
        setUserProfile({ ...tempData });
        setView('home');
      } else {
        setOnboardingStep(onboardingStep + 1);
      }
    };

    const canProceed = () => {
      switch (onboardingStep) {
        case 1: return tempData.name.trim() !== '';
        case 2: return tempData.companion !== '';
        case 3: return tempData.personality !== '';
        case 4: return tempData.reminderTime !== '';
        case 5: return tempData.dose !== '' && tempData.currentWeight !== '' && tempData.goalWeight !== '';
        default: return false;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto py-8 md:py-16">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Step {onboardingStep} of 5</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((onboardingStep / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(onboardingStep / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            {/* Step 1: Name */}
            {onboardingStep === 1 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-6 shadow-lg">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Noah!</h2>
                <p className="text-xl text-gray-600 mb-8">Let's get to know you better</p>
                <div className="max-w-lg mx-auto">
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    What's your name?
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={tempData.name}
                    onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Choose Companion */}
            {onboardingStep === 2 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your AI Companion</h2>
                <p className="text-lg text-gray-600 mb-8">Who would you like to guide you?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
                  <button
                    onClick={() => setTempData({ ...tempData, companion: 'noah' })}
                    className={`p-6 rounded-2xl border-4 transition-all ${
                      tempData.companion === 'noah'
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <NoahAvatar size={100} />
                    <h3 className="text-xl font-bold text-gray-900 mt-4">Dr. Noah</h3>
                    <p className="text-gray-600 mt-2">Male Doctor</p>
                  </button>
                  <button
                    onClick={() => setTempData({ ...tempData, companion: 'noelia' })}
                    className={`p-6 rounded-2xl border-4 transition-all ${
                      tempData.companion === 'noelia'
                        ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <NoeliaAvatar size={100} />
                    <h3 className="text-xl font-bold text-gray-900 mt-4">Dr. Noelia</h3>
                    <p className="text-gray-600 mt-2">Female Doctor</p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Choose Personality */}
            {onboardingStep === 3 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Personality Style</h2>
                <p className="text-lg text-gray-600 mb-8">How would you like your companion to communicate?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    { value: 'motivational', label: 'Motivational', desc: 'Energetic and encouraging' },
                    { value: 'straightforward', label: 'Straightforward', desc: 'Direct and to the point' },
                    { value: 'caring', label: 'Caring', desc: 'Warm and empathetic' },
                    { value: 'scientific', label: 'Scientific', desc: 'Data-driven and factual' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTempData({ ...tempData, personality: option.value })}
                      className={`p-6 rounded-2xl border-3 transition-all text-left ${
                        tempData.personality === option.value
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <h3 className="text-xl font-bold text-gray-900">{option.label}</h3>
                      <p className="text-gray-600 mt-1">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Daily Reminder Time */}
            {onboardingStep === 4 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Set Daily Reminder</h2>
                <p className="text-lg text-gray-600 mb-8">When would you like to take your pill?</p>
                <div className="max-w-md mx-auto">
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={tempData.reminderTime}
                    onChange={(e) => setTempData({ ...tempData, reminderTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Prescription Info */}
            {onboardingStep === 5 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Prescription & Goals</h2>
                <p className="text-lg text-gray-600 mb-8">Tell us about your treatment</p>
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                      Current Dose
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {['1.5mg', '4mg', '9mg', '25mg'].map((dose) => (
                        <button
                          key={dose}
                          onClick={() => setTempData({ ...tempData, dose })}
                          className={`py-3 rounded-xl border-2 font-medium transition-all ${
                            tempData.dose === dose
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-700 hover:border-blue-300'
                          }`}
                        >
                          {dose}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                      Current Weight (lbs)
                    </label>
                    <input
                      type="number"
                      placeholder="150"
                      value={tempData.currentWeight}
                      onChange={(e) => setTempData({ ...tempData, currentWeight: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                      Goal Weight (lbs)
                    </label>
                    <input
                      type="number"
                      placeholder="130"
                      value={tempData.goalWeight}
                      onChange={(e) => setTempData({ ...tempData, goalWeight: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {onboardingStep > 1 && (
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 px-6 py-3 font-medium rounded-xl transition ${
                  canProceed()
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {onboardingStep === 5 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // End of Day Modal
  const EndOfDayModal = () => {
    const [formData, setFormData] = useState({
      workout: null,
      symptoms: [],
      hungerLevel: 5,
      energyLevel: 5,
      notes: ''
    });

    const symptomOptions = ['Nausea', 'Fatigue', 'Headache', 'Constipation', 'None'];

    const handleSymptomToggle = (symptom) => {
      if (symptom === 'None') {
        setFormData({ ...formData, symptoms: ['None'] });
      } else {
        const newSymptoms = formData.symptoms.includes(symptom)
          ? formData.symptoms.filter(s => s !== symptom)
          : [...formData.symptoms.filter(s => s !== 'None'), symptom];
        setFormData({ ...formData, symptoms: newSymptoms });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">End of Day Check-in</h2>

          <div className="space-y-6">
            {/* Workout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Did you work out today?
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormData({ ...formData, workout: true })}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
                    formData.workout === true
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setFormData({ ...formData, workout: false })}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
                    formData.workout === false
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Any symptoms?
              </label>
              <div className="space-y-2">
                {symptomOptions.map((symptom) => (
                  <label key={symptom} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.symptoms.includes(symptom)}
                      onChange={() => handleSymptomToggle(symptom)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hunger Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hunger Level: {formData.hungerLevel}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.hungerLevel}
                onChange={(e) => setFormData({ ...formData, hungerLevel: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Not Hungry</span>
                <span>Very Hungry</span>
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Energy Level: {formData.energyLevel}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energyLevel}
                onChange={(e) => setFormData({ ...formData, energyLevel: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional thoughts or observations..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowEndOfDayModal(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleEndOfDaySave(formData)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-xl hover:opacity-90 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Milestone Modal
  const MilestoneModal = () => {
    if (!currentMilestone) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-bounce-in">
          <div className="text-6xl mb-4">{currentMilestone.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{currentMilestone.title}</h2>
          <p className="text-lg text-gray-700 mb-6">{currentMilestone.message}</p>
          <button
            onClick={() => setShowMilestone(false)}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition shadow-md"
          >
            Awesome!
          </button>
        </div>
      </div>
    );
  };

  // Daily Insight Card
  const DailyInsight = () => {
    const CompanionAvatar = userProfile.companion === 'noah' ? NoahAvatar : NoeliaAvatar;
    const companionName = userProfile.companion === 'noah' ? 'Noah' : 'Noelia';
    const personality = userProfile.personality;

    // Calculate stats
    const startWeight = parseFloat(userProfile.currentWeight) || 0;
    const currentWeight = weights.length > 0 ? weights[weights.length - 1].wt : startWeight;
    const weightLost = startWeight - currentWeight;
    const streak = calculateStreak();
    const entries = weights.length;

    // Determine message based on conditions
    let message = '';

    if (weights.length > 1 && weightLost > 0) {
      // Has weight progress
      const progress = weightLost.toFixed(1);
      const dose = userProfile.dose;

      switch (personality) {
        case 'motivational':
          message = `Amazing work! You're ${progress} lbs down with a ${streak} day streak! Every pill counts! 💪`;
          break;
        case 'straightforward':
          message = `Progress: -${progress} lbs. Streak: ${streak} days. Current dose: ${dose}. Continue protocol.`;
          break;
        case 'caring':
          message = `I'm so proud of you! You've lost ${progress} lbs and logged ${streak} days straight. You're doing beautifully! 💙`;
          break;
        case 'scientific':
          message = `Data: -${progress} lbs over ${entries} entries. ${streak}-day adherence. Consistent with expected GLP-1 response patterns.`;
          break;
        default:
          message = `Great progress! You're ${progress} lbs down with a ${streak} day streak!`;
      }
    } else if (streak > 0) {
      // Has streak but no weight loss yet
      switch (personality) {
        case 'motivational':
          message = `${streak} day streak! Keep it going! Every day brings you closer to your goal! 🌟`;
          break;
        case 'straightforward':
          message = `Adherence: ${streak} consecutive days. Maintain consistency for optimal results.`;
          break;
        case 'caring':
          message = `You're doing great! ${streak} days of showing up for yourself. That's something to be proud of! 💙`;
          break;
        case 'scientific':
          message = `${streak}-day continuous adherence. Data quality improves with consistent logging.`;
          break;
        default:
          message = `${streak} day streak! Keep it up!`;
      }
    } else {
      // No data yet
      switch (personality) {
        case 'motivational':
          message = 'Start your journey today! Take your pill and log it to begin your streak! You got this! 🚀';
          break;
        case 'straightforward':
          message = 'Begin tracking to establish baseline data. Take pill and log weight.';
          break;
        case 'caring':
          message = 'Welcome! I\'m here to support you every step of the way. Let\'s start with today\'s pill. 💙';
          break;
        case 'scientific':
          message = 'Initiating tracking protocol. Consistent data entry critical for trend analysis.';
          break;
        default:
          message = 'Welcome! Let\'s start tracking your journey today.';
      }
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-start gap-4 md:gap-6">
          <CompanionAvatar size={60} />
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
              Dr. {companionName}
            </h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Home/Dashboard Component
  const Home = () => {
    const currentLog = getCurrentLog();
    const streak = calculateStreak();
    const [weightInput, setWeightInput] = useState(currentLog.weight || '');

    const CompanionAvatar = userProfile.companion === 'noah' ? NoahAvatar : NoeliaAvatar;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Date Navigation Bar */}
        <div className="bg-white border-b border-gray-200 py-4 px-8">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleOpenCalendar}
                className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="text-lg font-semibold text-gray-900">{formatDate(currentDate).primary}</div>
              </button>
              <button
                onClick={() => navigateDate(1)}
                disabled={currentDate >= new Date().toISOString().split('T')[0]}
                className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-gray-900">{streak} day streak</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Daily Insight */}
          <DailyInsight />

          {/* Main Content Grid - Proper full width grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {/* Pill Tracker */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Daily Pill</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {userProfile.dose}
              </span>
            </div>

            {!currentLog.pillTaken ? (
              /* STATE 1 - Not Taken */
              <div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Ready for your {userProfile.dose} pill?
                    </p>
                    <p className="text-sm text-gray-600">
                      Take with ≤4oz water on empty stomach, wait 30 min
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePillTaken}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
                >
                  <Pill className="w-6 h-6" />
                  I took my pill - Start 30 min timer
                </button>
              </div>
            ) : timerActive ? (
              /* STATE 2 - Timer Active */
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-6 border-2 border-orange-300">
                <div className="text-center mb-4">
                  <Clock className="w-16 h-16 text-orange-600 mx-auto mb-3" />
                  <div className="text-6xl font-bold text-orange-600 mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    No food or drinking (except small sips)
                  </p>
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <Droplet className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Less than 4oz water only</span>
                  </div>
                </div>
                <div className="w-full bg-white bg-opacity-50 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${((1800 - timeRemaining) / 1800) * 100}%` }}
                  />
                </div>
                <button
                  onClick={handleCancelTimer}
                  className="w-full py-2 bg-white bg-opacity-70 text-gray-700 text-sm font-medium rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel timer
                </button>
              </div>
            ) : (
              /* STATE 3 - Completed */
              <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8">
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-green-700 mb-2">Great job! 🎉</h4>
                <p className="text-gray-700 text-lg">You can eat and drink normally now</p>
              </div>
            )}
            </div>

            {/* Weight Logging */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Weight</h3>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.1"
                placeholder="Enter weight (lbs)"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (weightInput) {
                    handleWeightSave(weightInput);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-xl hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
              {currentLog.weight && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  Logged: {currentLog.weight} lbs
                </p>
              )}
            </div>
            {/* End of Day Check-in Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Check-in</h3>
              <button
                onClick={() => setShowEndOfDayModal(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition shadow-md"
              >
                Complete Check-in
              </button>
              <p className="text-sm text-gray-500 mt-3 text-center">
                Track workout, symptoms, hunger & energy
              </p>
            </div>
          </div>

          {/* Daily Summary - Full Width */}
          {currentLog.workout !== undefined && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-600 mb-1">Workout:</span>
                  <span className="font-medium text-lg">{currentLog.workout ? 'Yes ✅' : 'No'}</span>
                </div>
                {currentLog.hungerLevel && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 mb-1">Hunger Level:</span>
                    <span className="font-medium text-lg">{currentLog.hungerLevel}/10</span>
                  </div>
                )}
                {currentLog.energyLevel && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 mb-1">Energy Level:</span>
                    <span className="font-medium text-lg">{currentLog.energyLevel}/10</span>
                  </div>
                )}
                {currentLog.symptoms && currentLog.symptoms.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 mb-1">Symptoms:</span>
                    <span className="font-medium text-base">{currentLog.symptoms.join(', ')}</span>
                  </div>
                )}
                {currentLog.notes && (
                  <div className="flex flex-col col-span-2">
                    <span className="text-gray-600 mb-1">Notes:</span>
                    <p className="text-gray-900">{currentLog.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Progress View
  const Progress = () => {
    const CompanionAvatar = userProfile.companion === 'noah' ? NoahAvatar : NoeliaAvatar;
    const companionName = userProfile.companion === 'noah' ? 'Noah' : 'Noelia';

    // Calculate stats
    const startWeight = parseFloat(userProfile.currentWeight) || 0;
    const goalWeight = parseFloat(userProfile.goalWeight) || 0;
    const currentWeight = weights.length > 0 ? weights[weights.length - 1].wt : startWeight;
    const weightLost = startWeight - currentWeight;
    const percentToGoal = startWeight !== goalWeight
      ? Math.round(((startWeight - currentWeight) / (startWeight - goalWeight)) * 100)
      : 0;
    const daysTracked = weights.length;
    const streak = calculateStreak();

    // Detect dose changes for reference lines
    const doseChanges = [];
    weights.forEach((entry, index) => {
      if (index > 0 && entry.dose !== weights[index - 1].dose) {
        doseChanges.push({
          date: entry.date,
          dose: entry.dose
        });
      }
    });

    // Get personality-based message
    const getPersonalityMessage = () => {
      const personality = userProfile.personality;
      const weightLostStr = Math.abs(weightLost).toFixed(1);

      switch (personality) {
        case 'motivational':
          return `Amazing! You've logged ${daysTracked} weights and ${weightLost >= 0 ? 'lost' : 'gained'} ${weightLostStr} lbs! Every entry shows your commitment! 💪`;
        case 'straightforward':
          return `Progress: ${weightLost >= 0 ? '-' : '+'}${weightLostStr} lbs over ${daysTracked} entries. Current trajectory ${percentToGoal >= 50 ? 'on track' : 'developing'}.`;
        case 'caring':
          return `So proud of you! You've ${weightLost >= 0 ? 'lost' : 'gained'} ${weightLostStr} lbs. Remember to be kind to yourself on this journey. 💙`;
        case 'scientific':
          return `Data shows ${weightLost >= 0 ? '-' : '+'}${weightLostStr} lbs over ${daysTracked} data points. Adherence rate: ${Math.round((streak / daysTracked) * 100)}%. Dose correlation positive.`;
        default:
          return `Great progress! You've tracked ${daysTracked} weights and ${weightLost >= 0 ? 'lost' : 'gained'} ${weightLostStr} lbs!`;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Progress & Dosing</h1>

          <div className="space-y-6">
          {/* Weight Chart */}
          {weights.length >= 2 ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Weight Over Time</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    domain={[
                      dataMin => Math.floor(dataMin - 5),
                      dataMax => Math.ceil(dataMax + 5)
                    ]}
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="wt"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    name="Weight (lbs)"
                  />
                  {/* Dose change indicators */}
                  {doseChanges.map((change, idx) => (
                    <ReferenceLine
                      key={idx}
                      x={change.date}
                      stroke="#10B981"
                      strokeDasharray="3 3"
                      label={{
                        value: `${change.dose}`,
                        position: 'top',
                        fill: '#10B981',
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Tracking</h2>
              <p className="text-gray-600">Log your weight regularly to see your progress chart!</p>
            </div>
          )}

          {/* Progress Summary */}
          {weights.length >= 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Progress Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {weightLost >= 0 ? '-' : '+'}{Math.abs(weightLost).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">lbs lost</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{percentToGoal}%</div>
                  <div className="text-sm text-gray-600 mt-1">to goal</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{daysTracked}</div>
                  <div className="text-sm text-gray-600 mt-1">days tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{streak}</div>
                  <div className="text-sm text-gray-600 mt-1">day streak</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {weights.length >= 1 && (
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <CompanionAvatar size={60} />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Dr. {companionName}'s Analysis
                  </h3>
                  <p className="text-gray-700">
                    {getPersonalityMessage()}
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  };

  // Chat View
  const Chat = () => {
    const [inputMessage, setInputMessage] = useState('');
    const companionName = userProfile.companion === 'noah' ? 'Noah' : 'Noelia';
    const AvatarComponent = userProfile.companion === 'noah' ? NoahAvatar : NoeliaAvatar;

    const quickStartQuestions = [
      "What are common side effects?",
      "How do I manage nausea?",
      "When should I increase my dose?"
    ];

    const handleSend = () => {
      if (inputMessage.trim()) {
        sendMessage(inputMessage);
        setInputMessage('');
      }
    };

    const handleQuickQuestion = (question) => {
      sendMessage(question);
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="px-8 py-6 max-w-5xl mx-auto flex-1 w-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <AvatarComponent size={40} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat with Dr. {companionName}</h1>
              <p className="text-sm text-gray-600">Ask questions about your GLP-1 journey</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 p-6 mb-4">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              // Empty State
              <div className="text-center py-12 md:py-16">
                <MessageCircle className="w-16 h-16 md:w-20 md:h-20 text-blue-400 mx-auto mb-4" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Start a conversation
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                  Ask Dr. {companionName} anything about your GLP-1 journey
                </p>
                <div className="space-y-3 max-w-md mx-auto">
                  {quickStartQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full bg-white border-2 border-blue-200 text-blue-700 px-4 md:px-6 py-3 md:py-4 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all text-sm md:text-base font-medium"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Messages
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[75%] px-4 md:px-6 py-3 md:py-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 shadow-md rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask Dr. ${companionName} anything...`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings/Profile View
  const Profile = () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const AvatarComponent = userProfile.companion === 'noah' ? NoahAvatar : NoeliaAvatar;
    const companionName = userProfile.companion === 'noah' ? 'Noah' : 'Noelia';

    const handleExportData = () => {
      const exportData = {
        profile: userProfile,
        dailyLogs: dailyLogs,
        weights: weights,
        milestonesShown: milestonesShown,
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `noah-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      showToast('Data exported successfully!');
    };

    const handleDeleteAllData = () => {
      setDailyLogs({});
      setWeights([]);
      setMilestonesShown([]);
      setMessages([]);
      setShowDeleteConfirm(false);
      showToast('All data deleted', 'error');
    };

    const totalDaysTracked = Object.keys(dailyLogs).length;
    const totalPillsTaken = Object.values(dailyLogs).filter(log => log.pillTaken).length;
    const currentStreak = calculateStreak();
    const currentWeight = weights.length > 0 ? weights[weights.length - 1].wt : userProfile.currentWeight;
    const weightLost = parseFloat(userProfile.currentWeight) - parseFloat(currentWeight);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings & Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <AvatarComponent size={100} />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{userProfile.name}</h2>
                <p className="text-lg text-gray-600">Working with Dr. {companionName}</p>
                <p className="text-sm text-gray-500 mt-1 capitalize">{userProfile.personality} personality</p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Your Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{totalDaysTracked}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Days Tracked</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{currentStreak}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-purple-600">{totalPillsTaken}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Pills Taken</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">{weightLost.toFixed(1)}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">lbs Lost</div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Profile Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Current Dose</span>
                <span className="font-semibold text-gray-900">{userProfile.dose}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Starting Weight</span>
                <span className="font-semibold text-gray-900">{userProfile.currentWeight} lbs</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Current Weight</span>
                <span className="font-semibold text-gray-900">{currentWeight} lbs</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Goal Weight</span>
                <span className="font-semibold text-gray-900">{userProfile.goalWeight} lbs</span>
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Daily Reminder</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 font-medium">Reminder Time</p>
                <p className="text-sm text-gray-500">Get notified to take your pill</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">{userProfile.reminderTime}</div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Data Management</h3>
            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Export Your Data</div>
                    <div className="text-sm text-gray-500">Download all your tracking data as JSON</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-between p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-6 h-6 text-red-600" />
                  <div className="text-left">
                    <div className="font-semibold text-red-900">Delete All Data</div>
                    <div className="text-sm text-red-600">Permanently remove all tracking data</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600" />
              </button>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-gray-700" />
              Privacy & Security
            </h3>
            <p className="text-gray-600 leading-relaxed">
              All your data is stored locally on your device. Noah does not send any personal health information to external servers. Your privacy and security are our top priority.
            </p>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">About Noah</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              Noah is your personal GLP-1 companion app, designed to help you track your medication, monitor your progress, and stay motivated on your health journey.
            </p>
            <p className="text-sm text-gray-500">
              Version 1.0.0 • Made with <Heart className="w-4 h-4 inline text-red-500" /> for GLP-1 users
            </p>
          </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete All Data?</h2>
                <p className="text-gray-600">
                  This will permanently delete all your tracking data, including daily logs, weight entries, and milestones. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllData}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Top Navigation Bar (Web-first)
  const TopNav = () => {
    const CompanionAvatar = userProfile.companion === 'noah' ? NoahAvatar : NoeliaAvatar;
    const companionName = userProfile.companion === 'noah' ? 'Noah' : 'Noelia';

    return (
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo/Brand */}
            <div className="flex items-center gap-3">
              <CompanionAvatar size={40} />
              <div>
                <div className="font-bold text-lg text-gray-900">Noah GLP-1 Companion</div>
                <div className="text-sm text-gray-600">Hey {userProfile.name}!</div>
              </div>
            </div>

            {/* Center - Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'home'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setView('progress')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'progress'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Progress
              </button>
              <button
                onClick={() => setView('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'chat'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Chat
              </button>
              <button
                onClick={() => setView('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'profile'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                Settings
              </button>
            </div>

            {/* Right - User Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Dr. {companionName}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                {userProfile.dose}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <>
      {view === 'onboarding' ? (
        <Onboarding />
      ) : (
        <>
          <TopNav />
          {view === 'home' && <Home />}
          {view === 'progress' && <Progress />}
          {view === 'chat' && <Chat />}
          {view === 'profile' && <Profile />}
        </>
      )}

      {showEndOfDayModal && <EndOfDayModal />}
      {showCalendar && <Calendar />}
      {showMilestone && <MilestoneModal />}

      {/* Toast Notifications */}
      <div className="fixed top-20 right-8 z-50 space-y-2 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
