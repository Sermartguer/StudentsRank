/**
 * Person class. We store personal information and points that reflect daily classroom job
 *
 * @constructor
 */

import {hashcode,getElementTd,localSave} from './utils.js';
import {context} from './context.js';
import Singleton from './singleton.js';
class Person {
    constructor(id, name, surname, points, tasks, attitude) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.points = points;
        this.gradedTasks = tasks;
        this.attitudeTasks = attitude;
    }
    /** Add points to persons we should carefully use it. */
    addPoints(points) {
        this.points += points;
    }
    /** Add a gradded task linked to person with its own mark. */
    addGradedTask(taskInstance) {
        this.gradedTasks.push({'task': taskInstance, 'points': 0});
        Singleton.getInstance().getRanking();
    }
    addAttitudeTask(task, description, points) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDay();
        this.attitudeTasks.push({'date': year + '-' + month + '-' + day, 'name': task, 'description': description, 'points': points});
        Singleton.getInstance().getRanking();
    }
    /** Renders HTML person view Create a table row (tr) with all name, points , add button and one input for every gradded task binded for that person. */
    getHTMLView() {
        var liEl = document.createElement('tr');
        liEl.appendChild(getElementTd(this.surname + ', ' + this.name, 'col3'));
        liEl.appendChild(getElementTd(this.points, 'col3'));
        var addPointsEl = document.createElement('button');
        var tb = document.createTextNode('+XP');
        addPointsEl.setAttribute('class', 'btn morexp');
        addPointsEl.setAttribute('name', 'btn');
        addPointsEl.setAttribute('id', this.id);
        addPointsEl.appendChild(tb);
        liEl.appendChild(getElementTd(addPointsEl, 'col3'));
        let _this = this;
        this.calculatedPoints = 0;
        this.gradedTasks.forEach(function(gTaskItem) {
            let inputEl = document.createElement('input');
            inputEl.setAttribute('class', 'ranking');
            inputEl.type = 'number';inputEl.min = 0;inputEl.max = 100;
            inputEl.value = gTaskItem.points;
            inputEl.addEventListener('change', function() {
                _this.addPoints(parseInt(gTaskItem.points) * (-1));
                gTaskItem.points = inputEl.value;
                _this.addPoints(parseInt(gTaskItem.points));
                Singleton.getInstance().getRanking();
            });
            liEl.appendChild(getElementTd(inputEl));
            localSave('tasks', Singleton.getInstance().gradedTasks);
            localSave('students', Singleton.getInstance().students);
        });
        return liEl;
    }
}

export default Person;
