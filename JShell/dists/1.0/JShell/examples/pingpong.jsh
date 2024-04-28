function pingPong() {
    let userInput = prompt("Enter 'ping' to play!"); // Initial prompt to user
    console.log(userInput);
    while (userInput == "ping" && userInput.toLowerCase() !== "end") { // Continue as long as user inputs 'ping' or 'end'
        console.log("Pong");
        setTimeout(function() {
            userInput = prompt(); // Prompt again for 'ping' or 'end'
            console.log(userInput);
        }, 500); // 500 milliseconds = 0.5 seconds
    }

    console.log("**Game Over!**"); // Display game over message when 'end' or another thing is entered.
}

pingPong(); // Call the function to start the game
