import {getRepository} from "typeorm";
import { Country } from "../db/entities";

export default class CountriesController {

   async getAllCountries() {
      const countriesRepository = getRepository(Country);
      const countries = await countriesRepository.find({relations: [
            // 'lifeLevel'
         ]});
      return countries;
   }

}
