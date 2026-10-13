export function initOrderForm() {
  const form = document.querySelector('[data-order-form]');
  if (!form) return;
  const fields = [...form.querySelectorAll('input, textarea')];
  const status = form.querySelector('[data-order-status]');
  form.noValidate = true;
  form.querySelector('[type="submit"]').disabled = false;

  function validate(field) {
    field.setCustomValidity('');
    if (field.name === 'fullName' && field.value.trim().length < 2) {
      field.setCustomValidity(
        'Please enter your full name (at least 2 characters).'
      );
    }
    const valid = field.checkValidity();
    const error = document.getElementById(
      field.getAttribute('aria-describedby')
    );
    const message = field.validity.valueMissing
      ? 'Please fill in this field.'
      : field.validity.typeMismatch
        ? 'Please enter a valid email address.'
        : field.validationMessage;
    field.setAttribute('aria-invalid', String(!valid));
    field.classList.toggle('is-valid', valid && field.value.trim().length > 0);
    error.textContent = valid ? '' : message;
    error.hidden = valid;
    return valid;
  }

  fields.forEach((field) => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      status.hidden = true;
      status.textContent = '';
      if (field.hasAttribute('aria-invalid')) validate(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.hidden = true;
    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) {
      status.textContent = 'Please check the highlighted fields.';
      status.hidden = false;
      invalid[0].focus();
      return;
    }
    status.textContent =
      'Your details are valid. Sending is not connected yet; your request has not been sent.';
    status.hidden = false;
  });
}
