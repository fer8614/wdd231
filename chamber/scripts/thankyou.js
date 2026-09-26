const params = new URLSearchParams(window.location.search);

const submittedFields = {
  first: "submitted-first",
  last: "submitted-last",
  email: "submitted-email",
  phone: "submitted-phone",
  organization: "submitted-organization",
  timestamp: "submitted-timestamp",
};

Object.entries(submittedFields).forEach(([parameter, elementId]) => {
  const element = document.querySelector(`#${elementId}`);
  const value = params.get(parameter)?.trim();

  if (element && value) {
    element.textContent = value;
  }
});
