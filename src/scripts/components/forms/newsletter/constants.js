const dataPrefixDonateForm = 'data-newsletter'
const dataPrefixForm = 'data-form'

export const selectors = {
  formContainer: `[${dataPrefixDonateForm}="form-container"]`,
  formSubmitButton: `[${dataPrefixDonateForm}="submit"]`,
  emailInput: `[${dataPrefixDonateForm}="email"]`,
  marketingEmailsCheckbox: `[${dataPrefixDonateForm}="marketing-emails"]`,
  inputError: `${dataPrefixForm}-error`,
  responseSuccess: `[${dataPrefixForm}="response-success"]`,
  responseError: `[${dataPrefixForm}="response-error"]`,
  responseErrorContent: `[${dataPrefixForm}="response-error-content"]`,
}
