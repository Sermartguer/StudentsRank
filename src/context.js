/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 *@param
 */
import Person from './person.js';
import {GradedTask,AttitudeTasks} from './gradedtask.js';
import {hashcode,getElementTd,makeRequest,localSave} from './utils.js';
import Singleton from './singleton.js';
import attitudeTasks from './attitudeTasks.js';
class Context {
    constructor() {
        this.students = [];
        this.gradedTasks = [];
        let studentscheck = localStorage.getItem('students');
        let taskscheck = localStorage.getItem('tasks');
        if (studentscheck !== null) {
            attitudeTasks();
            var arrayStudents = JSON.parse(localStorage.getItem('students'));
            var arrayTasks = JSON.parse(localStorage.getItem('tasks'));
            arrayStudents.forEach(function(student) {
                var id = hashcode(student.name + student.surname);
                this.students.push(new Person(id,student.name,student.surname,student.points,student.gradedTasks,student.attitudeTasks));
            }.bind(this));
            if (taskscheck !== null) {
                arrayTasks.forEach(function(task) {
                    this.gradedTasks.push(new GradedTask(task.name,task.description));
                }.bind(this));
            }
        }
    }
    adTask() {
        var addTask = document.getElementById('addGradedTask');
        addTask.addEventListener('click', () => {
            makeRequest('../templates/addTask.html', this.addGradedTask);
            //this.addGradedTask();
        });
        //this.gradedTasks = [];
    }
    addStudent() {
        var addStudents = document.getElementById('addStudents');
        addStudents.addEventListener('click', () => {
            makeRequest('../templates/addformStudent.html', this.addStudents);
        });
    }
    addAttitudeTask() {
        var btns = document.getElementsByName('btn');
        var i = -1;
        btns.forEach(function() {
            i++;
            btns[i].addEventListener('click', function(event) {
                console.log(this);
                makeRequest('../templates/attitudeTasks.html', this.addATasks, event.target.id);
                console.log(event.target.id);
            }.bind(this));
        }.bind(this));
    }
    /** Draw Students rank table in descendent order using points as a criteria */
    getRanking() {
        this.students.sort(function(a, b) {
            return (b.points - a.points);
        });
        makeRequest('../templates/rankingView.html', this.addtoHTML);
    }
    addtoHTML() {
        var studentsEl = document.getElementById('llistat');
        let TASK = '<tr><th colspan="2">Student</th><th>Points</th>';
        Singleton.getInstance().gradedTasks.forEach(function(taskItem) {
            TASK += '<th>' + taskItem.name + '</th>';
        });
        studentsEl.innerHTML = TASK;
        Singleton.getInstance().students.forEach(function(studentItem) {
            var liEl = studentItem.getHTMLView();
            studentsEl.appendChild(liEl);
        });
        Singleton.getInstance().addAttitudeTask();
    }
    /** Create a form to create a GradedTask that will be added to every student */
    addGradedTask() {
        let addtask = document.getElementById('submit');
        addtask.addEventListener('click', function() {
            //debugger;
            var taskname = document.getElementById('taskname').value;
            var taskdesciption = document.getElementById('taskdesciption').value;
            console.log(taskdesciption);
            let gtask = new GradedTask(taskname,taskdesciption);
            Singleton.getInstance().gradedTasks.push(gtask);
            console.log(Singleton.getInstance().students);
            Singleton.getInstance().students.forEach(function(studentItem) {
                console.log(Singleton.getInstance());
                studentItem.addGradedTask(gtask);
            }.bind(this));
            localSave('students', Singleton.getInstance().students);
            localSave('tasks', Singleton.getInstance().gradedTasks);
            Singleton.getInstance().getRanking();
        });
    }
    addStudents() {
        let addbutton = document.getElementById('submit');
        addbutton.addEventListener('click', function() {
            let name = document.getElementById('firstname');
            let surname = document.getElementById('lastname');
            let points = document.getElementById('studentPoints').value;
            var id = hashcode(name.value + surname.value);
            let addperson = new Person(id,name.value, surname.value,points,[]);
            if (Singleton.getInstance().gradedTasks.length > 0) {
                Singleton.getInstance().gradedTasks.forEach(function(tasks) {
                    addperson.addGradedTask(tasks);
                });
            }else {
                addperson.gradedTasks = [];
                addperson.attitudeTasks = [];
            }
            addperson.calculatedPoints = 0;
            Singleton.getInstance().students.push(addperson);
            localSave('students', Singleton.getInstance().students);
            //localStorage.setItem('students', JSON.stringify(Singleton.getInstance().students));
            console.log(Singleton.getInstance().students);
        }.bind(this));
    }
    addATasks(id) {
        console.log(id);
        Singleton.getInstance().students.forEach(function(student) {
            var select = document.getElementById('mySelect');
            if (student.id == id) {
                var arrayAttitude = JSON.parse(localStorage.getItem('attitudeTasks'));
                arrayAttitude.forEach(function(attitude) {
                    var option = document.createElement('option');
                    var optext = document.createTextNode(attitude.name);
                    option.appendChild(optext);
                    console.log(attitude.name);
                    option.setAttribute('value', attitude.name);
                    select.appendChild(option);
                });
                if (student.attitudeTasks !== undefined) {
                    var historyEl = document.getElementById('attlist');

                    let HISTORY = '<tr><th  class="text-left">Date</th><th  class="text-left">Task Category</th><th  class="text-left">Task Description</th><th  class="text-left">Points</th></tr><tr>';
                    student.attitudeTasks.forEach(function(attask) {
                        console.log(student.attitudeTasks);
                        HISTORY += '<td>' + attask.date + '</td><td>' + attask.name + '</td><td>' + attask.description + '</td><td>' + attask.points + '</td></tr>';
                        historyEl.innerHTML = HISTORY;
                    });
                }
                var butatt = document.getElementById('submit');
                butatt.addEventListener('click', function() {
                    let descval = document.getElementById('attdescription').value;
                    console.log(Singleton.getInstance().students);
                    var pointsAtt = document.getElementById('pointsatt').value;
                    let e = parseInt(pointsAtt);
                    let f = parseInt(student.points);
                    var pointglobal = e + f;
                    student.addAttitudeTask(select.value, descval, e);
                    student.points = pointglobal;
                    console.log(Singleton.getInstance().students);
                    localSave('students', Singleton.getInstance().students);
                    return '';
                });
            }
        });
    }
}

export default Context;
