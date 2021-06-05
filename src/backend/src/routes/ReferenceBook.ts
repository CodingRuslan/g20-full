import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import {CountriesController, LifeLevelController, ResourceController} from '../controllers';
import xlsx = require('xlsx');

const router = Router();
const { OK } = StatusCodes;

const countriesController = new CountriesController();
const resourceController = new ResourceController();
const lifeLevelController = new LifeLevelController()

router.post('/set-game-status', async (req: Request, res: Response) => {
    const status = await resourceController.changeStatusOfGame();
    return res.status(OK).send(status);
});

router.get('/is-game-going', async (req: Request, res: Response) => {
    const status = await resourceController.isGameGoing();
    return res.status(OK).send((status as any).value);
});

router.get('/header-links', async (req: Request, res: Response) => {
    const links = await resourceController.getHeaderLinks();
    return res.status(OK).send(links);
});

router.get('/countries', async (req: Request, res: Response) => {
    const countries = await countriesController.getAllCountries();
    return res.status(OK).send(countries);
});

router.get('/resources', async (req: Request, res: Response) => {
    const resources = await resourceController.getAllResources();
    return res.status(OK).send(resources);
});

router.get('/builds', async (req: Request, res: Response) => {
    const countries = await resourceController.getAllBuilds();
    return res.status(OK).send(countries);
});

router.get('/life-levels', async (req: Request, res: Response) => {
    const lifeLevels = await lifeLevelController.getAllLifeLevels();
    return res.status(OK).send(lifeLevels);
})

router.post('/create-build', async (req: Request, res: Response) => {
    const newBuild = await resourceController.createNewBuild(req.body);
    return res.status(OK).send(newBuild);
});

router.get('/add-resources', async (req: Request, res: Response) => {
    await resourceController.addResources();
    return res.status(OK).send();
});

router.post('/add-resources-timer', async (req: Request, res: Response) => {
    const { seconds } = req.body
    const deadline = await resourceController.addResourcesForTimer(seconds);
    return res.status(OK).send(deadline.toString());
});

router.delete('/add-resources-timer', async (req: Request, res: Response) => {
    await resourceController.stopAddingResourcesForTimer();
    return res.status(OK).send();
});

router.get('/add-resources-timer', async (req: Request, res: Response) => {
    const deadline = await resourceController.getDeadlineTimeForScheduler();
    console.log(deadline)
    return res.status(OK).send(deadline.toString());
});

router.post('/add-money', async (req: Request, res: Response) => {
    await resourceController.addMoney(req.body);
    return res.status(OK).send();
});

router.get('/trades', async (req: Request, res: Response) => {
    const trades = await resourceController.getAllTrades();
    return res.status(OK).send(trades);
});

router.get('/ads', async (req: Request, res: Response) => {
    const trades = await resourceController.getAllAds();
    return res.status(OK).send(trades);
});

router.get('/closed-trades', async (req: Request, res: Response) => {
    const trades = await resourceController.getAllClosedTrades();
    return res.status(OK).send(trades);
});

router.post('/trade', async (req: Request, res: Response) => {

    const trades = await resourceController.deleteTrade(req.body.id, req.body.uniqTradeKey);
    return res.status(OK).send(trades);
});

router.post('/create-trade', async (req: Request, res: Response) => {
    const trade = await resourceController.createTrade(req.body);
    return res.status(OK).send(trade);
});

router.post('/add-resource-country', async (req: Request, res: Response) => {
    const trade = await resourceController.addResourceToCountry(req.body);
    return res.status(OK).send(trade);
});


router.post('/import-data', async (req: Request, res: Response) => {
    const xlsxFile = xlsx.read((req.files as any).file.data, {type:'buffer', cellDates: true});
    const countries = xlsxFile.Sheets['Инфо о странах'];
    await resourceController.parseCountriesTable(countries);

    const resource = xlsxFile.Sheets['База ресурсов'];
    await resourceController.parseResourcesTable(resource);

    const startResource = xlsxFile.Sheets['Начальные ресурсы'];
    await resourceController.parseStartResourcesTable(startResource);

    const increasesResources = xlsxFile.Sheets['Прирост ресурсов'];
    await resourceController.parseIncreaseTable(increasesResources);

    const lifeLevels = xlsxFile.Sheets['Уровни жизни'];
    await lifeLevelController.parseLifeLevelTable(lifeLevels);

    const builds = xlsxFile.Sheets['Здания'];
    await resourceController.parseBuildTable(builds);

    const links = xlsxFile.Sheets['Ссылки'];
    await resourceController.parseLinkTable(links);

    const startBuild = xlsxFile.Sheets['Построенные здания'];
    const some = await resourceController.parseStartBuildTable(startBuild);

    return res.status(OK).send(some);
});

router.get('/download-trade-data', async (req: Request, res: Response) => {
    const buffer = await resourceController.generateTradeDoc();

    res.set({
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': 'attachment; filename=employeeInfoAccess.xlsx',
      });

    return res.status(OK).send(buffer);
});

router.post('/add-resource-all', async (req: Request, res: Response) => {
    const trade = await resourceController.addResourceToAll(req.body);
    return res.status(OK).send(trade);
});

router.get('/countries-stats', async (req: Request, res: Response) => {
    let countries = await countriesController.getAllCountries();
    const countriesWithResources = [];
    for(const country of countries) {
        const resources = await resourceController.getAllCountryResources(country);
        const trades = await resourceController.getAllCountryDeals(country);
        const builds = await resourceController.getAllCountryBuilds(country);
        const increases = await resourceController.getAllCountryIncreases(country);
        countriesWithResources.push({... country, resources, trades, builds, increases});
    }
    return res.status(OK).send(countriesWithResources);
});


export default router;
