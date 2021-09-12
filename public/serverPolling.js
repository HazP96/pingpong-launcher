    const ballCountElement = document.getElementById('ballCountDisplay')
    const ballElements = document.querySelectorAll('.ball')
    const speechBubbleEl = document.getElementById('speechBubble')
    const speechBubbleMessage = document.getElementById('speechBubbleMessage')

    let ballsPending, displayBallCount
    let secconds = 5

    const setBallCountUI = (message) => {
        ballCountElement.textContent = message
    }

    const renderBalls = (ballCount) => {
        const currentBallsDropped = 25 - ballCount
        for (let i = 0; i < ballElements.length; i++) {
            const ball = ballElements[i]
            const ballNumber = parseInt(ball.dataset.ballnumber)
            if (currentBallsDropped >= ballNumber) {
                ball.style.display = "none"
            }
        }
    }

    const showHarambe = (show) => {
        if (show) {
            speechBubbleEl.children[0].style.backgroundSize = "cover"
            speechBubbleEl.children[0].style.backgroundImage = "url(boi.jpg)"
        } else {
            speechBubbleEl.children[0].style.backgroundImage = "none"
        }
    }


    const showSpeechBubble = (show) => {
        if (show) {
            speechBubbleEl.style.opacity = 1
        } else {
            speechBubbleEl.style.opacity = 0
        }
    }

    const setSpeechBubbleMessage = (message) => {
        speechBubbleMessage.textContent = message
    }

    const pollServer = () => {
        fetch('/currentBallCount', {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.isHarambe) showHarambe(true)
            const { ballCount, ballsToBeDropped } = data
            displayBallCount = ballCount
            renderBalls(ballCount)
            if (ballsToBeDropped > 0) {
                ballsPending = ballsToBeDropped
            } else {
                setBallCountUI(ballCount)
            }
        })
    }


    pollServer() // Initial poll from server
    showSpeechBubble(false)
    setInterval(() => { //
        renderBalls() //Removes balls from the image if required
        if (ballsPending > 0 ) {
            showSpeechBubble(true)
            if (secconds === 0) {
                fetch('/dropball', {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json'
                    }
                }).then(() => {
                    displayBallCount--
                    renderBalls(displayBallCount)
                    setBallCountUI(displayBallCount)
                    setSpeechBubbleMessage("FIRE!")
                    setTimeout(() => {
                        showSpeechBubble(false)
                        showHarambe(false)
                        secconds = 5
                    }, 900)
                    ballsPending--
                })
            } else {
                setSpeechBubbleMessage(secconds)
                secconds--
            }
        } else {
            pollServer()
        }
    }, 1000)





