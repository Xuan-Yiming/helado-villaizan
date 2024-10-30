import { useState } from "react";
import { Question } from "@/app/lib/types";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface EncuestaNodeProps {
    question: Question;
    onDelete: (questionId: string) => void; // Add onDelete callback
    onUpdate: (updatedQuestion: Question) => void; // Add onUpdate callback
    isEditable: boolean;
}

export default function EncuestaNode({ question, onDelete, onUpdate, isEditable }: EncuestaNodeProps) {
    const [questionType, setQuestionType] = useState(question.type);
    const [options, setOptions] = useState(question.options || []);
    const [title, setTitle] = useState(question.title);
    const [isRequired, setIsRequired] = useState(question.required);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedRequired = event.target.checked;
      setIsRequired(updatedRequired);
      onUpdate({ ...question, required: updatedRequired });
    };

    function handleDeleteNode() {
        if (question.id)
            onDelete(question.id); // Call the onDelete callback with the question ID
    }

    function handleAddOption() {
        setOptions([...options, '']);
        onUpdate({ ...question, options: [...options, ''] });
    }

    function handleOptionChange(index: number, newValue: string) {
        let updatedOptions;
        if (newValue === "") {
            updatedOptions = options.filter((_, i) => i !== index);
        } else {
            updatedOptions = options.map((option, i) => (i === index ? newValue : option));
        }
        setOptions(updatedOptions);
        onUpdate({ ...question, options: updatedOptions });
    }

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTitle(e.target.value);
        onUpdate({ ...question, title: e.target.value });
    }

    function getQuestionType(questionType: string) {
        switch (questionType) {
            // open_text, single_choice, multiple_choice
            case "open_text":
                return (
                    <input
                        type="text"
                        placeholder="Respuesta"
                        className="text-md text-gray-700 w-full border-b-2 mb-4"
                        required={question.required}
                        disabled={isEditable}
                    />
                );
            case "single_choice":
                return (
                    <div className="flex flex-col w-full">
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="radio"
                                    name={question.title}
                                    value={option}
                                />
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="ml-2 border-b-2"
                                    required
                                    disabled={!isEditable}
                                />
                            </div>
                        ))}
                        {isEditable &&(
                        <button
                            type="button"
                            className="flex items-center mt-2 text-blue-500"
                            onClick={handleAddOption}
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Add Option
                        </button>
                        )}
                    </div>
                );
            case "multiple_choice":
                return (
                    <div className="flex flex-col w-full">
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name={question.title}
                                    value={option}
                                />
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="ml-2 border-b-2"
                                    required
                                    disabled={!isEditable}
                                />
                            </div>
                        ))}
                        {isEditable &&(
                        <button
                            type="button"
                            className="flex items-center mt-2 text-blue-500"
                            onClick={handleAddOption}
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Add Option
                        </button>
                        )}
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
                    
                    {(question.required || isEditable) &&(
                        <div className="flex items-center">
                            <input type="checkbox" name="requiredCheck" id=""             
                            checked={isRequired}
                            onChange={handleCheckboxChange} 
                        />
                            <label className="ml-2">Obligatorio</label>
                        </div>
                    )}
                    {isEditable &&(
                        <div className="flex justify-between">
                            <p className="font-bold ml-auto"> Tipo de Pregunta: </p>
                            <select
                                title="Tipo de pregunta"
                                className="text-md font-bold text-gray-700 border-b-2 mb-4 ml-5"
                                value={questionType}
                                onChange={(e) => {
                                    setQuestionType(e.target.value);
                                    onUpdate({ ...question, type: e.target.value });
                                }}
                            >
                                <option value="open_text">Texto</option>
                                <option value="single_choice">Opción Única</option>
                                <option value="multiple_choice">Multiple Opciones</option>
                            </select>
                        </div>
                    )}

                </div>

                <input
                    type="text"
                    placeholder="Pregunta"
                    className="text-xl font-bold text-gray-700 w-full border-b-2 mb-4"
                    value={title}
                    onChange={handleTitleChange}
                    required
                />
                <div className="flex flex-col w-full">{getQuestionType(questionType)}</div>

                {isEditable && (
                    <div className="flex items-center">


                        <button
                            className="flex items-center ml-5 rounded px-4 py-2 text-[#BD181E] ml-auto"
                            onClick={handleDeleteNode}
                        >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            Eliminar
                        </button>
                    </div>
                )}


            </div>
        </div>
    );
}