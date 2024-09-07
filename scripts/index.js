async function main() {
    const game = await setUpGame();
    game.start();
}

document.addEventListener('DOMContentLoaded', main);