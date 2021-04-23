// TODO Step 7 import "./score.components.html"

(function () {      // TODO Step 7 remove this closure

    /* class ScoreComponent constructor */
    class ScoreComponent {
        constructor() {
            const params = this.parseUrl();
            this.name = params.name;
            this.size = parseInt(params.size);
            this.time = parseInt(params.time);
        }

        init() {
            document.getElementById('name').innerText = this.name;
            document.getElementById('size').innerText = this.size;
            document.getElementById('time').innerText = this.time;
        }

        parseUrl() {

            return (window.location.href
                .split('?')[1] || '')
                .split('&')
                .map(element => element.split('='))
                .reduce((acc, [key, value]) => {

                    acc[key] = value;
                    return acc;
                }, {});
        }

        // TODO Step 6 implement getTemplate() {}

    }

    // put components in global scope, tu be runnable right from the HTML.
    // TODO Step 7 export ScoreComponent


    window.ScoreComponent = ScoreComponent;
})();
