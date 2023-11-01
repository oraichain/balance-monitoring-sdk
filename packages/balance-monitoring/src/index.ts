// @ts-nocheck
import { BigDecimal } from '@oraichain/oraidex-common';

const a = new BigDecimal(13);
const b = new BigDecimal(14);

console.log(a + (b + 12) / 5);
