import Context from './context.js';
var Singleton = (function () {
    var instance;
 
    function createInstance() {
        var object = new Context();
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
export default Singleton;