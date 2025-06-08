import AppUtils from '@utils/index';
import migratePlatfromName from './1_migratePlatfromName';
import removeWrongPricedTokens from './2_removeWrongPricedTokens';
import migrationModel from './repository/models';

const path = AppUtils.getFilePath(__filename);

const AppMigrations = async () => {
  try {
    const migration = await migrationModel.findOne({});
    if (!migration) {
      await migrationModel.create({ number: 0 });
    }
    await migratePlatfromName(1);
    await removeWrongPricedTokens(2);
  } catch (e) {
    AppUtils.logError({
      e,
      func: AppMigrations.name,
      path,
    });
  }
};

export default AppMigrations;
