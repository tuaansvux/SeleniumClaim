'use strict';

const { Page, Element } = require("../framework/frameWork.js");
const { URL } = require('../../config');
const axios = require('axios');


class Login extends Page {
    constructor() {
        super(3000);
        this.url = `${URL}`
        this.email = new Element({
            "name": "Email",
            "selector": '//*[@id="email"]',
            "selectorType": "xpath"
        });

        this.password = new Element({
            "name": "password",
            "selector": '//*[@id="pass"]',
            "selectorType": "xpath"
        });

        this.buttonLogin = new Element({
            "name": "login button",
            "selector": '//*[@id="u_0_5_fP"]',
            "selectorType": 'xpath'
        });
    }
};

module.exports = {
    Login: Login
}