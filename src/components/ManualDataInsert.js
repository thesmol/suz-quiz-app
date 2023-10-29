import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const ManualDataInsert = ({ styles, handleNewQuiz }) => {
    const [inputText, setInputText] = useState('');

    const isInputTextValid = (inputText) => {
        try {
            const data = JSON.parse(inputText);
            console.log(data);

            // Проверяем, что data является объектом
            if (typeof data !== 'object' || data === null) {
                console.log('data is not an object');
                return false;
            }

            // Проверяем наличие всех необходимых полей
            if (!data.hasOwnProperty('quizTitle') ||
                !data.hasOwnProperty('quizSynopsis') ||
                !data.hasOwnProperty('questions')) {
                console.log('data doesnt have quizTitle or quizSynopsis or questions');
                return false;
            }

            // Проверяем, что questions является массивом
            if (!Array.isArray(data.questions)) {
                console.log('data questions are not an array');
                return false;
            }

            // Проверяем каждый вопрос на наличие всех необходимых полей
            for (let question of data.questions) {
                if (!question.hasOwnProperty('question') ||
                    !question.hasOwnProperty('questionType') ||
                    !question.hasOwnProperty('answers') ||
                    !question.hasOwnProperty('correctAnswer') ||
                    !question.hasOwnProperty('messageForCorrectAnswer') ||
                    !question.hasOwnProperty('messageForIncorrectAnswer') ||
                    !question.hasOwnProperty('explanation') ||
                    !question.hasOwnProperty('point')) {
                    console.log('data question are invalid');
                    return false;
                }
            }
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    const handleSubmit = () => {
        if (isInputTextValid(inputText)) {
            // const data = JSON.parse(inputText);
            // data["applocale"] = {
            //     "landingHeaderText": "Количество вопросов <questionLength>",
            //     "question": "Вопрос",
            //     "startQuizBtn": "Начать тестирование",
            //     "resultFilterAll": "Все",
            //     "resultFilterCorrect": "Верные",
            //     "resultFilterIncorrect": "Неверные",
            //     "prevQuestionBtn": "Назад",
            //     "nextQuestionBtn": "Далее",
            //     "singleSelectionTagText": "Выбор одного",
            //     "multipleSelectionTagText": "Выбор нескольких",
            //     "pickNumberOfSelection": 'Выберите <numberOfSelection> вариант(-а)',
            //     "resultPageHeaderText": "Вы завершили тестирование. Решили верно <correctIndexLength> из <questionLength> вопросов.",
            //     "resultPagePoint": 'Вы получили <correctPoints> очков из <totalPoints>.',
            // };
            handleNewQuiz(inputText);
        } else {
            console.log("Invalid input data");
            alert("Входные данные не соответствуют правильной структуре, попробуйте снова");
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Генерация JSON файла с вопросами</span>
            <a className={styles.button} target="_blank" rel="noreferrer" href="https://wingkwong.github.io/react-quiz-form/" style={{ width: '145.19px', marginTop: '10px', textDecoration: 'none' }}>Сгенерировать</a>

            <span style={{ marginTop: '20px' }}>Данные теста формата json</span>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    className={`${styles.button} ${styles.danger}`}
                    onClick={() => setInputText('')}
                >
                    Очистить
                </button>

                <button
                    className={styles.button}
                    onClick={() => handleSubmit()}
                >
                    Сохранить
                </button>
            </div>

            <TextareaAutosize
                minRows='3'
                maxRows='50'
                autoFocus
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={styles.input}
                style={{ marginTop: '10px', resize: 'none' }}
            />
        </div>
    )
}

export default ManualDataInsert;