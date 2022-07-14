import { getFilePath, logError } from '@src/utils';
import migratePlatfromName from './1_migratePlatfromName';
import removeWrongPricedTokens from './2_removeWrongPricedTokens';
import migrationModel from './repository/models';

const path = getFilePath(__filename);

const Index = async () => {
  try {
    const migration = await migrationModel.findOne({});
    if (!migration) {
      await migrationModel.create({ number: 0 });
    }
    await migratePlatfromName(1);
    await removeWrongPricedTokens(2);
  } catch (e) {
    logError({
      e,
      func: Index.name,
      path,
    });
  }
};

export default Index;
