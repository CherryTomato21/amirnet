import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Home } from 'lucide-react';

// Utility to debounce function calls
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

export default function FlashcardPractice({ setCurrentView, allWords, wordMastery, setWordMastery, setScore }) {
  const [unlearnedWords, setUnlearnedWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (allWords.length > 0) {
      const filteredWords = allWords.filter((_, index) => wordMastery[index] < 3);
      const shuffledWords = [...filteredWords].sort(() => Math.random() - 0.5);

      const timer = setTimeout(() => {
        setUnlearnedWords(shuffledWords);
        setIsLoading(false);
        if (shuffledWords.length > 0) {
          setCurrentWordIndex(0);
        }
      }, 0);

      return () => clearTimeout(timer);
    } else if (allWords.length === 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setUnlearnedWords([]);
        setCurrentWordIndex(0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [allWords, wordMastery]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const currentWord = unlearnedWords[currentWordIndex];
  const isCurrentWordMastered = currentWord && wordMastery[allWords.indexOf(currentWord)] >= 3;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = () => {
    setIsFlipped(false);
    if (unlearnedWords.length === 0) return;
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % unlearnedWords.length);
  };

  const handlePreviousWord = () => {
    setIsFlipped(false);
    if (unlearnedWords.length === 0) return;
    setCurrentWordIndex((prevIndex) => (prevIndex - 1 + unlearnedWords.length) % unlearnedWords.length);
  };

  const handleCorrectAnswer = () => {
    if (!currentWord) return;
    const originalIndex = allWords.indexOf(currentWord);
    if (originalIndex !== -1) {
      const currentMastery = wordMastery[originalIndex] || 0;
      if (currentMastery < 3) {
        setWordMastery(prevMastery => ({
          ...prevMastery,
          [originalIndex]: currentMastery + 1
        }));
        setScore(prevScore => prevScore + 10); // Award points
        showMessage('Great! You earned 10 points!');
      }
    }
    handleNextWord();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-svh bg-gradient-to-br from-blue-50 to-indigo-100 font-inter p-4">
        <p className="text-xl text-indigo-700 animate-pulse">Loading vocabulary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh bg-red-50 font-inter p-4">
        <p className="text-xl text-red-700 mb-4">{error}</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-red-700 transition-all duration-200"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (unlearnedWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh bg-gray-100 font-inter p-4">
        <p className="text-xl text-gray-700 mb-4">You've learned all the words! Great job!</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-200"
        >
          <Home className="mr-2" size={20} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      {message && (
        <div className="fixed top-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-down z-50">
          {message}
        </div>
      )}

      <button
        onClick={() => setCurrentView('home')}
        className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full shadow-md hover:bg-gray-300 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
      >
        <Home className="mr-2" size={20} /> Home
      </button>

      <h1 className="text-4xl sm:text-5xl font-extrabold font-hebrewRubik text-indigo-800 mb-8 text-center drop-shadow-md">
        Flashcard Practice
      </h1>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transition-transform duration-300 hover:scale-105">
        <div
          className={`relative w-full h-64 flex items-center justify-center text-center p-6 cursor-pointer transform-gpu transition-transform duration-500 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className={`absolute w-full h-full flex flex-col items-center justify-center backface-hidden transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
            style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          >
            <p className="text-3xl sm:text-4xl font-englishHandwritten font-bold text-gray-900 mb-2">
              {currentWord ? currentWord.term : 'No word available'}
            </p>
            {isCurrentWordMastered && (
              <CheckCircle className="text-green-500 text-lg sm:text-xl mt-2" size={32} />
            )}
          </div>

          <div
            className={`absolute w-full h-full flex flex-col items-center justify-center backface-hidden rotate-y-180 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
            style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          >
            <p className="text-2xl sm:text-3xl font-hebrewRubik font-semibold text-gray-700">
              {currentWord ? currentWord.definition : 'No definition available'}
            </p>
            {isCurrentWordMastered && (
              <CheckCircle className="text-green-500 text-lg sm:text-xl mt-2" size={32} />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full max-w-lg">
        <button
          onClick={handlePreviousWord}
          className="flex items-center px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
        >
          <ChevronLeft className="mr-2" size={24} /> Previous
        </button>
        <button
          onClick={handleCorrectAnswer}
          className={`flex items-center px-6 py-3 text-lg font-semibold rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75 bg-green-500 text-white hover:bg-green-600 focus:ring-green-400`}
        >
          <CheckCircle className="mr-2" size={24} /> I Knew It!
        </button>
        <button
          onClick={handleNextWord}
          className="flex items-center px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
        >
          Next <ChevronRight className="ml-2" size={24} />
        </button>
      </div>

      <p className="mt-8 text-gray-600 text-sm">
        {currentWord ? `Mastery: ${wordMastery[allWords.indexOf(currentWord)] || 0}/3` : ''}
      </p>

      <style>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}