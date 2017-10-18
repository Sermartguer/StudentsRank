/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 */
import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,getElementTd,makeRequest} from './utils.js';

class Context {
    constructor() {
        if (typeof(Storage) !== undefined) {
        this.students = []; 
        this.gradedTasks = [];
      var arrayStudents = JSON.parse(localStorage.getItem("students"));
      var arrayTasks = JSON.parse(localStorage.getItem("tasks"));
      arrayStudents.forEach(function(student){      
        this.students.push(new Person(student.name,student.surname,student.points,student.gradedTasks));
      }.bind(this));
      console.log(arrayTasks);
      if (arrayTasks !==null){
        arrayTasks.forEach(function(task){
            this.gradedTasks.push(new GradedTask(task.name));
          }.bind(this));
        
        
    }
      console.log(this.students);
    }
    /*this.students = [
        new Person("Paco", "Vañó", 5,[]),
        new Person("Lucia", "Botella", 10,[]),
        new Person("German", "Ojeda", 3,[]),
        new Person("Salva", "Peris", 1,[]),
        new Person("Oscar", "Carrion", 40,[])
    ];
    localStorage.setItem('students', JSON.stringify(this.students));
    this.gradedTasks=[];*/
  }
  adTask(){
    var addTask = document.getElementById("addGradedTask");
    addTask.addEventListener("click", () => {
          this.addGradedTask();
    });
    //this.gradedTasks = [];
  }
  addStudent(){ 
      var addStudents = document.getElementById("addStudents");
      addStudents.addEventListener("click", () => {
        makeRequest('addformStudent.html',this.addStudents,this);
      });
  }
  /** Draw Students rank table in descendent order using points as a criteria */
  getRanking(){
        this.students.sort(function(a, b) {
            return (b.points - a.points);
        });
        var studentsEl = document.getElementById("llistat");
   
        while (studentsEl.firstChild) {
            studentsEl.removeChild(studentsEl.firstChild);
        }

        let headerString="<tr><td colspan='3'></td>";
        this.gradedTasks.forEach(function(taskItem){            
            headerString+="<td>"+taskItem.name+"</td>";
        });
        studentsEl.innerHTML= headerString;
        this.students.forEach(function(studentItem) {
            var liEl = studentItem.getHTMLView();
            studentsEl.appendChild(liEl);
        });
    }
    /** Create a form to create a GradedTask that will be added to every student */
   addGradedTask(){        
        let taskName = prompt("Please enter your task name");
        let gtask = new GradedTask(taskName);
        this.gradedTasks.push(gtask);
        this.students.forEach(function(studentItem) {            
            studentItem.addGradedTask(gtask);
        });
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('tasks',JSON.stringify(this.gradedTasks));
        this.getRanking();
        
    }
    addStudents(that){
        let addbutton = document.getElementById('submit');
        addbutton.addEventListener('click', function(){
            let name = document.getElementById('firstname');
            let surname = document.getElementById('lastname');
            let addperson = new Person(name.value, surname.value,0,[]);
            
            console.log(that.gradedTasks.length);
            if(that.gradedTasks.length>0){
                that.gradedTasks.forEach(function(tasks){
                    addperson.gradedTasks.push({"task":tasks,"points":0});
                });
            }else{
                addperson.gradedTasks=[];
            }
            
            addperson.calculatedPoints = 0;
            that.students.push(addperson);
            localStorage.setItem('students', JSON.stringify(that.students));
            console.log(that.students);
            
        }.bind(this));
       
        /*let studentName = prompt("Enter the student name");
        let adds = new Person(studentName,"Martinez",0);
        this.students.push(adds);
        this.gradedTasks.forEach(function(tasks){
            adds.addGradedTask(tasks);
        });
        this.getRanking();
        */
    }
}

export let context = new Context();