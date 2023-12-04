export class SteValidator {
  validateSchemeCode(schemeCode: string): string[] {
    const error = [];
    if (!schemeCode) {
      error.push('EMPTY SCHEME CODE');
      return error;
    }
    if (schemeCode.length === 0) {
      error.push('SCHEME CODE CANNOT BE EMPTY STRING');
      return error;
    }
    return error;
  }

  validateAadhaarNumber(aadhaarNumber: string): string[] {
    const error = [];
    if (!aadhaarNumber) {
      error.push('EMPTY AADHAAR NUMBER');
      return error;
    }
    if (isNaN(Number(aadhaarNumber))) {
      error.push('AADHAAR NUMBER IS NOT A NUMBER');
      return error;
    }
    if (aadhaarNumber.length !== 12) {
      error.push('AADHAAR NUMBER SHOULD BE OF LENGTH 12');
      return error;
    }
    return error;
  }

  validateAadhaarReferenceNumber(aadhaarReferenceNumber: string): string[] {
    const error = [];
    if (!aadhaarReferenceNumber) {
      error.push('EMPTY AADHAAR REFERENCE NUMBER');
      return error;
    }
    if (isNaN(Number(aadhaarReferenceNumber))) {
      error.push('AADHAAR REFERENCE NUMBER IS NOT A NUMBER');
      return error;
    }
    if (aadhaarReferenceNumber.length !== 13) {
      error.push('AADHAAR REFERENCE NUMBER SHOULD BE OF LENGTH 13');
      return error;
    }
    return error;
  }

  validateUniqueBeneficiaryId(uniqueBeneficiaryId: string): string[] {
    const error = [];
    if (!uniqueBeneficiaryId) {
      error.push('EMPTY UNIQUE BENEFICIARY ID');
      return error;
    }
    if (uniqueBeneficiaryId.length === 0) {
      error.push('UNIQUE BENEFICIARY ID CANNOT BE EMPTY STRING');
      return error;
    }
    return error;
  }

  validateFinancialYear(financialYear: string): string[] {
    const error = [];
    if (!financialYear) {
      error.push('EMPTY FINANCIAL YEAR');
      return error;
    }
    const regex = /^\d{4}-\d{2}$/; // for YYYY-YY pattern
    if (!regex.test(financialYear)) {
      error.push('FINANCIAL NOT IN FORMAT OF YYYY-YY');
      return error;
    }
    return error;
  }

  validateTransactionType(transactionType: string): string[] {
    const error = [];
    if (!transactionType) {
      error.push('EMPTY TRANSACTION TYPE');
      return error;
    }
    if (transactionType.length === 0) {
      error.push('TRANSACTION TYPE CANNOT BE EMPTY STRING');
      return error;
    }
    return error;
  }

  validateTransactionAmount(transactionAmount): string[] {
    const error = [];
    if (!transactionAmount) {
      error.push('EMPTY TRANSACTION AMOUNT');
      return error;
    }
    if (typeof transactionAmount !== 'number') {
      error.push('TRANSACTION AMOUNT SHOULD BE AN INTEGER');
      return error;
    }
    return error;
  }

  validateInKindBenefitDetail(inKindBenefitDetail: string): string[] {
    const error = [];
    if (!inKindBenefitDetail) {
      error.push('EMPTY IN KIND BENEFIT DETAIL');
      return error;
    }
    if (inKindBenefitDetail.length === 0) {
      error.push('IN KIND BENEFIT DETAIL CANNOT BE EMPTY STRING');
      return error;
    }
    return error;
  }

  validateTransactionDate(transactionDate: string): string[] {
    const error = [];
    if (!transactionDate) {
      error.push('EMPTY TRANSACTION DATE');
      return error;
    }
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/; // for DD-MM-YYYY pattern
    if (!regex.test(transactionDate)) {
      error.push('TRANSACTION DATE NOT IN FORMAT OF DD-MM-YYYY');
      return error;
    }
    return error;
  }

  validateSchemeTransactionEvent(schemeTransaction: any): any {
    type ErrorObject = {
      [key: string]: any[];
    };
    const errors: ErrorObject = {};
    errors['schemeCode'] = this.validateSchemeCode(
      schemeTransaction.schemeCode,
    );
    errors['aadhaarNumber'] = this.validateAadhaarNumber(
      schemeTransaction.aadhaarNumber,
    );
    errors['aadhaarReferenceNumber'] = this.validateAadhaarReferenceNumber(
      schemeTransaction.aadhaarReferenceNumber,
    );
    errors['uniqueBeneficiaryId'] = this.validateUniqueBeneficiaryId(
      schemeTransaction.uniqueBeneficiaryId,
    );
    errors['financialYear'] = this.validateFinancialYear(
      schemeTransaction.financialYear,
    );
    errors['transactionType'] = this.validateTransactionType(
      schemeTransaction.transactionType,
    );
    errors['transactionAmount'] = this.validateTransactionAmount(
      schemeTransaction.transactionAmount,
    );
    errors['inKindBenefitDetail'] = this.validateInKindBenefitDetail(
      schemeTransaction.inKindBenefitDetail,
    );
    errors['transactionDate'] = this.validateTransactionDate(
      schemeTransaction.transactionDate,
    );
    const resError = {};
    Object.entries(errors).forEach(([key, value]) => {
      if (value.length > 0) {
        resError[key] = value[0];
      }
    });
    return resError;
  }
}
