import AppStructures from '@structures/index';

export enum PaymentTransaction {
  CREDIT_CARD_PAYMENT = 'Credit Card Payment',
  CREDIT_CARD_WITHDRAWAL = 'Credit Card Withdrawal',
  BANK_PAYMENT = 'Bank Payment',
  BANK_WITHDRAWAL = 'Bank Withdrawal',
}

export interface CexPaymentHistory {
  orderNo: string;
  cexName: AppStructures.CexName;
  type: string;
  fee: string;
  status: string;
  date: string;
  createTime: number;
  fiatCurrency: string;
  amount: string;
}
