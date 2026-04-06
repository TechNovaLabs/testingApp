let shuffledQuestions = []
let userSelections = []
let answerConfirmed = []

let currentIndex = 0
let currentView = 'start'
let currentTestType = ''

function shuffleArray(arr) {

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1))

        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp

    }

    return arr

}

function initShuffledData(questions) {

    let copy = [...questions]
    copy = shuffleArray(copy)

    shuffledQuestions = copy.map(q => {

        let answers = shuffleArray([...q.answers])

        let correctIndex = answers.findIndex(a => a.isCorrect)

        return {
            text: q.text,
            answers: answers,
            correctIndex: correctIndex
        }

    })

    userSelections = new Array(shuffledQuestions.length).fill(null)
    answerConfirmed = new Array(shuffledQuestions.length).fill(false)

    currentIndex = 0

}

function renderStart() {

    return `
<div class="card">
<div class="card-inner">

<div class="datetime-section">
<div class="date-display">${new Date().toLocaleDateString()}</div>
<div class="time-display">${new Date().toLocaleTimeString()}</div>
</div>

<div class="btn-group">
<button class="btn-start" id="startMain">Служебная подготовка</button>
<button class="btn-start" id="startCharters">Уставы</button>
</div>

</div>
</div>
`

}

function renderQuiz() {

    let q = shuffledQuestions[currentIndex]

    let selected = userSelections[currentIndex]

    let confirmed = answerConfirmed[currentIndex]

    let answersHTML = q.answers.map((a, i) => {

        let className = "answer-option"

        if (!confirmed) {

            if (selected === i) className += " temp-selected"

        } else {

            if (i === q.correctIndex) {
                className += " correct-final"
            }

            if (i === selected && selected !== q.correctIndex) {
                className += " wrong-final"
            }

        }

        return `
<div class="${className}" data-index="${i}">
${a.text}
</div>
`

    }).join("")

    return `

<div class="card">
<div class="card-inner">

<div class="quiz-header">
<div class="progress-text">Вопрос ${currentIndex + 1}/${shuffledQuestions.length}</div>
</div>

<div class="question-text">${q.text}</div>

<div class="answers-list">
${answersHTML}
</div>

<div class="nav-buttons">

<button class="btn-nav" id="prevBtn" ${currentIndex === 0 ? "disabled" : ""}>
Назад
</button>

${!confirmed
            ? `<button class="btn-nav primary" id="confirmBtn" ${selected === null ? "disabled" : ""}>
Проверить
</button>`
            : `<button class="btn-nav primary" id="nextBtn">
Далее
</button>`
        }

</div>

</div>
</div>

`

}

function renderResult() {

    let score = 0

    shuffledQuestions.forEach((q, i) => {

        if (userSelections[i] === q.correctIndex) score++

    })

    return `

<div class="card result-card">
<div class="card-inner">

<h2>Результат</h2>

<div class="score-circle">
${score}/${shuffledQuestions.length}
</div>

<button class="restart-btn" id="restartBtn">
Пройти заново
</button>

</div>
</div>

`

}

function renderApp() {

    const root = document.getElementById("appRoot")

    if (currentView === "start") {

        root.innerHTML = renderStart()

        document.getElementById("startMain").onclick = () => {

            currentTestType = "main"

            initShuffledData(fullMainQuestions)

            currentView = "quiz"

            renderApp()

        }

        document.getElementById("startCharters").onclick = () => {

            currentTestType = "charters"

            initShuffledData(chartersQuestionsData)

            currentView = "quiz"

            renderApp()

        }

    }

    else if (currentView === "quiz") {

        root.innerHTML = renderQuiz()

        const confirmed = answerConfirmed[currentIndex]

        document.querySelectorAll(".answer-option").forEach(el => {

            el.onclick = () => {

                if (answerConfirmed[currentIndex]) return

                userSelections[currentIndex] = Number(el.dataset.index)

                renderApp()

            }

        })

        const confirmBtn = document.getElementById("confirmBtn")

        if (confirmBtn) {

            confirmBtn.onclick = () => {

                answerConfirmed[currentIndex] = true

                renderApp()

            }

        }

        const nextBtn = document.getElementById("nextBtn")

        if (nextBtn) {

            nextBtn.onclick = () => {

                if (currentIndex === shuffledQuestions.length - 1) {

                    currentView = "result"

                } else {

                    currentIndex++

                }

                renderApp()

            }

        }

        document.getElementById("prevBtn").onclick = () => {

            if (currentIndex > 0) {

                currentIndex--

                renderApp()

            }

        }

    }

    else if (currentView === "result") {

        root.innerHTML = renderResult()

        document.getElementById("restartBtn").onclick = () => {

            currentView = "start"

            renderApp()

        }

    }

}

renderApp()