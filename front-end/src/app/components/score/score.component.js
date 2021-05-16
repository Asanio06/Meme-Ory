import "./score.component.scss"
import template from "./score.component.html";
import {parseUrl,formatTime,deleteSaveInDataBase} from "../../utils/utils";
import {Component} from "../../utils/component";

const environment = {
    api: {
        host: 'http://localhost:8081'
    }
};
/* class ScoreComponent constructor */
export class ScoreComponent extends Component {
    constructor() {
        super('score')
        const params = parseUrl();
        this.name = params.name;
        this.size = parseInt(params.size);
        this.time = parseInt(params.time);
    }

    async init() {
        await this._postScore();
        await deleteSaveInDataBase();
        await this._insertInformationInTable();
        document.getElementById('name').innerText = this.name;
        document.getElementById('size').innerText = this.size;
        document.getElementById('time').innerText = this.time;
    }

    getTemplate() {
        return template;
    }

    async _postScore(){
        return await fetch("http://localhost:8081/scores?size", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: this.name, time: this.time, size: this.size }),
        });

    }

    async _getAllScore(){
        return await fetch(`${environment.api.host}/scores`, {
            method: "GET",
        }).then((response) => response.json());

    }

    async _insertInformationInTable(){
        const allScore = await this._getAllScore();
        // Rangement de la liste
        allScore.sort(function(a, b) {
            return b.size - a.size || a.time - b.time;
        });

        //classement-body
        let bodyOfTable = '';
        allScore.forEach((scoreInfo,index)=>{
            bodyOfTable += `<tr>
                <th scope="row">${index+1}</th>
                <td>${scoreInfo.name}</td>
                <td>${scoreInfo.size}</td>
                <td>${formatTime(scoreInfo.time)}</td>
            </tr>`;

        })
        document.getElementById('classement-body').innerHTML = bodyOfTable;
    }




}
