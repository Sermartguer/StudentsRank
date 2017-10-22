/**
 * GradedTask class. Create a graded task in order to be evaluated for every student engaged
 * @constructor
 */
class Tasks {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}
class GradedTask extends Tasks{
    constructor(name, description){
        super(name, description);
        //this.description = description;
    }
}
class AttitudeTasks extends Tasks{
    constructor(name,category,description){
        super(name,description);
        this.category = category;
        //this.description = description;
    }
}

export {GradedTask,AttitudeTasks};
