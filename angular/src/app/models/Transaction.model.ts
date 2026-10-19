import { TransactionType } from "./TransactionType.model";
import { TransactionStatus } from "./TransactionStatus.model";
export interface Transaction {
    transactionId: string;
    accountId: string;
    recipientAccountId?: string | null;
    amount: number;
    description?: string | null;
    transactionType: TransactionType;
    dateCreated: Date;
    transferId: string | null;
    transactionStatus: TransactionStatus;
}