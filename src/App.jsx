import React, { useState, useEffect, useCallback } from 'react';
import HomeScreen from './components/HomeScreen.jsx';
import FlashcardPractice from './components/FlashcardPractice.jsx';
import MatchingGame from './components/MatchingGame.jsx';
import MultipleChoice from './components/MultipleChoice.jsx';
import LearnedWordsList from './components/LearnedWordsList.jsx';

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
  const [allWords, setAllWords] = useState([]);
  const [isLoadingWords, setIsLoadingWords] = useState(true);
  const [wordsError, setWordsError] = useState(null);
  const [learnedWordsIndices, setLearnedWordsIndices] = useState(new Set(Array.from(JSON.parse(localStorage.getItem('amirnet_learned_words') || '[]'))));
  const [currentView, setCurrentView] = useState('home');

  const LOCAL_STORAGE_KEY = 'amirnet_learned_words';

  // Fetch words once at the top level
  useEffect(() => {
    const fetchAllWords = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}words.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const wordsData = await response.json();
        setAllWords(wordsData);
      } catch (e) {
        console.error("Failed to fetch all words:", e);
        setWordsError("Failed to load vocabulary. Please check the words.json file.");
      } finally {
        setIsLoadingWords(false);
      }
    };
    fetchAllWords();
  }, []);

  // Save learned words to local storage whenever it changes (debounced)
  const debouncedSaveLearnedWords = useCallback(
    debounce((learnedSet) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(learnedSet)));
      console.log('Learned words saved to local storage.');
    }, 500),
    []
  );

  useEffect(() => {
    // Only save if learnedWordsIndices is not empty or if there's an existing item to potentially clear
    if (learnedWordsIndices.size > 0 || localStorage.getItem(LOCAL_STORAGE_KEY) !== null) {
      debouncedSaveLearnedWords(learnedWordsIndices);
    }
  }, [learnedWordsIndices, debouncedSaveLearnedWords]);


  if (isLoadingWords) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter p-4">
        <p className="text-xl text-indigo-700 animate-pulse">Loading application data...</p>
      </div>
    );
  }

  if (wordsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 font-inter p-4">
        <p className="text-xl text-red-700 mb-4">{wordsError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-red-700 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderView = () => {
    const commonProps = { setCurrentView, allWords, learnedWordsIndices, setLearnedWordsIndices };
    switch (currentView) {
      case 'home':
        return <HomeScreen {...commonProps} learnedWordsCount={learnedWordsIndices.size} totalWordsCount={allWords.length} />;
      case 'flashcards':
        return <FlashcardPractice {...commonProps} />;
      case 'multipleChoice':
        return <MultipleChoice {...commonProps} />;
      case 'matchingGame':
        return <MatchingGame {...commonProps} />;
      case 'learnedWordsList':
        return <LearnedWordsList {...commonProps} />;
      default:
        return <HomeScreen {...commonProps} learnedWordsCount={learnedWordsIndices.size} totalWordsCount={allWords.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter p-4 sm:p-6 md:p-8">
      {renderView()}
    </div>
  );
}