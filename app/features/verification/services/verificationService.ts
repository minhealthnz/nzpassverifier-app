import {
  getDefaultIssuerResolver,
  verify as sdkVerify,
  VerifyFailureReasonType,
  VerifyResponse,
  VerifyError,
  Cache,
} from "@mattrglobal/vc-cwt-verifier";
import base32Decode from "base32-decode";
import { Result, err, ok, fromThrowable } from "neverthrow";

import { VerifyErrorType } from "@mattrglobal/vc-cwt-verifier";

import { config } from "../../../common";
import {
  VerificationStatus,
  InvalidReason,
  VerificationFailureResult,
  DateStrings,
  VerificationResult,
} from "../state";
import { fromUnixTime } from "date-fns";
import { getDateStrings } from "../utilities";

const NZCP_PREFIX = "NZCP:";
const NZCP_VERSION = "1";

export type VerifyResultDetails = {
  readonly familyName: string | undefined;
  readonly givenName: string;
  readonly dob: DateStrings;
};

const mapSdkError = (sdkVerifyResult: VerifyError): VerificationFailureResult => {
  switch (sdkVerifyResult.type) {
    case VerifyErrorType.NetworkError:
    case VerifyErrorType.TimeoutError:
      return { status: VerificationStatus.CannotValidate };
    case VerifyErrorType.UnknownError:
      return { status: VerificationStatus.CannotRead };
  }
};

const mapVerifiedFail = (
  sdkVerifyResult: VerifyResponse,
  expiryString: DateStrings,
  expiredDuration: number
): VerificationFailureResult => {
  switch (sdkVerifyResult.reason?.type) {
    case VerifyFailureReasonType.PayloadInvalid:
    case VerifyFailureReasonType.UnsupportedAlgorithm:
      return { status: VerificationStatus.CannotRead };
    case VerifyFailureReasonType.Expired:
      return {
        status: VerificationStatus.Invalid,
        failureReason: InvalidReason.CredentialExpired,
        expiry: expiryString,
        expiredDuration: expiredDuration,
      };
    case VerifyFailureReasonType.IssuerNotTrusted:
      return { status: VerificationStatus.Invalid, failureReason: InvalidReason.IssuerNotTrusted };
    case VerifyFailureReasonType.IssuerPublicKeyInvalid:
      return { status: VerificationStatus.Invalid, failureReason: InvalidReason.IssuerPublicKeyInvalid };
    case VerifyFailureReasonType.NotActive:
      return { status: VerificationStatus.Invalid, failureReason: InvalidReason.CredentialNotActive };
    case VerifyFailureReasonType.SignatureInvalid:
      return { status: VerificationStatus.Invalid, failureReason: InvalidReason.SignatureInvalid };
    case undefined:
      // Should never happen
      return { status: VerificationStatus.CannotRead };
  }
};

const parsePayload = (payload: string): Result<Uint8Array, VerificationFailureResult> => {
  const [prefix, version, base32Payload] = payload.split("/");
  const error: VerificationFailureResult = {
    status: VerificationStatus.CannotRead,
  };

  // Validate payload
  if (!prefix || !version || !base32Payload) {
    return err(error); // Payload does not comply to NZCP spec
  }

  // Validate prefix
  if (prefix !== NZCP_PREFIX) {
    return err(error); // Payload does not match the expected NZCP prefix
  }

  // Validate version
  if (version !== NZCP_VERSION) {
    return err(error); // Payload does not match the supported NZCP version
  }

  const doDecodePayload = fromThrowable(
    () => new Uint8Array(base32Decode(base32Payload, "RFC4648")),
    (): VerificationFailureResult => error // Failed to decode base32 NZCP payload
  );
  return doDecodePayload();
};

const parsePayloadDetails = (
  data?: Record<string, unknown>
): Result<VerifyResultDetails, VerificationFailureResult> => {
  const { familyName, givenName, dob } = data || {};

  const error: VerificationFailureResult = { status: VerificationStatus.CannotRead };

  if (familyName && typeof familyName !== "string") {
    return err(error); // NZCP credential details contains invalid 'familyName'
  }
  if (typeof givenName !== "string") {
    return err(error); // NZCP credential details missing required 'givenName'
  }
  if (typeof dob !== "string") {
    return err(error); // NZCP credential details missing required 'dob'
  }

  const [year, month, day] = dob.split("-");

  return ok({
    givenName,
    familyName: familyName as string | undefined,
    dob: { year, month, day },
  });
};

/**
 * Options for verifying an NZCP
 * Including the payload to verify and the trusted issuer cache
 */
export type VerifyOptions = {
  readonly payload: string;
  readonly issuerCache: Cache;
};

/**
 * Verify a scanned payload
 *
 * @param options - {@link VerifyOptions}
 */
const verify = async (options: VerifyOptions): Promise<VerificationResult> => {
  const { payload, issuerCache } = options;

  const parsePayloadResult = parsePayload(payload);
  if (parsePayloadResult.isErr()) {
    return parsePayloadResult.error;
  }

  // TODO during caching task issuer resolver caching etc
  const sdkVerifyResult = await sdkVerify({
    trustedIssuers: config.TRUSTED_ISSUER_LIST,
    payload: parsePayloadResult.value,
    assertExpiry: true,
    assertNotBefore: true,
    issuerResolver: getDefaultIssuerResolver({
      cache: issuerCache,
      timeoutMs: config.ISSUER_RESOLUTION_REQUEST_TIMEOUT_MS,
    }),
  });

  // Handle SDK error
  if (sdkVerifyResult.isErr()) {
    return mapSdkError(sdkVerifyResult.error);
  }

  const expiry = sdkVerifyResult.value.payload?.exp;
  if (!expiry) {
    return { status: VerificationStatus.Invalid, failureReason: InvalidReason.CredentialExpired };
  }

  const expiryDate = fromUnixTime(expiry);
  const expiryDateStrings = getDateStrings(expiryDate);
  const daysDiffToNow = Math.abs(new Date().getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24);

  // Handle verify failure
  if (!sdkVerifyResult.value.verified) {
    return mapVerifiedFail(sdkVerifyResult.value, expiryDateStrings, daysDiffToNow);
  }

  // Verify credential details
  const parsePayloadDetailsResult = parsePayloadDetails(sdkVerifyResult.value.payload?.vc.credentialSubject);
  if (parsePayloadDetailsResult.isErr()) {
    return parsePayloadDetailsResult.error;
  }

  return {
    status: VerificationStatus.Valid,
    details: { ...parsePayloadDetailsResult.value, expiry: expiryDateStrings },
  };
};

export const verificationService = {
  verify,
};
