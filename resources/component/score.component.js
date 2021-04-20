import './score.components.css';
import template from './score.components.html';
import { Component } from '../../utils/components';
import { parseUrl} from '../../utils/utils';

export class ScoreComponent extends Component {

    constructor() {
        super('score');
        // ...
    }

    getTemplate() { return template; }
}
