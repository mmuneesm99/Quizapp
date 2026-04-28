/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Subject = 'Maths' | 'Science' | 'IT' | 'AI';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  subject: Subject;
}
