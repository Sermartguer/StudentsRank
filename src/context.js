/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @param
 */
import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,getElementTd,makeRequest,localSave} from './utils.js';
import Singleton from './singleton.js';
class Context {
    constructor() {
        this.students = [];
        this.gradedTasks = [];
        let studentscheck = localStorage.getItem('students');
        let taskscheck = localStorage.getItem('tasks');
        if (studentscheck !== null) {
            var arrayStudents = JSON.parse(localStorage.getItem('students'));
            var arrayTasks = JSON.parse(localStorage.getItem('tasks'));
            arrayStudents.forEach(function(student) {
                this.students.push(new Person(student.name,student.surname,student.points,student.gradedTasks));
            }.bind(this));
            if (taskscheck !== null) {
                arrayTasks.forEach(function(task) {
                    this.gradedTasks.push(new GradedTask(task.name));
                }.bind(this));
            }
        }
        /*this.students = [
            new Person('Paco', 'Vañó', 5,[]),
            new Person('Lucia', 'Botella', 10,[]),
            new Person('German', 'Ojeda', 3,[]),
            new Person('Salva', 'Peris', 1,[]),
            new Person('Oscar', 'Carrion', 40,[])
        ];
        localStorage.setItem('students', JSON.stringify(this.students));
        this.gradedTasks = [];*/
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
    /** Draw Students rank table in descendent order using points as a criteria */
    getRanking() {
        this.students.sort(function(a, b) {
            return (b.points - a.points);
        });
        makeRequest('../templates/rankingView.html', this.addtoHTML);
    }
    addtoHTML() {
        var studentsEl = document.getElementById('llistat');
        let TASK = '<tr><td colspan="3"></td>';
        Singleton.getInstance().gradedTasks.forEach(function(taskItem) {
            TASK += '<td>' + taskItem.name + '</td>';
        });
        studentsEl.innerHTML = TASK;
        Singleton.getInstance().students.forEach(function(studentItem) {
            var liEl = studentItem.getHTMLView();
            studentsEl.appendChild(liEl);
        });
    }
    /** Create a form to create a GradedTask that will be added to every student */
    addGradedTask() {
        
        let addtask = document.getElementById('submit');
        addtask.addEventListener('click', function() {
            debugger;
            var taskname = document.getElementById('taskname').value;
            let gtask = new GradedTask(taskname);
            Singleton.getInstance().gradedTasks.push(gtask);
            console.log(Singleton.getInstance().students);
            Singleton.getInstance().students.forEach(function(studentItem) {
                debugger;
                console.log(Singleton.getInstance());
                studentItem.addGradedTask(gtask);
            }.bind(this));
            //localStorage.setItem('students', JSON.stringify(Singleton.getInstance().students));
            localSave('students',Singleton.getInstance().students)
            //localStorage.setItem('tasks', JSON.stringify(Singleton.getInstance().gradedTasks));
            localSave('tasks',Singleton.getInstance().gradedTasks)
            Singleton.getInstance().getRanking();
        });
    }
    addStudents() {
        let addbutton = document.getElementById('submit');
        addbutton.addEventListener('click', function() {
            let name = document.getElementById('firstname');
            let surname = document.getElementById('lastname');
            let addperson = new Person(name.value, surname.value,0,[]);
            if (Singleton.getInstance().gradedTasks.length > 0) {
                Singleton.getInstance().gradedTasks.forEach(function(tasks) {
                    addperson.addGradedTask(tasks);
                });
            }else {
                addperson.gradedTasks = [];
            }
            addperson.calculatedPoints = 0;
            Singleton.getInstance().students.push(addperson);
            localSave('students', Singleton.getInstance().students);
            //localStorage.setItem('students', JSON.stringify(Singleton.getInstance().students));
            console.log(Singleton.getInstance().students);
        }.bind(this));
    }
}

export default Context;
