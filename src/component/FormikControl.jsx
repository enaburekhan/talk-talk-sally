import TinyMCEForm from '';

const FormikControl = ({ control, ...rest }) => {
  switch (control) {
    case 'tiny-mce':
      return <TinyMCEForm {...rest} />;
    default:
      return null;
  }
};

export default FormikControl;
