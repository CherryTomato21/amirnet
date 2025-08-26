import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Home, BookOpen, Gamepad, ClipboardList, Link, List, XCircle } from 'lucide-react'; // Added 'XCircle' icon for removing words

export default function HomeScreen({ setCurrentView, learnedWordsCount, totalWordsCount }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h1 className="text-4xl sm:text-5xl font-extrabold font-hebrewRubik text-indigo-800 mb-12 text-center drop-shadow-md">
        הכנה למבחן אמירנט
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <button
          onClick={() => setCurrentView('flashcards')}
          className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          <BookOpen className="text-blue-500 mb-4 group-hover:text-blue-600 transition-colors" size={64} />
          <span className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-700 font-inter">
            Flashcards
          </span>
          <span className="text-sm text-gray-500 mt-2 text-center font-inter">
            Practice terms & definitions
          </span>
        </button>

        <button
          onClick={() => setCurrentView('multipleChoice')}
          className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group focus:outline-none focus:ring-4 focus:ring-green-400"
        >
          <ClipboardList className="text-green-500 mb-4 group-hover:text-green-600 transition-colors" size={64} />
          <span className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-700 font-inter">
            Multiple Choice
          </span>
          <span className="text-sm text-gray-500 mt-2 text-center font-inter">
            Test your knowledge with quizzes
          </span>
        </button>

        <button
          onClick={() => setCurrentView('matchingGame')}
          className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group focus:outline-none focus:ring-4 focus:ring-purple-400"
        >
          <Link className="text-purple-500 mb-4 group-hover:text-purple-600 transition-colors" size={64} />
          <span className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-700 font-inter">
            Matching Game
          </span>
          <span className="text-sm text-gray-500 mt-2 text-center font-inter">
            Match terms to definitions
          </span>
        </button>
      </div>
      <p className="mt-8 text-gray-600 text-lg">
        Learned words: {learnedWordsCount} / {totalWordsCount}
      </p>

      {/* New "Learned Words List" micro button */}
      <button
        onClick={() => setCurrentView('learnedWordsList')}
        className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 text-md font-semibold rounded-full shadow-md hover:bg-gray-300 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 flex items-center"
      >
        <List className="mr-2" size={20} /> View Learned Words
      </button>

    </div>
  );
}