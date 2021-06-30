import { browser, by, element, logging, WebElement } from 'protractor';

describe('plan sprint', () => {

    it('should login', async () => {
        await  browser.get(browser.baseUrl);

        element(by.css("input[formControlName=email]")).sendKeys("test@test.test");
        element(by.css("input[formControlName=password]")).sendKeys("testtest");

        element(by.buttonText('Login')).click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);
    });

    it('should create new project', async () => {
        await browser.get(browser.baseUrl);

        element(by.buttonText('Create new project')).click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let name = browser.driver.findElement(by.id('projectName'));
        await name.sendKeys("protractor test");

        let description = browser.driver.findElement(by.id('projectDescription'));
        await description.sendKeys("test description");

        let createButton = browser.driver.findElement(by.id('createButton'));
        createButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(await browser.driver.getCurrentUrl()).toEqual(browser.baseUrl);

        let row =  await browser.driver.findElement(by.id("navigator"));
        row.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(await browser.driver.getCurrentUrl()).toContain("backlog");
    });

    it('should create 5 new userstory', async () => {
        for(let i = 0; i < 5; i++)
        {
            let createUSButton = browser.driver.findElement(by.id('createUserstory'));
            createUSButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            let backlogLink = browser.driver.findElement(by.id("backlogLink"));
            backlogLink.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        let rows = await browser.driver.findElements(by.tagName("tr"));

        expect(rows.length - 1).toEqual(5);
    });

    it('should create new sprint', async () => {

        let sprintLink = browser.driver.findElement(by.id("sprintLink"));
        sprintLink.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        let createSprintButton = browser.driver.findElement(by.id('createSprint'));
        createSprintButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        let sprintBackLink = browser.driver.findElement(by.id("sprintLink"));
        sprintBackLink.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        let row = await browser.driver.findElement(by.id("sprintNavigator"));
        row.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(await browser.driver.getCurrentUrl()).toContain("administration");
    });

    it('should plan a sprint', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        let backlog = await browser.driver.findElement(by.id("backlog"));
        let sprint = await browser.driver.findElement(by.id("sprint"));

        let backlogRows = await backlog.findElements(by.tagName("tr"));
        for(let i = 2; i < 5; i++)
        {
            //await browser.actions().dragAndDrop(backlogRows[i], sprint).perform();
            //await dragAndDrop(backlogRows[i], sprint);
            await dragAndDrop(backlogRows[i], {x:250, y:0});
        }

        let sprintRows = await sprint.findElements(by.tagName("tr"));
        expect(sprintRows.length).toEqual(2);

    });

    it('should delete a project', async () => {
        await  browser.get(browser.baseUrl);
        await new Promise(resolve => setTimeout(resolve, 1000));

        let deleteProject =  await browser.driver.findElement(by.id("deleteProject"));
        deleteProject.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let confirm = await browser.driver.findElement(by.id("confirm"));
        confirm.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        let project: WebElement =  null;
        try{
            await browser.driver.findElement(by.id("navigator"));
        }
        catch{}

        expect(project).toBeNull();
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
        level: logging.Level.SEVERE,
        } as logging.Entry));
    });


    function dragAndDrop($element, $destination) {
        return browser
            .actions()
            .mouseMove($element)
            .perform()
            .then(() =>
                browser
                    .actions()
                    .mouseDown($element)
                    .perform()
            )
            .then(() =>
                browser
                    .actions()
                    .mouseMove($destination)
                    .perform()
            )
            .then(() =>
                browser
                    .actions()
                    .mouseUp()
                    .perform()
            );
    }
});