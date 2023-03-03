export function validateSchema(schema, data) {
    return (req, res) => {
      const { error } = schema.validate(data, { abortEarly: false });
  
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(422).send(errors);
      }
      return;
    };
  }