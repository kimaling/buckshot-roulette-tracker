let totalLive = 0;
let totalBlank = 0;
let remainingLive = 0;
let remainingBlank = 0;
let currentTurn = 1;
let lastNormalTurn = 1;
let bullets = [];
let fixMode = false;

function calculateTrueProbability() {
    const totalRemaining = remainingLive + remainingBlank;
    
    if (totalRemaining === 0) return null;
    
    const liveProbability = (remainingLive / totalRemaining) * 100;
    const blankProbability = (remainingBlank / totalRemaining) * 100;
    
    return {
        live: liveProbability,
        blank: blankProbability
    };
}

function getDisplayProbability() {
    const trueProbability = calculateTrueProbability();
    if (!trueProbability) return null;

    const nextUnknownBullet = bullets.find(bullet => bullet.state === 'unknown');
    if (nextUnknownBullet && nextUnknownBullet.inverterUsed) {
        return {
            live: trueProbability.blank,
            blank: trueProbability.live
        };
    }
    return trueProbability;
}

function toggleBulletState(index, newState = null) {
    if (fixMode && index !== currentTurn - 1) return;
    if (fixMode && !bullets[index].lockedBeforeFixMode) return;
    if (bullets[index].locked && !fixMode) return;
    
    const bullet = bullets[index];
    const oldState = bullet.state;
    
    if (newState) {
        bullet.state = newState;
    } else {
        if (oldState === 'unknown') {
            bullet.state = 'live';
        } else if (oldState === 'live') {
            bullet.state = 'blank';
        } else {
            bullet.state = 'unknown';
        }
    }

    if (oldState === 'unknown' && bullet.state !== 'unknown') {
        if (bullet.state === 'live') remainingLive--;
        else if (bullet.state === 'blank') remainingBlank--;
    }

    updateRemainingCounts();
    
    if (index === currentTurn - 1 && bullet.state !== 'unknown' && !fixMode) {
        currentTurn = Math.min(currentTurn + 1, bullets.length);
        bullet.locked = true;
    }
    
    drawBullets();
}



function drawBullets() {
    console.log("drawBullets called");
    const container = document.getElementById('bulletContainer');
    container.innerHTML = '';
    const displayProbabilities = getDisplayProbability();
    
    bullets.forEach((bullet, index) => {
        const bulletElement = document.createElement('div');
        let displayState = bullet.state;
        if (bullet.locked && bullet.inverterUsed) {
            if (displayState === 'live') displayState = 'blank';
            else if (displayState === 'blank') displayState = 'live';
        }
        bulletElement.className = `bullet ${displayState}`;
        bulletElement.dataset.index = index;
        if (index === currentTurn - 1) bulletElement.classList.add('current');
        if (bullet.inverterUsed) bulletElement.classList.add('inverter-used');
        if (bullet.locked) bulletElement.classList.add('locked');
        if (fixMode && bullet.locked) bulletElement.classList.add('unlocked');
        
        const inverterBadge = document.createElement('div');
        inverterBadge.className = 'inverter-badge';
        
        const lockIcon = document.createElement('i');
        lockIcon.className = 'material-icons lock-icon';
        lockIcon.textContent = fixMode && bullet.locked ? 'lock_open' : 'lock';
        
        bulletElement.appendChild(inverterBadge);
        bulletElement.appendChild(lockIcon);
        
        if (displayProbabilities && bullet.state === 'unknown' && index === bullets.findIndex(b => b.state === 'unknown')) {
            const probContainer = document.createElement('div');
            probContainer.className = 'prob-container';
            
            const liveProbElement = document.createElement('div');
            liveProbElement.className = 'probability live-prob';
            liveProbElement.textContent = displayProbabilities.live.toFixed(1) + '%';
            
            const blankProbElement = document.createElement('div');
            blankProbElement.className = 'probability blank-prob';
            blankProbElement.textContent = displayProbabilities.blank.toFixed(1) + '%';
            
            probContainer.appendChild(liveProbElement);
            probContainer.appendChild(blankProbElement);
            bulletElement.appendChild(probContainer);
        }
        
        container.appendChild(bulletElement);
    });
    document.getElementById('turnCounter').textContent = currentTurn;
    document.querySelector('.turn-container').style.display = fixMode ? 'flex' : 'none';
}

function toggleInverter() {
    const currentBullet = bullets[currentTurn - 1];
    currentBullet.inverterUsed = !currentBullet.inverterUsed;
    drawBullets();
    
    M.toast({
        html: `Inverter ${currentBullet.inverterUsed ? 'activated' : 'deactivated'} for current bullet.`,
        displayLength: 1500,
        classes: 'rounded'
    });
}

