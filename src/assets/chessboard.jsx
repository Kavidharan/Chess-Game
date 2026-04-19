import React, {useContext, useEffect, useState} from 'react'
import { Pieces } from '../App'
import he from "he"
import Points from "./points"
import "./chessboard.css"


const chessboard= () =>{
  const [piece,setPiece] = useState({id:{}});
  const [move,setmove] = useState(0);
  const [check,setCheck] = useState({White:{rook:[],bishop:[],knigt:[]},Black:{rook:[],bishop:[],knigt:[]}});

  const [checks,setChecks] = useState(false);
  let checkMade = false; 


  const horizontal=['a','b','c','d','e','f','g','h'];
  const vertical =['1','2','3','4','5','6','7','8'];
  let allMovements = [];
  
  horizontal.map((hor) =>{
    vertical.map((ve) =>{
      allMovements = [...allMovements,hor+ve];
    })
  })

  const data = useContext(Pieces);
  const keys=Object.keys(data);

  let allColumn=[];
  function allPiecesClass(){
    const locations = document.querySelector(".piecesCheck");           //select tabel name locasons
    const location = locations.querySelectorAll("tr")                    //selact all tabel rows name locson
    for(let a of location){
      allColumn=[...allColumn,a.querySelectorAll("td")];
    }    
    return location;
  }
  
  useEffect(() =>{
    allMovements.map((p) => {
      if(p.includes("2") || p.includes("7") || p.includes("e1") || p.includes("e8")){
        setPiece(prev => ({...prev,id:{...prev.id,[`${p}`]:{move:0}}}));
      }
      if(p.includes("h1") || p.includes("a1") || p.includes("h8") || p.includes("a8")){
        setPiece(prev => ({...prev,id:{...prev.id,[`${p}`]:{move:0}}}));
      }
    });
    for (let a of horizontal){
      for (let b of vertical){
        let cColor = document.querySelector("#"+a+b);
        if (vertical.indexOf(b) % 2 == 0){
          if (horizontal.indexOf(a) % 2 == 0){
            cColor.bgColor = "#404040"
          }else
            cColor.bgColor = "#BFBFBF"
        }else{
          if (horizontal.indexOf(a) % 2 != 0){
            cColor.bgColor = "#404040"
          }else{
            cColor.bgColor = "#BFBFBF"
          }
        }
      }
    }
  },[]);

  useEffect(() =>{
    allMovements.map((m) => {
      let all = document.querySelector("#"+m);
      let name = all.className.split(" ")[0];
      keys.includes(name) ? all.textContent = he.decode(data[name]) : "";   
    });  

    // find the checks
    let color = ["White","Black"];
    color.map((c) => {
      let king = document.querySelector("."+ c +"_King");
      let kingId = [horizontal.indexOf(king.id.split("")[0]),vertical.indexOf(king.id.split("")[1])];
      
      let [,r] = RookMove("",kingId[0],kingId[1]);
      setCheck(perv => ({...perv,[`${c}`]:{...perv[`${c}`],rook:r}}));

      let [,b] = BishopMove("",kingId[0],kingId[1]);
      setCheck(perv => ({...perv,[`${c}`]:{...perv[`${c}`],bishop:b}}));

      let [k] = KnigtMove("",kingId[0],kingId[1]);
      setCheck(perv => ({...perv,[`${c}`]:{...perv[`${c}`],knigt:k}}));
    });
  },[move]);

  function Check(){
    if (move % 2 == 0){
      //rook
      for (let direction of check.Black.rook){
        for (let Rook of direction){
          let contitison = document.querySelector("#"+Rook);
          if (contitison.className.split(" ")[0] == "White_Rook"){
            let king = document.querySelector(".Black_King");
            king.className = king.className + " covercheck";
          }
        }
      }
    }
  }

  function piecesClick (e){
    allColumn.splice(8);
    const piecesClass = e.className.split(" ")
    const piece = piecesClass[0].split("_")[1];
    const color = piecesClass[0].split("_")[0];

    const pieceid = e.id;
    const indexOfA = horizontal.indexOf(pieceid.split("")[0]);
    const indexOfD = vertical.indexOf(pieceid.split("")[1]);
  
      if (allMovements.includes(piecesClass[piecesClass.length -1])){
        allMovements.map((al) => {
          let alterMove = document.querySelector("#"+al);
          let remo = alterMove.className.split(" ");
          remo = remo.map((am) => am == "move" ? "" : am);
          remo = remo.map((am) => am == piecesClass[piecesClass.length-1] ? "" : am);
          alterMove.className = remo.join(" ").trimStart();
        })
        Move(e,piecesClass[piecesClass.length - 1]);

      }else{
        for (let all of allMovements){
          let allMove = document.querySelector("#"+all);
          let allRemov = allMove.className.split(" ");
          allRemov = allRemov.map((ar) => ar == "move" ? "" : ar );
          allRemov = allRemov.map((ar) => ar == "select" ? "" : ar)
          allRemov = allRemov.map((ar) => allMovements.includes(ar) ? "" : ar);
          allMove.className = allRemov.join(" ").trimStart();
        }
        if (move % 2 == 0 && color == "White"){
          if(piecesClass.length == 3){
            piecesClass.splice(2);
            e.className = piecesClass.join(" ");
          }else{
            if (piecesClass != ""){
              piecesClass.push("select")
              e.className = piecesClass.join(" ")
            }
          }
        }

        if (move % 2 == 1 && color == "Black"){
          if(piecesClass.length == 3){
            piecesClass.splice(2);
            e.className = piecesClass.join(" ");
          }else{
            if (piecesClass != ""){
              piecesClass.push("select")
              e.className = piecesClass.join(" ")
            }
          }
        }

        switch (piece){
          case "Rook":
            RookMove(e,indexOfA,indexOfD,color);
            break;
          case "Knight":
            KnigtMove(e,indexOfA,indexOfD,color);
            break;
          case "Bishop":
            BishopMove(e,indexOfA,indexOfD,color);
            break;
          case "Queen":
            QueenMove(e,indexOfA,indexOfD,color);
            break;
          case "King":
            KingMove(e,indexOfA,indexOfD,color);
            break;
          case "Pawn":
            PawnMove(e,indexOfA,indexOfD,color);
            break;
        }
      }  
    

  }

  function RookMove(e,indexOfA,indexOfD,color){
    
    let locationOfRook = [];
    let directions= [[],[],[],[]];
    
    for (let i = 1; horizontal.length - (indexOfA+1) >= i; i++){
      locationOfRook.push(horizontal[indexOfA + i] + vertical[indexOfD]);
      directions[0].push(horizontal[indexOfA + i] + vertical[indexOfD]);
    }
    for(let i =1; indexOfA >= i; i++){
      locationOfRook.push(horizontal[indexOfA - i] + vertical[indexOfD]);
      directions[1].push(horizontal[indexOfA - i] + vertical[indexOfD]);
    }
    for (let i = 1; vertical.length -(indexOfD+1) >=i; i++){
      locationOfRook.push(horizontal[indexOfA] + vertical[indexOfD + i]);
      directions[2].push(horizontal[indexOfA] + vertical[indexOfD + i]);
    }
    for ( let i = 1; indexOfD >=i; i++){
      locationOfRook.push(horizontal[indexOfA] + vertical[indexOfD - i]);
      directions[3].push(horizontal[indexOfA] + vertical[indexOfD - i]);
    }

    e != "" ? PieceMove(locationOfRook,e,directions,color): "";
    return [locationOfRook,directions];
  }  

  function KnigtMove(e,indexOfA,indexOfD,color){
    let movesOfKnigt = [];
    let vMove1A = "", vMove2A = "", hMove1A = "", hMove2A = "", vMove1D = "",vMove2D = "", hMove1D = "", hMove2D = ""; 

    let hMoveA1 = indexOfA + 2;
    hMoveA1 = hMoveA1 < 0 ? 0 : hMoveA1;
    hMove1A = horizontal.length > hMoveA1 ? horizontal[hMoveA1] : "";

    let hMoveA2 = indexOfA - 2;
    hMove2A = horizontal.length > hMoveA2 ? horizontal[hMoveA2] : "";

    let vMoveA1 = indexOfA + 1;
    vMove1A = horizontal.length > vMoveA1 ? horizontal[vMoveA1] : "";

    let vMoveA2 = indexOfA - 1;
    vMove2A = horizontal.length > vMoveA2 ? horizontal[vMoveA2] : "";

    let vMoveD1 = indexOfD + 2;
    vMove1D =  vertical.length > vMoveD1 ? vertical[vMoveD1] : "";

    let vMoveD2 = indexOfD - 2;
    vMove2D = vertical.length > vMoveD2 ? vertical[vMoveD2] : "";

    let hMoveD1 = indexOfD +1;
    hMove1D = vertical.length > hMoveD1 ? vertical[hMoveD1] : "";

    let hMoveD2 = indexOfD -1;
    hMove2D = vertical.length > hMoveD2 ? vertical[hMoveD2] : "";

    if (hMove1A != "" && hMove1A != undefined){
      if (hMove1D != "" && hMove1D != undefined){
        movesOfKnigt = [...movesOfKnigt,hMove1A + hMove1D];
      }
      if (hMove2D != "" && hMove2D != undefined){
        movesOfKnigt = [...movesOfKnigt,hMove1A + hMove2D];
      }
    }
    if (hMove2A != "" && hMove2A != undefined){
      if (hMove1D != "" && hMove1D != undefined){
        movesOfKnigt = [...movesOfKnigt,hMove2A + hMove1D];
      }
      if (hMove2D != "" && hMove2D != undefined){
        movesOfKnigt = [...movesOfKnigt,hMove2A + hMove2D];
      }
    }
    if (vMove1A != "" && vMove1A != undefined){
      if (vMove1D != "" && vMove1D != undefined){
        movesOfKnigt = [...movesOfKnigt,vMove1A + vMove1D];
      }
      if (vMove2D != "" && vMove2D != undefined){
        movesOfKnigt = [...movesOfKnigt,vMove1A + vMove2D];
      }
    }
    if (vMove2A != "" && vMove2A != undefined){
      if (vMove1D != "" && vMove1D != undefined){
        movesOfKnigt = [...movesOfKnigt,vMove2A + vMove1D];
      }
      if (vMove2D != "" && vMove2D != undefined){
        movesOfKnigt = [...movesOfKnigt,vMove2A + vMove2D];
      }
    }
    
    e != "" ? PieceMove(movesOfKnigt,e,"",color) : "" ;
    return [movesOfKnigt]
  }

  function  BishopMove(e,indexOfA,indexOfD,color){
    let locationOfBishop = [];
    let directions = [[],[],[],[]];
  
    for (let i = 1; horizontal.length - (indexOfA + 1) >= i ; i++){
      if (vertical[indexOfD - i] != undefined){
        locationOfBishop.push(horizontal[indexOfA+i]+vertical[indexOfD-i]);
        directions[0].push(horizontal[indexOfA+i]+vertical[indexOfD-i]);
      }
      if (vertical[indexOfD + i] != undefined){
        locationOfBishop.push(horizontal[indexOfA+i]+vertical[indexOfD+i]);
        directions[1].push(horizontal[indexOfA+i]+vertical[indexOfD+i]);
      }  
    }
    for (let i = 1; indexOfA >= i ; i++){
      if (vertical[indexOfD - i] != undefined){
        locationOfBishop.push(horizontal[indexOfA-i]+vertical[indexOfD-i]);
        directions[2].push(horizontal[indexOfA-i]+vertical[indexOfD-i]);
      }
      if (vertical[indexOfD + i] != undefined){
        locationOfBishop.push(horizontal[indexOfA-i]+vertical[indexOfD+i]);
        directions[3].push(horizontal[indexOfA-i]+vertical[indexOfD+i]);
      }
    }
    e != "" ? PieceMove(locationOfBishop,e,directions,color) : "";
    return [locationOfBishop,directions];

  }

  function QueenMove(e,indexOfA,indexOfD,color){
    let direction = [];
    let locationOfQueen = [];
    let a = [],b = [];
    [a,b] = RookMove("",indexOfA,indexOfD);
    direction = [...direction,b];
    locationOfQueen = [...locationOfQueen,a];

    [a,b] = BishopMove("",indexOfA,indexOfD);
    direction = [...direction,b];
    locationOfQueen = [...locationOfQueen,a];

    direction = [...direction[0],...direction[1]];
    locationOfQueen = [...locationOfQueen[0],...locationOfQueen[1]];

    e != "" ? PieceMove(locationOfQueen,e,direction,color) : "";
    return [locationOfQueen,direction];
  }

  function KingMove(e,indexOfA,indexOfD,color){
    let locationOfKine = [];

    if (horizontal[indexOfA + 1 ] != undefined){
      locationOfKine.push(horizontal[indexOfA + 1] + vertical[indexOfD]);
      if (vertical[indexOfD + 1] != undefined){
        locationOfKine.push(horizontal[indexOfA + 1] + vertical[indexOfD + 1]);
      }
      if(vertical[indexOfD -1] != undefined){
        locationOfKine.push(horizontal[indexOfA +1] + vertical[indexOfD - 1]);
      }
    }
    if (horizontal[indexOfA - 1] != undefined){
      locationOfKine.push(horizontal[indexOfA - 1] + vertical[indexOfD]);
      if (vertical[indexOfD + 1] != undefined){
        locationOfKine.push(horizontal[indexOfA - 1] + vertical[indexOfD + 1]);
      }
      if (vertical[indexOfD - 1] != undefined){
        locationOfKine.push(horizontal[indexOfA - 1] + vertical[indexOfD - 1]);
      }
    }
    if (vertical[indexOfD + 1] != undefined){
      locationOfKine.push(horizontal[indexOfA] + vertical[indexOfD + 1]);
    }
    if (vertical[indexOfD - 1] != undefined){
      locationOfKine.push(horizontal[indexOfA] + vertical[indexOfD - 1]);
    }
    
    PieceMove(locationOfKine,e,"",color);
  }

  function PawnMove(e,indexOfA,indexOfD,color){``
    let locationOfPawn = [];
    
    if (piece.id[e.id] != undefined){
      if (piece.id[e.id].move == 0){
        if(color == "White"){
          locationOfPawn.push(horizontal[indexOfA] + vertical[indexOfD + 2]);
        }
        if (color == "Black"){
          locationOfPawn.push(horizontal[indexOfA] + vertical[indexOfD - 2]);
        }
      }  
    }

    if (color == "White"){
      let a = horizontal[indexOfA] + vertical[indexOfD +1];
      let b = document.querySelector("#"+a).className;
      if (b == ""){
        locationOfPawn.push(horizontal[indexOfA] + vertical[indexOfD + 1]);
      }  
      if (horizontal[indexOfA + 1] != undefined){
        let a = horizontal[indexOfA + 1] + vertical[indexOfD + 1];
        let b = document.querySelector("#"+a).className;
        if (b != ""){
          if (b.split(" ")[0].split("_")[0] == "Black"){
            locationOfPawn.push(horizontal[indexOfA + 1] + vertical[indexOfD + 1]);
          }  
        }
      }  
      if (horizontal[indexOfA - 1] != undefined){
        let a = horizontal[indexOfA - 1] + vertical[indexOfD + 1];
        let b = document.querySelector("#"+a).className;
        if (b != ""){
          if (b.split(" ")[0].split("_")[0] == "Black"){
            locationOfPawn.push(horizontal[indexOfA - 1] + vertical[indexOfD + 1]);
          }  
        }
      }
    }

    if(color == "Black"){
      let a = horizontal[indexOfA] + vertical[indexOfD -1];
      let b = document.querySelector("#"+a).className;
      if (b == ""){
        locationOfPawn.push(horizontal[indexOfA] + vertical[indexOfD - 1]);
      }
      if (horizontal[indexOfA + 1] != undefined){
        let a = horizontal[indexOfA + 1] + vertical[indexOfD - 1];
        let b = document.querySelector("#"+a).className;
        if (b != ""){
          if (b.split(" ")[0].split("_")[0] == "White"){
            locationOfPawn.push(horizontal[indexOfA + 1] + vertical[indexOfD - 1]);
          }  
        }
      }
      if (horizontal[indexOfA - 1] != undefined){
        let a = horizontal[indexOfA - 1] + vertical[indexOfD - 1];
        let b = document.querySelector("#"+a).className;
        if (b != ""){
          if (b.split(" ")[0].split("_")[0] == "White"){
            locationOfPawn.push(horizontal[indexOfA - 1] + vertical[indexOfD - 1]);
          }  
        }
      }
    }
    PieceMove(locationOfPawn,e,"",color);
  }
 
  function PieceMove(locations,e,directions,color){
    let Contitison = e.className.split(" ");

    if (Contitison.includes("select")){
      if (Contitison[0].split("_")[1] == "Knight" || Contitison[0].split("_")[1] == "King" || Contitison[0].split("_")[1] == "Pawn"){
        for (let location of locations){
          let moves = document.querySelector("#"+location);
          if (moves.className == ""){
            moves.className = moves.className+ " " + "move" + " " + e.id;
          }
          if (moves.className.split(" ")[0].split("_")[0] != color){
            moves.className = moves.className+ " " + "move" + " " + e.id;  
          }
        }  
      }else{
        for (let direction of directions){
          if (direction != ""){
            for (let location of direction){
              let moves = document.querySelector("#"+location);
              if (moves.className == ""){
                moves.className = moves.className+ " " + "move" + " " + e.id;
              }else if (moves.className.split(" ")[0].split("_")[0] != color){
                moves.className = moves.className+ " " + "move" + " " + e.id;
                break;
              }else if(moves.className.split(" ")[0].split("_")[0] == color){
                break;
              }
            }
          }
        }
      }
    }else{
      for(let location of locations){
        let move = document.querySelector("#"+location);
        let remov = move.className.split(" ");
        remov = remov.map((r) => r == "move" ? "" : r);
        remov = remov.map((r) => allMovements.includes(r) ? "": r);
        move.className = remov.join(" ").trimStart(); 
      }
    }

  }

  function Move(e,p){
    
    let from = document.querySelector("#"+p);
  
    from.textContent = "";
    let to = document.querySelector("#"+e.id);
    
    to.className = from.className.split(" ").slice(0,-1).join(" ");
    from.className = "";
    setmove(move+1);
    Check();
  }
 
  return (
      <div className='game'>
        <div className='piecesCheck'>
          <tr className="colorrow1 white">
            <td id='h1' className="White_Rook whitePiece" onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='g1' className='White_Knight whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='f1' className='White_Bishop whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='e1' className='White_King whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='d1' className='White_Queen whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='c1' className='White_Bishop whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='b1' className='White_Knight whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='a1' className='White_Rook whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
          </tr>
          <tr className="colorrow2 white">
            <td id='h2' className='White_Pawn whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='g2' className='White_Pawn whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='f2' className='White_Pawn whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='e2' className='White_Pawn whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='d2' className='White_Pawn whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='c2' className='White_Pawn whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='b2' className='White_Pawn whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='a2' className='White_Pawn whitePiece' onClick={(e) => {piecesClick(e.target)}}></td>
          </tr>
          <tr className="colorrow1">
            <td id='h3' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='g3' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='f3' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='e3' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='d3' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='c3' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='b3' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='a3' onClick={(e) => {piecesClick(e.target)}}></td>
          </tr>
          <tr className="colorrow2">
            <td id='h4' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='g4' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='f4' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='e4' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='d4' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='c4' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='b4' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='a4' onClick={(e) => {piecesClick(e.target)}}></td>
          </tr>
          <tr className="colorrow1">
            <td id='h5' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='g5' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='f5' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='e5' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='d5' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='c5' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='b5' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='a5' onClick={(e) => {piecesClick(e.target)}}></td>
          </tr>
          <tr className="colorrow2">
            <td id='h6' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='g6' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='f6' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='e6' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='d6' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='c6' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='b6' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='a6' onClick={(e) => {piecesClick(e.target)}}></td>
          </tr>
          <tr className="colorrow1 Black">
            <td id='h7' className='Black_Pawn blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='g7' className='Black_Pawn blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='f7' className='Black_Pawn blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='e7' className='Black_Pawn blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='d7' className='Black_Pawn blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='c7' className='Black_Pawn blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='b7' className='Black_Pawn blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='a7' className='Black_Pawn blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
          </tr>
          <tr className="colorrow2 Black">
            <td id='h8' className='Black_Rook blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='g8' className='Black_Knight blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='f8' className='Black_Bishop blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='e8' className='Black_King blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='d8' className='Black_Queen blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='c8' className='Black_Bishop blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='b8' className='Black_Knight blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
            <td id='a8' className='Black_Rook blackPiece' onClick={(e) => {piecesClick(e.target)}}></td>
          </tr>
        </div>
        <Points />
      </div>
  )
}
export default chessboard;