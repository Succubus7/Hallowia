// Éléments du DOM
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
const showRulesBtn = document.getElementById('showRules');
const closeRulesBtn = document.getElementById('closeRules');

// Variables globales
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
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fonction pour charger les images depuis GitHub
async function loadImagesFromGitHub() {
    try {
        console.log('Chargement des images...');
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents${path}`);
        const data = await response.json();
        console.log('Données reçues:', data);
        images = data.filter(file => file.type === 'file' && file.name.match(/\.(jpg|jpeg|png|gif)$/i))
                        .map(file => file.download_url);
        console.log('Images filtrées:', images);
        shuffleArray(images);
        totalImagesSpan.textContent = images.length;
        await createImageElements();
        loadingDiv.style.display = 'none';
        console.log('Chargement terminé');
        if (images.length > 0) {
            nextBtn.disabled = false;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
        loadingDiv.textContent = 'Erreur lors du chargement des images. Veuillez réessayer.';
    }
}

// Fonction pour créer les éléments img
async function createImageElements() {
    gallery.innerHTML = ''; // Nettoyer la galerie avant d'ajouter de nouvelles images
    for (let i = 0; i < images.length; i++) {
        const img = document.createElement('img');
        img.src = images[i];
        img.alt = `Expression française ${i + 1}`;
        gallery.appendChild(img);
        
        // Attendre que l'image soit chargée
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        
        console.log(`Image ${i + 1} chargée`);
    }
}

// Fonction pour démarrer le minuteur
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerToggleBtn.textContent = 'Arrêter';
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDiv.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                timerToggleBtn.textContent = 'Redémarrer';
                timerEndSound.play();
                blurCurrentImage(); // Appliquer le flou à la fin du minuteur
            }
        }, 1000);
    }
}

// Fonction pour arrêter le minuteur
function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerToggleBtn.textContent = 'Reprendre';
}

// Fonction pour réinitialiser le minuteur
function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    timerDiv.textContent = timeLeft;
    isTimerRunning = false;
    timerToggleBtn.textContent = 'Démarrer';
    unblurCurrentImage(); // Retirer le flou lors de la réinitialisation du minuteur
}

// Fonction pour basculer le minuteur
function toggleTimer() {
    if (isTimerRunning) {
        stopTimer();
    } else {
        if (timeLeft <= 0) {
            resetTimer();
        }
        startTimer();
        if (isBlurred) {
            unblurCurrentImage(); // Retirer le flou si on redémarre le minuteur
        }
    }
}

// Fonction pour appliquer le flou à l'image actuelle
function blurCurrentImage() {
    if (currentIndex >= 0 && currentIndex < gallery.children.length) {
        gallery.children[currentIndex].classList.add('blurred');
        isBlurred = true;
    }
}

// Fonction pour retirer le flou de l'image actuelle
function unblurCurrentImage() {
    if (currentIndex >= 0 && currentIndex < gallery.children.length) {
        gallery.children[currentIndex].classList.remove('blurred');
        isBlurred = false;
    }
}

// Fonction pour afficher l'image suivante
function showNextImage() {
    console.log('Affichage de l\'image suivante');
    if (images.length === 0) {
        console.log('Aucune image chargée');
        return;
    }
    if (currentIndex >= 0) {
        gallery.children[currentIndex].classList.remove('active');
        unblurCurrentImage(); // Retirer le flou de l'image précédente
    }
    currentIndex = (currentIndex + 1) % images.length;
    gallery.children[currentIndex].classList.add('active');
    updateImageCounter();
    resetTimer();
    console.log('Image affichée:', currentIndex);
}

// Fonction pour afficher l'image précédente
function showPrevImage() {
    if (currentIndex > 0) {
        gallery.children[currentIndex].classList.remove('active');
        unblurCurrentImage(); // Retirer le flou de l'image précédente
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        gallery.children[currentIndex].classList.add('active');
        updateImageCounter();
        resetTimer();
    }
}

// Fonction pour mettre à jour le compteur d'images
function updateImageCounter() {
    currentImageSpan.textContent = currentIndex + 1;
}

// Fonction pour basculer en mode plein écran
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (body.requestFullscreen) {
            body.requestFullscreen();
        } else if (body.mozRequestFullScreen) { // Firefox
            body.mozRequestFullScreen();
        } else if (body.webkitRequestFullscreen) { // Chrome, Safari et Opera
            body.webkitRequestFullscreen();
        } else if (body.msRequestFullscreen) { // IE/Edge
            body.msRequestFullscreen();
        }
        body.classList.add('fullscreen');
        fullscreenBtn.textContent = 'Quitter Plein Écran';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        body.classList.remove('fullscreen');
        fullscreenBtn.textContent = 'Plein Écran';
    }
}

// Fonctions pour gérer les scores
function updateScore(team, change) {
    const scoreDiv = team === 1 ? team1ScoreDiv : team2ScoreDiv;
    const currentScore = team === 1 ? team1Score : team2Score;
    const newScore = Math.max(0, currentScore + change);

    if (team === 1) {
        team1Score = newScore;
    } else {
        team2Score = newScore;
    }

    scoreDiv.textContent = newScore;
    scoreDiv.classList.add('score-change');
    setTimeout(() => scoreDiv.classList.remove('score-change'), 300);
}

// Fonction pour mettre à jour les noms des équipes
function updateTeamNames() {
    document.querySelector('.team-score:nth-child(1) h2').textContent = team1Name;
    document.querySelector('.team-score:nth-child(2) h2').textContent = team2Name;
}

// Fonction d'initialisation
function init() {
    teamNameForm.style.display = 'flex';
}

// Gestionnaire de soumission du formulaire
nameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    team1Name = team1NameInput.value || "Équipe 1";
    team2Name = team2NameInput.value || "Équipe 2";
    updateTeamNames();
    teamNameForm.style.display = 'none';
    loadImagesFromGitHub(); // Commencer à charger les images après avoir défini les noms d'équipes
});

// Écouteurs d'événements
nextBtn.addEventListener('click', showNextImage);
prevBtn.addEventListener('click', showPrevImage);
fullscreenBtn.addEventListener('click', toggleFullscreen);
team1PlusBtn.addEventListener('click', () => updateScore(1, 1));
team1MinusBtn.addEventListener('click', () => updateScore(1, -1));
team2PlusBtn.addEventListener('click', () => updateScore(2, 1));
team2MinusBtn.addEventListener('click', () => updateScore(2, -1));
timerToggleBtn.addEventListener('click', toggleTimer);

// Gestion des touches du clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'f') toggleFullscreen();
    if (e.key === '1') updateScore(1, 1);
    if (e.key === 'q') updateScore(1, -1);
    if (e.key === '2') updateScore(2, 1);
    if (e.key === 'w') updateScore(2, -1);
    if (e.key === ' ') toggleTimer(); // Espace pour démarrer/arrêter le minuteur
});

// Gestion de la sortie du mode plein écran
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        body.classList.remove('fullscreen');
        fullscreenBtn.textContent = 'Plein Écran';
    }
});

showRulesBtn.addEventListener('click', () => {
    rulesOverlay.style.display = 'block';
});

closeRulesBtn.addEventListener('click', () => {
    rulesOverlay.style.display = 'none';
});

// Fermer l'overlay si on clique en dehors du contenu
rulesOverlay.addEventListener('click', (e) => {
    if (e.target === rulesOverlay) {
        rulesOverlay.style.display = 'none';
    }
});

// Lancer l'initialisation
init();
