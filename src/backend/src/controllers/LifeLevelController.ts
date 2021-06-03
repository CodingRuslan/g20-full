import {getRepository} from "typeorm";
import {LifeLevel, Resource} from "../db/entities";

export default class LifeLevelController {

  async getAllLifeLevels() {
    const lifeLevelRepository = getRepository(LifeLevel);
    return await lifeLevelRepository.find()
  }

  async parseLifeLevelTable(table: any): Promise<any> {
    const lifeLevelRepository = getRepository(LifeLevel);
    await lifeLevelRepository.delete({});
    let row = 2;
    const resources = [];
    while (table[`A${row}`]) {
      const resource = {
        number: table[`A${row}`].v,
        name: table[`B${row}`].v,
        condition: table[`C${row}`].w
      };

      resources.push(resource);
      row++;
    }

    await lifeLevelRepository.save(resources);
  }

}
