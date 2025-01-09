import { cexAssetModel } from '@api/cex/repository/models';
import { dexAssetModel } from '@api/dex/repository/models';
import logger from '@config/logger';
import { Platform } from '@config/types';
import AppUtils from '@src/utils';
import migrationModel from './repository/models';

const path = AppUtils.getFilePath(__filename);

const Index = async (number: number) => {
  try {
    const migration = await migrationModel.findOne({});
    if (migration?.number !== undefined && migration?.number < number) {
      logger.info(`Migration number ${number} started`);
      await dexAssetModel.updateMany({ platform: 'bitcoin' }, { $set: { platform: Platform.BITCOIN } });
      await dexAssetModel.updateMany({ platform: 'ethereum' }, { $set: { platform: Platform.ETHEREUM } });
      await dexAssetModel.updateMany({ platform: 'avalanche' }, { $set: { platform: Platform.AVALANCHE } });
      await dexAssetModel.updateMany({ platform: 'smartchain' }, { $set: { platform: Platform.BSC } });
      await dexAssetModel.updateMany({ platform: 'polkadot' }, { $set: { platform: Platform.POLKADOT } });
      await dexAssetModel.updateMany({ platform: 'polygon' }, { $set: { platform: Platform.POLYGON } });
      await dexAssetModel.updateMany({ platform: 'arbitrum' }, { $set: { platform: Platform.ARBITRUM } });
      await dexAssetModel.updateMany({ platform: 'optimism' }, { $set: { platform: Platform.OPTIMISM } });

      await cexAssetModel.updateMany({ cexName: 'binance' }, { $set: { platform: Platform.BINANCE } });
      await cexAssetModel.updateMany({ cexName: 'gateio' }, { $set: { platform: Platform.GATEIO } });
      await cexAssetModel.updateMany({ cexName: 'kucoin' }, { $set: { platform: Platform.KUCOIN } });

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
