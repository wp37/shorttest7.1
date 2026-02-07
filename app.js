// ===== Quiz Application =====

// Google Apps Script Web App URL - Replace with your actual URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIV-2Sek6n8o6aSMc868rMzaxxTmPHrfJ_Qbgw7iXmnbzCSB3OF2zzrZJdmVsbu4buow/exec';

// State management
let state = {
    studentName: '',
    studentClass: '',
    answers: {},
    submitted: false
};

// DOM Elements
const registrationSection = document.getElementById('registration');
const quizSection = document.getElementById('quiz');
const resultsSection = document.getElementById('results');
const registrationForm = document.getElementById('registrationForm');
const questionsContainer = document.getElementById('questionsContainer');
const submitBtn = document.getElementById('submitQuiz');
const loadingOverlay = document.getElementById('loadingOverlay');

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Registration form submission
    registrationForm.addEventListener('submit', handleRegistration);

    // Submit quiz button
    submitBtn.addEventListener('click', handleSubmitQuiz);

    // Retry button
    document.getElementById('retryBtn').addEventListener('click', handleRetry);

    // Review button
    document.getElementById('reviewBtn').addEventListener('click', handleReview);
}

// ===== Registration =====
function handleRegistration(e) {
    e.preventDefault();

    const nameInput = document.getElementById('studentName');
    const classInput = document.getElementById('studentClass');

    state.studentName = nameInput.value.trim();
    state.studentClass = classInput.value.trim();

    if (!state.studentName || !state.studentClass) {
        alert('Vui lòng nhập đầy đủ họ tên và lớp!');
        return;
    }

    // Update display
    document.getElementById('displayName').textContent = state.studentName;
    document.getElementById('displayClass').textContent = `Lớp: ${state.studentClass}`;

    // Render questions
    renderQuestions();

    // Show quiz section
    registrationSection.classList.add('hidden');
    quizSection.classList.remove('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Render Questions =====
function renderQuestions() {
    questionsContainer.innerHTML = '';

    quizQuestions.forEach((q, index) => {
        const questionCard = createQuestionCard(q, index);
        questionsContainer.appendChild(questionCard);
    });

    updateProgress();
}

function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `question-${question.id}`;

    const optionLetters = ['A', 'B', 'C', 'D'];

    card.innerHTML = `
        <div class="question-header">
            <div class="question-number">${question.id}</div>
            <div class="question-text">${question.question}</div>
        </div>
        <div class="question-body">
            <div class="options-list">
                ${question.options.map((option, optIndex) => `
                    <div class="option-item">
                        <input 
                            type="radio" 
                            id="q${question.id}_opt${optIndex}" 
                            name="question_${question.id}" 
                            value="${optIndex}"
                            class="option-input"
                            data-question-id="${question.id}"
                        >
                        <label for="q${question.id}_opt${optIndex}" class="option-label" data-option-index="${optIndex}">
                            <span class="option-marker">${optionLetters[optIndex]}</span>
                            <span class="option-text">${option.substring(3)}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners for options
    const inputs = card.querySelectorAll('.option-input');
    inputs.forEach(input => {
        input.addEventListener('change', handleAnswerChange);
    });

    return card;
}

// ===== Handle Answer Changes =====
function handleAnswerChange(e) {
    const questionId = parseInt(e.target.dataset.questionId);
    const selectedOption = parseInt(e.target.value);

    state.answers[questionId] = selectedOption;

    updateProgress();
    checkCanSubmit();
}

function updateProgress() {
    const answered = Object.keys(state.answers).length;
    const total = quizQuestions.length;
    const percentage = (answered / total) * 100;

    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = `${answered}/${total}`;
}

function checkCanSubmit() {
    const answered = Object.keys(state.answers).length;
    const total = quizQuestions.length;

    submitBtn.disabled = answered < total;
}

// ===== Submit Quiz =====
function handleSubmitQuiz() {
    if (state.submitted) return;

    const answered = Object.keys(state.answers).length;
    if (answered < quizQuestions.length) {
        alert(`Bạn còn ${quizQuestions.length - answered} câu chưa trả lời!`);
        return;
    }

    // Confirm submission
    if (!confirm('Bạn có chắc chắn muốn nộp bài?')) {
        return;
    }

    state.submitted = true;

    // Calculate results
    const results = calculateResults();

    // Show results
    showResults(results);

    // Send to Google Sheets
    sendToGoogleSheets(results);
}

function calculateResults() {
    let correct = 0;
    let incorrect = 0;
    const details = [];

    quizQuestions.forEach(q => {
        const userAnswer = state.answers[q.id];
        const isCorrect = userAnswer === q.correctAnswer;

        if (isCorrect) {
            correct++;
        } else {
            incorrect++;
        }

        details.push({
            questionId: q.id,
            question: q.question,
            userAnswer: userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: isCorrect,
            section: q.section
        });
    });

    const total = quizQuestions.length;
    const grade = (correct / total * 10).toFixed(1);

    return {
        studentName: state.studentName,
        studentClass: state.studentClass,
        correct,
        incorrect,
        total,
        grade,
        details,
        submittedAt: new Date().toISOString()
    };
}

// ===== Show Results =====
function showResults(results) {
    // Hide quiz section
    quizSection.classList.add('hidden');

    // Update results UI
    document.getElementById('scoreNumber').textContent = results.correct;
    document.getElementById('correctCount').textContent = results.correct;
    document.getElementById('incorrectCount').textContent = results.incorrect;
    document.getElementById('gradeValue').textContent = results.grade;

    // Set result message based on grade
    const message = getResultMessage(parseFloat(results.grade));
    document.getElementById('resultsMessage').textContent = message.text;

    // Update score circle color
    const scoreCircle = document.getElementById('scoreCircle');
    if (parseFloat(results.grade) >= 8) {
        scoreCircle.style.borderColor = 'rgba(16, 185, 129, 0.5)';
    } else if (parseFloat(results.grade) >= 5) {
        scoreCircle.style.borderColor = 'rgba(245, 158, 11, 0.5)';
    } else {
        scoreCircle.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    }

    // Show results section
    resultsSection.classList.remove('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getResultMessage(grade) {
    if (grade >= 9) {
        return { text: '🏆 Xuất sắc! Bạn đã làm rất tốt!', type: 'excellent' };
    } else if (grade >= 8) {
        return { text: '🌟 Giỏi! Kết quả rất tốt!', type: 'good' };
    } else if (grade >= 6.5) {
        return { text: '👍 Khá! Tiếp tục phát huy nhé!', type: 'average' };
    } else if (grade >= 5) {
        return { text: '📚 Đạt yêu cầu. Cần cố gắng hơn!', type: 'pass' };
    } else {
        return { text: '💪 Chưa đạt. Hãy ôn tập và thử lại!', type: 'fail' };
    }
}

// ===== Review Answers =====
function handleReview() {
    const reviewSection = document.getElementById('reviewSection');
    const reviewContainer = document.getElementById('reviewContainer');

    if (!reviewSection.classList.contains('hidden')) {
        reviewSection.classList.add('hidden');
        document.getElementById('reviewBtn').innerHTML = '<span class="btn-icon">📋</span> Xem Đáp Án';
        return;
    }

    // Generate review content
    reviewContainer.innerHTML = '';

    quizQuestions.forEach(q => {
        const userAnswer = state.answers[q.id];
        const isCorrect = userAnswer === q.correctAnswer;

        const reviewCard = createReviewCard(q, userAnswer, isCorrect);
        reviewContainer.appendChild(reviewCard);
    });

    reviewSection.classList.remove('hidden');
    document.getElementById('reviewBtn').innerHTML = '<span class="btn-icon">🔼</span> Ẩn Đáp Án';

    // Scroll to review section
    reviewSection.scrollIntoView({ behavior: 'smooth' });
}

function createReviewCard(question, userAnswer, isCorrect) {
    const card = document.createElement('div');
    card.className = 'question-card';

    const optionLetters = ['A', 'B', 'C', 'D'];

    card.innerHTML = `
        <div class="question-header" style="background: ${isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}">
            <div class="question-number" style="background: ${isCorrect ? 'var(--gradient-success)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}">${question.id}</div>
            <div class="question-text">${question.question}</div>
        </div>
        <div class="question-body">
            <div class="options-list">
                ${question.options.map((option, optIndex) => {
        let className = 'option-label';
        if (optIndex === question.correctAnswer) {
            className += ' correct';
        } else if (optIndex === userAnswer && !isCorrect) {
            className += ' incorrect';
        }

        return `
                        <div class="option-item">
                            <div class="${className}">
                                <span class="option-marker">${optionLetters[optIndex]}</span>
                                <span class="option-text">${option.substring(3)}</span>
                                ${optIndex === question.correctAnswer ? '<span style="margin-left: auto;">✅</span>' : ''}
                                ${optIndex === userAnswer && !isCorrect ? '<span style="margin-left: auto;">❌</span>' : ''}
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;

    return card;
}

// ===== Retry Quiz =====
function handleRetry() {
    // Reset state
    state = {
        studentName: '',
        studentClass: '',
        answers: {},
        submitted: false
    };

    // Reset form
    registrationForm.reset();

    // Hide sections
    quizSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    document.getElementById('reviewSection').classList.add('hidden');

    // Show registration
    registrationSection.classList.remove('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Send to Google Sheets =====
async function sendToGoogleSheets(results) {
    const submitStatus = document.getElementById('submitStatus');

    // Check if URL is configured
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        submitStatus.textContent = '⚠️ Chưa cấu hình Google Sheets. Kết quả chưa được lưu online.';
        submitStatus.className = 'submit-status error';
        console.warn('Google Apps Script URL not configured');
        return;
    }

    loadingOverlay.classList.remove('hidden');

    try {
        // Prepare data for Google Sheets
        const data = {
            timestamp: new Date().toLocaleString('vi-VN'),
            studentName: results.studentName,
            studentClass: results.studentClass,
            correct: results.correct,
            incorrect: results.incorrect,
            total: results.total,
            grade: results.grade,
            answers: Object.values(state.answers).map((ans, idx) => {
                const q = quizQuestions[idx];
                return ans === q.correctAnswer ? 1 : 0;
            }).join(',')
        };

        // Send to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        submitStatus.textContent = '✅ Kết quả đã được gửi lên Google Sheets thành công!';
        submitStatus.className = 'submit-status success';

    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        submitStatus.textContent = '❌ Không thể gửi kết quả. Vui lòng liên hệ giáo viên.';
        submitStatus.className = 'submit-status error';
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}
