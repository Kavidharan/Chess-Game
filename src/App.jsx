import { createContext } from "react";
import "./App.css";
import Chessboard from "./assets/chessboard"
import data from "./assets/pieces.json";
export const Pieces = createContext();

function App() {
  return (
    <>
      <div className="container">
        <div className="nav">
          <h2>Chess Game</h2>
        </div>
        <div className="chess">
          <Pieces.Provider value={data}>
            <Chessboard />
          </Pieces.Provider>
        </div>
      </div>
    </>
  )
}

export default App;
