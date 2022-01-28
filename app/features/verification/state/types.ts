export type DateStrings = {
  readonly day: string;
  readonly month: string;
  readonly year: string;
};

export const enum VerificationStatus {
  /**
   * Credential is valid
   */
  Valid = "Valid",
  /**
   * Credential is invalid
   */
  Invalid = "Invalid",
  /**
   * Payload does not conform to NZCP spec
   */
  CannotRead = "CannotRead",
  /**
   * Unable to verify the NZCP payload
   */
  CannotValidate = "CannotValidate",
}

export const enum CannotReadReason {
  /**
   * Payload is malformed
   */
  PayloadInvalid = "PayloadInvalid",
}

export const enum InvalidReason {
  /**
   * Issuer of the credential is not trusted
   */
  IssuerNotTrusted = "IssuerNotTrusted",
  /**
   * Invalid issuer public key
   */
  IssuerPublicKeyInvalid = "IssuerPublicKeyInvalid",
  /**
   * The signature of the credential is invalid
   */
  SignatureInvalid = "SignatureInvalid",
  /**
   * Credential are expired
   */
  CredentialExpired = "CredentialExpired",
  /**
   * Credential are not active
   */
  CredentialNotActive = "CredentialNotActive",
}

export type VerificationState = {
  readonly isLoading: boolean;
  readonly result?: VerificationResult;
};

export type VerificationResultValid = {
  readonly status: VerificationStatus.Valid;
  readonly details: VerificationDetails;
};

export type VerificationResultInvalid = {
  readonly status: VerificationStatus.Invalid;
  readonly failureReason: InvalidReason;
};

export type VerificationResultCannotRead = {
  readonly status: VerificationStatus.CannotRead;
};

export type VerificationResultCannotValidate = {
  readonly status: VerificationStatus.CannotValidate;
  // no reason needed
};

export type VerificationFailureResult =
  | VerificationResultInvalid
  | VerificationResultCannotRead
  | VerificationResultCannotValidate;

export type VerificationResult = VerificationResultValid | VerificationFailureResult;
export type VerificationResultWithProcessedTime = VerificationResult & {
  readonly processedInMs: number;
};

export type VerificationDetails = {
  readonly familyName?: string;
  readonly givenName: string;
  readonly dob: DateStrings;
  readonly expiry: DateStrings;
};
