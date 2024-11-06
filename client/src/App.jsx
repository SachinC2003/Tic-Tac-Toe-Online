import { useEffect, useState } from 'react';
import './App.css';
import { Square } from './components/Square';
import io from 'socket.io-client';
import Swal from 'sweetalert2';

function App() {
  const renderForm = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const [gameStatus, setGameStatus] = useState(renderForm);
  const [currentPlayer, setCurrentPlayer] = useState('circle');
  const [finishState, setFinishState] = useState(false);
  const [winnerP, setWinnerP] = useState('');
  const [draw, setDraw] = useState(false);
  const [finishStateArray, setFinishStateArray] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [opponent, setOpponent] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [rematch, setRematch] = useState(false)

  useEffect(() => {
    if (socket) {
      socket.on('opponent-move', (data) => {
        setGameStatus(data.newGameStatus);
        setCurrentPlayer(data.nextPlayer);
        setIsMyTurn(true);
      });

      socket.on('opponent-connected', (data) => {
        setOpponent(data.opponentName);
        setRoomId(data.roomId);
        setWaiting(false);
        setIsMyTurn(data.startFirst);
      });

      socket.on('waiting_for_opponent', () => {
        setWaiting(true);
      });

      socket.on('rematch_start', () => {
        // Reset the game state
        setGameStatus(renderForm);
        setFinishState(false);
        setWinnerP('');
        setDraw(false);
        setCurrentPlayer(Math.random() < 0.5 ? 'circle' : 'cross'); // Randomly decide who starts first
        setFinishStateArray([]);
        setIsMyTurn(currentPlayer === 'circle' ? 'circle' : 'cross'); // Reset player turns
    });


      socket.on('connect', () => {
        console.log('Connected to the server');
      });

      return () => {
        socket.off('opponent-move');
        socket.off('opponent-connected');
        socket.off('waiting_for_opponent');
        socket.off('rematch_start');
        socket.off('connect');
      };
    }
  }, [socket]);

  const checkWinner = () => {
    for (let row = 0; row < gameStatus.length; row++) {
      if (gameStatus[row][0] === gameStatus[row][1] && gameStatus[row][0] === gameStatus[row][2]) {
        setFinishStateArray([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameStatus[row][0];
      }
    }

    for (let col = 0; col < gameStatus.length; col++) {
      if (gameStatus[0][col] === gameStatus[1][col] && gameStatus[1][col] === gameStatus[2][col]) {
        setFinishStateArray([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameStatus[0][col];
      }
    }

    if (gameStatus[0][0] === gameStatus[1][1] && gameStatus[0][0] === gameStatus[2][2]) {
      setFinishStateArray([0, 4, 8]);
      return gameStatus[0][0];
    }

    if (gameStatus[0][2] === gameStatus[1][1] && gameStatus[0][2] === gameStatus[2][0]) {
      setFinishStateArray([2, 4, 6]);
      return gameStatus[0][2];
    }

    const isDrawMatch = gameStatus.flat().every((e) => e === 'circle' || e === 'cross');
    if (isDrawMatch) {
      setDraw(true);
      return 'draw';
    }

    return null;
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setFinishState(true);
      setWinnerP(winner);
    }
  }, [gameStatus]);

  const handleRematchClick = () => {
    setGameStatus(renderForm);
    setFinishState(false);
    setWinnerP('');
    setDraw(false);
    setCurrentPlayer(Math.random() < 0.5 ? 'circle' : 'cross');
    setFinishStateArray([]);
    setIsMyTurn(currentPlayer === 'circle' ? 'circle' : 'cross');

    if (socket && roomId) {
        socket.emit('start_rematch', { roomId });
    }
};

  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: 'Enter your name',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
    });

    return result;
  };

  const PlayOnlineclick = async () => {
    const result = await takePlayerName();

    if (!result.isConfirmed) {
      return;
    }

    const username = result.value;
    setPlayerName(username);

    const newSocket = io(import.meta.env.VITE_REACT_APP_SERVER_URL || 'http://localhost:3000', {
      autoConnect: true,
    });

    newSocket.emit('join_game', {
      playerName: username,
    });

    setSocket(newSocket);
    setPlayOnline(true);
  };


  const handleSquareClick = (index) => {
    if (!isMyTurn || finishState || gameStatus[Math.floor(index / 3)][index % 3] !== index + 1) {
      return;
    }
    
    const newGameStatus = gameStatus.map(row => [...row]);
    newGameStatus[Math.floor(index / 3)][index % 3] = currentPlayer;
    setGameStatus(newGameStatus);

    const nextPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    setCurrentPlayer(nextPlayer);
    setIsMyTurn(false);

    if (socket && roomId) {
      socket.emit('player-move', { roomId, newGameStatus, nextPlayer });
    }
  };

  if (!playOnline) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={PlayOnlineclick}
          className="bg-yellow-300 text-black font-bold text-2xl px-8 py-4 rounded-lg shadow-md"
        >
          Play Online
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center">
      <div className="w-1/2 flex flex-col items-center justify-center">
        {waiting && <div className='text-white font-bold text-2xl px-8 py-4 rounded-lg shadow-md'>Waiting for Opponent...</div>}
        {opponent && (
          <>
            <div className='w-80 h-10 mb-4 flex justify-between'>
              <div className="w-20 bg-red-300 flex items-center justify-center rounded-tl-3xl rounded-br-3xl">
                {playerName}
              </div>
              <div className="w-20 bg-red-300 flex items-center justify-center rounded-tl-3xl rounded-br-3xl">
                {opponent}
              </div>
            </div>
            <div className="text-2xl pt-2 pb-2 font-bold bg-slate-600 w-80 text-center rounded-lg text-white">
              Tic Tac Toe
            </div>
            
            <div className="grid grid-cols-3 gap-2 w-80 mt-5">
              {renderForm.flat().map((value, index) => (
                <Square 
                  key={index} 
                  id={index}
                  gameStatus={gameStatus}
                  currentPlayer={currentPlayer}
                  finishState={finishState}
                  finishStateArray={finishStateArray}
                  onClick={() => handleSquareClick(index)}
                  disabled={!isMyTurn}
                />
              ))}
            </div>
            {winnerP ? (
              winnerP === 'draw' ? (
                <div className="mt-6 text-lg font-bold">It's a Draw!</div>
              ) : (
                <div className="mt-6 text-lg font-bold">
                  {isMyTurn ? "You Lose The Game" : "Congratulation......!   You Win The Game"}
                </div>
              )
            ) : (
              <p className="mt-6 text-lg font-bold">
                {isMyTurn ? "Your turn" : "Opponent's turn"}
              </p>
            )}
            {winnerP && (
              <button onClick={handleRematchClick} className="mt-4 bg-blue-500 text-white px-3 py-1 rounded">
                Rematch
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
