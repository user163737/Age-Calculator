import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

function App() {
  const [dob, setDob] = useState('');
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const calculateAge = (dateString: string): AgeResult | null => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const birthDate = new Date(year, month, day);
    const today = new Date();

    if (birthDate > today) {
      setError("That date hasn't arrived yet.");
      return null;
    }

    if (birthDate.getFullYear() < 1900 || birthDate.getFullYear() > today.getFullYear()) {
      setError('Please enter a valid date.');
      return null;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }

    setDob(value);
    setError('');

    if (value.length === 10) {
      const result = calculateAge(value);
      if (result) {
        setAgeResult(result);
        setError('');
      }
    } else {
      setAgeResult(null);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return today.toLocaleDateString('en-GB', options);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 30%, rgba(147, 197, 253, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 70%, rgba(196, 181, 253, 0.3) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(251, 207, 232, 0.2) 0px, transparent 50%)
          `,
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Age Calculator</h1>
          <p className="text-gray-600 font-medium">Discover your age in an instant</p>
        </div>

        <div
          className={`glass rounded-3xl p-8 shadow-2xl transition-all duration-300 ${
            isFocused ? 'shadow-blue-200/50 scale-[1.02]' : ''
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
          </div>

          <input
            type="text"
            value={dob}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            className={`w-full px-6 py-4 text-2xl font-semibold text-gray-800 bg-white/50 rounded-2xl
              border-2 transition-all duration-300 outline-none placeholder-gray-400
              ${error ? 'border-red-400 shadow-red-200/50' : isFocused ? 'border-blue-400 shadow-lg shadow-blue-200/50' : 'border-white/40'}
            `}
          />

          {error && (
            <div className="mt-3 p-3 bg-red-50/80 border border-red-200 rounded-xl animate-slide-up">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
        </div>

        {ageResult && !error && (
          <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Your Age</span>
            </div>

            <div className="text-center space-y-2">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {ageResult.years}
              </div>
              <div className="text-2xl font-semibold text-gray-700">
                years old
              </div>
              <div className="mt-4 pt-4 border-t border-white/40">
                <p className="text-lg text-gray-600 font-medium">
                  {ageResult.years} years, {ageResult.months} months, {ageResult.days} days
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="glass-dark rounded-2xl px-6 py-3 text-center shadow-lg">
          <p className="text-sm text-gray-700 font-medium">
            Today's Date: <span className="font-semibold">{getTodayDate()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
