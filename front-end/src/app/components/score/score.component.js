// TODO Step 7 import "./score.components.html"

(function () {      // TODO Step 7 remove this closure

    /* class ScoreComponent constructor */
    class ScoreComponent {
        constructor() {
            var params = this.parseUrl();
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
            var url = window.location;
            var query = url.href.split('?')[1] || '';
            var delimiter = '&';
            var result = {};
            var parts = query
                .split(delimiter);
            // TODO Step 3.3: Use Array.map() & Array.reduce()
            for (var i in parts) {
                var item = parts[i];
                var kv = item.split('=');
                result[kv[0]] = kv[1];
            }

            return result;
        }

        // TODO Step 6 implement getTemplate() {}

    }

    // put components in global scope, tu be runnable right from the HTML.
    // TODO Step 7 export ScoreComponent


    window.ScoreComponent = ScoreComponent;
})();
