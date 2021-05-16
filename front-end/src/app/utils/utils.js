import * as localforage from "localforage/dist/localforage";

export function parseUrl() {
    return (window.location.href
        .split('?')[1] || '')
        .split('&')
        .map(element => element.split('='))
        .reduce((acc, [key, value]) => {

            acc[key] = value;
            return acc;
        }, {});
}

export function saveStateOfGame(listCard, userName, timeElapsedInSeconds,size,matchedPairs) {

    listCard = listCard.map((card) => {
        const id = card._id;
        const flipped = card._flipped;
        const objet = {id, flipped}
        return objet;
    })



    const stateOfGame = {
        listCard,
        userName,
        timeElapsedInSeconds,
        size,
        matchedPairs
    }

    console.log( stateOfGame)


    localforage
        .setItem("saveOfState", stateOfGame)
        .catch((err) => {
            // we got an error
            throw err
        });

}

export function getSavedStateOfGame() {
    return localforage.getItem("saveOfState")
        .then((value) => {
            return value;
        })
}

export function deleteSaveInDataBase(){
    return  localforage.removeItem('saveOfState');
}