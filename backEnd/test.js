const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('User Registration and Login', function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });

  it('should register a new user and login', async function () {
    await driver.get('http://your-app-url/register');

    await driver.findElement(By.name('username')).sendKeys('testuser');
    await driver.findElement(By.name('email')).sendKeys('test@example.com');
    await driver.findElement(By.name('password')).sendKeys('password');
    await driver.findElement(By.name('registerButton')).click();


    await driver.wait(until.elementLocated(By.name('loginButton')), 5000);
    await driver.findElement(By.name('email')).sendKeys('test@example.com');
    await driver.findElement(By.name('password')).sendKeys('password');
    await driver.findElement(By.name('loginButton')).click();

    await driver.wait(until.elementLocated(By.name('profileButton')), 5000);

    const profileButton = await driver.findElement(By.name('profileButton'));
    assert.ok(await profileButton.isDisplayed(), 'User is logged in');
  });
});