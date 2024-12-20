const app = document.getElementById("app");

let gameState = {
    players: [],
    subject: "Mixed",
    questionsPerPlayer: 3,
    currentPlayerIndex: 0,
    currentQuestionIndex: 0,
    scores: {},
    questions: [],
    timer: null,
    timeLeft: 10,
};

const screens = {
    playerSelection() {
        app.innerHTML = `
            <div class="screen">
                <h1>Select Number of Players</h1>
                <button onclick="selectNumberOfPlayers(1)">1 Player</button>
                <button onclick="selectNumberOfPlayers(2)">2 Players</button>
                <button onclick="selectNumberOfPlayers(3)">3 Players</button>
                <button onclick="selectNumberOfPlayers(4)">4 Players</button>
            </div>
        `;
    },

    nameInput() {
        const numberOfPlayers = gameState.players.length;
        let inputsHTML = "";
        for (let i = 0; i < numberOfPlayers; i++) {
            inputsHTML += `
                <input type="text" id="player${i + 1}" placeholder="Enter player ${i + 1} name">
            `;
        }
        app.innerHTML = `
            <div class="screen">
                <h1>Enter Player Names</h1>
                ${inputsHTML}
                <button onclick="startSubjectSelection()">Next</button>
            </div>
        `;
    },

    subjectSelection() {
        app.innerHTML = `
            <div class="screen">
                <h1>Select Subject</h1>
                <select id="subjectSelect">
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                    <option value="JS">JavaScript</option>
                    <option value="Mixed" selected>Mixed</option>
                </select>
                <label>
                    <span>Questions per player:</span>
                    <select id="questionsPerPlayer">
                        <option value="3" selected>3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </label>
                <button onclick="startGame()">Start Game</button>
            </div>
        `;
    },

    gameScreen() {
        const player = gameState.players[gameState.currentPlayerIndex];
        const question = gameState.questions[gameState.currentQuestionIndex];

        const scoreDisplay = gameState.players
            .map((player) => `<p>${player}: ${gameState.scores[player]} points</p>`)
            .join("");

        app.innerHTML = `
            <div class="screen">
                <h1>It's ${player}'s turn!</h1>
                <p class="timer">Time Left: ${gameState.timeLeft}s</p>
                <p>${question.question}</p>
                <div>
                    ${question.options
                        .map(
                            (option, index) =>
                                `<button onclick="selectAnswer(${index})">${option}</button>`
                        )
                        .join("")}
                </div>
                <button id="submitBtn" disabled onclick="submitAnswer()">Submit</button>
                <div>
                    ${scoreDisplay} <!-- Отображение очков игроков -->
                </div>
            </div>
        `;

        startTimer();
    },

    resultsScreen() {
        const results = Object.entries(gameState.scores)
            .sort((a, b) => b[1] - a[1])
            .map(
                ([player, score]) =>
                    `<li>${player}: ${score} points</li>`
            )
            .join("");

        app.innerHTML = `
            <div class="screen">
                <h1>Game Over!</h1>
                <ul class="results">${results}</ul>
                <button onclick="resetGame()">New Game</button>
            </div>
        `;
    },
};

function selectNumberOfPlayers(numPlayers) {
    if (numPlayers < 1 || numPlayers > 4) return;
    gameState.players = new Array(numPlayers).fill("");
    screens.nameInput();
}

function startSubjectSelection() {
    const playerNames = [];
    gameState.players.forEach((_, index) => {
        const playerName = document.getElementById(`player${index + 1}`).value.trim();
        if (playerName) playerNames.push(playerName);
    });

    if (playerNames.length < 1 || playerNames.length > 4) {
        alert("Please enter between 1 and 4 player names.");
        return;
    }

    gameState.players = playerNames;
    gameState.scores = Object.fromEntries(playerNames.map((name) => [name, 0]));
    screens.subjectSelection();
}

function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('current-time').textContent = timeString;
}


setInterval(updateCurrentTime, 1000);

function startGame() {
    const subjectSelect = document.getElementById("subjectSelect").value;
    const questionsPerPlayer = parseInt(
        document.getElementById("questionsPerPlayer").value
    );

    gameState.subject = subjectSelect;
    gameState.questionsPerPlayer = questionsPerPlayer;
    gameState.questions = generateQuestions();
    gameState.currentPlayerIndex = 0;
    gameState.currentQuestionIndex = 0;

    screens.gameScreen();
}

