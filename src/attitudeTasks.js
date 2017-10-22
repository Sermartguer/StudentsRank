import {AttitudeTasks} from './gradedtask.js';
import {localSave} from './utils.js';
function attitudeTasks() {
    let attTasks = [
        new AttitudeTasks('Participacio',''),
        new AttitudeTasks('Entrega',''),
        new AttitudeTasks('Evaluacio', '')
    ];
    localSave('attitudeTasks', attTasks);
}
export default attitudeTasks;
