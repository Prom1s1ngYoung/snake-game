import './Board.css'
import React, { useEffect, useState, useRef } from 'react'

const dirEnum = {
	up: [-1, 0],
	down: [1, 0],
	left: [0, -1],
	right: [0, 1],
}

function Board () {
	const [length, setLength] = useState(1)
	const [snake, setSnake] = useState([44])
	const [food, setFood] = useState(45)
	const [snakeSet, setSnakeSet] = useState(new Set([44]))
	const [isEat, setIsEat] = useState(false)
	const divRef = useRef([])
	const [dir, setDir] = useState(dirEnum.right)
	const move = () => {
		const head = snake[snake.length - 1]
		//console.log(head)
		const newRow = Math.floor(head / 10) + dir[0]
		const newCol = head % 10 + dir[1]
		const newSnake = [...snake]
		const newSnakeSet = new Set(snakeSet)
		let curLength = length
		const newHead = newRow * 10 + newCol
		if (checkIsMovementInvalid(newRow, newCol, newHead)) {
			return
		}
		if (food === newHead) {
			setIsEat(true)
			curLength += 1
		}
		newSnake.push(newHead)
		newSnakeSet.add(newHead)
		if (curLength < newSnake.length) {
			// console.log("curLength: ", curLength)
			// console.log("arrayLength: ", newSnake.length)
			const tail = newSnake.shift()
			newSnakeSet.delete(tail)
			divRef.current[tail].style.backgroundColor = 'white'
			//console.log(divRef.current[tail])
		}
		//console.log(divRef.current[newHead])
		divRef.current[newHead].style.backgroundColor = 'aqua'
		setLength(curLength)
		setSnakeSet(newSnakeSet)
		setSnake(newSnake)
	}
	const checkIsMovementInvalid = (col, row, newHead) => {
		if (col >= 10 || col < 0 || row >= 10 || row < 0 || snakeSet.has(newHead)) {
			console.log("dead")
			return true
		}
		return false
	}
	useEffect(() => {
		if (isEat === false) {
			return
		}
		let randomNumber = Math.floor(Math.random() * 100)
		while (snakeSet.has(randomNumber)) {
			randomNumber = Math.floor(Math.random() * 100)
		}
		setFood(randomNumber)
		setIsEat(false)
	}, [isEat])
	useEffect(() => {
		const head = snake[snake.length - 1]
		//console.log(divRef.current[head])
		divRef.current[head].style.backgroundColor = 'aqua'
	}, [snake])
	useEffect(() => {
		const foodPos = food
		divRef.current[foodPos].style.backgroundColor = 'yellow'
	}, [food])
	useEffect(() => {
		const handleKeyDown = (event) => {
			//console.log(event.key)
			//console.log(dir)
			switch (event.key) {
				case 'w':
					setDir(dirEnum.up)
					break
				case 'a':
					setDir(dirEnum.left)
					break
				case 's':
					setDir(dirEnum.down)
					break
				case 'd':
					setDir(dirEnum.right)
					break
				default:
					break
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			//When window closed
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])
	useEffect(() => {
		const timerId = setTimeout(move, 500)
		return () => {
			clearTimeout(timerId)
		}
	}, [snake])
	const getBoard = () => {
		const board = []
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				const div = <div key={i * 10 + j} className="pixel" ref={el => divRef.current.push(el)}></div >
				board.push(div)
			}
		}
		return board
	}
	return (
		<div>
			<div className="panels">
				{getBoard()}
			</div>
			{/* <button onClick={move}>move</button> */}
		</div>
	)
}

export default Board