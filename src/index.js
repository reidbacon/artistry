var database = firebase.database();

var allSongs = [];
var songs = [];
var songNum = 0;
var leftSongIndex = 0;
var rightSongIndex = 0;
var leftElo = 0;
var rightElo = 0;

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

getSongsFromDB();

leftButton.addEventListener("click", evt => {
    calculateElo(leftSongIndex, rightSongIndex, "left");
    pickTwo();
})

rightButton.addEventListener("click", evt => {
    calculateElo(leftSongIndex, rightSongIndex, "right");
    pickTwo();
})

function calculateElo(leftIndex, rightIndex, winner) {
    if(winner == "left") {
        var leftWinChance = (1.0 / (1.0 + Math.pow(10, ((leftElo - rightElo) / 400))));
        var rightWinChance = (1.0 / (1.0 + Math.pow(10, ((rightElo - leftElo) / 400))));
        var newLeftElo = leftElo + (24 * (1 - leftWinChance));
        var newRightElo = rightElo + (24 * (0 - rightWinChance));
        database.ref('/songs/' + songs[leftIndex]).update({
            elo: newLeftElo,
        });
        database.ref('/songs/' + songs[rightIndex]).update({
            elo: newRightElo,
        });
    } else {
        var rightWinChance = (1.0 / (1.0 + Math.pow(10, ((rightElo - leftElo) / 400))));
        var leftWinChance = (1.0 / (1.0 + Math.pow(10, ((leftElo - rightElo) / 400))));
        var newRightElo = rightElo + (24 * (1 - rightWinChance));
        var newLeftElo = leftElo + (24 * (0 - leftWinChance));
        database.ref('/songs/' + songs[rightIndex]).update({
            elo: newRightElo,
        });
        database.ref('/songs/' + songs[leftIndex]).update({
            elo: newLeftElo,
        });
    }
}

function getData(left, right) {
    database.ref('/songs/' + left).once('value').then(function(snapshot) {
        leftButton.innerHTML = snapshot.val().title;
        leftElo = snapshot.val().elo;
    });
    database.ref('/songs/' + right).once('value').then(function(snapshot) {
        rightButton.innerHTML = snapshot.val().title;
        rightElo = snapshot.val().elo;
    });
}

function getSongsFromDB() {
    database.ref('/songs').once('value').then(function(snapshot) {
        allSongs = snapshot.toJSON();
        getNumOfSongs();
        buildSongArray();
        pickTwo();
    });
}

// This is so fucking hacky
function getNumOfSongs() {
    for(i = 0; i < 100; i++) {
        if(allSongs[i] != undefined) {
            songNum++;
        }
    }
}

function buildSongArray() {
    for(i = 0; i < songNum; i++) {
        songs.push(i);
    }
}

function pickTwo() {
    leftSongIndex = Math.floor(Math.random() * songNum);
    do {
        rightSongIndex = Math.floor(Math.random() * songNum);
    } while (leftSongIndex == rightSongIndex)
    getData(leftSongIndex, rightSongIndex);
}