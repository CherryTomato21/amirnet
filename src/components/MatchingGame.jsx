import React, { useState, useEffect, useCallback } from 'react';
import { Home } from 'lucide-react';

export default function MatchingGame({ setCurrentView, allWords, learnedWordsIndices, setLearnedWordsIndices }) {
    const [termOptions, setTermOptions] = useState([]);
    const [definitionOptions, setDefinitionOptions] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [selectedDefinition, setSelectedDefinition] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState({}); // { term: definition }
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const PAIR_COUNT = 5; // Number of pairs to match in one game

    useEffect(() => {
        if (allWords.length > 0) {
            setIsLoading(false);
        } else if (allWords.length === 0) {
            setIsLoading(false);
            setError("No words available to play Matching Game.");
        }
    }, [allWords]);

    const startGame = useCallback(() => {
        const unlearnedWords = allWords.filter((_, index) => !learnedWordsIndices.has(index));

        if (unlearnedWords.length === 0 && allWords.length > 0) {
            setError("All words learned! Go back to home to restart.");
            setGameOver(true);
            setGameStarted(false); // Make sure gameStarted is false so "Start Game" button remains
            return;
        }

        if (unlearnedWords.length < PAIR_COUNT) {
            setError(`Need at least ${PAIR_COUNT} unlearned words to start the matching game.`);
            setGameStarted(false);
            return;
        }

        setGameStarted(true);
        setGameOver(false);
        setSelectedTerm(null);
        setSelectedDefinition(null);
        setMatchedPairs({});
        setFeedback('');
        setScore(0);

        // Get PAIR_COUNT unique random unlearned words
        const shuffledWords = [...unlearnedWords].sort(() => Math.random() - 0.5);
        const gameWords = shuffledWords.slice(0, PAIR_COUNT);

        const terms = gameWords.map(word => word.term).sort(() => Math.random() - 0.5);
        const definitions = gameWords.map(word => word.definition).sort(() => Math.random() - 0.5);

        setTermOptions(terms);
        setDefinitionOptions(definitions);
    }, [allWords, learnedWordsIndices]); // Added learnedWordsIndices to dependencies

    useEffect(() => {
        if (!isLoading && allWords.length > 0 && !gameStarted && !error) {
            startGame(); // Auto-start game when words are loaded or restart if needed
        }
    }, [isLoading, allWords, gameStarted, error, startGame]);


    const handleTermClick = (term) => {
        if (gameOver) return;
        // Check if this term is already part of a successfully matched pair
        if (Object.keys(matchedPairs).includes(term)) return;
        setSelectedTerm(term);
        setFeedback('');
    };

    const handleDefinitionClick = (definition) => {
        if (gameOver) return;
        // Check if this definition is already part of a successfully matched pair
        if (Object.values(matchedPairs).includes(definition)) return;
        setSelectedDefinition(definition);
        setFeedback('');
    };

    useEffect(() => {
        if (selectedTerm && selectedDefinition) {
            // Capture current selections before clearing to process them
            const currentSelectedTerm = selectedTerm;
            const currentSelectedDefinition = selectedDefinition;

            // Clear selections immediately to prevent re-evaluation in next render cycles
            setSelectedTerm(null);
            setSelectedDefinition(null);

            const termObject = allWords.find(w => w.term === currentSelectedTerm);

            if (termObject && termObject.definition === currentSelectedDefinition) {
                // Only increment score and add to matchedPairs if it's a new, correct match
                if (!matchedPairs[currentSelectedTerm]) { // Crucial check to prevent re-scoring
                    setMatchedPairs(prev => ({ ...prev, [currentSelectedTerm]: currentSelectedDefinition }));
                    setScore(prev => prev + 1);
                    setFeedback('Correct Match!');

                    // Mark word as learned
                    const originalIndex = allWords.indexOf(termObject);
                    if (originalIndex !== -1) {
                        setLearnedWordsIndices(prevSet => {
                            const newSet = new Set(prevSet);
                            newSet.add(originalIndex);
                            return newSet;
                        });
                    }
                }
            } else {
                setFeedback('Incorrect Match. Try again!');
            }

            // Clear feedback after a brief delay
            const feedbackTimer = setTimeout(() => {
                setFeedback('');
            }, 800);
            return () => clearTimeout(feedbackTimer);
        }
    }, [selectedTerm, selectedDefinition, allWords, matchedPairs, setLearnedWordsIndices]); // `setLearnedWordsIndices` is a dependency

    useEffect(() => {
        if (Object.keys(matchedPairs).length === PAIR_COUNT && gameStarted) {
            setGameOver(true);
            setFeedback(`Game Over! You matched ${score} out of ${PAIR_COUNT} pairs correctly!`);
        }
    }, [matchedPairs, gameStarted, score, PAIR_COUNT]);


    const resetGame = () => {
        setGameStarted(false); // Will trigger useEffect to setup new game
        setGameOver(false);
        setSelectedTerm(null);
        setSelectedDefinition(null);
        setMatchedPairs({});
        setFeedback(''); // Clear feedback on reset
        setScore(0);
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

    return (
        <div className="flex flex-col items-center justify-center min-h-svh">
            {/* Back to Home Button */}
            <button
                onClick={() => setCurrentView('home')}
                className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full shadow-md hover:bg-gray-300 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
                <Home className="mr-2" size={20} /> Home
            </button>

            <h1 className="text-4xl sm:text-5xl font-extrabold font-hebrewRubik text-indigo-800 mb-8 text-center drop-shadow-md">
                Matching Game
            </h1>

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 mb-8 text-center">
                {!gameStarted || gameOver ? (
                    <div className="flex flex-col items-center justify-center">
                        {gameOver && (
                            <>
                                <h2 className="text-3xl font-bold text-indigo-800 mb-4">Game Over!</h2>
                                <p className="text-xl text-gray-700 mb-6">You matched {score} out of {PAIR_COUNT} pairs!</p>
                            </>
                        )}
                        <button
                            onClick={startGame}
                            className="mt-4 px-8 py-4 bg-indigo-500 text-white text-xl font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                            {gameOver ? 'Play Again' : 'Start Game'}
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-xl text-gray-600 mb-4">Score: {score} / {PAIR_COUNT}</p>
                        {feedback && (
                            <p className={`mb-4 text-xl font-semibold ${feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600'}`}>
                                {feedback}
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-2xl font-bold text-gray-800">Terms</h3>
                                {termOptions.map((term, index) => (
                                    <button
                                        key={`term-${index}`}
                                        onClick={() => handleTermClick(term)}
                                        className={`p-3 rounded-xl text-lg font-englishHandwritten font-semibold transition-all duration-200
                      ${selectedTerm === term ? 'bg-indigo-300' : 'bg-blue-100 hover:bg-blue-200'}
                      ${Object.keys(matchedPairs).includes(term) ? 'bg-green-300 text-green-900 cursor-not-allowed' : 'text-blue-800'}
                      ${(selectedTerm && selectedTerm !== term && !Object.keys(matchedPairs).includes(term)) ? 'opacity-50' : ''}
                    `}
                                        disabled={Object.keys(matchedPairs).includes(term) || gameOver}
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-2xl font-bold text-gray-800">Definitions</h3>
                                {definitionOptions.map((definition, index) => (
                                    <button
                                        key={`def-${index}`}
                                        onClick={() => handleDefinitionClick(definition)}
                                        className={`p-3 rounded-xl text-lg font-hebrewRubik font-semibold transition-all duration-200 text-right
                      ${selectedDefinition === definition ? 'bg-indigo-300' : 'bg-blue-100 hover:bg-blue-200'}
                      ${Object.values(matchedPairs).includes(definition) ? 'bg-green-300 text-green-900 cursor-not-allowed' : 'text-blue-800'}
                      ${(selectedDefinition && selectedDefinition !== definition && !Object.values(matchedPairs).includes(definition)) ? 'opacity-50' : ''}
                    `}
                                        disabled={Object.values(matchedPairs).includes(definition) || gameOver}
                                    >
                                        {definition}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Display correct/incorrect answers at the end */}
                        {gameOver && (
                            <div className="mt-8 text-left p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-2xl font-bold text-indigo-800 mb-4">Summary of Matches</h3>
                                {termOptions.map((term, index) => {
                                    const correctDefinition = allWords.find(w => w.term === term)?.definition;
                                    const userMatchedDefinition = matchedPairs[term];
                                    const isCorrect = userMatchedDefinition === correctDefinition;

                                    return (
                                        <p key={`summary-${index}`} className={`text-lg mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            <span className="font-englishHandwritten font-bold">{term}:</span>{' '}
                                            <span className="font-hebrewRubik">{correctDefinition}</span>{' '}
                                            {userMatchedDefinition && !isCorrect && (
                                                <span className="text-gray-500 text-sm"> (You matched: {userMatchedDefinition})</span>
                                            )}
                                        </p>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
