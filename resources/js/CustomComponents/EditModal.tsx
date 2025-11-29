import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Props {
    show: boolean,
    setShow: (arg: boolean) => void,
    question: any
}
export default function EditModal(props: Props) {
    const { show, setShow, question } = props
    
    // Initialize formData with proper structure
    const initializeFormData = (q: any) => {
        if (!q) return {};
        
        // Parse options if it's a string
        let options = q.options || [];
        if (typeof options === 'string' && options.trim()) {
            try {
                options = JSON.parse(options);
            } catch (e) {
                console.error('Failed to parse options:', e);
                options = [];
            }
        }
        
        return {
            id: q.id,
            question: q.question || q.questionText || '',
            difficulty: q.difficulty || 'easy',
            type: q.type || 'multiple-choice',
            timeLimit: q.timeLimit || q.time_limit || '',
            points: q.points || '',
            options: options,
            trueFalseAnswer: q.trueFalseAnswer !== undefined ? q.trueFalseAnswer : (q.true_false_answer !== undefined ? q.true_false_answer : null),
            shortAnswer: q.shortAnswer || q.short_answer || '',
        };
    };
    
    const [formData, setFormData] = useState(initializeFormData(question));
    
    // Update formData when question prop changes
    useEffect(() => {
        setFormData(initializeFormData(question));
    }, [question]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = {
            ...newOptions[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { text: "", isCorrect: false }]
        }));
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                options: newOptions
            }));
        }
    };

    const setCorrectAnswer = (index) => {
        const newOptions = formData.options.map((option, i) => ({
            ...option,
            isCorrect: i === index
        }));
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleSave = async () => {
        console.log('Saved data:', formData);

        try {
            // Format data to match backend expectations
            const payload: any = {
                id: formData.id,
                question: formData.question || formData.questionText || '',
                difficulty: formData.difficulty || 'easy',
                type: formData.type || 'multiple-choice',
                timeLimit: formData.timeLimit || formData.time_limit || '',
                points: formData.points || '',
            };

            // Handle options for multiple-choice questions
            if (payload.type === 'multiple-choice' && formData.options) {
                // Ensure options is an array
                let optionsArray = formData.options;
                if (typeof optionsArray === 'string') {
                    try {
                        optionsArray = JSON.parse(optionsArray);
                    } catch (e) {
                        console.error('Failed to parse options:', e);
                        optionsArray = [];
                    }
                }
                // Ensure options have the correct structure
                payload.options = optionsArray.map((opt: any) => ({
                    text: opt.text || opt.option_text || '',
                    isCorrect: opt.isCorrect !== undefined ? opt.isCorrect : (opt.is_correct || false)
                }));
            }

            // Handle true-false answer
            if (payload.type === 'true-false') {
                // Convert boolean to 1/0 or keep as is if already number
                if (formData.trueFalseAnswer !== undefined && formData.trueFalseAnswer !== null) {
                    payload.trueFalseAnswer = formData.trueFalseAnswer === true || formData.trueFalseAnswer === 1 || formData.trueFalseAnswer === '1';
                } else if (formData.true_false_answer !== undefined && formData.true_false_answer !== null) {
                    payload.trueFalseAnswer = formData.true_false_answer === true || formData.true_false_answer === 1 || formData.true_false_answer === '1';
                }
            }

            // Handle short answer
            if (payload.type === 'short-answer') {
                payload.shortAnswer = formData.shortAnswer || formData.short_answer || '';
            }

            const res = await axios.post("/question/edit", payload);

            if (res.data == 1) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Question Updated Successfully',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: '#fff',
                    color: '#399918',
                    iconColor: '#399918 ',
                });
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            } else {
                throw new Error('Update failed');
            }
        } catch (error: any) {
            console.error('Error updating question:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update question';
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: errorMessage,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#fff',
                color: '#e3342f',
                iconColor: '#e3342f',
            });
        }
    };

    return (
        <Dialog open={show} onOpenChange={() => setShow(!show)}>
            <DialogContent className="sm:max-w-[425px] min-w-[1200px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                    <DialogTitle>Edit Question</DialogTitle>
                    <DialogDescription>
                        Make changes to question here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                {/* 2-Panel Layout: Form on Left, Preview on Right */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Form Fields */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 border-r bg-gray-50">
                        <div className="max-w-full">
                            {/* Question */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question
                                </label>
                                <textarea
                                    value={formData.question}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\?/g, ''); // remove all "?"
                                        handleInputChange('question', value)
                                    }}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    placeholder="Enter your question here..."
                                />
                            </div>

                            {/* Settings Row */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty
                                    </label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="average">Average</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Points
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) => handleInputChange('points', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="inline w-4 h-4 mr-1" />
                                        Time Limit (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.timeLimit}
                                        onChange={(e) => handleInputChange('timeLimit', e.target.value)}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Options Section */}
                            {formData.type === 'multiple-choice' && (
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-base font-medium text-gray-900">Answer Options</h3>
                                        <button
                                            onClick={addOption}
                                            className="flex items-center px-2 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
                                        >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add Option
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                        {formData.options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={option.isCorrect}
                                                        onChange={() => setCorrectAnswer(index)}
                                                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                                    />
                                                    <span className="ml-1 text-xs text-gray-600">Correct</span>
                                                </div>

                                                <input
                                                    type="text"
                                                    value={option.text}
                                                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />

                                                {formData.options.length > 2 && (
                                                    <button
                                                        onClick={() => removeOption(index)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Short Answer Section */}
                            {formData.type === 'short-answer' && (
                                <div className="mb-4">
                                    <h3 className="text-base font-medium text-gray-900 mb-2">Correct Answer</h3>
                                    <div className="bg-white p-3 border border-gray-200 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expected Answer
                                        </label>
                                        <textarea
                                            value={formData.shortAnswer || ''}
                                            onChange={(e) => handleInputChange('shortAnswer', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Enter the correct answer for this question..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            This will be used to evaluate student responses (case-insensitive matching)
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* True/False Section */}
                            {formData.type === 'true-false' && (
                                <div className="mb-4">
                                    <h3 className="text-base font-medium text-gray-900 mb-2">Correct Answer</h3>
                                    <div className="bg-white p-3 border border-gray-200 rounded-lg">
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="trueFalseAnswer"
                                                    value="1"
                                                    checked={formData.trueFalseAnswer == 1}
                                                    onChange={() => handleInputChange('trueFalseAnswer', true)}
                                                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                                />
                                                <span className="ml-2 text-sm font-medium text-gray-700">True</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="trueFalseAnswer"
                                                    value="0"
                                                    checked={formData.trueFalseAnswer == 0}
                                                    onChange={() => handleInputChange('trueFalseAnswer', false)}
                                                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                                />
                                                <span className="ml-2 text-sm font-medium text-gray-700">False</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Save Button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center px-6 py-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Question
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Preview */}
                    <div className="w-[400px] flex-shrink-0 overflow-y-auto px-6 py-4 bg-white">
                        <div className="sticky top-0">
                            <h4 className="font-semibold text-gray-900 mb-3 text-base border-b pb-2">Preview</h4>
                            
                            <div className="space-y-3">
                                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="text-sm text-gray-700 space-y-2">
                                        <p className="font-semibold text-base">
                                            <span className="text-orange-600">Q{formData.id}:</span> {formData.question || 'Enter question...'}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-1 bg-white rounded border">
                                                <strong>Difficulty:</strong> {formData.difficulty || 'easy'}
                                            </span>
                                            <span className="px-2 py-1 bg-white rounded border">
                                                <strong>Time:</strong> {formData.timeLimit || '0'} sec
                                            </span>
                                            <span className="px-2 py-1 bg-white rounded border">
                                                <strong>Points:</strong> {formData.points || '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {formData.type === 'multiple-choice' && formData.options.length > 0 && (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h5 className="font-medium text-sm text-gray-900 mb-2">Options:</h5>
                                        <ul className="space-y-2">
                                            {formData.options.map((option, index) => (
                                                <li 
                                                    key={index} 
                                                    className={`p-2 rounded border ${
                                                        option.isCorrect 
                                                            ? 'bg-green-50 border-green-300 text-green-800' 
                                                            : 'bg-white border-gray-200 text-gray-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {option.isCorrect && (
                                                            <span className="text-green-600 font-bold">✓</span>
                                                        )}
                                                        <span className={option.isCorrect ? 'font-medium' : ''}>
                                                            {option.text || `Option ${index + 1}`}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {formData.type === 'short-answer' && (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h5 className="font-medium text-sm text-gray-900 mb-2">Expected Answer:</h5>
                                        <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                                            {formData.shortAnswer || 'Enter expected answer...'}
                                        </p>
                                    </div>
                                )}

                                {formData.type === 'true-false' && (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h5 className="font-medium text-sm text-gray-900 mb-2">Correct Answer:</h5>
                                        <p className="text-sm font-medium text-gray-700 bg-white p-2 rounded border border-gray-200">
                                            {formData.trueFalseAnswer == 1 ? 'True' : formData.trueFalseAnswer == 0 ? 'False' : 'Not set'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>

        </Dialog>

    );
}