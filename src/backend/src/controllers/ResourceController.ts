import { getRepository, IsNull, Not } from "typeorm";
import {
  Resource,
  ResourceOwner,
  Country,
  Trade,
  TradeStatus,
  Options,
  Build,
  IncreaseResources,
  ResourceCountRelations,
  Link,
  LifeLevel
} from "../db/entities";
const xl = require('excel4node');
import moment from "moment";
import BuildOwner from "src/db/entities/BuildOwner";

export default class ResourceController {
  async isGameGoing() {
    const optionsRepository = getRepository(Options);
    let status = await optionsRepository.findOne({ name: 'isGameGoing'});
    if(!status) {
      status = await optionsRepository.save({name: 'isGameGoing', value: true});
    }
    return status;
  }

  async getHeaderLinks() {
    const linksRepository = getRepository(Link);
    return await linksRepository.find();
  }

  async changeStatusOfGame() {
    const optionsRepository = getRepository(Options);
    const status = await optionsRepository.findOne({ name: 'isGameGoing'});
    return await optionsRepository.update(status as any, { value: !status?.value})
  }

  async getAllResources() {
    const resourcesRepository = getRepository(Resource);
    // const countryRepository = getRepository(Country);
    // const resourcesOwnerRepository = getRepository(ResourceOwner);
    // const r = await resourcesRepository.findOne();
    // const c = await countryRepository.findOne();
    // await resourcesOwnerRepository.save({ count: 50, country: c, resource: r});
    const resources = await resourcesRepository.find({isTradable: true});
    return resources;
  }

  async getAllBuilds() {
    const buildRepository = getRepository(Build);

    return await buildRepository.find({relations: [
      'changes',
      'buildConditions',
      'changes.resource',
      'buildConditions.resource',
      'lifeLevel'
      ]});
  }

  async addMoney({country, money}: any) {
    const countriesRepository = getRepository(Country);
    const selectCountry = await countriesRepository.findOne({id: country});
    return await countriesRepository.save({...selectCountry, money: Number(selectCountry?.money) + Number(money)})
  }

  async addResources() {
    const resourcesOwnerRepository = getRepository(ResourceOwner);
    const buildOwnerRepository = getRepository(BuildOwner);
    const increaseRepository = getRepository(IncreaseResources);
    const allBuildOwners = await buildOwnerRepository.find({relations: ['country', 'build', 'build.changes', 'build.changes.resource'],
     where: {
       build: Not(IsNull())
     }});

    for(const buildOwner of allBuildOwners) {
      for(const change of buildOwner.build.changes) {
        const foundResource = await resourcesOwnerRepository.findOne({
          country: {id: buildOwner.country.id}, resource: change.resource
        });
        if(foundResource){
          await resourcesOwnerRepository.update(foundResource,
            {
              count: +foundResource.count + +change.count
            })
        }
      }
    }

    const startResources = await increaseRepository.find({relations: ['resource', 'country'],
    where: {
      country: Not(IsNull()),
      resource:Not(IsNull())
    }});

    for(const startResource of startResources) {
      const foundResource = await resourcesOwnerRepository.findOne({
        country: {id: startResource.country.id}, resource: startResource.resource
      });
      if(foundResource){
        await resourcesOwnerRepository.update(foundResource,
          {
            count: +foundResource.count + +startResource.count
          })
      }
    }
  }

