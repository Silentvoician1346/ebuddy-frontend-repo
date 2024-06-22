import { FormHelperText } from "@mui/material";
import { red } from "@mui/material/colors";

const gotErrorMessage = (type: string) => {
  switch (type) {
    case "minLength":
      return "Minimum of 8 characters required.";
    default:
      return "Please fill the field.";
  }
};

const FormError = ({ error }: any) => {
  if (!error) {
    return <></>;
  }

  const { type } = error;
  const message = gotErrorMessage(type);

  return <FormHelperText sx={{ color: red[500], m: 0 }}>{message}</FormHelperText>;
};

export default FormError;
