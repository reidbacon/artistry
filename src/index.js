var database = firebase.database();

// SET EXAMPLE
// database.ref('songs/' + "foreverandalways").set({
//     elo: "1400",
// });

// GET EXAMPLE
// database.ref('/songs/foreverandalways').once('value').then(function(snapshot) {
//     console.log(snapshot.val());
// });

let leftButton = document.getElementById('left');
let rightButton = document.getElementById('right');

leftButton.innerHTML = "foreverandalways";
rightButton.innerHTML = "lookwhatyoumademedo";

var leftElo = 0;
var rightElo = 0;

resetElos();

leftButton.addEventListener("click", evt => {
    calculateElo(leftElo, rightElo, "left");
})

rightButton.addEventListener("click", evt => {
    calculateElo(rightElo, leftElo, "right");
})

function calculateElo(a, b, winner) {
    var expectedA = (1.0 / (1.0 + Math.pow(10, ((b - a) / 400))));
    var expectedB = (1.0 / (1.0 + Math.pow(10, ((a - b) / 400))));
    console.log("a wins = " + expectedA + " and b wins = " + expectedB);

    var newA = a + (24 * (1 - expectedA));
    var newB = b + (24 * (0 - expectedB));
    console.log("a is now = " + newA + " and b is now = " + newB);

    if(winner == "left") {
        database.ref('songs/' + "foreverandalways").set({
            elo: newA,
        });
        database.ref('songs/' + "lookwhatyoumademedo").set({
            elo: newB,
        });
    } else {
        database.ref('songs/' + "foreverandalways").set({
            elo: newB,
        });
        database.ref('songs/' + "lookwhatyoumademedo").set({
            elo: newA,
        });
    }

    resetElos();
}

function resetElos() {
    database.ref('/songs/foreverandalways').once('value').then(function(snapshot) {
        leftElo = snapshot.val().elo;
        console.log("left set at " + leftElo);
    });
    
    database.ref('/songs/lookwhatyoumademedo').once('value').then(function(snapshot) {
        rightElo = snapshot.val().elo;
        console.log("right set at " + rightElo);
    });
}