  async createNewBuild(data: any) {
    const buildRepository = getRepository(Build);
    const buildOwnerRepository = getRepository(BuildOwner);
    const countriesRepository = getRepository(Country);
    const resourcesOwnerRepository = getRepository(ResourceOwner);
    const optionsRepository = getRepository(Options);

    const isGameGoing = await optionsRepository.findOne({name: 'isGameGoing'});
    if(!isGameGoing?.value) {
      throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Действие недоступно: игра остановлена.`);
    }

    let country = await countriesRepository.findOne(data.country);
    const build = await buildRepository.findOne({relations: ['buildConditions', 'buildConditions.resource'], where: {id: data.build}});


    if(country && build) {
      if(country?.uniqTradeKey === data.uniqTradeKey) {
        if(country?.money >= build?.moneyCost) {
          for(const condition of build.buildConditions) {
            const resourceOwner = await resourcesOwnerRepository.findOne({ relations: ['resource'],
              where: {country, resource: condition.resource}});
            if((resourceOwner && +resourceOwner?.count < +condition.count) || !resourceOwner) {
              throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Недостаточно ресурсов`);
            }
          }

          for(const condition of build.buildConditions) {
            const resourceOwner = await resourcesOwnerRepository.findOne({ relations: ['resource'],
              where: {country,
              resource: condition.resource}
            });
            if(resourceOwner) {
              await resourcesOwnerRepository.update(resourceOwner, {count: resourceOwner?.count - condition.count});
            }
          }

          country = await countriesRepository.save({...country, money: country.money - build?.moneyCost});

          return await buildOwnerRepository.save({country, build});
        } else {
          throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] У страны недостаточно денег`);
        }
      } else {
          throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Неверный уникальный ключ`);
      }
    }
  }

  async getAllCountryResources(country: any) {
    const resourcesOwnerRepository = getRepository(ResourceOwner);
    return await resourcesOwnerRepository.find({ relations: ['resource'],
     where: {
      country
  } });
  }

  async getAllCountryDeals(country: any) {
    const tradeRepository = getRepository(Trade);
    return await tradeRepository.find({ relations: ['seller', 'buyer', 'owner', 'resource'],
    where: [
      {owner: country}
   ] });
  }

  async getAllCountryIncreases(country: any) {
    const increasesRepository = getRepository(IncreaseResources);
    const buildsOwnerRepository = getRepository(BuildOwner);
    const unSortedIncreases = await increasesRepository.find({ relations: ['country', 'resource'],
      where: { country }
    });
    const sortedIncreases = {} as any;
    unSortedIncreases.forEach(increase => {
      if(increase?.resource) {
        if(!sortedIncreases[increase?.resource.name]) {
          sortedIncreases[increase?.resource.name] = +increase?.count;
        } else {
          sortedIncreases[increase?.resource.name] += +increase?.count;
        }
      }
    });

    const unSortedBuildsOwner = await buildsOwnerRepository.find({
      relations: ['country', 'build', 'build.changes', 'build.changes.resource'],
      where: { country }
    });
    unSortedBuildsOwner.forEach(buildOwner => {
      buildOwner?.build?.changes.forEach(change => {
        if(!sortedIncreases[change.resource.name]) {
          sortedIncreases[change.resource.name] = +change.count;
        } else {
          sortedIncreases[change.resource.name] += +change.count;
        }
      })
    })

    return sortedIncreases;
  }

  async getAllCountryBuilds(country: any) {
    const buildsOwnerRepository = getRepository(BuildOwner);
    const unSortedBuildsOwner = await buildsOwnerRepository.find({ relations: ['country', 'build'],
    where: { country }
    });
    const sortedBuilds = {} as any;
    unSortedBuildsOwner.forEach(build => {
      if(build?.build) {
        if(!sortedBuilds[build.build.name]) {
          sortedBuilds[build.build.name] = 1;
        } else {
          sortedBuilds[build.build.name] += 1;
        }
      }
    });
    return sortedBuilds;
  }

  async getAllTrades() {
    const tradesRepository = getRepository(Trade);
    return (await tradesRepository.find({ relations: ['owner', 'buyer', 'resource', 'seller'], where: {
      status: TradeStatus.Active,
      seller: Not(IsNull()),
      buyer: Not(IsNull())
    } })).sort((a: any, b: any) => b.time - a.time);
  }

  async getAllAds() {
    const tradesRepository = getRepository(Trade);
    return await tradesRepository.find({ relations: ['owner', 'buyer', 'resource', 'seller'], where: [
      {seller: null}, {buyer: null}
    ] });
  }

  async deleteTrade(id: any, uniqTradeKey: string) {
    const tradesRepository = getRepository(Trade);
    const optionsRepository = getRepository(Options);

    const isGameGoing = await optionsRepository.findOne({name: 'isGameGoing'});
    if(!isGameGoing?.value) {
      throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Действие недоступно: игра остановлена.`);
    }

    const trade = await tradesRepository.findOne({relations: ['owner'], where: { id }});
    if(trade?.owner.uniqTradeKey === uniqTradeKey) {
      return await tradesRepository.delete(id);
    } else {
      throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Неверный уникальный ключ`);
    }
  }

  async getAllClosedTrades() {
    const tradesRepository = getRepository(Trade);
    return await tradesRepository.find({ relations: ['owner', 'buyer', 'resource', 'seller'], where: {
      status: TradeStatus.Closed
    } });
  }

  async addResourceToAll(data: any) {
    const countriesRepository = getRepository(Country);
    const countries = await countriesRepository.find();

    for(const country of countries) {
      await this.addResourceToCountry({...data, country: country.id})
    }
  }

  async addResourceToCountry(data: any) {
    const countriesRepository = getRepository(Country);
    const resourcesRepository = getRepository(Resource);
    const resourceOwnersRepository = getRepository(ResourceOwner);
    const resource = await resourcesRepository.findOne({ id: data.resource });
    const country = await countriesRepository.findOne({ id: data.country });

    const isHasCountryResource = await resourceOwnersRepository.findOne({
      country, resource
    });

    if(isHasCountryResource) {
      return await resourceOwnersRepository.update(
        isHasCountryResource,
        { count: +isHasCountryResource.count + +data.count });
    } else {
      return await resourceOwnersRepository.save({
        country,
        resource,
        count: +data.count
      })
    }
  }

  async createTrade(data: any) {
    const tradeRepository = getRepository(Trade);
    const countriesRepository = getRepository(Country);
    const resourcesRepository = getRepository(Resource);
    const resourceOwnersRepository = getRepository(ResourceOwner);
    const optionsRepository = getRepository(Options);

    const isGameGoing = await optionsRepository.findOne({name: 'isGameGoing'});
    if(!isGameGoing?.value) {
      throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Действие недоступно: игра остановлена.`);
    }

    let seller = null;
    let buyer = null;
    const resource = await resourcesRepository.findOne({ id: data.resource });
    const owner = await countriesRepository.findOne({ id: data.owner });
    if(data.owner === data.seller) {
      seller = owner;
      if(data.buyer) {
        buyer = await countriesRepository.findOne({ id: data.buyer });
      }
    } else if (data.owner === data.buyer) {
      buyer = owner;
      if(data.seller) {
        seller = await countriesRepository.findOne({ id: data.seller });
      }
    } else {
       throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Ошибка создания сделки`);
    }

    if(seller && buyer && seller.id === buyer.id || owner?.uniqTradeKey !== data.uniqTradeKey) {
      throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Ошибка создания сделки или неверный уникальный ключ`);
    }

    let similarTrade = null;

    if(buyer && seller) {
      similarTrade = await tradeRepository.findOne({
        where: {
          seller,
          buyer,
          resource,
          count: data.count,
          cost: data.cost,
          owner: {
            id: Not(owner?.id)
          },
          status: TradeStatus.Active
        },
        relations: ['seller', 'buyer', 'resource', 'owner']
      });
    }

    if(similarTrade) {
      const resourceOfCountry = await resourceOwnersRepository.findOne({
        relations: ['country', 'resource'], where: {
          country: similarTrade.seller,
          resource: similarTrade.resource
      } })

      if(buyer && buyer?.money >= similarTrade.sum &&
        resourceOfCountry &&
        resourceOfCountry?.count >= similarTrade.count &&
        seller) {
            console.log(await countriesRepository.findOne(buyer));
            buyer = await countriesRepository.save({...buyer, money: buyer.money - similarTrade.sum });
            console.log(await countriesRepository.findOne(buyer));
            await resourceOwnersRepository.update(resourceOfCountry, { count: resourceOfCountry.count - similarTrade.count })
            await countriesRepository.update(seller, { money: Number(seller.money) + Number(similarTrade.sum) });

            let isHasCountryResource;
            if(buyer) {
              isHasCountryResource = await resourceOwnersRepository.findOne({
                country: buyer, resource: similarTrade.resource
              });
            }

            if(isHasCountryResource) {
              await resourceOwnersRepository.update(isHasCountryResource,
                 { count: Number(isHasCountryResource.count) + Number(similarTrade.count) })
            } else {
              await resourceOwnersRepository.save({
                country: buyer,
                resource: similarTrade.resource,
                count: similarTrade.count
            });
          }

          similarTrade = await tradeRepository.findOne({
            where: {
              seller,
              buyer,
              resource,
              count: data.count,
              cost: data.cost,
              owner: {
                id: Not(owner?.id)
              },
              status: TradeStatus.Active
            },
            relations: ['seller', 'buyer', 'resource', 'owner']
          });

          if(similarTrade) {
            await tradeRepository.delete(similarTrade);
          }

          return {
            ...await tradeRepository.save({ ...similarTrade, status: TradeStatus.Closed }),
            deletedTrade: similarTrade && similarTrade.id
          };
      } else {
        throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Недостаточно денег или ресурса`);
      }
    } else {
      if(seller && !buyer) {
        return await tradeRepository.save({
            time: moment.utc().add(3, 'hours').format(),
            count: data.count,
            cost: data.cost,
            sum: data.sum,
            owner,
            seller,
            resource
          });
      } else if(!seller && buyer) {
        return await tradeRepository.save({
          time: moment.utc().add(3, 'hours').format(),
          count: data.count,
          cost: data.cost,
          sum: data.sum,
          owner,
          buyer,
          resource
        });
      } else if(seller && buyer) {
        return await tradeRepository.save({
          time: moment.utc().add(3, 'hours').format(),
          count: data.count,
          cost: data.cost,
          sum: data.sum,
          owner,
          buyer,
          seller,
          resource
        });
      } else {
        throw new Error(`[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Для сделки нужен покупатель или продавец`);
      }
    }
  }

  async generateTradeDoc(): Promise<any> {
    const wb = new xl.Workbook();
    const trades = wb.addWorksheet('Сделки');

    trades.cell(1, 1).string('Время');
    trades.cell(1, 2).string('Оформитель');
    trades.cell(1, 3).string('Покупатель');
    trades.cell(1, 4).string('Продавец');
    trades.cell(1, 5).string('Товар');
    trades.cell(1, 6).string('Цена');
    trades.cell(1, 7).string('Количество');
    trades.cell(1, 8).string('Стоимость');
    trades.cell(1, 9).string('Статус');

    const tradeRepository = getRepository(Trade);

    const allTrades = await tradeRepository.find({ relations: ['owner', 'seller', 'buyer', 'resource'] });

    allTrades.map((trade, index) => {
      trades.cell(index + 2, 1).string(moment(trade.time).format('DD.MM.YYYY hh:mm:ss'));
      trades.cell(index + 2, 2).string(trade.owner?.name);
      trades.cell(index + 2, 3).string(trade.buyer?.name);
      trades.cell(index + 2, 4).string(trade.seller?.name);
      trades.cell(index + 2, 5).string(trade.resource?.name);
      trades.cell(index + 2, 6).number(trade.cost);
      trades.cell(index + 2, 7).number(trade.count);
      trades.cell(index + 2, 8).number(trade.sum);
      trades.cell(index + 2, 9).string(trade.status === TradeStatus.Active ? 'Открыта' : 'Закрыта');
    })

    const countries = wb.addWorksheet('Инфо о странах');

    countries.cell(1, 1).string('№');
    countries.cell(1, 2).string('Название страны');
    countries.cell(1, 3).string('Уникальный торговый ключ (УТК)');
    countries.cell(1, 4).string('Изображение страны');
    countries.cell(1, 5).string('Деньги');

    const countriesRepository = getRepository(Country);
    const allCountries = await countriesRepository.find();

    allCountries.map((country, index) => {
      countries.cell(index + 2, 1).number(index+1);
      countries.cell(index + 2, 2).string(country.name);
      countries.cell(index + 2, 3).string(country.uniqTradeKey);
      countries.cell(index + 2, 4).string(country.img);
      countries.cell(index + 2, 5).number(country.money);
    });


    const increase = wb.addWorksheet('Прирост ресурсов');

    increase.cell(1, 1).string('Страна');
    increase.cell(1, 2).string('Название ресурса');
    increase.cell(1, 3).string('Количество');
    let index = 0;

    for (const country of allCountries) {
      const increases = await this.getAllCountryIncreases(country);
      Object.keys(increases).map((increaseItem) => {
        increase.cell(index + 2, 1).string(country.name);
        increase.cell(index + 2, 2).string(increaseItem);
        increase.cell(index + 2, 3).number(increases[increaseItem]);
        index++;
      })
    }

    const addedBuilds = wb.addWorksheet('Построенные здания');
    addedBuilds.cell(1, 1).string('Страна');
    addedBuilds.cell(1, 2).string('Сфера');
    addedBuilds.cell(1, 3).string('Количество');
    let indexOfBuilds = 0;

    for (const country of allCountries) {
      const allCountryBuilds = await this.getAllCountryBuilds(country);
      Object.keys(allCountryBuilds).map((buildItem) => {
        addedBuilds.cell(indexOfBuilds + 2, 1).string(country.name);
        addedBuilds.cell(indexOfBuilds + 2, 2).string(buildItem);
        addedBuilds.cell(indexOfBuilds + 2, 3).number(allCountryBuilds[buildItem]);
        indexOfBuilds++;
      })
    }

    return await wb.writeToBuffer();
  }

  async parseLinkTable(table: any): Promise<any> {
    const linksRepository = getRepository(Link);
    await linksRepository.delete({});

    let row = 2;
    const linksArray = [];
    while (row !== 6) {
        const link = {
            name: table[`B${row}`].v,
            link: table[`C${row}`].v
        };
        linksArray.push(link);
        row++;
    }

    await linksRepository.save(linksArray)
  }

  async parseStartResourcesTable(table: any): Promise<any> {
    const resourcesRepository = getRepository(Resource);
    const countriesRepository = getRepository(Country);
    const resourceOwnersRepository = getRepository(ResourceOwner);
    await resourceOwnersRepository.delete({});

    let row = 2;
    const resourcesOwnerArray = [];
    while (table[`A${row}`]) {
        const resourceOwner = {
            country: await countriesRepository.findOne({name: table[`B${row}`].v}),
            resource: await resourcesRepository.findOne({name: table[`C${row}`].v}),
            count: table[`D${row}`].v
        };

        if(resourceOwner.country && resourceOwner.resource) {
          resourcesOwnerArray.push(resourceOwner);
        }
        row++;
    }
    await resourceOwnersRepository.save(resourcesOwnerArray);
  }

  async parseResourcesTable(table: any): Promise<any> {
    const resourcesRepository = getRepository(Resource);
    await resourcesRepository.delete({});
    let row = 2;
    const resources = [];
    while (table[`A${row}`]) {
        const resource = {
            name: table[`B${row}`].v,
            isTradable: table[`C${row}`].w
        };

        resources.push(resource);
        row++;
    }

    await resourcesRepository.save(resources);
  }

  async parseCountriesTable(table: any): Promise<any> {
    const countriesRepository = getRepository(Country);
    await countriesRepository.delete({});
    let row = 2;
    const countries = [];

    while (table[`A${row}`]) {
        const country = {
            name: table[`B${row}`].v,
            uniqTradeKey: table[`C${row}`].v,
            img: table[`D${row}`].v,
            money: table[`E${row}`].v
        };

        countries.push(country);
        row++;
    }

    await countriesRepository.save(countries);
}

  async parseIncreaseTable(table: any): Promise<any> {
    const increaseRepository = getRepository(IncreaseResources);
    const countriesRepository = getRepository(Country);
    const resourcesRepository = getRepository(Resource);
    await increaseRepository.delete({});
    let row = 2;
    const increases = [];

    while (table[`A${row}`]) {
        const increase = {
            country: await countriesRepository.findOne({name: table[`B${row}`].v}),
            resource: await resourcesRepository.findOne({name: table[`C${row}`].v}),
            count: table[`D${row}`].v,
        };

        increases.push(increase);
        row++;
    }

    await increaseRepository.save(increases);
  }

  async parseStartBuildTable(table: any): Promise<any> {
    const buildOwnersRepository = getRepository(BuildOwner);
    const countriesRepository = getRepository(Country);
    const buildsRepository = getRepository(Build);
    await buildOwnersRepository.delete({});
    let row = 2;
    const builds = [];

    while (table[`A${row}`]) {
        const build = {
            country: await countriesRepository.findOne({name: table[`B${row}`].v}),
            build: await buildsRepository.findOne({name: table[`C${row}`].v}),
        };
        for(let i = 0; i < table[`D${row}`].v; i++) {
          builds.push(build);
        }
        row++;
    }

    return await buildOwnersRepository.save(builds);
  }

  async parseBuildTable(table: any): Promise<any> {
    const buildRepository = getRepository(Build);
    const resourceCountRepository = getRepository(ResourceCountRelations);
    const resourcesRepository = getRepository(Resource);
    const lifeLevelRepository = getRepository(LifeLevel)
    await buildRepository.delete({});

    const getResourcesCount = async (cell: any) => {
      const splitChangesData = table[cell].v.split(';');
        const resourcesCount = [];

        for(const change of splitChangesData) {
          const changeSplit = change.split(',');
          const resource = await resourcesRepository.findOne({name: changeSplit[0]});
          const count = changeSplit[1];
          if(resource && count) {
            resourcesCount.push({
              resource,
              count
            });
          }
        }
        return await resourceCountRepository.save(resourcesCount);
    }

    let row = 2;
    const builds = [];

    while (table[`A${row}`]) {
        const build = {
            name: table[`B${row}`].v,
            changes: table[`C${row}`] && await getResourcesCount(`C${row}`),
            buildConditions: table[`D${row}`] && await getResourcesCount(`D${row}`),
            moneyCost: table[`E${row}`].v,
            icon: table[`F${row}`].v,
            lifeLevel: await lifeLevelRepository.findOne({number: table[`G${row}`].v}),
        };

        builds.push(build);
        row++;
    }

    await buildRepository.save(builds);
  }
}
