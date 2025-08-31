import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

export default function MultipleChoiceGame({ setCurrentView, allWords, wordMastery, setWordMastery, score, setScore }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const MAX_QUESTIONS = 10;

  useEffect(() => {
    if (allWords.length > 0) {
      setIsLoading(false);
      if (!currentQuestion && questionCount < MAX_QUESTIONS) {
        generateQuestion();
      }
    } else if (allWords.length === 0) {
      setIsLoading(false);
      setError("No words available to play Multiple Choice.");
    }
  }, [allWords, questionCount, currentQuestion, wordMastery]);

  const generateQuestion = () => {
    setSelectedOption(null);
    setFeedback('');

    const unmasteredWords = allWords.filter((_, index) => (wordMastery[index] || 0) < 3);

    if (unmasteredWords.length < 4) {
      setError("Not enough unmastered words to create multiple choice questions.");
      return;
    }

    const correctWord = unmasteredWords[Math.floor(Math.random() * unmasteredWords.length)];

    let incorrectOptions = [];
    while (incorrectOptions.length < 3) {
      const randomIncorrectWord = allWords[Math.floor(Math.random() * allWords.length)];
      if (randomIncorrectWord.term !== correctWord.term && !incorrectOptions.includes(randomIncorrectWord.term)) {
        incorrectOptions.push(randomIncorrectWord.term);
      }
    }

    const allOptions = [correctWord.term, ...incorrectOptions];
    allOptions.sort(() => Math.random() - 0.5);

    setCurrentQuestion(correctWord);
    setOptions(allOptions);
  };

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    if (option === currentQuestion.term) {
      setFeedback('Correct!');
      setScore(prevScore => prevScore + 10);
      const originalIndex = allWords.indexOf(currentQuestion);
      setWordMastery(prevMastery => ({
        ...prevMastery,
        [originalIndex]: (prevMastery[originalIndex] || 0) + 1
      }));
    } else {
      setFeedback(`Incorrect. The correct answer was "${currentQuestion.term}".`);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      setQuestionCount(prev => prev + 1);
      setCurrentQuestion(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <p className="text-xl text-indigo-700 animate-pulse">Loading game data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh bg-red-50 p-4">
        <p className="text-xl text-red-700 mb-4">{error}</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-red-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (questionCount >= MAX_QUESTIONS) {
    const finalScore = allWords.filter((_, index) => (wordMastery[index] || 0) >= 3).length;
    return (
      <div className="flex flex-col items-center justify-center min-h-svh">
        <h2 className="text-4xl font-bold text-indigo-800 mb-6">Game Over!</h2>
        <p className="text-2xl text-gray-700 mb-8">You finished the quiz!</p>
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <Home className="mr-2" size={24} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <button
        onClick={() => setCurrentView('home')}
        className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full shadow-md hover:bg-gray-300 transition-all duration-200 ease-in-out transform hover:scale-105"
      >
        <Home className="mr-2" size={20} /> Home
      </button>

      <h1 className="text-4xl sm:text-5xl font-extrabold font-hebrewRubik text-indigo-800 mb-8 text-center drop-shadow-md">
        Multiple Choice Quiz
      </h1>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 mb-8 text-center">
        <p className="text-xl text-gray-600 mb-4">Question {questionCount + 1} / {MAX_QUESTIONS}</p>
        <p className="text-3xl font-hebrewRubik text-gray-900 mb-8">
          {currentQuestion ? currentQuestion.definition : 'Loading question...'}
        </p>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion && options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`p-4 rounded-xl text-xl font-englishHandwritten font-semibold transition-all duration-200 ${
                selectedOption === null
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                  : option === currentQuestion.term
                    ? 'bg-green-200 text-green-900'
                    : option === selectedOption
                      ? 'bg-red-200 text-red-900'
                      : 'bg-gray-100 text-gray-500'
              } ${selectedOption !== null && 'cursor-not-allowed'}`}
              disabled={selectedOption !== null}
            >
              {option}
            </button>
          ))}
        </div>
        {feedback && (
          <p className={`mt-6 text-xl font-semibold ${feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600'}`}>
            {feedback}
          </p>
        )}
        {selectedOption !== null && questionCount < MAX_QUESTIONS && (
          <button
            onClick={handleNextQuestion}
            className="mt-8 px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-200"
          >
            {questionCount === MAX_QUESTIONS - 1 ? 'Finish Game' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}