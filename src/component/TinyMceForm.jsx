import { Field } from 'formik';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEForm = ({ name, ...rest }) => {
  return (
    <>
      <Field id={name} name={name} {...rest}>
        {({ form, field }) => {
          const { setFieldValue } = form;

          return (
            <>
              <Editor
                apiKey='qzdns6jmf0qi7om95ppnxngk06o19tuuzdx3zdde6ub7v7cb'
                value={field.value}
                init={{
                  height: 500,
                  menubar: true,
                  plugins:
                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tableofcontents footnotes mergetags autocorrect typography inlinecss',
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
                onEditorChange={(content, editor) => {
                  setFieldValue(name, content);
                }}
              />
            </>
          );
        }}
      </Field>
    </>
  );
};

export default TinyMCEForm;
