document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initNavigation();
    loadPortfolioItems();
    initSearchAndSort();
    initPortfolioFilters();
    initGame();
    
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    }
});

// ========== MOBILE MENU ==========
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

// ========== NAVIGATION ==========
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            history.pushState(null, null, '#' + sectionId);
            
            // close mobile menu
            document.getElementById('nav').classList.remove('active');
        });
    });
}

window.navigateToSection = function(sectionId) {
    showSection(sectionId);
    history.pushState(null, null, '#' + sectionId);
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
        section.classList.remove('active-section');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`[href="#${sectionId}"]`);
    
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
    
    if (targetLink) {
        targetLink.classList.add('active');
    }
}

// ========== TOAST ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast-mini';
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ========== GAME SEDERHANA ==========
let currentQuestion = 0;
let score = 0;
let totalQuestions = 5;
let playerName = "";
let timerInterval;
let timeLeft = 10;
let currentAnswer = 0;
let questions = [];

function initGame() {
    // Sembunyikan semua screen
    const gameMenu = document.getElementById('gameMenu');
    const gameArena = document.getElementById('gameArena');
    const gameResult = document.getElementById('gameResult');
    
    if (!gameMenu || !gameArena || !gameResult) return;
}

function startNewGame() {
    const nameInput = document.getElementById('playerName');
    const gameMenu = document.getElementById('gameMenu');
    const gameArena = document.getElementById('gameArena');
    
    if (!nameInput.value.trim()) {
        alert('Masukkan nama kamu dulu!');
        return;
    }
    
    playerName = nameInput.value;
    currentQuestion = 0;
    score = 0;
    
    // Generate 5 soal
    generateQuestions();
    
    // Tampilkan arena game
    gameMenu.classList.add('hidden');
    gameArena.classList.remove('hidden');
    
    // Update player name
    document.getElementById('playerDisplay').innerText = '👤 ' + playerName;
    
    // Tampilkan soal pertama
    showQuestion();
}

function generateQuestions() {
    questions = [];
    for (let i = 0; i < totalQuestions; i++) {
        let a = Math.floor(Math.random() * 10) + 1;
        let b = Math.floor(Math.random() * 10) + 1;
        let ops = ['+', '-', '×'];
        let op = ops[Math.floor(Math.random() * 3)];
        
        let answer;
        if (op === '+') answer = a + b;
        else if (op === '-') answer = a - b;
        else answer = a * b;
        
        // Generate 4 pilihan jawaban
        let options = [answer];
        while (options.length < 4) {
            let fake = answer + (Math.floor(Math.random() * 5) - 2);
            if (!options.includes(fake) && fake > 0) {
                options.push(fake);
            }
        }
        
        // Acak urutan pilihan
        options.sort(() => Math.random() - 0.5);
        
        questions.push({
            text: a + ' ' + op + ' ' + b,
            answer: answer,
            options: options
        });
    }
}

function showQuestion() {
    if (currentQuestion >= totalQuestions) {
        endGame();
        return;
    }
    
    // Update counter
    document.getElementById('questionCounter').innerText = 
        'Soal: ' + (currentQuestion + 1) + '/' + totalQuestions;
    document.getElementById('scoreDisplay').innerText = 'Skor: ' + score;
    
    // Tampilkan soal
    const q = questions[currentQuestion];
    document.getElementById('questionDisplay').innerText = q.text + ' = ?';
    currentAnswer = q.answer;
    
    // Tampilkan pilihan jawaban
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(btn);
    });
    
    // Reset timer
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    
    const timerBar = document.getElementById('timerBar');
    timerBar.style.width = '100%';
    timerBar.style.transition = 'none';
    
    setTimeout(() => {
        timerBar.style.transition = 'width 10s linear';
        timerBar.style.width = '0%';
    }, 10);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

function checkAnswer(answer) {
    clearInterval(timerInterval);
    
    if (answer === currentAnswer) {
        score++;
    }
    
    nextQuestion();
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < totalQuestions) {
        showQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    const gameArena = document.getElementById('gameArena');
    const gameResult = document.getElementById('gameResult');
    
    gameArena.classList.add('hidden');
    gameResult.classList.remove('hidden');
    
    document.getElementById('resultPlayer').innerText = '👤 ' + playerName;
    document.getElementById('resultScore').innerText = 'Skor: ' + score + '/' + totalQuestions;
    
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    if (score >= 4) {
        resultTitle.innerText = '✨ Selamat! ✨';
        resultMessage.innerText = 'Kamu hebat!';
    } else if (score >= 2) {
        resultTitle.innerText = '👍 Lumayan';
        resultMessage.innerText = 'Coba lagi biar lebih baik!';
    } else {
        resultTitle.innerText = '😢 Yahh...';
        resultMessage.innerText = 'Ayo coba lagi!';
    }
}

