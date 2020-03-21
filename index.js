const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.BOT_TOKEN;

let players = [];

let blueCharacters = [];
let redCharacters = [];
let timeout = false;
let ingame = false;
let timer = 3;
let seconds = 0;
let int = null;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

client.on('ready', () => {
    console.log('Bot is online!')
})

client.on('message', (msg)=>{
    if(msg.content === "!help"){
        msg.channel.send('Hello degenerates! I am a Discord bot that can help faciliate the game of 2 Rooms and Boom. Here are a list of my commands: \n' + 
            '!join      - join the Queue for the game\n' +
            '!leave     - leave the Queue for the game\n' +
            '!queue     - check who is in the Queue\n' +
            '!startgame - starts the game. Only works when there are 6 players!\n' +
            '!timer     - there are 3 timers. Starts the countdown for the current timer\n' +
            '!endgame   - ends the current game. Restarts the timers.' 
        );
    }

    //commands for if the game hasn't started yet
    if(!ingame){
        if(msg.content === "!join"){
            console.log(msg.author)
            players.push(msg.author);
            msg.channel.send('Players in Queue are: \n' + players.map(player => ' - <@' + player.id + '>\n'));
        }

        else if(msg.content === "!leave"){
            let index = players.indexOf(msg.author);
            if(index > -1){
                players.splice(index, 1);
            }
            msg.channel.send('Players in Queue are: \n' + players.map(player => ' - <@' + player.id + '>\n'));
        }

        if(msg.content === "!queue"){
            msg.channel.send('Players in Queue are: \n' + players.map(player => ' - <@' + player.id + '>\n'));
        }

        //TODO: write continue
        if(msg.content === "!startgame"){
            if(players.length < 6){
                msg.channel.send('Not enough players in Queue to start the game!');
            }

            msg.channel.send('Starting the game!');
            msg.channel.send('Prepare to play, and check your DMs for your roles! The people playing are: \n' + players.map(player => ' - <@' + player.id + '>\n'));

            timer = 3;
            ingame = true;

            //send roles to players
            shuffle(players);

            let characters = Array.from(players);

            characters.pop().send('You are the President! You are on the blue team. Don\'t get placed in the same room as the bomber!');
            characters.pop().send('You are the Bomber! You are on the red team. ALLAHU AKBAR KILL THE PRESIDENT!');

            if(characters.length%2 != 0) {
                characters.pop().send('You are the Gambler! At the end of the 3 rounds, try to guess which team won!');
            }

            toggle = true;
            characters.map(character => {
                if(toggle){
                    character.send('You are on the blue team!');
                    toggle = false;
                }
                else{
                    character.send('You are on the red team!');
                    toggle = true;
                }
            })

        }
    }

    else {
        if(msg.content === "!timer"){
            if(timeout) {
                msg.channel.send('A timer is in session: ' + seconds+'s left on the timer.');
            }
            else {
                if(timer > 0){
                    timeout = true;

                    seconds = timer * 60;

                    msg.channel.send('Starting a timer for ' + timer + ' minutes.')

                    int = setInterval(function() {
                        seconds = seconds - 1;

                        console.log('Time left: '+seconds+'s');

                        if(seconds == 60){
                            msg.channel.send('1 minute remaining');
                        }
                        if(seconds == 30){
                            msg.channel.send('30 seconds remaining');
                        }
                        if(seconds == 10){
                            msg.channel.send('10 seconds remaining');
                        }
                        if(seconds == 0){
                            msg.channel.send('TIME IS UP!');
                            timeout = false;
                            clearInterval(int);
                            int = null;
                        }
                    }, 1000);
                    
                                        
                    timer = timer - 1;
                }
            }
        }

        if(msg.content === "!endgame"){
            msg.channel.send('Ending the game. Timers and roles restarted.');
            if(int != null){
                clearInterval(int);
            }
            timeout = false;
            timer = 3;
            ingame = false;
        }
    }

}) 

client.login(token)