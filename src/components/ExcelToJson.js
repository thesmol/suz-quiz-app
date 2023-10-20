import React, { useState } from 'react';
import * as XLSX from 'xlsx';



const ExcelToJson = ({ handleNewQuize, count, handleCountChange }) => {
    const [fileName, setFileName] = useState('Файл не выбран');
    let quizData = null;

    const handleChange = (e) => {
        handleCountChange(e.target.value);

        if (!(quizData === null)) {
            quizData["nrOfQuestions"] = String(e.target.value);
            handleNewQuize(prevState => ({ ...prevState, ...quizData }));
        }

    };

    const handleFileUpload = e => {
        if (e.target.files.length === 0) {
            return;
        }
        const file = e.target.files[0];
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
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
                const question = {
                    question: jsonData[i][1],
                    questionType: jsonData[i + 1][1],
                    answerSelectionType: jsonData[i + 2][1],
                    answers: jsonData[i + 3][1].split(','),
                    correctAnswer: String(jsonData[i + 4][1]),
                    messageForCorrectAnswer: jsonData[i + 5][1],
                    messageForIncorrectAnswer: jsonData[i + 6][1],
                    explanation: jsonData[i + 7][1],
                    point: String(jsonData[i + 8][1])
                };
                quizData.questions.push(question);
            }
            handleNewQuize(prevState => ({ ...prevState, ...quizData }));
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ marginRight: "10px" }}>Количество вопросов в тесте</label>
                    <input
                        className='input'
                        style={{ width: '50px' }}
                        type="number"
                        value={count}
                        onChange={handleChange}
                        min="1"
                    />
                </div>
                <span style={{ fontSize: '12px', marginBottom: '10px' }}>*укажите количество вопросов перед загрузкой вопросов</span>

            </div>

            <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '20px' }}>Таблица с вопросами</label>

                <input type="file" id="actual-btn" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
                <div>
                    <label className="button" htmlFor="actual-btn">Выберите файл</label>
                    <span id="file-chosen" style={{ marginLeft: '5px', fontSize: '14px' }}>{fileName}</span>
                </div>

                <a style={{ fontSize: '14px', color: 'black', marginTop: '10px' }} href={`${process.env.PUBLIC_URL}/QuestionsTemplate.xlsx`} download>Cкачать шаблон</a>
            </div>

        </div>
    );
};

export default ExcelToJson;