function backToMenu() {
    document.getElementById('gameMenu').classList.remove('hidden');
    document.getElementById('gameArena').classList.add('hidden');
    document.getElementById('gameResult').classList.add('hidden');
    document.getElementById('playerName').value = '';
    clearInterval(timerInterval);
}

// ========== PORTFOLIO ==========
let portfolioItems = [];
let currentPage = 1;
let itemsPerPage = 6;
let currentFilter = 'all';
let currentSearch = '';

function loadPortfolioItems() {
    showSkeleton(true);
    
    setTimeout(() => {
        const saved = localStorage.getItem('zizah_portfolioItems');
        if (saved) {
            portfolioItems = JSON.parse(saved);
        } else {
            // Data default karya seni
            portfolioItems = [
                {
                    id: '1',
                    category: 'lukisan',
                    title: 'Lukisan Pemandangan',
                    description: 'lukisan pemandangan gunung dengan cat air',
                    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format',
                    createdAt: Date.now() - 3000000
                },
                {
                    id: '2',
                    category: 'lukisan',
                    title: 'Potret Diri',
                    description: 'lukisan potret dengan pensil',
                    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format',
                    createdAt: Date.now() - 2000000
                },
                {
                    id: '3',
                    category: 'novel',
                    title: 'Cerita Misteri',
                    description: 'novel thriller misteri pembunuhan',
                    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format',
                    createdAt: Date.now() - 1000000
                },
                {
                    id: '4',
                    category: 'lukisan',
                    title: 'Abstrak',
                    description: 'lukisan abstrak dengan cat minyak',
                    image: 'https://images.unsplash.com/photo-1549490349-86433622e60d?w=500&auto=format',
                    createdAt: Date.now() - 4000000
                },
                {
                    id: '5',
                    category: 'novel',
                    title: 'Romansa Senja',
                    description: 'cerita romansa di sebuah desa',
                    image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=500&auto=format',
                    createdAt: Date.now() - 3500000
                },
                {
                    id: '6',
                    category: 'lukisan',
                    title: 'Still Life',
                    description: 'lukisan buah-buahan',
                    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad1b119?w=500&auto=format',
                    createdAt: Date.now() - 4500000
                }
            ];
            savePortfolioItems();
        }
        showSkeleton(false);
        renderPortfolioItems();
    }, 500);
}

function showSkeleton(show) {
    const skeleton = document.getElementById('portfolioSkeleton');
    const grid = document.getElementById('portfolioGrid');
    if (skeleton && grid) {
        if (show) {
            skeleton.classList.remove('hidden');
            grid.innerHTML = '';
        } else {
            skeleton.classList.add('hidden');
        }
    }
}

function savePortfolioItems() {
    localStorage.setItem('zizah_portfolioItems', JSON.stringify(portfolioItems));
}

function filterAndSortItems() {
    let filtered = [...portfolioItems];
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.category === currentFilter);
    }
    
    if (currentSearch) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
            item.description.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }
    
    // Sort by newest
    filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    return filtered;
}

function renderPortfolioItems() {
    const grid = document.getElementById('portfolioGrid');
    const stats = document.getElementById('portfolioStats');
    const pagination = document.getElementById('portfolioPagination');
    if (!grid) return;
    
    const filtered = filterAndSortItems();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filtered.slice(start, end);
    
    if (stats) {
        stats.innerHTML = `menampilkan ${paginatedItems.length} dari ${totalItems} karya`;
    }
    
    if (totalItems === 0) {
        grid.innerHTML = `
            <div class="empty-state-mini">
                <p>belum ada karya</p>
            </div>
        `;
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    paginatedItems.forEach(item => {
        html += `
            <div class="portfolio-item-mini" data-id="${item.id}">
                <div class="portfolio-image-mini">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format'">
                </div>
                <div class="portfolio-info-mini">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <span class="portfolio-category">${item.category}</span>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    
    if (pagination) {
        renderPagination(totalPages);
    }
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('portfolioPagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<button disabled>...</button>`;
        }
    }
    
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    
    pagination.innerHTML = html;
}

window.changePage = function(page) {
    const filtered = filterAndSortItems();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderPortfolioItems();
    window.scrollTo({ top: document.getElementById('portfolioGrid').offsetTop - 100, behavior: 'smooth' });
}

function initSearchAndSort() {
    const searchInput = document.getElementById('searchPortfolio');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value;
            currentPage = 1;
            renderPortfolioItems();
        });
    }
}

function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-chip');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1;
            renderPortfolioItems();
        });
    });
}

// ========== POPSTATE ==========
window.addEventListener('popstate', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    } else {
        showSection('home');
    }
});