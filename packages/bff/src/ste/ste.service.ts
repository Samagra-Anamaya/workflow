import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchemeTransactionEvent } from './dto/scheme.transaction.dto';
import axios from 'axios';
import { SteValidator } from './ste.validator';
import { map } from 'lodash';

@Injectable()
export class SteService {
  constructor(private readonly prismaService: PrismaService) {}

  private steValidator = new SteValidator();
  private userServiceBaseUrl = process.env.USER_SERVICE;
  private steApplicationId = process.env.STE_APPLICATION_ID;

  async authenticate(username: string, password: string) {
    let response;
    try {
      response = await axios.post(`${this.userServiceBaseUrl}/api/login`, {
        password: password,
        loginId: username,
        applicationId: this.steApplicationId,
      });
      if (response.data.responseCode === 'FAILURE') {
        return {
          status: 'failure',
          message: response.data.params.err,
        };
      }
      const token = response.data.result.data.user.token;
      return {
        status: 'success',
        message: 'Authenticated',
        token: token,
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async transformSchemeTransaction(
    schemeTransactions: SchemeTransactionEvent[],
    deptUsername: string,
  ): Promise<any[]> {
    return await Promise.all(
      map(schemeTransactions, async (transaction) => {
        return {
          userId: deptUsername,
          ...transaction,
        };
      }),
    );
  }

  async saveSchemeTransaction(
    schemetransactions: SchemeTransactionEvent[],
    userId: string,
  ) {
    const transactionStartTime = new Date();
    const schemeTransactionEvents = JSON.parse(
      JSON.stringify(schemetransactions),
    );
    const validatedSchemeTransactionEventBody =
      await this.validateSchemeTransactionEventBody(schemeTransactionEvents);
    const validSchemeTransactions =
      validatedSchemeTransactionEventBody.validSchemeTransactions;

    let validSchemeTransactionsSaved = false;
    try {
      const records = await this.transformSchemeTransaction(
        validSchemeTransactions,
        userId,
      );
      await this.prismaService.scheme_transaction.createMany({
        data: records,
      });
      validSchemeTransactionsSaved = true;
    } catch (error) {}
    let transactionHistory;
    try {
      transactionHistory =
        await this.prismaService.transaction_history_table.create({
          data: {
            requestBody: schemeTransactionEvents,
            containErrors: validatedSchemeTransactionEventBody.errorCount !== 0,
            errors: validatedSchemeTransactionEventBody.errors,
            userId,
            validRecordsSaved: validSchemeTransactionsSaved,
            transactionStartTime: transactionStartTime,
            transactionEndTime: new Date(),
          },
        });
    } catch (error) {
      console.log(
        `Transaction History Save Failed for ${userId}`,
        validatedSchemeTransactionEventBody,
      );
    }
    return {
      transactionId: transactionHistory.id,
      savedTransactionsCount:
        validatedSchemeTransactionEventBody.validSchemeTransactions.length,
      errorTransactionsCount: validatedSchemeTransactionEventBody.errorCount,
    };
  }

  async getTransactionHistory(transactionHistoryid: string) {
    const transactionHistory =
      await this.prismaService.transaction_history_table.findUnique({
        where: {
          id: transactionHistoryid,
        },
      });
    if (!transactionHistory) {
      throw new HttpException(
        `No transaction history found with id ${transactionHistoryid}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return transactionHistory;
  }

  async getProgress(userId: string) {
    const recordCount = await this.prismaService.scheme_transaction.count({
      where: {
        userId: userId,
      },
    });
    return { records_saved: recordCount };
  }

  async validateSchemeTransactionEventBody(
    schemeTransactionEvents: any[],
  ): Promise<any> {
    const validatedArray = {};
    validatedArray['validSchemeTransactions'] = [];
    validatedArray['errors'] = {};
    let errorCount = 0;
    for (let i = 0; i < schemeTransactionEvents.length; i++) {
      const errors = this.steValidator.validateSchemeTransactionEvent(
        schemeTransactionEvents[i],
      );
      if (Object.keys(errors).length === 0) {
        validatedArray['validSchemeTransactions'].push(
          schemeTransactionEvents[i],
        );
      } else {
        errorCount++;
        validatedArray['errors'][`${i}`] = errors;
      }
    }
    validatedArray['errorCount'] = errorCount;
    validatedArray['validSchemeTransactionsCount'] =
      validatedArray['validSchemeTransactions'].length;
    return validatedArray;
  }
}
