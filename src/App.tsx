/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Loader2, AlertCircle } from "lucide-react";
import SubjectSelector from "./components/SubjectSelector";
import QuizView from "./components/QuizView";
import ResultView from "./components/ResultView";
import { Subject, Question } from "./types";
import { generateQuizQuestions } from "./services/geminiService";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";

type AppState = "SELECTING" | "LOADING" | "QUIZ" | "RESULT" | "ERROR";

export default function App() {
  const [state, setState] = useState<AppState>("SELECTING");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubjectSelect = async (selectedSubject: Subject) => {
    setSubject(selectedSubject);
    setState("LOADING");
    setError(null);
    try {
      const generatedQuestions = await generateQuizQuestions(selectedSubject);
      setQuestions(generatedQuestions);
      setState("QUIZ");
    } catch (err) {
      console.error(err);
      setError("Failed to load quiz questions. Please check your connection and try again.");
      setState("ERROR");
    }
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setState("RESULT");
  };

  const handleRestart = () => {
    if (subject) {
      handleSubjectSelect(subject);
    }
  };

  const handleHome = () => {
    setState("SELECTING");
    setSubject(null);
    setQuestions([]);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleHome}
          >
            <div className="bg-primary p-2 rounded-lg text-white group-hover:rotate-12 transition-transform">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">QuizMaster <span className="text-primary">Grade 7</span></h1>
          </div>
          {subject && state === "QUIZ" && (
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-slate-500">Subject: </span>
              <span className="text-sm font-bold text-primary">{subject}</span>
            </div>
          )}
        </div>
      </header>

      <main className="py-10 px-4">
        <AnimatePresence mode="wait">
          {state === "SELECTING" && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900">Ready to test your knowledge?</h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                  Choose a subject below to start your 10-question challenge. 
                  Earn 2 points for every correct answer!
                </p>
              </div>
              <SubjectSelector onSelect={handleSubjectSelect} />
            </motion.div>
          )}

          {state === "LOADING" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="text-primary/50" size={24} />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">Preparing your {subject} quiz...</h3>
                <p className="text-slate-500">Gemini is crafting the perfect questions for you.</p>
              </div>
            </motion.div>
          )}

          {state === "QUIZ" && subject && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuizView 
                subject={subject} 
                questions={questions} 
                onComplete={handleQuizComplete} 
              />
            </motion.div>
          )}

          {state === "RESULT" && subject && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultView 
                subject={subject} 
                score={score} 
                totalQuestions={questions.length} 
                onRestart={handleRestart}
                onHome={handleHome}
              />
            </motion.div>
          )}

          {state === "ERROR" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="mt-6 flex justify-center">
                <Button onClick={handleHome}>Back to Home</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-400 text-sm">
        <p>&copy; 2024 QuizMaster Grade 7. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}
