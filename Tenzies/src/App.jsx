import Die from "./components/Die"
import React from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(() => generateAllNewDice())

    const buttonRef = React.useRef(null)
    //console.log(buttonRef)

    const gameWon = dice.every(die => die.isHeld) && 
        dice.every(die => die.value === dice[0].value)

    React.useEffect(() => {
        if(gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])
    

    function generateAllNewDice() {
        const newDice = []
        for(let i=0; i < 10; i++) {
            let randDiceNum = Math.floor(Math.random()*6) + 1;
            newDice.push({
                id: nanoid(),
                value: randDiceNum, 
                isHeld: false
            });
        }

        return newDice;
    }

    function rollDice() {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }
    
    const diceElements = dice.map((dieObj) => 
        <Die
            id={dieObj.id} 
            key={dieObj.id}
            value={dieObj.value} 
            isHeld={dieObj.isHeld}
            hold={hold}
        />)


    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only"></div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" ref={buttonRef} onClick={rollDice}>{gameWon ? "New Game" : "Roll"}</button>
        </main>
    )
}