
## Signing API changes

The legacy `keystone-sign-request` / `keystone-sign-result` APIs have been removed. Use TRON Native for TRON and PSBT Extend for LTC, BCH, DASH and DOGE. These protocols require different transaction inputs and response handling; they are not drop-in replacements. Integrations that still require the removed APIs must pin an earlier SDK version.
# keystone-sdk-web