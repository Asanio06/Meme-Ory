// TODO Step 7 import "./welcome.components.html"

(function() {   // TODO Step 7 remove this closure

    /* class WelcomeComponent constructor  */

    class WelcomeComponent{
        constructor() {
        }

        init() {
            const form = document.querySelector('form.form-signin');

            form.addEventListener('submit', (event) =>{

                event.preventDefault();
                if (form.checkValidity() === false) {
                    event.stopPropagation();
                    form.classList.add('was-validated');
                } else {
                    const name = event.srcElement.querySelector('#nickname').value;
                    const size = parseInt(event.srcElement.querySelector('#size').value);

                    this._startGame(name, size);
                }
            }, false);

            return this;
        }

        // TODO Step 6 implement getTemplate() {}

         _startGame(name, size) {

            // TODO Step 7: change path to: `game?name=${name}=name&size=${size}`
            window.location = `../game/game.component.html?name=${name}&size=${size}`;
        }

    }

    // put components in global scope, tu be runnable right from the HTML.
    // TODO Step 7 export WelcomeComponent
    window.WelcomeComponent = WelcomeComponent
})();