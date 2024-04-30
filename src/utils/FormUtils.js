export function validateForm(formData, validationRules){
  const errors = {};
  let errorCount = 0;

  for (const fieldName in validationRules) {
    const rules = validationRules[fieldName];

    for (const rule of rules) {
      if (rule.required && !formData[fieldName].trim()) {
        errors[fieldName] = rule.message || "Campo obrigatório.";
        errorCount++;
        break;
      }
    }
  }

  return { errors, errorCount };
}
