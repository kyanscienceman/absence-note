var ABSENCE_FORM_CLASS = 'absence-form';
var SUBMIT_BUTTON = 'form-submit-ajax';
var PDF_BUTTON = 'form-create-pdf';
var TEXT_INPUT = 'input';
var EXPLANATION_INPUT = 'explanation';
var PERIOD_CHECKBOX = 'checkbox';
var FORM_ENTRIES = 'form-entry';
var ERROR_MESSAGE = 'error-message';

var setupForms = function(event) {
  forEachInClass(document, ABSENCE_FORM_CLASS, function(form) {
    form.onsubmit = form.onsubmit || function(event) {
      event.preventDefault();
    };

    var submitForm = function(event) {
      submit(form, {
        url: '/students/absencenote',
        method: 'POST',
        data: getData(form),
        success: function(res) {
          res = JSON.parse(res);
          if (res.success) return window.location.href = '/student/absencenote/' + res.note_id;
          else {
            forEachInClass(form, ABSENCE_FORM_CLASS, function(element) {
              element.innerHTML = res;
            });
          }
        },
        complete: function() {}
      }, ERROR_MESSAGE);
    };
    forEachInClass(form, SUBMIT_BUTTON, function(button) {
      button.addEventListener('click', submitForm);
    });
    forEachInClass(form, PDF_BUTTON, function(button) {
      button.addEventListener('click', getData);
    });
  });
};

//Returns a dictionary of all filled out inputs in the form
var getData = function(form) {
  var data = {};
  //Get the standalone entries in the form
  forEachInClass(form, FORM_ENTRIES, function(entry) {
    forEachInClass(entry, TEXT_INPUT, function(input) {
      data[input.name] = input.value;
    })
    forEachInClass(entry, EXPLANATION_INPUT, function(input) {
      data[input.name] = input.value;
    })
  });
  //Get the teachers and periods 
  forEachInClass(form, PERIOD_CHECKBOX, function(box) {
    if (box.checked) {
      forEachInClass(box.parentNode.parentNode, TEXT_INPUT, function(input) {
        data[input.name] = input.value;
      })
    }
  })
  return data;
};

document.addEventListener('DOMContentLoaded', setupForms);
