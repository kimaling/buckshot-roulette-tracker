window.EventHandlers = {
    handleBulletClick: function(e, index) {
        console.log("Bullet clicked:", index);

        if (!fixMode && index !== currentTurn - 1) return;
        if (!fixMode && bullets[currentTurn - 1].locked) {
            currentTurn = Math.min(currentTurn + 1, bullets.length);
            drawBullets();
            return;
        }

        const rect = e.target.closest('.bullet').getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickPosition = clickX / width;

        const displayProb = getDisplayProbability();
        if (displayProb) {
            if (clickPosition < 0.5 && displayProb.live === 0) return;
            if (clickPosition >= 0.5 && displayProb.blank === 0) return;
        }

        const currentBullet = bullets[index];
        let newState;

        if (clickPosition < 0.5) {
            newState = currentBullet.inverterUsed ? 'blank' : 'live';
        } else {
            newState = currentBullet.inverterUsed ? 'live' : 'blank';
        }

        toggleBulletState(index, newState);
    },

    handleKeydown: function(e) {
        if (e.key === 'R' || e.key === 'r') {
            e.preventDefault();
            resetGame();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            changeTurn(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            changeTurn(1);
        } else if (e.key === 'I' || e.key === 'i') {
            e.preventDefault();
            toggleInverter();
        } else if (e.key === 'F' || e.key === 'f') {
            e.preventDefault();
            toggleFixMode();
        } else if (e.key === 'C' || e.key === 'c') {
            e.preventDefault();
            flipCoin();			
        } else if (e.key === 'B' || e.key === 'b') {
            e.preventDefault();
            const modal = M.Modal.getInstance(document.getElementById('burnerPhoneModal'));
            modal.open();
        } 
    },

    updateInput: function(input) {
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        if (!isNaN(value) && value >= min && value <= max) {
            console.log("Input updated:", input.id, value);
            const inputs = ['liveRounds', 'blankRounds'];
            const currentIndex = inputs.indexOf(input.id);
            if (currentIndex < inputs.length - 1) {
                document.getElementById(inputs[currentIndex + 1]).focus();
            } else {
                input.blur();
            }
            this.checkAllFieldsFilled();
        } else {
            input.value = '';
        }
    },

    checkAllFieldsFilled: function() {
        const liveRounds = parseInt(document.getElementById('liveRounds').value) || 0;
        const blankRounds = parseInt(document.getElementById('blankRounds').value) || 0;

        if (liveRounds && blankRounds) {
            const oldTotalBullets = bullets.length;
            const newTotalBullets = liveRounds + blankRounds;

            totalLive = liveRounds;
            totalBlank = blankRounds;
            remainingLive = liveRounds;
            remainingBlank = blankRounds;

            if (newTotalBullets > oldTotalBullets) {
                for (let i = oldTotalBullets; i < newTotalBullets; i++) {
                    bullets.push({ state: 'unknown', inverterUsed: false, locked: false });
                }
            } else if (newTotalBullets < oldTotalBullets) {
                bullets = bullets.slice(0, newTotalBullets);
            }

            currentTurn = Math.min(currentTurn, newTotalBullets);
            lastNormalTurn = Math.min(lastNormalTurn, newTotalBullets);

            drawBullets();
            updateRemainingCounts();
        }
    }
};