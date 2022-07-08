const { Login } = require("../pageobject/facebookLogin.js");
const { expect, assert } = require("chai");
const { URL } = require('../../config');
describe("check facebook login", async () => {

    let loginPage = new Login();

    const loginScenario = async (email, password) => {

        // Input email
        await loginPage.email.inputText(email);

        // Input password
        await loginPage.password.inputText(password);

        // Click login button
        await loginPage.buttonLogin.click();
    }

    const loginMetamask = async (email, password) => {

        
    }

    beforeEach(async function () {

        await loginPage.navigate();

    });

    after(async function () {

        //await loginPage.quit();
    });

    it("should go to ezteam website and check the title", async () => {
        const title = await loginPage.getTitle();
        assert.equal(title, 'Facebook')
    });

    it("should next page projects when user input email and password are correct ", async () => {
        await loginScenario("01206157175", "anhvu123");
        const url = await loginPage.getCurrentUrl();
        assert.equal(url, `${URL}`)

    });

});