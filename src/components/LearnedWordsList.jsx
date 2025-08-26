import React, { useState } from 'react';
import { Home, XCircle } from 'lucide-react';

export default function LearnedWordsList({ setCurrentView, allWords, learnedWordsIndices, setLearnedWordsIndices }) {
  const learnedWords = allWords.filter((_, index) => learnedWordsIndices.has(index));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLearnedWords = learnedWords.filter(word =>
    word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleRemoveLearnedWord = (wordToRemove) => {
    const originalIndex = allWords.indexOf(wordToRemove);
    if (originalIndex !== -1) {
      setLearnedWordsIndices(prevSet => {
        const newSet = new Set(prevSet);
        newSet.delete(originalIndex);
        return newSet;
      });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-svh p-4">
      {/* Back to Home Button */}
      <button
        onClick={() => setCurrentView('home')}
        className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full shadow-md hover:bg-gray-300 transition-all duration-200 ease-in-out transform hover:scale-105"
      >
        <Home className="mr-2" size={20} /> Home
      </button>

      <h1 className="text-4xl sm:text-5xl font-extrabold font-hebrewRubik text-indigo-800 mb-8 text-center drop-shadow-md">
        Your Learned Words
      </h1>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6">
        <input
          type="text"
          placeholder="Search learned words..."
          className="w-full p-3 mb-6 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-inter text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {learnedWords.length === 0 ? (
          <p className="text-xl text-gray-700 text-center">You haven't learned any words yet. Start playing!</p>
        ) : filteredLearnedWords.length === 0 ? (
          <p className="text-xl text-gray-700 text-center">No matching learned words found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLearnedWords.map((word, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <p className="text-xl font-englishHandwritten font-bold text-gray-900 mb-1 sm:mb-0">
                  {word.term}
                </p>
                <p className="text-lg font-hebrewRubik text-gray-700 text-right">
                  {word.definition}
                </p>
                <button
                  onClick={() => handleRemoveLearnedWord(word)}
                  className="mt-2 sm:mt-0 px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors flex items-center"
                >
                  <XCircle size={16} className="mr-1" /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}