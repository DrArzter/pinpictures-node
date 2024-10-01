const { body, header, query, param } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

exports.sanitizeInput = [

  body('*').customSanitizer(value => {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }),

  header('*').customSanitizer(value => {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }),

  query('*').customSanitizer(value => {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }),

  param('*').customSanitizer(value => {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    });
  })
];
