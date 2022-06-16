import { getFilePath, logError } from '@src/utils'
import migratePlatfromName from './1_migratePlatfromName'

const path = getFilePath(__filename)

const Index = async () => {
  try {
    await migratePlatfromName()
  } catch (e) {
    logError({
      e,
      func: Index.name,
      path,
    })
  }
}

export default Index
