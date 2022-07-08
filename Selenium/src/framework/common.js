'use strict';
class Logging {

    static async WriteLogConsole(text) {
        console.log(new Date().toString('YYYY-MM-dd') + " : " + text);
    }

    static async WriteLog(objname, typefunction, objval) {
        if (typeof objval == "undefined") {
            this.WriteLogConsole(`[object : ${objname}] -> [func : ${typefunction}]`);
        }
        else {
            this.WriteLogConsole(`[object : ${objname}] -> [func : ${typefunction}] -> [value : ${objval}]`);
        }
    }
}
module.exports = {
    Logging: Logging
}