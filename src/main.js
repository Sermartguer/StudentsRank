import {context} from './context.js';
import Singleton from './singleton.js';
/** Once the page is loaded we get a context app object an generate students rank view. */
window.onload = function() {
    //let context = new Context();
    console.log(Singleton.getInstance());
    Singleton.getInstance().adTask();
    Singleton.getInstance().addStudent();
    Singleton.getInstance().getRanking();
};
