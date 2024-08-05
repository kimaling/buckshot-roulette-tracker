document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            EventHandlers.updateInput(this);
        });
    });

    const burnerPhoneModal = document.getElementById('burnerPhoneModal');
    burnerPhoneModal.addEventListener('openstart', () => {
        document.removeEventListener('keydown', EventHandlers.handleKeydown);
    });
    burnerPhoneModal.addEventListener('closeend', () => {
        document.addEventListener('keydown', EventHandlers.handleKeydown);
    });

    document.addEventListener('keydown', EventHandlers.handleKeydown);

    document.getElementById('bulletContainer').addEventListener('click', function(e) {
        const bulletElement = e.target.closest('.bullet');
        if (bulletElement) {
            const index = parseInt(bulletElement.dataset.index);
            console.log("Bullet clicked:", index);
            EventHandlers.handleBulletClick(e, index);
        }
    });

    document.getElementById('applyBurnerPhone').addEventListener('click', applyBurnerPhoneInfo);

    document.getElementById('burnerPhoneTurnsAhead').addEventListener('input', function(e) {
        console.log("Turns ahead changed:", e.target.value);
    });

    // Initialize game state
    resetGame();
});