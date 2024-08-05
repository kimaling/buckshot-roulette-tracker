function flipCoin() {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    const resultElement = document.getElementById("coinResult");

    const shootYourselfMessages = [
        "embracing the grip of fate.",
        "the darkness closes in.",
        "surrender to the inevitable.",
        "there's no escape.",
        "silence the pain.",
        "face the void.",
        "shadows consume.",
        "meet your maker.",
        "fate's cruel twist.",
        "the end of the line.",
        "there's no turning back.",
        "destiny's final act.",
        "it's written in the stars.",
        "the end awaits.",
        "face your fate.",
        "the final curtain.",
        "a whispered hope.",
        "death’s cruel dice.",
        "fate’s empty promise.",
        "the silent click.",
        "a breath of mercy.",
        "dance with despair.",
        "roulette’s cruel jest.",
        "the final spin.",
        "a desperate wish.",
        "the void beckons.",
        "a flicker of hope.",
        "fate’s tight grip.",
        "darkness or light?",
        "a gambler’s breath."
    ];

    const shootDealerMessages = [
        "sealing a cruel destiny.",
        "justice is served.",
        "end their tyranny.",
        "fate's cruel hand.",
        "the end of their line.",
        "no mercy shown.",
        "silence the chaos.",
        "justice awaits.",
        "balance restored.",
        "destiny fulfilled.",
        "the end is near.",
        "seal their fate.",
        "darkness consumes.",
        "no more games.",
        "justice demands it.",
        "the end is here.",
        "fate's decision.",
        "the final judgment.",
        "the darkness ends.",
        "retribution.",
        "destiny's decree.",
        "their time is up.",
        "fate's final act.",
        "the end of chaos.",
        "justice calls.",
        "no more lies.",
        "the final end.",
        "balance achieved.",
        "the last stand.",
        "fate's justice."
    ];

    const message = result === "Heads" 
        ? `<span class="shoot-dealer">Shoot the dealer,</span> ${shootDealerMessages[Math.floor(Math.random() * shootDealerMessages.length)]}`
        : `<span class="shoot-yourself">Shoot yourself,</span> ${shootYourselfMessages[Math.floor(Math.random() * shootYourselfMessages.length)]}`;

    resultElement.innerHTML = message;
    resultElement.classList.remove("fadeIn");
    void resultElement.offsetWidth; // Force reflow for animation
    resultElement.classList.add("fadeIn");
}
