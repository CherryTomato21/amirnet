import React, { useState, useEffect, useCallback } from 'react';
import HomeScreen from './components/HomeScreen.jsx';
import FlashcardPractice from './components/FlashcardPractice.jsx';
import MatchingGame from './components/MatchingGame.jsx';
import MultipleChoice from './components/MultipleChoice.jsx';
import LearnedWordsList from './components/LearnedWordsList.jsx';

export default function App() {
  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const [allWords, setAllWords] = useState([]);
  const [isLoadingWords, setIsLoadingWords] = useState(true);
  const [wordsError, setWordsError] = useState(null);
  const [wordMastery, setWordMastery] = useState(() => JSON.parse(localStorage.getItem('amirnet_word_mastery') || '{}'));
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('amirnet_score') || '0', 10));
  const [currentView, setCurrentView] = useState('home');

  const WORD_MASTERY_KEY = 'amirnet_word_mastery';
  const SCORE_KEY = 'amirnet_score';

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
        setWordsError("Failed to load vocabulary. Please check the words.json file and your vite.config.js base path.");
      } finally {
        setIsLoadingWords(false);
      }
    };
    fetchAllWords();
  }, []);

  const debouncedSaveState = useCallback(
    debounce((mastery, currentScore) => {
      localStorage.setItem(WORD_MASTERY_KEY, JSON.stringify(mastery));
      localStorage.setItem(SCORE_KEY, currentScore.toString());
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSaveState(wordMastery, score);
  }, [wordMastery, score, debouncedSaveState]);

  if (isLoadingWords) {
    return (
      <div className="flex items-center justify-center min-h-svh bg-gradient-to-br from-blue-50 to-indigo-100 font-inter p-4">
        <p className="text-xl text-indigo-700 animate-pulse">Loading application data...</p>
      </div>
    );
  }

  if (wordsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh bg-red-50 font-inter p-4">
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

  const learnedWordsCount = Object.values(wordMastery).filter(count => count >= 3).length;

  const renderView = () => {
    const commonProps = { setCurrentView, allWords, wordMastery, setWordMastery, score, setScore };
    switch (currentView) {
      case 'home':
        return <HomeScreen {...commonProps} learnedWordsCount={learnedWordsCount} totalWordsCount={allWords.length} />;
      case 'flashcards':
        return <FlashcardPractice {...commonProps} />;
      case 'multipleChoice':
        return <MultipleChoice {...commonProps} />;
      case 'matchingGame':
        return <MatchingGame {...commonProps} />;
      case 'learnedWordsList':
        return <LearnedWordsList {...commonProps} />;
      default:
        return <HomeScreen {...commonProps} learnedWordsCount={learnedWordsCount} totalWordsCount={allWords.length} />;
    }
  };

  return (
    <div className="min-h-svh bg-gradient-to-br from-blue-50 to-indigo-100 font-inter p-4 sm:p-6 md:p-8">
      {renderView()}
    </div>
  );
}