import { useState } from "react";
import { Question, Answer, Encuesta } from "@/app/lib/types";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface EncuestaNodeProps {
  question: Question;
  answers?: string[]; // Update to accept an array of strings
}

export default function EncuestaNode({ question, answers }: EncuestaNodeProps) {
  function getQuestionType(questionType: string) {
    var totalAnswers = answers?.length;

    switch (questionType) {
      case "open_text":
        return (
          <div className="flex flex-col w-full">
            {answers?.map((answer, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Respuesta ${index + 1}`}
                className="text-md text-gray-700 w-full border-b-2 mb-4"
                required={question.required}
                value={answer}
                disabled
              />
            ))}
          </div>
        );
      case "single_choice":
        return (
          <div className="flex flex-col w-full">
            {question?.options?.map((option, index) => (
              <div key={index} className="flex flex-col mb-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={question.title}
                    value={option}
                    disabled
                  />
                  <input
                    type="text"
                    value={option}
                    className="ml-2 border-b-2"
                    disabled
                  />
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#BD181E] h-2.5 rounded-full"
                      style={{
                        width: `${Math.floor(
                          ((answers
                            ? answers.filter((answer) => answer === option)
                                .length
                            : 0) / totalAnswers!) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2">
                    {answers?.filter((answer) => answer === option).length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      case "multiple_choice":
        return (
          <div className="flex flex-col w-full">
            {question?.options?.map((option, index) => (
              <div key={index} className="flex flex-col mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name={question.title}
                    value={option}
                    disabled
                  />
                  <input
                    type="text"
                    value={option}
                    className="ml-2 border-b-2"
                    disabled
                  />
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#BD181E] h-2.5 rounded-full"
                      style={{
                        width: `${Math.floor(
                          ((answers
                            ? answers?.filter((answer) =>
                                answer.split(", ").includes(option)
                              ).length
                            : 0) / totalAnswers!) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2">
                    {
                      answers?.filter((answer) =>
                        answer.split(", ").includes(option)
                      ).length
                    }
                  </span>
                </div>
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
