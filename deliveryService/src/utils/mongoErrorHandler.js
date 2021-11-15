module.exports = (err) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    const fields = Object.values(err.errors).map((el) => el.path);
    if (errors.length > 1) {
      const formattedErrors = errors.join(' ');
      return { messages: formattedErrors, fields };
    }
    return { messages: errors, fields };
  }
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue);
    return { error: `this value for field ${field} is busy`, status: 'error' };
  }
};