function generateQuestions() {
    const allQuestions = {
        HTML: [
            {
                question: "What does HTML stand for?",
                options: [
                    "HyperText Markup Language",
                    "HyperText Machine Language",
                    "HyperText Markup List",
                    "None of the above"
                ],
                correct: 0
            },
            {
                question: "Which HTML tag is used to define an HTML document?",
                options: [
                    "<html>",
                    "<head>",
                    "<body>",
                    "<document>"
                ],
                correct: 0
            },
            {
                question: "Which tag is used to display an image in HTML?",
                options: [
                    "<image>",
                    "<img>",
                    "<src>",
                    "<picture>"
                ],
                correct: 1
            }
        ],
        CSS: [
            {
                question: "What does CSS stand for?",
                options: [
                    "Cascading Style Sheets",
                    "Computer Style Sheets",
                    "Creative Style Sheets",
                    "None of the above"
                ],
                correct: 0
            },
            {
                question: "Which property is used to change the background color in CSS?",
                options: [
                    "color",
                    "background-color",
                    "bgcolor",
                    "background"
                ],
                correct: 1
            },
            {
                question: "What does the `display: flex` property do in CSS?",
                options: [
                    "Aligns text",
                    "Creates a grid layout",
                    "Centers elements horizontally and vertically",
                    "Makes elements invisible"
                ],
                correct: 2
            }
        ],
        JS: [
            {
                question: "What does JS stand for?",
                options: [
                    "JavaScript",
                    "JavaSystem",
                    "JScript",
                    "None of the above"
                ],
                correct: 0
            },
            {
                question: "Which of the following is used to declare a variable in JavaScript?",
                options: [
                    "var",
                    "let",
                    "const",
                    "All of the above"
                ],
                correct: 3
            },
            {
                question: "What is the correct syntax for a JavaScript function?",
                options: [
                    "function = myFunction()",
                    "function myFunction()",
                    "function: myFunction()",
                    "myFunction() = function"
                ],
                correct: 1
            }
        ],
        Mixed: [
            {
                question: "What does HTML stand for?",
                options: [
                    "HyperText Markup Language",
                    "HyperText Machine Language",
                    "HyperText Markup List",
                    "None of the above"
                ],
                correct: 0
            },
            {
                question: "What does CSS stand for?",
                options: [
                    "Cascading Style Sheets",
                    "Computer Style Sheets",
                    "Creative Style Sheets",
                    "None of the above"
                ],
                correct: 0
            },
            {
                question: "What does JS stand for?",
                options: [
                    "JavaScript",
                    "JavaSystem",
                    "JScript",
                    "None of the above"
                ],
                correct: 0
            },
            {
                question: "Which property is used to change the background color in CSS?",
                options: [
                    "color",
                    "background-color",
                    "bgcolor",
                    "background"
                ],
                correct: 1
            }
        ]
    };

    const questions = allQuestions[gameState.subject] || allQuestions.Mixed;

    const selectedQuestions = [];
    for (let i = 0; i < gameState.players.length * gameState.questionsPerPlayer; i++) {
        const question = questions[i % questions.length];
        selectedQuestions.push(shuffleOptions(question));
    }

    return selectedQuestions;
}

function shuffleOptions(question) {
    const options = [...question.options];
    const correctAnswer = question.correct;
    
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    const newCorrectIndex = options.indexOf(question.options[correctAnswer]);

    return {
        question: question.question,
        options: options,
        correct: newCorrectIndex
    };
}

function startTimer() {
    gameState.timeLeft = 10;
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        document.querySelector(".timer").textContent = `Time Left: ${gameState.timeLeft}s`;

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            submitAnswer();
        }
    }, 1000);
}

function selectAnswer(index) {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn, i) => (btn.style.background = i === index ? "blue" : ""));
    document.getElementById("submitBtn").disabled = false;
}

function submitAnswer() {
    clearInterval(gameState.timer);

    const player = gameState.players[gameState.currentPlayerIndex];
    const question = gameState.questions[gameState.currentQuestionIndex];
    const selectedAnswer = Array.from(document.querySelectorAll("button")).findIndex(
        (btn) => btn.style.background === "blue"
    );

    if (selectedAnswer === question.correct) {
        gameState.scores[player] += 10;
    }

    gameState.currentPlayerIndex =
        (gameState.currentPlayerIndex + 1) % gameState.players.length;
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        screens.resultsScreen();
    } else {
        screens.gameScreen();
    }
}

function resetGame() {
    gameState = {
        players: [],
        subject: "Mixed",
        questionsPerPlayer: 3,
        currentPlayerIndex: 0,
        currentQuestionIndex: 0,
        scores: {},
        questions: [],
        timer: null,
        timeLeft: 10,
    };

    screens.playerSelection();
}

screens.playerSelection();
