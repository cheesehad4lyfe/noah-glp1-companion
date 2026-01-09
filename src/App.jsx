import React, { useState, useEffect } from 'react';
import { Heart, Home, BarChart3, MessageCircle, User, ChevronLeft, ChevronRight, Zap, AlertCircle, Pill, Clock, Droplet, CheckCircle, X, Scale } from 'lucide-react';
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
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
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

          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Step 1: Name */}
            {onboardingStep === 1 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-6 shadow-lg">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Noah!</h2>
                <p className="text-lg text-gray-600 mb-8">Let's get to know you better</p>
                <div className="max-w-md mx-auto">
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

  // Home/Dashboard Component
  const Home = () => {
    const currentLog = getCurrentLog();
    const streak = calculateStreak();
    const [weightInput, setWeightInput] = useState(currentLog.weight || '');

    const CompanionAvatar = userProfile.companion === 'noah' ? NoahAvatar : NoeliaAvatar;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
        {/* Header with Date Navigation and Streak */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setView('home')}
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                <CompanionAvatar size={50} />
                <div className="text-left">
                  <div className="font-medium text-sm opacity-90">Dr. {userProfile.companion === 'noah' ? 'Noah' : 'Noelia'}</div>
                  <div className="font-bold text-lg">Hey {userProfile.name}!</div>
                </div>
              </button>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-bold text-lg">{streak}</span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white bg-opacity-20 rounded-xl px-4 py-3">
              <button
                onClick={() => navigateDate(-1)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleOpenCalendar}
                className="text-center px-4 py-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <div className="text-xl font-bold">{formatDate(currentDate).primary}</div>
                {formatDate(currentDate).secondary && (
                  <div className="text-sm opacity-90">{formatDate(currentDate).secondary}</div>
                )}
              </button>
              <button
                onClick={() => navigateDate(1)}
                disabled={currentDate >= new Date().toISOString().split('T')[0]}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition disabled:opacity-30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* Pill Tracker */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
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
          <div className="bg-white rounded-2xl shadow-lg p-6">
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

          {/* End of Day Check-in */}
          <button
            onClick={() => setShowEndOfDayModal(true)}
            className="w-full py-4 bg-white border-2 border-blue-500 text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 transition shadow-md"
          >
            End of Day Check-in
          </button>

          {/* Daily Summary */}
          {currentLog.workout !== undefined && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Workout:</span>
                  <span className="font-medium">{currentLog.workout ? 'Yes ✅' : 'No'}</span>
                </div>
                {currentLog.symptoms && currentLog.symptoms.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Symptoms:</span>
                    <span className="font-medium">{currentLog.symptoms.join(', ')}</span>
                  </div>
                )}
                {currentLog.hungerLevel && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hunger Level:</span>
                    <span className="font-medium">{currentLog.hungerLevel}/10</span>
                  </div>
                )}
                {currentLog.energyLevel && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy Level:</span>
                    <span className="font-medium">{currentLog.energyLevel}/10</span>
                  </div>
                )}
                {currentLog.notes && (
                  <div>
                    <span className="text-gray-600">Notes:</span>
                    <p className="text-gray-900 mt-1">{currentLog.notes}</p>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 shadow-lg">
          <h1 className="text-2xl font-bold">Progress & Dosing</h1>
        </div>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Weight Chart */}
          {weights.length >= 2 ? (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Weight Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
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
    );
  };

  // Chat View (Placeholder)
  const Chat = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Chat with {userProfile.companion === 'noah' ? 'Dr. Noah' : 'Dr. Noelia'}</h1>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">Chat with your AI companion for support and advice</p>
        </div>
      </div>
    </div>
  );

  // Profile View (Placeholder)
  const Profile = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            {userProfile.companion === 'noah' ? <NoahAvatar size={100} /> : <NoeliaAvatar size={100} />}
            <h2 className="text-2xl font-bold text-gray-900 mt-4">{userProfile.name}</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Companion:</span>
              <span className="font-medium">Dr. {userProfile.companion === 'noah' ? 'Noah' : 'Noelia'}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Personality:</span>
              <span className="font-medium capitalize">{userProfile.personality}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Daily Reminder:</span>
              <span className="font-medium">{userProfile.reminderTime}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Current Dose:</span>
              <span className="font-medium">{userProfile.dose}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Starting Weight:</span>
              <span className="font-medium">{userProfile.currentWeight} lbs</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Goal Weight:</span>
              <span className="font-medium">{userProfile.goalWeight} lbs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-around">
        <button
          onClick={() => setView('home')}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${view === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button
          onClick={() => setView('progress')}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${view === 'progress' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs font-medium">Progress</span>
        </button>
        <button
          onClick={() => setView('chat')}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${view === 'chat' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button
          onClick={() => setView('profile')}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${view === 'profile' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );

  // Main Render
  return (
    <>
      {view === 'onboarding' && <Onboarding />}
      {view === 'home' && <Home />}
      {view === 'progress' && <Progress />}
      {view === 'chat' && <Chat />}
      {view === 'profile' && <Profile />}
      {view !== 'onboarding' && <BottomNav />}
      {showEndOfDayModal && <EndOfDayModal />}
      {showCalendar && <Calendar />}
    </>
  );
}
