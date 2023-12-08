import React, { useState } from 'react';
import * as XLSX from 'xlsx';



const ExcelToJson = ({ handleNewQuize, count, handleReload }) => {
    const [fileName, setFileName] = useState('Файл не выбран');
    let quizData = null;

    const handleFileUpload = e => {
        handleNewQuize(null);
        handleReload(prevState => !prevState)
        if (e.target.files.length === 0) {
            return;
        }
        const file = e.target.files[0];
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                quizData = {
                    quizTitle: jsonData[0][1],
                    quizSynopsis: jsonData[1][1],
                    nrOfQuestions: String(count),
                    appLocale: {
                        "landingHeaderText": "Количество вопросов <questionLength>",
                        "question": "Вопрос",
                        "startQuizBtn": "Начать тестирование",
                        "resultFilterAll": "Все",
                        "resultFilterCorrect": "Верные",
                        "resultFilterIncorrect": "Неверные",
                        "prevQuestionBtn": "Назад",
                        "nextQuestionBtn": "Далее",
                        "singleSelectionTagText": "Выбор одного",
                        "multipleSelectionTagText": "Выбор нескольких",
                        "pickNumberOfSelection": 'Выберите <numberOfSelection> вариант(-а)',
                        "resultPageHeaderText": "Вы завершили тестирование. Решили верно <correctIndexLength> из <questionLength> вопросов.",
                        "resultPagePoint": 'Вы получили <correctPoints> очков из <totalPoints>.',
                    },
                    questions: []
                };

                for (let i = 3; i < jsonData.length; i += 9) {
                    // Check if the row contains a question and answers
                    if (jsonData[i] && jsonData[i][1] && jsonData[i + 3] && jsonData[i + 3][1]) {
                        let correctAnswer;
                        if (jsonData[i + 2] && jsonData[i + 2][1] === 'single') {
                            correctAnswer = String(jsonData[i + 4][1]);
                        } else if (jsonData[i + 2] && jsonData[i + 2][1] === 'multiple') {
                            correctAnswer = String(jsonData[i + 4][1]).split(',').map(Number);
                        }
                
                        let answers;
                        if (jsonData[i + 3] && jsonData[i + 3][1]) {
                            answers = jsonData[i + 3][1].split(',');
                        } else {
                            answers = [];
                        }
                
                        const question = {
                            question: jsonData[i][1],
                            questionType: jsonData[i + 1][1],
                            answerSelectionType: jsonData[i + 2][1],
                            answers: answers,
                            correctAnswer: correctAnswer,
                            messageForCorrectAnswer: jsonData[i + 5][1],
                            messageForIncorrectAnswer: jsonData[i + 6][1],
                            explanation: jsonData[i + 7][1],
                            point: String(jsonData[i + 8][1])
                        };
                
                        quizData.questions.push(question);
                    }
                }
                handleNewQuize(prevState => ({ ...prevState, ...quizData }));
            } catch (error) {
                // Если возникла ошибка при парсинге таблицы, выводим алерт
                console.log(error);
                alert('Произошла ошибка при парсинге таблицы. Пожалуйста, проверьте структуру файла.');
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <>
            <label style={{ marginBottom: '20px' }}>Файл с вопросами (xlsx)</label>

            <input type="file" id="actual-btn" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
            <div>
                <label className="button" htmlFor="actual-btn">Выберите файл</label>
                <span id="file-chosen" style={{ marginLeft: '5px', fontSize: '14px' }}>{fileName}</span>
            </div>

            <a style={{ fontSize: '14px', color: 'black', marginTop: '10px' }} href={`${process.env.PUBLIC_URL}/QuestionsTemplate.xlsx`} download>Cкачать шаблон xlsx</a>
        </>
    );
};

export default ExcelToJson;