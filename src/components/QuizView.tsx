/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Question, Subject } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import ReactMarkdown from "react-markdown";

interface QuizViewProps {
  subject: Subject;
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function QuizView({ subject, questions, onComplete }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore((prev) => prev + 2);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score + (selectedOption === currentQuestion.correctIndex ? 2 : 0));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-2">
        <Badge variant="outline" className="text-lg px-3 py-1">
          {subject} Quiz
        </Badge>
        <span className="text-sm font-medium text-slate-500">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <Progress value={progress} className="h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl leading-relaxed">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => {
                  let variant: "outline" | "default" | "secondary" = "outline";
                  let className = "justify-start text-left h-auto py-4 px-6 text-lg transition-all border-2";

                  if (selectedOption === index) {
                    variant = "default";
                    className += " border-primary";
                  }

                  if (isAnswered) {
                    if (index === currentQuestion.correctIndex) {
                      className += " bg-green-100 border-green-500 text-green-900 hover:bg-green-100";
                    } else if (selectedOption === index) {
                      className += " bg-red-100 border-red-500 text-red-900 hover:bg-red-100";
                    }
                  }

                  return (
                    <Button
                      key={index}
                      variant={variant}
                      className={className}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswered}
                    >
                      <span className="mr-4 font-bold opacity-50">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                      {isAnswered && index === currentQuestion.correctIndex && (
                        <CheckCircle2 className="ml-auto text-green-600" size={20} />
                      )}
                      {isAnswered && selectedOption === index && index !== currentQuestion.correctIndex && (
                        <XCircle className="ml-auto text-red-600" size={20} />
                      )}
                    </Button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-2 ${
                    selectedOption === currentQuestion.correctIndex
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <h4 className="font-bold mb-2 flex items-center">
                    {selectedOption === currentQuestion.correctIndex ? (
                      <span className="text-green-700">Correct! +2 Points</span>
                    ) : (
                      <span className="text-red-700">Incorrect</span>
                    )}
                  </h4>
                  <div className="text-slate-700 prose prose-sm max-w-none">
                    <ReactMarkdown>{currentQuestion.explanation}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              {!isAnswered ? (
                <Button
                  size="lg"
                  onClick={handleConfirm}
                  disabled={selectedOption === null}
                  className="px-8"
                >
                  Confirm Answer
                </Button>
              ) : (
                <Button size="lg" onClick={handleNext} className="px-8 group">
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
