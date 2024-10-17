const gallery = document.querySelector('.gallery');
const startMessage = document.getElementById('start-message');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const currentImageSpan = document.getElementById('currentImage');
const totalImagesSpan = document.getElementById('totalImages');
const loadingDiv = document.getElementById('loading');
const body = document.body;
const team1ScoreDiv = document.getElementById('team1Score');
const team2ScoreDiv = document.getElementById('team2Score');
const team1PlusBtn = document.getElementById('team1Plus');
const team1MinusBtn = document.getElementById('team1Minus');
const team2PlusBtn = document.getElementById('team2Plus');
const team2MinusBtn = document.getElementById('team2Minus');
const timerDiv = document.getElementById('timer');
const timerToggleBtn = document.getElementById('timerToggle');
const teamNameForm = document.getElementById('teamNameForm');
const nameForm = document.getElementById('nameForm');
const team1NameInput = document.getElementById('team1Name');
const team2NameInput = document.getElementById('team2Name');
const rulesOverlay = document.getElementById('rulesOverlay');
const startGameBtn = document.getElementById('startGameBtn');

let currentIndex = -1;
let images = [];
let team1Score = 0;
let team2Score = 0;
let timerInterval;
let isTimerRunning = false;
let timeLeft = 30;
let isBlurred = false;
let team1Name = "Équipe 1";
let team2Name = "Équipe 2";

// Configuration GitHub
const owner = 'Succubus7';
const repo = 'Hallowia';
const path = '/images';

// Charger le son
const timerEndSound = new Audio('https://soundbible.com/grab.php?id=1496&type=mp3');

// Fonction pour mélanger un tableau
function shuffleArray(array) {
    for (let i = array.length - 1
