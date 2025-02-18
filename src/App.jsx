import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Book, Award, RotateCcw, ChevronRight, Brain, Zap } from 'lucide-react';
import {   scrumQuestions } from './softwarequestions';
import { Instagram } from "lucide-react";


const QuizApp = () => {
  const [currentTopic, setCurrentTopic] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizMode, setQuizMode] = useState('topic-select');
  const [fadeIn, setFadeIn] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    setFadeIn(true);
  }, [currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    setTimeLeft(30);

    if (currentQuestion < scrumQuestions[currentTopic].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizMode('result');
      setShowResult(true);
    }
  }, [currentQuestion, currentTopic]);

  useEffect(() => {
    if (quizMode === 'quiz' && timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      setTimerId(timer);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, quizMode, showExplanation, handleNextQuestion]);

  const handleStartTopic = (topicIndex) => {
    setCurrentTopic(topicIndex);
    setQuizMode('quiz');
    resetQuiz();
  };

  const handleJumpToQuestion = (questionIndex) => {
    if (questionIndex !== currentQuestion) {
      setCurrentQuestion(questionIndex);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
      if (timerId) {
        clearTimeout(timerId);
      }
    }
  };
  

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setShowExplanation(true);
    const isCorrect = option === scrumQuestions[currentTopic].questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAttemptedQuestions(prev => ({
      ...prev,
      [currentQuestion]: {
        correct: isCorrect,
      },
    }));
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAttemptedQuestions({});
    if (timerId) {
      clearTimeout(timerId);
    }
  };

  const QuestionJumper = () => (
    <div className="lg:w-64 lg:ml-6 lg:sticky lg:top-6 hidden lg:block">
      <Card className="lg:sticky lg:top-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
        
         
            <div className="overflow-x-auto lg:overflow-visible">
              <div className="flex lg:grid lg:grid-cols-4 gap-2 w-max lg:w-full">
                {scrumQuestions[currentTopic].questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleJumpToQuestion(index)}
                    className={`h-8 w-8 lg:h-10 lg:w-10 rounded-lg flex items-center justify-center text-sm font-medium
                      transition-all duration-200
                      ${currentQuestion === index
                        ? 'bg-blue-500 text-white'
                        : attemptedQuestions[index]
                          ? attemptedQuestions[index].correct
                            ? 'bg-green-100 text-green-700 border-2 border-green-500'
                            : 'bg-red-100 text-red-700 border-2 border-red-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
  
  
  
  
  const TopicSelection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4">
      {scrumQuestions.map((topic, index) => (
        <Card 
          key={index} 
          className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white w-full"
          onClick={() => handleStartTopic(index)}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <Brain className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs sm:text-sm">
                {topic.questions.length} Questions
              </Badge>
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
              {topic.topic}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Master key concepts in {topic.topic.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const QuizInterface = () => {
    const currentQ = scrumQuestions[currentTopic].questions[currentQuestion];
    
    return (
      <div className="px-2 sm:px-4 flex flex-col lg:flex-row gap-6">
        
        <div className="flex-1">
          <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader className="space-y-4 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-start sm:items-center">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700 flex items-center text-xs sm:text-sm">
                    <Timer className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {timeLeft}s
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs sm:text-sm">
                    {currentQuestion + 1}/{scrumQuestions[currentTopic].questions.length}
                  </Badge>
                </div>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs sm:text-sm">
                  Score: {score}
                </Badge>
              </div>
              <Progress
                value={(currentQuestion / scrumQuestions[currentTopic].questions.length) * 100}
                className="h-2"
              />
              <CardTitle className="text-base sm:text-xl font-bold leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid gap-3 sm:gap-4">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    disabled={showExplanation}
                    onClick={() => handleAnswer(option)}
                    className={`p-3 sm:p-4 text-left rounded-lg transition-all duration-200 text-sm sm:text-base
                      ${selectedAnswer === option
                        ? option === currentQ.answer
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'bg-red-50 border-red-500 text-red-700'
                        : 'bg-gray-50 active:bg-gray-100 hover:bg-gray-100 border-gray-200'
                      } border-2 ${
                        showExplanation && option === currentQ.answer
                          ? 'border-green-500 ring-2 ring-green-200'
                          : ''
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-current flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-base">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
  
              {showExplanation && (
                <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-base sm:text-lg mb-2 flex items-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                    Explanation
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                    {currentQ.explanation}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center w-full transition-colors text-sm sm:text-base"
                  >
                    Next Question <ChevronRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
  
       
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-10 flex justify-between">
          <button
            onClick={handlePrevQuestion}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg text-sm sm:text-base"
          >
            Prev
          </button>
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-sm sm:text-base"
          >
            Next
          </button>
        </div>
  
     
        <div className="hidden lg:block">
          <QuestionJumper />
        </div>
      </div>
    );
  };
  
  

  const ResultScreen = () => (
    <Card className="w-full max-w-xl mx-auto shadow-lg m-2 sm:m-0">
      <CardContent className="p-6 sm:p-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Award className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
          You've completed the {scrumQuestions[currentTopic].topic} quiz
        </p>
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="text-3xl sm:text-4xl font-bold text-blue-500 mb-2">
            {Math.round((score / scrumQuestions[currentTopic].questions.length) * 100)}%
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            You scored {score} out of {scrumQuestions[currentTopic].questions.length} questions
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          <button
            onClick={() => {
              resetQuiz();
              setQuizMode('quiz');
            }}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry Topic
          </button>
          <button
            onClick={() => {
              resetQuiz();
              setQuizMode('topic-select');
            }}
            className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <Book className="w-4 h-4 mr-2" />
            Choose New Topic
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-2 sm:px-6">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Software Design MCQ Questions
          </h1>
          <p className="text-gray-600 text-base sm:text-lg px-4">
            Test your software design knowledge across various topics
          </p>
          <div className="flex justify-center items-center gap-2 font-bold">
            <p>made by </p>
            <Instagram className="w-5 h-5 text-gray-600" />
            <a href='https://www.instagram.com/imnb57/'>imnb57</a>
          </div>
        </header>
    
        {quizMode === 'topic-select' && <TopicSelection />}
        {quizMode === 'quiz' && <QuizInterface><QuestionJumper/></QuizInterface>}
        {quizMode === 'result' && <ResultScreen />}
      </div>
    </div>
  );
};

export default QuizApp;