export const strings = {
  en: {
    verification: {
      buttonScanAgain: "Scan again",
      home: "home",
      valid: {
        title: "Valid",
        holdToPause: "Press and hold to pause",
      },
      invalid: {
        title: "Invalid",
        signatureInvalid: "This QR code is invalid.",
        credExpired: "The pass has expired.",
        issuerNotTrusted: "This pass was not issued by the Ministry of Health.",
        credNotActive: "This pass isn't active yet.",
      },
      cannotRead: {
        title: "Scan failed",
        description:
          "The QR code may be unreadable, or the certificate may not be the correct type or format.\n\nPlease try scanning again, or ask the visitor to confirm they have My Vaccine Pass.",
      },
      cannotValidate: {
        title: "Cannot validate",
        description:
          "This My Vaccine Pass can’t be verified because you haven’t connected to the internet and the app’s offline data is out of date. Please connect to the internet to continue scanning passes.",
      },
      presentorDetail: {
        ddmmyyyy: "dd / mm / yyyy",
        dob: "Date of birth",
        familyName: "Last name",
        firstNames: "First name(s)",
        certificateExpiryDate: "Pass expiry date",
        daysAgo: "days ago",
        expiredToday: "Expired today",
      },
      accessibility: {
        ddmmyyy: "day month year",
        firstNames: "first names",
        remainingDays: "days remaining until expiry",
        expiredDays: "days since expiry",
      },
      progress: {
        cancel: "Cancel",
      },
    },
  },
};
