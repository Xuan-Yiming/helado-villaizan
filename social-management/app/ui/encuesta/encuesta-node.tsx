
import { useState } from "react"

import { Question } from "@/app/lib/types"

interface EncuestaNodeProps {
    question: Question
}


export default function EncuestaNode( {question}: EncuestaNodeProps){

    const [questionType, setQuestionType] = useState(question.type);

    function getQuestionType(questionType: string){
        switch(questionType){
            // open_text, single_choice, multiple_choice
            case "open_text":
                return (
                    <input
                    type="text"
                    placeholder="Respuesta"
                    className="text-xl font-bold text-gray-700 w-full border-b-2 mb-4"
                    required={question.required}
                    />
                )
            case "single_choice":
                return (
                    <div className="flex flex-col w-full">
                        {question.options?.map((option, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                type="radio"
                                name={question.title}
                                value={option}
                                required={question.required}
                                />
                                <label>{option}</label>
                            </div>
                        ))}
                    </div>
                )
            case "multiple_choice":
                return (
                    <div className="flex flex-col w-full">
                        {question.options?.map((option, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                type="checkbox"
                                name={question.title}
                                value={option}
                                required={question.required}
                                />
                                <label>{option}</label>
                            </div>
                        ))}
                    </div>
                )
            default:
                return <div>Invalid question type</div>
        }
    }

    return(
        <div className="p-4 mx-auto text-left"> {/* Added text-left class */}
            <div className="card bg-white shadow-md rounded-lg p-6">

                <div className="flex justify-between mb-4">
                    <p className="font-bold ml-auto"> Tipo de Pregunta: </p>
                    <select
                        title="Tipo de pregunta"
                        className="text-md font-bold text-gray-700  border-b-2 mb-4 ml-5"
                        value={questionType}
                        onChange={(e) => {
                            setQuestionType(e.target.value);
                            
                            // Update the question type in the parent component
                            // You can pass a callback function from the parent component to handle the type change
                        }}
                    >
                        <option value="open_text">Texto</option>
                        <option value="single_choice">Opción Única</option>
                        <option value="multiple_choice">Multiple Opciones</option>
                    </select>
                </div>


                <input
                type="text"
                placeholder="Pregunta"
                className="text-xl font-bold text-gray-700 w-full border-b-2 mb-4"
                value={question.title}
                required
                />
                <div className="flex flex-col w-full">
                    {getQuestionType(questionType)}
                </div>
            </div>
        </div>
    )

}