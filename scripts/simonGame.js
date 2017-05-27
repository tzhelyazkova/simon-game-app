var app = new Vue({
    el: '#simonGame',
    data: {
        message: 'Simon Game!',
        score: 0,
        colors: ['yellow', 'red', 'green', 'blue'],
        sounds: {
            'green': 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
            'red': 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
            'blue': 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
            'yellow': 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
        },
        computerPattern: '',
        userPattern: '',
        waitForMove: 0,
        classRed: {
            'active-red': false,
        },
        classBlue: {
            'active-blue': false,
        },
        classGreen: {
            'active-green': false,
        },
        classYellow: {
            'active-yellow': false,
        }
    },
    methods: {
        startGame: function () {
            $(".flex-container").css("pointer-events", "none");
            this.computerPattern = this.computerMove();
            console.log("computer pattern: " + this.computerPattern);
            this.playPattern(this.computerPattern, function(){
                $(".flex-container").css("pointer-events", "auto");
                console.log("computer is done playing");
                return;
            });
        },
        resetGame: function () {
            this.userPattern = '';
            this.computerPattern = '';
            this.score = 0;
            $(".flex-container").css("pointer-events", "auto");
            setTimeout(this.startGame, 500);
        },
        endGame: function() {
            this.userPattern = '';
            this.computerPattern = '';
            $(".flex-container").css("pointer-events", "auto");
            alert("End of game!");
        },
        computerMove: function () {
            //pick a random color
            console.log("comp move");
            return this.colors[Math.floor(Math.random() * this.colors.length)];
        },
        userMove: function (move) {
            clearTimeout(this.waitForMove);
            this.userPattern = (this.userPattern === '') ? move : this.userPattern + "," + move;
            this.playUserMove(move, function(){
                this.waitForMove = setTimeout(function() {
                    console.log("user is done playing. user pattern is "+this.userPattern);
                    $(".flex-container").css("pointer-events", "none");
                    if (!this.areMovesEqual()) {
                        this.endGame();
                        return;
                    }
                    else {
                        this.score++;
                        console.log("moves are equal");
                        this.userPattern = '';
                        this.computerPattern = this.computerPattern + "," + this.computerMove();
                        console.log("computer pattern + 1 " + this.computerPattern);
                        clearTimeout(this.waitForMove);
                        this.playPattern(this.computerPattern, function(){
                            $(".flex-container").css("pointer-events", "auto");
                            console.log("pattern played");
                            return;
                        });
                    }
                }.bind(this), 3000)
            }.bind(this));

        },
        playUserMove: function(color, callback) {
            //simulate the pressing of a button
            console.log("go to light "+color);
            var cls = "class" + color.charAt(0).toUpperCase() + color.slice(1);
            this[cls]['active-'+color] = true;
            var audio = new Audio(this.sounds[color]);
            audio.play();
            setTimeout(function() {
                this[cls]['active-'+color] = false;
                console.log("go back to dark "+color);
                return callback();
            }.bind(this), 500);
        },
        areMovesEqual: function() {
            return this.userPattern === this.computerPattern;
        },
        playPattern: function(pattern, callback) {
            var colorsPattern = pattern.split(',');
            var i = 0;
            var len = colorsPattern.length; 
            var fn = function() {
                if (i < len) {
                    this.playColor(colorsPattern[i], fn);
                    i++;
                }
                else {
                    return callback();
                }
            }.bind(this);
            fn();
        },
        playColor: function(color, fn) {
            //simulate the pressing of a button
            console.log("go to light "+color);
            var cls = "class" + color.charAt(0).toUpperCase() + color.slice(1);
            this[cls]['active-'+color] = true;
            var audio = new Audio(this.sounds[color]);
            audio.play();
            setTimeout(function() {
                this[cls]['active-'+color] = false;
                console.log("go back to dark "+color);
                setTimeout(fn.bind(this), 500);
            }.bind(this), 500);
        }
    }
});