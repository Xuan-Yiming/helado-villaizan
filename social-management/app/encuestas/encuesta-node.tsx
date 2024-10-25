import { useState } from "react";
import { Question, Answer } from "@/app/lib/types";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface EncuestaNodeProps {
  question: Question;
  onUpdate: (updatedAnswer: Answer) => void; // Add onUpdate callback
}

export default function EncuestaNode({
  question,
  onUpdate,
}: EncuestaNodeProps) {
  const [answers, setAnswers] = useState<string[]>(question.options || []);

  const handleOptionChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleAnswerUpdate = (value: string, index?: number) => {
    if (question.type === "open_text") {
      setAnswers([value]);
    } else if (
      question.type === "single_choice" ||
      question.type === "multiple_choice"
    ) {
      if (index !== undefined) {
        handleOptionChange(index, value);
      }
    }
    onUpdate({
      question_id: question.id,
      answer: value,
    });
  };

  function getQuestionType(questionType: string) {
    switch (questionType) {
      case "open_text":
        return (
          <input
            type="text"
            placeholder="Respuesta"
            className="text-md text-gray-700 w-full border-b-2 mb-4"
            required={question.required}
            value={answers[0] || ""}
            onChange={(e) => handleAnswerUpdate(e.target.value)}
          />
        );
      case "single_choice":
        return (
          <div className="flex flex-col w-full">
            {answers.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name={question.title}
                  value={option}
                  required={question.required}
                  onChange={(e) => handleAnswerUpdate(e.target.value)}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="ml-2 border-b-2"
                  disabled
                />
              </div>
            ))}
          </div>
        );
      case "multiple_choice":
        return (
          <div className="flex flex-col w-full">
            {answers.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name={question.title}
                  value={option}
                  required={question.required}
                  onChange={(e) => handleAnswerUpdate(e.target.value, index)}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="ml-2 border-b-2"
                  disabled
                />
              </div>
            ))}
          </div>
        );
      default:
        return <div>Invalid question type</div>;
    }
  }

  return (
    <div className="p-4 mx-auto text-left">
      <div className="card bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between mb-4">
          {question.required && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="requiredCheck"
                id=""
                checked={question.required}
              />
              <label className="ml-2">Obligatorio</label>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Pregunta"
          className="text-xl font-bold text-gray-700 w-full border-b-2 mb-4"
          value={question.title}
          disabled
        />
        <div className="flex flex-col w-full">
          {getQuestionType(question.type)}
        </div>
      </div>
    </div>
  );
}
