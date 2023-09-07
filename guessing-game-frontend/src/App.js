import React, { useState } from "react";
import Confetti from 'react-confetti';
import "./App.css";

function App() {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");
  const [correctNumber, setCorrectNumber] = useState("");
  const [guessHistory, setGuessHistory] = useState([]);
  const [remainingGuesses, setRemainingGuesses] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleGuess = async () => {
    if (remainingGuesses === 0) {
      setMessage(`Out of guesses.The correct number was ${number}. Restart the game.`);
      return;
    }

    const parsedGuess = parseInt(guess);
    if (isNaN(parsedGuess) || parsedGuess < 1 || parsedGuess > 10) {
    setMessage("Please enter a valid number between 1 and 10.");
    return;
  }
    console.log("Sending request to:", "http://localhost:5000/guess");
    console.log("Request data:", JSON.stringify({ guess: parsedGuess }));
    
    const response = await fetch("http://localhost:5000/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guess: parsedGuess }),
    });
  
    const data = await response.json();
    if (data.message.includes("Congratulations")) {
      setShowCelebration(true); // Show the celebration animation after a correct guess
      setCorrectNumber(data.number);
    }
    
    setGuessHistory([...guessHistory, parsedGuess]);
    setMessage(data.message);
    setRemainingGuesses(remainingGuesses - 1);
    setNumber(data.number);

    if (remainingGuesses === 1) {
      setMessage(`Out of guesses. The correct number was ${number}. The game is over.`);
    }
  };

  const restartGame = () => {
    setGuess("");
    setMessage("");
    setNumber("");
    setCorrectNumber("");
    setGuessHistory([]);
    setRemainingGuesses(3);
    setShowCelebration(false);
  };

  return (
    <div className="App">
      <h1>Guessing Random Number Game</h1>
      <p>Can you guess the correct number?</p>
      
      <label>
        Enter your guess  :-  
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={remainingGuesses === 0}
        />
      </label>
      <button onClick={handleGuess} disabled={remainingGuesses === 0}>Guess</button>
      
      <p className="message">{message}</p>
      
      {number && (
        <div>
          <p className="number">The number was {number}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}

      {remainingGuesses === 0 && correctNumber === null &&(
        <div>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}

      <div>
        <h2>Guess History:</h2>
        <ul>
          {guessHistory.map((guess, index) => (
            <li key={index}>Guess #{index + 1}: {guess}</li>
          ))}
        </ul>
      </div>
      {showCelebration && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={1000}
          recycle={false}
          colors={['#FFD700', '#FF4500', '#00FF00']}
        />
      )}
    </div>
  );
}

export default App;
