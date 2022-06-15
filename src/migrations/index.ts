import { logError } from '@src/utils'
import migratePlatfromName from './1_migratePlatfromName'

const Index = async () => {
  try {
    await migratePlatfromName()
  } catch (e) {
    logError({
      e,
      func: Index.name,
      path: 'src/migrations/index.ts',
    })
  }
}

export default Index
