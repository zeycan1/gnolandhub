import { GnoJSONRPCProvider } from '@gnolang/gno-js-client';

const provider = await GnoJSONRPCProvider.create('http://127.0.0.1:36657');

const allTokens = await provider.evaluateExpression(
  'gno.land/r/zeycan1/tba',
  'AllTokensCSV()'
);
console.log('AllTokensCSV raw result:', JSON.stringify(allTokens));

const info = await provider.evaluateExpression(
  'gno.land/r/zeycan1/tba',
  'TokenInfo("1")'
);
console.log('TokenInfo raw result:', JSON.stringify(info));
