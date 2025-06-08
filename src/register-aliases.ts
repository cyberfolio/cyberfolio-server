import moduleAlias from 'module-alias';
import path from 'path';

moduleAlias.addAliases({
  '@api': path.join(__dirname, 'api'),
  '@config': path.join(__dirname, 'config'),
  '@constants': path.join(__dirname, 'constants'),
  '@migrations': path.join(__dirname, 'migrations'),
  '@modules': path.join(__dirname, 'modules'),
  '@structures': path.join(__dirname, 'structures'),
  '@utils': path.join(__dirname, 'utils'),
  '@providers': path.join(__dirname, 'modules/providers'),
  '@cex': path.join(__dirname, 'modules/cex'),
  '@dex': path.join(__dirname, 'modules/dex'),
  '@src': __dirname,
});