function resetGame() {
    document.getElementById('liveRounds').value = '';
    document.getElementById('blankRounds').value = '';
    document.getElementById('liveRounds').focus();
    bullets = [];
    totalLive = 0;
    totalBlank = 0;
    remainingLive = 0;
    remainingBlank = 0;
    currentTurn = 1;
    lastNormalTurn = 1;
    fixMode = false;
    drawBullets();
    updateRemainingCounts();
    M.updateTextFields();
    document.querySelector('.fix-mode-indicator').classList.remove('active');
}

function toggleFixMode() {
    fixMode = !fixMode;
    const fixModeIndicator = document.querySelector('.fix-mode-indicator');
    const turnContainer = document.querySelector('.turn-container');
    if (fixMode) {
        bullets.forEach(bullet => {
            bullet.lockedBeforeFixMode = bullet.locked;
        });
        fixModeIndicator.classList.add('active');
        turnContainer.style.display = 'flex';
        lastNormalTurn = currentTurn;
        M.toast({html: 'Fix mode activated.', displayLength: 1500, classes: 'rounded'});
    } else {
        fixModeIndicator.classList.remove('active');
        turnContainer.style.display = 'none';
        currentTurn = lastNormalTurn;
        M.toast({html: 'Fix mode deactivated.', displayLength: 1500, classes: 'rounded'});
    }
    drawBullets();
}

function toggleBulletState(index, newState = null) {
    if (fixMode && index !== currentTurn - 1) return;
    if (fixMode && !bullets[index].lockedBeforeFixMode) return;
    if (bullets[index].locked && !fixMode) return;
    
    const bullet = bullets[index];
    const oldState = bullet.state;
    
    if (newState) {
        bullet.state = newState;
    } else {
        if (oldState === 'unknown') {
            bullet.state = 'live';
        } else if (oldState === 'live') {
            bullet.state = 'blank';
        } else {
            bullet.state = 'unknown';
        }
    }

    if (oldState === 'unknown' && bullet.state !== 'unknown') {
        if (bullet.inverterUsed) {
            if (bullet.state === 'live') remainingBlank--;
            else if (bullet.state === 'blank') remainingLive--;
        } else {
            if (bullet.state === 'live') remainingLive--;
            else if (bullet.state === 'blank') remainingBlank--;
        }
    }

    updateRemainingCounts();
    
    if (index === currentTurn - 1 && bullet.state !== 'unknown' && !fixMode) {
        currentTurn = Math.min(currentTurn + 1, bullets.length);
        bullet.locked = true;
    }
    
    drawBullets();
}

function updateRemainingCounts() {
    let countedLive = 0;
    let countedBlank = 0;
    
    bullets.forEach(bullet => {
        if (bullet.state === 'live') {
            countedLive++;
        } else if (bullet.state === 'blank') {
            countedBlank++;
        }
    });
    
    remainingLive = Math.max(0, totalLive - countedLive);
    remainingBlank = Math.max(0, totalBlank - countedBlank);
    
    document.getElementById('remainingLive').textContent = `${remainingLive}/${totalLive}`;
    document.getElementById('remainingBlank').textContent = `${remainingBlank}/${totalBlank}`;
}

function applyBurnerPhoneInfo() {
    const bulletType = document.getElementById('burnerPhoneBulletType').value;
    const turnsAhead = parseInt(document.getElementById('burnerPhoneTurnsAhead').value);

    const targetTurnIndex = currentTurn + turnsAhead - 2;

    if (turnsAhead && targetTurnIndex < bullets.length) {
        bullets[targetTurnIndex].state = bulletType;
        bullets[targetTurnIndex].locked = true;
        updateRemainingCounts();

        drawBullets();

        M.toast({
            html: `Burner Phone: ${bulletType} bullet ${turnsAhead} turn(s) ahead.`,
            displayLength: 1500,
            classes: 'rounded'
        });
    } else {
        M.toast({
            html: 'Invalid Burner Phone information.',
            displayLength: 1500,
            classes: 'rounded'
        });
    }

    const modal = M.Modal.getInstance(document.getElementById('burnerPhoneModal'));
    modal.close();
}

function changeTurn(delta) {
    if (!fixMode) return;
    currentTurn = Math.max(1, Math.min(currentTurn + delta, bullets.length));
    drawBullets();
}

