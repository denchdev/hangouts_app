var serverPath = '//mejoprome-1.appspot.com/';

var state_ = null;
var metadata_ = null;
var participants_ = null;
var startData = null;
var lesson = {};

function initData() {
  console.log('init data');
  if ( gapi.hangout.data.getValue('lessonId') ) {
    console.log('init data second', gapi.hangout.data.getValue('lessonId'));
    lesson.id = gapi.hangout.data.getValue('lessonId');
    lesson.title = gapi.hangout.data.getValue('title');
    lesson.teacher = gapi.hangout.data.getValue('teacher');
    lesson.student = gapi.hangout.data.getValue('student');
    lesson.price = gapi.hangout.data.getValue('price');
  } else {
    console.log('init data first', gapi.hangout.getStartData());
    var startData = gapi.hangout.getStartData();
    console.log('startData', startData);
    lesson = JSON.parse(startData);

    gapi.hangout.data.setValue('lessonId', '' + lesson.id);
    gapi.hangout.data.setValue('title', '' +lesson.title);
    gapi.hangout.data.setValue('teacher', '' +lesson.teacher);
    gapi.hangout.data.setValue('student', '' +lesson.student);
    gapi.hangout.data.setValue('price', '' +lesson.price);

    var url = gapi.hangout.getHangoutUrl();
    console.log('url', url);
    $.ajax({
      // this url for development
      // for production change url
      url: 'localhost:3000/lesson/' + lesson.id + '/' + url,      
      error: function() {
         console.log('error');
      },
      success: function(data) {
         console.log('success', data);
      },
      type: 'GET'
   });
  }
}

// function sendSharedData() {
//   gapi.hangout.data.sendMessage('"' + startData + '"');
// }
//
// function getSharedData(data) {
//   lesson = JSON.parse(data);
// }


function createP(inner, root) {
  var elem = document.createElement('p');
  elem.innerHTML = inner;
  root.appendChild(elem);
}

function render() {
  var body = document.getElementById('container');

  var infoDiv = document.createElement('div');
  createP(lesson.title + ' (' + (lesson.price/100) + '$/hr)', infoDiv);
  createP('Teacher: ' + lesson.teacher, infoDiv);
  createP('Student: ' + lesson.student, infoDiv);

  var timeDiv = document.createElement('div');
  createP("Lesson time: <p id='time'>0:00</p>", timeDiv);
  createP("Lesson cost: <p id='cost'>$0.00</p>", timeDiv);

  var controlDiv = document.createElement('div');
  controlDiv.innerHTML = '<button onClick="startLesson()">Start lesson</button>';

  body.appendChild(infoDiv);
  body.appendChild(timeDiv);
  body.appendChild(controlDiv);

  var user = gapi.hangout.getEnabledParticipants()[0];
  var picDiv = document.createElement('div');
  createP("<img src=" + user.person.image.url + ">", picDiv);
  body.appendChild(picDiv);
}

function render_time() {
  var timeDiv = $('#timeDiv');
}

// A function to be run at app initialization time which registers our callbacks
function init() {
  console.log('Init app.');

  var apiReady = function(eventObj) {
    if (eventObj.isApiReady) {
      initData();

      // gapi.hangout.onParticipantsAdded.add(function(eventObj) {
      //   console.log('onParticipantsAdded', eventObj);
      //   sendSharedData();
      // });
      //
      // gapi.hangout.data.onMessageReceived.add(function(eventObj) {
      //   console.log('eventObj', eventObj);
      //   getSharedData(eventObj);
      // });

      render();

      gapi.hangout.onApiReady.remove(apiReady);
    }
  };

  gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
