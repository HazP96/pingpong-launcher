document.addEventListener("DOMContentLoaded", function(event) {
    const ballCountElement = document.getElementById('ballCountDisplay')

    let ballsPending = 0
    let secconds = 5

    const setBallCountUI = (message) => {
        ballCountElement.innerHTML = message
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
            console.log(data)
            const { ballCount, ballsToBeDropped } = data
            if (ballsToBeDropped > 0) {
                ballsPending = ballsToBeDropped
            } else {
                setBallCountUI(ballCount)
            }
        })
    }

    pollServer() // Inital poll
    setInterval(() => { //
        if (ballsPending > 0 ) {
            if (secconds === 0) {
                // setBallCountUI("FIRE!")
                fetch('/dropball', {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json'
                    }
                })
                secconds = 5
                ballsPending--
            } else {
                // setBallCountUI(`Dropping in ${secconds}`)
                secconds--
            }
        } else {
            pollServer()
        }
    }, 1000)


});





