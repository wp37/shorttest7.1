// 20 câu hỏi trắc nghiệm Unit 7: Traffic - Mức độ trung bình
// Nguồn: A Closer Look 1, A Closer Look 2 & Looking Back

const quizQuestions = [
    // ===== A CLOSER LOOK 1 - Vocabulary (Biển báo giao thông) =====
    {
        id: 1,
        question: "The sign 'No parking' means you _______.",
        options: [
            "A. can park your car here",
            "B. cannot stop your car here",
            "C. cannot leave your car here",
            "D. can leave your car for a short time"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 1"
    },
    {
        id: 2,
        question: "What does 'cycle lane' mean?",
        options: [
            "A. A road for cars only",
            "B. A path for pedestrians",
            "C. A lane for bicycles",
            "D. A lane for motorbikes"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 1"
    },
    {
        id: 3,
        question: "A _______ is a person who walks on the street.",
        options: [
            "A. driver",
            "B. passenger",
            "C. pedestrian",
            "D. cyclist"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 1"
    },
    {
        id: 4,
        question: "The _______ is the path at the side of the road for people to walk on.",
        options: [
            "A. lane",
            "B. pavement",
            "C. cycle lane",
            "D. road sign"
        ],
        correctAnswer: 1, // B
        section: "A Closer Look 1"
    },
    {
        id: 5,
        question: "Everyone in the car must wear a _______.",
        options: [
            "A. helmet",
            "B. seat belt",
            "C. jacket",
            "D. uniform"
        ],
        correctAnswer: 1, // B
        section: "A Closer Look 1"
    },
    {
        id: 6,
        question: "When you see the sign 'School ahead', you should _______.",
        options: [
            "A. speed up",
            "B. turn left",
            "C. slow down",
            "D. stop immediately"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 1"
    },

    // ===== A CLOSER LOOK 1 - Pronunciation (/eɪ/ and /aɪ/) =====
    {
        id: 7,
        question: "Which word has the sound /eɪ/ as in 'station'?",
        options: [
            "A. sign",
            "B. fine",
            "C. plane",
            "D. ride"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 1"
    },
    {
        id: 8,
        question: "Which word has the sound /aɪ/ as in 'bike'?",
        options: [
            "A. train",
            "B. wait",
            "C. drive",
            "D. safe"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 1"
    },
    {
        id: 9,
        question: "The underlined sound in 'traffic' is pronounced as _______.",
        options: [
            "A. /eɪ/",
            "B. /aɪ/",
            "C. /æ/",
            "D. /ə/"
        ],
        correctAnswer: 2, // C (traffic có âm /æ/, không phải /eɪ/ hay /aɪ/)
        section: "A Closer Look 1"
    },

    // ===== A CLOSER LOOK 2 - Grammar (It + distance) =====
    {
        id: 10,
        question: "_______ is about 2 kilometers from my house to the school.",
        options: [
            "A. This",
            "B. That",
            "C. It",
            "D. There"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 2"
    },
    {
        id: 11,
        question: "How _______ is it from here to the bus station?",
        options: [
            "A. long",
            "B. far",
            "C. much",
            "D. many"
        ],
        correctAnswer: 1, // B
        section: "A Closer Look 2"
    },
    {
        id: 12,
        question: "It _______ about 500 meters from my house to the nearest supermarket.",
        options: [
            "A. are",
            "B. has",
            "C. is",
            "D. have"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 2"
    },
    {
        id: 13,
        question: "_______ far is it from Ha Noi to Ho Chi Minh City?",
        options: [
            "A. What",
            "B. Where",
            "C. How",
            "D. Which"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 2"
    },

    // ===== A CLOSER LOOK 2 - Grammar (Should/Shouldn't) =====
    {
        id: 14,
        question: "You _______ wear a helmet when you ride a motorbike.",
        options: [
            "A. should",
            "B. shouldn't",
            "C. mustn't",
            "D. can't"
        ],
        correctAnswer: 0, // A
        section: "A Closer Look 2"
    },
    {
        id: 15,
        question: "Children _______ play near the road. It's dangerous.",
        options: [
            "A. should",
            "B. shouldn't",
            "C. can",
            "D. must"
        ],
        correctAnswer: 1, // B
        section: "A Closer Look 2"
    },
    {
        id: 16,
        question: "We _______ cross the road when the traffic light is red.",
        options: [
            "A. should",
            "B. can",
            "C. shouldn't",
            "D. might"
        ],
        correctAnswer: 2, // C
        section: "A Closer Look 2"
    },
    {
        id: 17,
        question: "You _______ obey the traffic rules to stay safe.",
        options: [
            "A. shouldn't",
            "B. should",
            "C. might not",
            "D. can't"
        ],
        correctAnswer: 1, // B
        section: "A Closer Look 2"
    },

    // ===== LOOKING BACK =====
    {
        id: 18,
        question: "Choose the correct answer: The hospital is _______ the right.",
        options: [
            "A. in",
            "B. at",
            "C. on",
            "D. of"
        ],
        correctAnswer: 2, // C
        section: "Looking Back"
    },
    {
        id: 19,
        question: "We use 'should' to give _______.",
        options: [
            "A. orders",
            "B. advice",
            "C. permission",
            "D. ability"
        ],
        correctAnswer: 1, // B
        section: "Looking Back"
    },
    {
        id: 20,
        question: "Complete the sentence: '_______ is it from your house to the market?' - 'It's about 1 km.'",
        options: [
            "A. How long",
            "B. How much",
            "C. How often",
            "D. How far"
        ],
        correctAnswer: 3, // D
        section: "Looking Back"
    }
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = quizQuestions;
}
