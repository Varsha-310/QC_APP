export default function fieldValidate(field_value, length) {
  if (field_value?.length > length) {
    return true;
  }

  return false;
}
