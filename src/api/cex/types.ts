import { CexName } from '@config/types';

export enum PaymentTransaction {
  CREDIT_CARD_PAYMENT = 'Credit Card Payment',
  CREDIT_CARD_WITHDRAWAL = 'Credit Card Withdrawal',
  BANK_PAYMENT = 'Bank Payment',
  BANK_WITHDRAWAL = 'Bank Withdrawal',
}

export interface PaymentHistoryResponse {
  orderNo: string;
  cex: CexName;
  type: string;
  fee: string;
  status: string;
  date: string;
  amount: string;
}
