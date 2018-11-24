const   fs      = require('fs'),
        path    = require('path'),
        express = require('express');

class Router {

    constructor() {
        this.startFolder = null;
    }

    //Called once during initial server startup
    load(app, folderName) {

        if (!this.startFolder) this.startFolder = path.basename(folderName);

        fs.readdirSync(folderName).forEach((file) => {

            const fullName = path.join(folderName, file);
            const stat = fs.lstatSync(fullName);

            if (stat.isDirectory()) {
                //Recursively walk-through folders
                this.load(app, fullName);
            } else if (file.toLowerCase().indexOf('.js')) {
                //Grab path to JavaScript file and use it to construct the route
                let dirs = path.dirname(fullName).split(path.sep);

                if (dirs[0].toLowerCase() === this.startFolder.toLowerCase()) {
                    dirs.splice(0, 1);
                }

                const router = express.Router();
                //Generate the route
                console.log(dirs);
                const baseRoute = '/' + dirs.join('/').replace('src/controllers/','');
                console.log(baseRoute);
                console.log('Created route: ' + baseRoute + ' for ' + fullName);

                //Load the JavaScript file ("controller") and pass the router to it
                // const controllerClass = require('../' + fullName);
                const controllerClass1 = require('../controllers/api/auth/auth.controller.js');
                const controller1 = new controllerClass1(router);
                const controllerClass2 = require('../controllers/api/states/states.controller.js');
                const controller2 = new controllerClass2(router);
                const controllerClass = require('../controllers/api/customers/customers.controller.js');
                const controller = new controllerClass(router);


                //Associate the route with the router
                app.use(baseRoute, router);
            }
        });
    }

}

module.exports = new Router();
