class AuthController {

    constructor(router) {
        router.post('/login', this.login.bind(this));
    }

    login(req, res) {
      console.log('*** login');
      res.json(true);
    }

}

module.exports = AuthController;
