import { dexAssetModel } from '@api/dex/repository/models';
import AppUtils from '@utils/index';
import AppConfig from '@config/index';
import migrationModel from './repository/models';

const path = AppUtils.getFilePath(__filename);

const removeWrongPricedTokens = async (number: number) => {
  try {
    const migration = await migrationModel.findOne({});
    if (migration?.number !== undefined && migration?.number < number) {
      AppConfig.Logger.info(`Migration number ${number} started`);
      await dexAssetModel.deleteMany().or([{ symbol: 'uni-v2' }, { price: { $gte: 200000 } }]);
      await migrationModel.findOneAndUpdate({}, { number });
      AppConfig.Logger.info(`Migration number ${number} finished`);
    }
  } catch (e) {
    AppUtils.logError({
      e,
      func: removeWrongPricedTokens.name,
      path,
    });
  }
};

export default removeWrongPricedTokens;
