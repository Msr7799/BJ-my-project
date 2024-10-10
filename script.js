// تعريف عناصر واجهة المستخدم
const startButton = document.getElementById('start-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const gameMessage = document.getElementById('game-message');
const splitButton = document.getElementById('split-button');
const dealerCards = document.getElementById('dealer-cards');
const playerCards = document.getElementById('player-cards');
const playerScoreDisplay = document.getElementById('player-score');
const dealerScoreDisplay = document.getElementById('dealer-score');

// تهيئة متغيرات اللعبة
let playerScore = 0;
let dealerScore = 0;
let cardback = 0;
let deck = [];
let playerHand = [];
let dealerHand = [];
let splitHand = [];
let isSplit = false; // متغير لتحديد ما إذا كان هناك انقسام

// دالة لإنشاء مجموعة الأوراق
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

// دالة لخلط الأوراق
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// دالة لسحب ورقة من المجموعة
function drawCard() {
    return deck.pop();
}

// دالة لحساب قيمة اليد
function calculateHandValue(hand) {
    let value = 0;
    let hasAce = false;
    for (let card of hand) {
        if (card.value === 'A') {
            hasAce = true;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    if (hasAce && value > 21) {
        value -= 10;
    }
    return value;
}

// دالة لتحديث عرض البطاقات
function updateCardDisplay(container, hand) {
    container.innerHTML = '';
    for (let card of hand) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.value}${card.suit}`;
        container.appendChild(cardElement);
    }
}

// دالة لبدء اللعبة
function startGame() {
    createDeck();
    shuffleDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    updateCardDisplay(playerCards, playerHand);
    updateCardDisplay(dealerCards, [dealerHand[0], { value: '?', suit: '?' }]);
    playerScore = calculateHandValue(playerHand);
    dealerScore = calculateHandValue(dealerHand);
    playerScoreDisplay.textContent = `Player Score: ${playerScore}`;
    dealerScoreDisplay.textContent = 'Dealer Score: ?';
    gameMessage.textContent = '';
    hitButton.disabled = false;
    standButton.disabled = false;
    startButton.disabled = true;
    checkForBlackjack();
}

// دالة للتحقق من البلاك جاك
function checkForBlackjack() {
    if (playerScore === 21) {
        endGame("Player wins with Blackjack!");
    } else if (dealerScore === 21) {
        revealDealerHand();
        endGame("Dealer wins with Blackjack!");
    }
}

// دالة لسحب ورقة إضافية للاعب
function hit() {
    playerHand.push(drawCard());
    updateCardDisplay(playerCards, playerHand);
    playerScore = calculateHandValue(playerHand);
    playerScoreDisplay.textContent = `Player Score: ${playerScore}`;
    if (playerScore > 21) {
        endGame("Player busts! Dealer wins.");
    }
}

// دالة للوقوف (إنهاء دور اللاعب)
function stand() {
    hitButton.disabled = true;
    standButton.disabled = true;
    revealDealerHand();
    dealerPlay();
}

// دالة لكشف يد الديلر
function revealDealerHand() {
    updateCardDisplay(dealerCards, dealerHand);
    dealerScoreDisplay.textContent = `Dealer Score: ${dealerScore}`;
}

// دالة للعب دور الديلر
function dealerPlay() {
    while (dealerScore < 17) {
        dealerHand.push(drawCard());
        dealerScore = calculateHandValue(dealerHand);
        updateCardDisplay(dealerCards, dealerHand);
        dealerScoreDisplay.textContent = `Dealer Score: ${dealerScore}`;
    }
    determineWinner();
}

// دالة لتحديد الفائز
function determineWinner() {
    if (dealerScore > 21) {
        endGame("Dealer busts! Player wins.");
    } else if (dealerScore > playerScore) {
        endGame("Dealer wins!");
    } else if (dealerScore < playerScore) {
        endGame("Player wins!");
    } else {
        endGame("It's a tie!");
    }
}

// دالة لإنهاء اللعبة
function endGame(message) {
    gameMessage.textContent = message;
    hitButton.disabled = true;
    standButton.disabled = true;
    startButton.disabled = false;
}

// إضافة مستمعي الأحداث للأزرار
startButton.addEventListener('click', startGame);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);

// تعطيل أزرار اللعب في البداية
hitButton.disabled = true;
standButton.disabled = true;