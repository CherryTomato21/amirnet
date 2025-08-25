import React, { useState, useEffect, useCallback } from 'react';
import wordsData from '@/data/words.json'; // Using the alias for words.json
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';

// Utility to debounce function calls
const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

export default function App() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedWordsIndices, setLearnedWordsIndices] = useState(new Set(Array.from(JSON.parse(localStorage.getItem('amirnet_learned_words') || '[]'))));
  const [message, setMessage] = useState('');

  const LOCAL_STORAGE_KEY = 'amirnet_learned_words';

  // Load words and learned status on component mount
  useEffect(() => {
    // Shuffle words initially for a fresh experience each load
    const shuffledWords = [...wordsData].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    // Initial load of learned words is now handled directly in useState initialization to prevent sync issues
  }, []);

  // Save learned words to local storage whenever it changes
  const debouncedSaveLearnedWords = useCallback(
    debounce((learnedSet) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(learnedSet)));
      console.log('Learned words saved to local storage.');
    }, 500),
    []
  );

  useEffect(() => {
    // Only save if the set is not empty or if it was loaded from storage
    if (learnedWordsIndices.size > 0 || localStorage.getItem(LOCAL_STORAGE_KEY)) {
      debouncedSaveLearnedWords(learnedWordsIndices);
    }
  }, [learnedWordsIndices, debouncedSaveLearnedWords]);

  // Display message helper
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const currentWord = words[currentWordIndex];
  const isCurrentWordLearned = currentWord && learnedWordsIndices.has(currentWordIndex);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = () => {
    setIsFlipped(false);
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handlePreviousWord = () => {
    setIsFlipped(false);
    setCurrentWordIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
  };

  const handleToggleLearned = () => {
    if (!currentWord) return;

    // Use a function to update state based on previous state
    setLearnedWordsIndices((prevSet) => {
      const newSet = new Set(prevSet); // Create a new set from the previous one
      if (newSet.has(currentWordIndex)) {
        newSet.delete(currentWordIndex);
        showMessage('Word unmarked as learned!');
      } else {
        newSet.add(currentWordIndex);
        showMessage('Word marked as learned!');
      }
      return newSet; // Return the new set
    });
  };

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter p-4">
        <p className="text-xl text-gray-700">Loading vocabulary...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter p-4 sm:p-6 md:p-8">
      {message && (
        <div className="fixed top-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-down z-50">
          {message}
        </div>
      )}

      <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-8 text-center drop-shadow-md">
        הכנה למבחן אמירנט
      </h1>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transition-transform duration-300 hover:scale-105">
        <div
          className={`relative w-full h-64 flex items-center justify-center text-center p-6 cursor-pointer transform-gpu transition-transform duration-500 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of the card (Term - English Cursive) */}
          <div
            className={`absolute w-full h-full flex flex-col items-center justify-center backface-hidden transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
            style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          >
            <p className="text-3xl sm:text-4xl font-englishCursive font-bold text-gray-900 mb-2">
              {currentWord ? currentWord.term : 'No word available'}
            </p>
            {isCurrentWordLearned && (
              <CheckCircle className="text-green-500 text-lg sm:text-xl mt-2" size={32} />
            )}
          </div>

          {/* Back of the card (Definition - Hebrew Rubik) */}
          <div
            className={`absolute w-full h-full flex flex-col items-center justify-center backface-hidden rotate-y-180 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
            style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          >
            <p className="text-2xl sm:text-3xl font-hebrewRubik text-gray-700">
              {currentWord ? currentWord.definition : 'No definition available'}
            </p>
            {isCurrentWordLearned && (
              <CheckCircle className="text-green-500 text-lg sm:text-xl mt-2" size={32} />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        <button
          onClick={handlePreviousWord}
          className="flex items-center px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
        >
          <ChevronLeft className="mr-2" size={24} /> Previous
        </button>
        <button
          onClick={handleToggleLearned}
          className={`flex items-center px-6 py-3 text-lg font-semibold rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isCurrentWordLearned
            ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400'
            : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400'
            }`}
        >
          {isCurrentWordLearned ? <CheckCircle className="mr-2" size={24} /> : <Circle className="mr-2" size={24} />}
          {isCurrentWordLearned ? 'Unmark Learned' : 'Mark as Learned'}
        </button>
        <button
          onClick={handleNextWord}
          className="flex items-center px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
        >
          Next <ChevronRight className="ml-2" size={24} />
        </button>
      </div>

      <p className="mt-8 text-gray-600 text-sm">
        Learned words: {learnedWordsIndices.size} / {words.length}
      </p>

      {/* Basic global styles for the flip effect */}
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