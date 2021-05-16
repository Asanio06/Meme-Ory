import {CardComponent} from "./card/card.component";
import template from "./game.component.html"
import {deleteSaveInDataBase, getSavedStateOfGame, parseUrl, saveStateOfGame} from "../../utils/utils";
import {Component} from "../../utils/component";


const environment = {
    api: {
        host: 'http://localhost:8081'
    }
};

/* class GameComponent constructor */
export class GameComponent extends Component {
    constructor() {
        super("game")
        let params = parseUrl();

        // save player name & game ize
        this._name = params.name;
        this._size = parseInt(params.size) || 9;
        this._flippedCard = null;
        this._matchedPairs = 0;
        this.savetimeElapsedInSeconds = 0;

    }

    async init() {

        // fetch the cards configuration from the server
        let stateOfGame = await getSavedStateOfGame();
        let continueOnSaveData;
        console.log(stateOfGame)
        if (stateOfGame) continueOnSaveData = confirm("Souhaitez vous continuez la partie précédente? (Cliquer sur Ok pour dire oui)");
        if (!continueOnSaveData) {
            await deleteSaveInDataBase();
            stateOfGame = null;
        }

        if (stateOfGame) {
            this._name = stateOfGame.userName;
            this._size = stateOfGame.size;
            this.listCardSave = stateOfGame.listCard;
            this.savetimeElapsedInSeconds = stateOfGame.timeElapsedInSeconds;
            this._matchedPairs = stateOfGame.matchedPairs;
            this.lastFlippedCardId = stateOfGame.lastflippedCardId;
        }

        console.log('merde ' +this.lastFlippedCardId )


        const config = await this.fetchConfig();
        this._config = config;

        // create a card out of the config
        this._cards = this._config.ids.map((id) => {
            return new CardComponent(id);
        })

        this._boardElement = document.querySelector('.cards');
        console.log(this._cards)
        this._cards.forEach((card) => {
            this._boardElement.appendChild(card.getElement());
            card.getElement().addEventListener('click', () => {
                this._flipCard(card);
                // Save the game state when the player flips a card

            });

        })

        if (this.listCardSave) {
            this.listCardSave.forEach((cardSave) => {
                const cardId = this._cards.findIndex(card => card._id == cardSave.id && !card._flipped);
                if (cardSave.flipped) {
                    this._flipCardFromSave(this._cards[cardId])
                }
                // je ne met pas if (!this.lastFlippedCardId) par peur qu'il considere !0 = true
                if(this.lastFlippedCardId !=null || this.lastFlippedCardId != undefined){ // Si le dernier flip est sauvegardé
                    console.log('id save ' + this.lastFlippedCardId  )

                    // On recupere la derniere carte lorsque le cardSave nous permet de dire qu'elle etait retourné et que son id vaut celui de la derniere carte sauvegarder.
                    // En effet toutes les cartes sont en pairs mais seules une des 2 est retourné
                    const lastCardFlip = this._cards.findIndex(card => cardSave.flipped && card._id == this.lastFlippedCardId)
                    if(this._cards[lastCardFlip]){
                        this._flippedCard =  this._cards[lastCardFlip]
                        console.log('Carte lip deernier')
                        console.log(this._flippedCard )
                    }
                }


            })
        }


        this.start();


    }


    start() {
        this._startTime = Date.now(); // the value is initialized in the init function when a save
        let seconds = 0 + this.savetimeElapsedInSeconds;

        document.querySelector('nav .navbar-title').textContent = `Player: ${this._name}. Elapsed time: ${seconds++}`;

        this._timer = setInterval(() => {
            document.querySelector('nav .navbar-title').textContent = `Player: ${this._name}. Elapsed time: ${seconds++}`;
        }, 1000);
    }

    async fetchConfig() {

        return fetch(`${environment.api.host}/board?size=${this._size}`, {
            method: 'GET'
        })
            .then((response) => response.json())
            .catch((error) => {
                throw error
            });

    }

    gotoScore() {

        const timeElapsedInSeconds = this._getTimeElapsedInSeconds();
        clearInterval(this._timer);
        setTimeout(() => {
            window.location.hash = `score?name=${this._name}&size=${this._size}&time=${timeElapsedInSeconds}`;
        }, 750);
    }

    _getTimeElapsedInSeconds() {
        if (!this._startTime) this._startTime = Date.now(); // Initialisation de startTime si la fonction start n'a pas été lancé
        return Math.floor((Date.now() - this._startTime) / 1000 + this.savetimeElapsedInSeconds);
    }

    _flipCard(card) {
        if (this._busy) {
            return;
        }

        if (card.flipped) {
            return;
        }


        // flip the card
        card.flip();


        // if flipped first card of the pair
        if (!this._flippedCard) {
            // keep this card flipped, and wait for the second card of the pair
            this._flippedCard = card;
            console.log('nooooooooooooooo')
        } else {
            // second card of the pair flipped...
                console.log('Flipped card')
            console.log(this._flippedCard)
            console.log('carte')
            console.log(card)
            // if cards are the same
            if (card.equals(this._flippedCard)) {
                console.log("EGALITE")
                this._flippedCard.matched = true;
                card.matched = true;
                this._matchedPairs += 1;


                // reset flipped card for the next turn.
                this._flippedCard = null;

                if (this._matchedPairs === this._size) {
                    deleteSaveInDataBase().then(() => this.gotoScore())

                }
            } else {
                this._busy = true;

                // cards did not match
                // wait a short amount of time before hiding both cards
                setTimeout(() => {
                    // hide the cards
                    this._flippedCard.flip();
                    card.flip();
                    this._busy = false;


                    // reset flipped card for the next turn.
                    this._flippedCard = null;
                    saveStateOfGame(this._cards, this._name, this._getTimeElapsedInSeconds(), this._size, this._matchedPairs, null) // Sauvegar

                }, 500);
            }
        }

        if(this._flippedCard){
            saveStateOfGame(this._cards, this._name, this._getTimeElapsedInSeconds(), this._size, this._matchedPairs, this._flippedCard._id);
        }else{
            // Lorsque les cartes se matchent, il n'ya plus de flippedCard
            saveStateOfGame(this._cards, this._name, this._getTimeElapsedInSeconds(), this._size, this._matchedPairs,null);

        }

    }

    _flipCardFromSave(card) {


        // flip the card
        card.flip();
        //this._flippedCard = card;
        if (this._matchedPairs === this._size) {
            this.gotoScore();
        }

    }

    getTemplate() {
        return template;
    }

}



