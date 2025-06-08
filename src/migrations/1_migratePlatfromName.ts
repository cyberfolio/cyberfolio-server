import { cexAssetModel } from '@api/cex/repository/models';
import { dexAssetModel } from '@api/dex/repository/models';
import AppStructures from '@structures/index';
import AppUtils from '@utils/index';
import AppConfig from '@config/index';
import migrationModel from './repository/models';

const path = AppUtils.getFilePath(__filename);

const migratePlatfromName = async (number: number) => {
  try {
    const migration = await migrationModel.findOne({});
    if (migration?.number !== undefined && migration?.number < number) {
      AppConfig.Logger.info(`Migration number ${number} started`);
      await dexAssetModel.updateMany({ platform: 'bitcoin' }, { $set: { platform: AppStructures.Platform.BITCOIN } });
      await dexAssetModel.updateMany({ platform: 'ethereum' }, { $set: { platform: AppStructures.Platform.ETHEREUM } });
      await dexAssetModel.updateMany(
        { platform: 'avalanche' },
        { $set: { platform: AppStructures.Platform.AVALANCHE } },
      );
      await dexAssetModel.updateMany({ platform: 'smartchain' }, { $set: { platform: AppStructures.Platform.BSC } });
      await dexAssetModel.updateMany({ platform: 'polkadot' }, { $set: { platform: AppStructures.Platform.POLKADOT } });
      await dexAssetModel.updateMany({ platform: 'polygon' }, { $set: { platform: AppStructures.Platform.POLYGON } });
      await dexAssetModel.updateMany({ platform: 'arbitrum' }, { $set: { platform: AppStructures.Platform.ARBITRUM } });
      await dexAssetModel.updateMany({ platform: 'optimism' }, { $set: { platform: AppStructures.Platform.OPTIMISM } });

      await cexAssetModel.updateMany({ cexName: 'binance' }, { $set: { platform: AppStructures.Platform.BINANCE } });
      await cexAssetModel.updateMany({ cexName: 'gateio' }, { $set: { platform: AppStructures.Platform.GATEIO } });
      await cexAssetModel.updateMany({ cexName: 'kucoin' }, { $set: { platform: AppStructures.Platform.KUCOIN } });

      await migrationModel.findOneAndUpdate({}, { number });
      AppConfig.Logger.info(`Migration number ${number} finished`);
    }
  } catch (e) {
    AppUtils.logError({
      e,
      func: migratePlatfromName.name,
      path,
    });
  }
};

export default migratePlatfromName;
