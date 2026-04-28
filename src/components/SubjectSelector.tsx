/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Calculator, Beaker, Monitor, Cpu } from "lucide-react";
import { Subject } from "../types";
import { Card, CardContent } from "./ui/card";

interface SubjectSelectorProps {
  onSelect: (subject: Subject) => void;
}

const subjects: { name: Subject; icon: any; color: string; description: string }[] = [
  {
    name: "Maths",
    icon: Calculator,
    color: "bg-maths",
    description: "Numbers, Algebra, Geometry and more!",
  },
  {
    name: "Science",
    icon: Beaker,
    color: "bg-science",
    description: "Biology, Chemistry, Physics and the Universe.",
  },
  {
    name: "IT",
    icon: Monitor,
    color: "bg-it",
    description: "Computers, Software, and Digital Literacy.",
  },
  {
    name: "AI",
    icon: Cpu,
    color: "bg-ai",
    description: "Machine Learning, Neural Networks and the Future.",
  },
];

export default function SubjectSelector({ onSelect }: SubjectSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto p-4">
      {subjects.map((subject, index) => (
        <motion.div
          key={subject.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className="cursor-pointer overflow-hidden border-2 hover:border-primary transition-colors h-full"
            onClick={() => onSelect(subject.name)}
          >
            <CardContent className="p-0 flex h-full">
              <div className={`${subject.color} w-24 flex items-center justify-center text-white`}>
                <subject.icon size={40} />
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                <p className="text-slate-500">{subject.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
