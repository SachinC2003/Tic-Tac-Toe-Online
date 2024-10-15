/*import { useEffect, useState } from 'react';
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
  const [playOnline, setPlayOnline] = useState(true);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [opponent, setOpponent] = useState(null);

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

  useEffect(() => {
    if (socket) {
      socket.on('opponent-move', (data) => {
        setGameStatus(data.newGameStatus);
        setCurrentPlayer(data.nextPlayer);
      });

      socket.on('connect', () => {
        setPlayOnline(false);
        console.log('Connected to the server');
      });

      return () => {
        socket.off('opponent-move');
        socket.off('connect');
      };
    }
  }, [socket]);

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

    const newSocket = io('http://localhost:3000', {
      autoConnect: true,
    });

    newSocket.emit('request_to_play', {
      playerName: username,
    });

    setSocket(newSocket);
  };

  if (playOnline) {
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

  if(playOnline && !opponent){
    return <div>
      Waiting for Apponent
    </div>
  }

  return (
    <div className="h-screen flex justify-center">
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className='w-80 h-10 mb-4 flex justify-between'>
            <div className="w-20 bg-red-300 flex items-center justify-center">
              left
            </div>
            <div className="w-20 bg-red-300 flex items-center justify-center">
              right
            </div>
        </div>
        <div className="pt-2 pb-2 bg-slate-600 w-80 text-center rounded-lg text-white">
          Tic Tac Toe
        </div>
        
        <div className="grid grid-cols-3 gap-2 w-80 mt-5">
          {renderForm.flat().map((value, index) => (
            <Square 
              key={index} 
              id={index}
              gameStatus={gameStatus}
              setGameStatus={setGameStatus}
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
              finishState={finishState}
              finishStateArray={finishStateArray}
            />
          ))}
        </div>
        {winnerP ? (
          winnerP === 'draw' ? (
            <div className="mt-6 text-lg font-bold">It's a Draw!</div>
          ) : (
            <div className="mt-6 text-lg font-bold">Winner: {winnerP === 'circle' ? 'O' : 'X'}</div>
          )
        ) : (
          <p className="mt-6">Current player: {currentPlayer === 'circle' ? 'O' : 'X'}</p>
        )}
      </div>
    </div>
  );
}

export default App;*/
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

  useEffect(() => {
    if (socket) {
      socket.on('opponent-move', (data) => {
        setGameStatus(data.newGameStatus);
        setCurrentPlayer(data.nextPlayer);
      });

      socket.on('opponent-connected', (data) => {
        setOpponent(data.opponentName);
        setRoomId(data.roomId);
        setWaiting(false);
      });

      socket.on('waiting_for_opponent', () => {
        setWaiting(true);
      });

      socket.on('connect', () => {
        console.log('Connected to the server');
      });

      return () => {
        socket.off('opponent-move');
        socket.off('opponent-connected');
        socket.off('waiting_for_opponent');
        socket.off('connect');
      };
    }
  }, [socket]);

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

    const newSocket = io('http://localhost:3000', {
      autoConnect: true,
    });

    newSocket.emit('join_game', {
      playerName: username,
    });

    setSocket(newSocket);
    setPlayOnline(true);
  };

  const handleSquareClick = (index) => {
    if (finishState || gameStatus[Math.floor(index / 3)][index % 3] !== index + 1) {
      return;
    }

    const newGameStatus = gameStatus.map(row => [...row]);
    newGameStatus[Math.floor(index / 3)][index % 3] = currentPlayer;
    setGameStatus(newGameStatus);

    const nextPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    setCurrentPlayer(nextPlayer);

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
              <div className="w-20 bg-red-300 flex items-center justify-center">
                {playerName}
              </div>
              <div className="w-20 bg-red-300 flex items-center justify-center">
                {opponent}
              </div>
            </div>
            <div className="pt-2 pb-2 bg-slate-600 w-80 text-center rounded-lg text-white">
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
                />
              ))}
            </div>
            {winnerP ? (
              winnerP === 'draw' ? (
                <div className="mt-6 text-lg font-bold">It's a Draw!</div>
              ) : (
                <div className="mt-6 text-lg font-bold">Winner: {winnerP === 'circle' ? 'O' : 'X'}</div>
              )
            ) : (
              <p className="mt-6 text-lg font-bold">Current player: {currentPlayer === 'circle' ? 'O' : 'X'}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
