'use strict';

const { Builder, By, until, Key, WebDriver } = require('selenium-webdriver');
const { assert } = require('chai');
const fs = require('fs');
const path = require("path");
const FW_TIME_OUT = 10000;
const { browser, bowserMaximize, chrome, headless } = require('../../config')
const { Logging } = require("./common.js");
const { Driver } = require('selenium-webdriver/chrome');

var driver;
let chromeOptions = new chrome.Options();

chromeOptions.addExtensions(encode(path.resolve(__dirname, '../../../extensions/metamask.crx')));

function encode(file) {
    var stream = fs.readFileSync(file);
    return new Buffer.from(stream).toString('base64');
}

class Browser {
    static async init() {
        driver = new Builder()
            .forBrowser(browser)
            .setChromeOptions(chromeOptions)
            .build();
    }

    static getDriver() {
        return driver;
    }

    static async destroy() {
        await driver.quit();
    }

    static async getTittle() {

        return await driver.getTitle();
    }

    static async getUrl() {
        return await driver.getCurrentUrl();
    }

    static getLocator(sel, type) {
        let locator;

        switch (type) {
            case "className":
                locator = By.className(sel);
                break;
            case "css":
                locator = By.css(sel);
                break;
            case "id":
                locator = By.id(sel);
                break;
            case "js":
                locator = By.js(sel);
                break;
            case "linkText":
                locator = By.linkText(sel);
                break;
            case "name":
                locator = By.name(sel);
                break;
            case "partialLinkText":
                locator = By.partialLinkText(sel);
                break;
            default:
                locator = By.xpath(sel);
                break;
        }

        return locator;
    }
    static async findElement(sel, type) {
        return await driver.findElement(this.getLocator(sel, type));
    }

    static async findAnElement(el) {
        return await driver.wait(until.elementLocated(this.getLocator(el.selector, el.selectorType)), el.TIME_OUT);
    }

}

class Page {
    constructor(url, timeout) {
        if (driver === null || driver === undefined) {
            Browser.init();
        }
        this.url = url;

        if (timeout !== undefined) {
            this.TIME_OUT = timeout;
        }
        else {
            this.TIME_OUT = 3000;
        }
    }

    async navigate(url) {
        if (url !== undefined) {
            this.url = url;
        }
        await driver.get(this.url);
        if (bowserMaximize === true) {
            // await driver.manage().window().maximize();
        }
    }

    async getTitle() {
        return await Browser.getTittle();
    }

    async getCookie() {
        return await driver.manage().getCookies();
    }

    async addCookie(name, value) {
        return await driver.manage().addCookie(name, value);
    }

    async deleteCookie() {
        return await driver.manage().deleteCookie();
    }

    async getCurrentUrl() {
        return await Browser.getUrl();
    }

    async sleep(Timeout) {
        await driver.sleep(Timeout);
    }

    async quit() {
        await Browser.destroy();
    }

    wait() {
        Browser.wait(this.TIME_OUT);
    }
};

class Element {
    constructor(json) {
        this.name = json.name;
        this.selector = json.selector;
        this.selectorType = json.selectorType;
        this.TIME_OUT = json.TIME_OUT || FW_TIME_OUT;
    }

    setName(name) {
        this.name = name;
    }

    setSelector(sel) {
        this.selector = sel;
    }

    setSelectorType(typ) {
        this.selectorType = typ;
    }

    set(nm, sel, typ) {
        return new Element(nm, sel, typ);
    }

    async getInstance() {
        if (this.instance !== undefined || this.instance !== null) {
            this.instance = await Browser.findAnElement(this);
        }

        Logging.WriteLog(this.name, "getInstance");
        return await this.instance;
    }

    async click() {
        (await this.getInstance()).click();

        Logging.WriteLog(this.name, "click");
    }

    async inputText(text) {
        await this.getInstance();

        Logging.WriteLog(this.name, "inputText", text);
        await this.instance.sendKeys(text);
    }

    async inputTextEnter(text) {
        await this.getInstance();
        await this.instance.sendKeys(text, Key.ENTER);
    }

    async getText() {
        await this.getInstance();

        let txt = await this.instance.getText();
        Logging.WriteLog(this.name, "getText", txt);
        return txt;
    }

    async isEnabled() {
        await this.getInstance();

        return await this.instance.isEnabled();
    }

    async getIframe() {

        try {
            await this.getInstance();
            await driver.switchTo().frame(this.instance);
        }
        catch (err) {
            console.log(err);
        }

    }

    async get(prop) {
        await this.getInstance();

        Logging.WriteLog(this.name, "get(prop)", prop);
        return await this.instance.getAttribute(prop);
    }

};

module.exports = {
    Browser: Browser,
    Page: Page,
    Element: Element
}

