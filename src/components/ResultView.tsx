/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Trophy, RotateCcw, Home, Share2 } from "lucide-react";
import { Subject } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

interface ResultViewProps {
  subject: Subject;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onHome: () => void;
}

export default function ResultView({ subject, score, totalQuestions, onRestart, onHome }: ResultViewProps) {
  const maxScore = totalQuestions * 2;
  const percentage = (score / maxScore) * 100;

  let message = "Keep practicing!";
  let iconColor = "text-slate-400";

  if (percentage >= 80) {
    message = "Excellent! You're a Master!";
    iconColor = "text-yellow-500";
  } else if (percentage >= 50) {
    message = "Good job! Well done.";
    iconColor = "text-blue-500";
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
      >
        <Card className="text-center border-2 shadow-xl overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader className="pt-10">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`p-6 rounded-full bg-slate-100 ${iconColor}`}
              >
                <Trophy size={80} />
              </motion.div>
            </div>
            <CardTitle className="text-4xl font-bold mb-2">Quiz Completed!</CardTitle>
            <p className="text-xl text-slate-500">{subject} Challenge</p>
          </CardHeader>
          <CardContent className="space-y-8 py-6">
            <div className="space-y-2">
              <div className="text-6xl font-black text-primary">
                {score}
                <span className="text-2xl text-slate-400 font-normal ml-2">/ {maxScore}</span>
              </div>
              <p className="text-2xl font-medium text-slate-700">{message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Accuracy</div>
                <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Correct</div>
                <div className="text-2xl font-bold">{score / 2} / {totalQuestions}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center p-8 bg-slate-50">
            <Button size="lg" variant="outline" onClick={onHome} className="w-full sm:w-auto">
              <Home className="mr-2" size={20} />
              Back to Subjects
            </Button>
            <Button size="lg" onClick={onRestart} className="w-full sm:w-auto">
              <RotateCcw className="mr-2" size={20} />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
