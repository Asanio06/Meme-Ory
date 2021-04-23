// TODO Step 7 import "./card.components.html"

(function() {   // TODO Step 7 remove this closure

    /* class CardComponent constructor */
    class CardComponent{
        constructor(id) {
            // is this card flipped ?
            this._flipped = false;

            // has the matching card has been discovered already ?
            this.matched = false;

            this._id = id;

            // TODO Step 7: We can access the element from the components class that built an element from the template
            // TODO Step 7: don't use document.getElementById anymore
            this._elt = document.getElementById('card-template').content.cloneNode(true).firstElementChild;
            this._imageElt = this._elt.querySelector('.card-wrapper');
            // TODO Step 7: Update the path for images
            this._imageElt.querySelector('img.front-face').src = `card/assets/card-${this._id}.png`;
            this._imageElt.querySelector('img.back-face').src = 'card/assets/back.png';
        }

        getElement() {
            return this._elt;
        }

        flip() {
            this._imageElt.classList.toggle('flip');
            this._flipped = !this._flipped;
        }

        equals(card) {
            return card._id === this._id;
        }

        get flipped(){
            return this._flipped;
        }


    }




    // put components in global scope, tu be runnable right from the HTML.
    // TODO Step 7 export CardComponent
    window.CardComponent = CardComponent;
})();
