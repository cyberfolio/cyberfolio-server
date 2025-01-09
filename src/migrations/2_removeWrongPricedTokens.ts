import { dexAssetModel } from '@api/dex/repository/models';
import logger from '@config/logger';
import AppUtils from '@src/utils';
import migrationModel from './repository/models';

const path = AppUtils.getFilePath(__filename);

const Index = async (number: number) => {
  try {
    const migration = await migrationModel.findOne({});
    if (migration?.number !== undefined && migration?.number < number) {
      logger.info(`Migration number ${number} started`);
      await dexAssetModel.deleteMany().or([{ symbol: 'uni-v2' }, { price: { $gte: 200000 } }]);
      await migrationModel.findOneAndUpdate({}, { number });
      logger.info(`Migration number ${number} finished`);
    }
  } catch (e) {
    AppUtils.logError({
      e,
      func: Index.name,
      path,
    });
  }
};

export default Index;
