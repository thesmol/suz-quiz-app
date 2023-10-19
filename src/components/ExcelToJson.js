import React from 'react';
import * as XLSX from 'xlsx';

const ExcelToJson = ({ handleNewQuize, count, handleCountChange }) => {

    let quizData = null;

    const handleChange = (e) => {
        handleCountChange(e.target.value);

        if (!(quizData === null)) {
            quizData["nrOfQuestions"] = String(e.target.value);
            handleNewQuize(prevState => ({ ...prevState, ...quizData }));
        }

    };

    const handleFileUpload = e => {
        const file = e.target.files[0];
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
            <label>Количество вопросов в тесте</label>
            <span style={{ fontSize: '10px', marginBottom: '10px' }}>Укажите количество вопросов перед загрузкой вопросов</span>
            <input
                type="number"
                value={count}
                onChange={handleChange}
                min="1" />
            <label style={{ marginTop: '15px', marginBottom: '10px' }}>Таблица с вопросами</label>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <a style={{ fontSize: '12px', color: 'black', marginTop: '5px' }} href={`${process.env.PUBLIC_URL}/QuestionsTemplate.xlsx`} download>Cкачать шаблон</a>
        </div>
    );
};

export default ExcelToJson;