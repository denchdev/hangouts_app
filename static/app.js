var serverPath = '//mejoprome-1.appspot.com/';
var state_ = null;
var metadata_ = null;
var participants_ = null;
var startData = null;
var lesson = {};
var dispatcher = null;

function initData() {
  if ( gapi.hangout.data.getValue('lessonId') ) {
    lesson.id = gapi.hangout.data.getValue('lessonId');
    lesson.title = gapi.hangout.data.getValue('title');
    lesson.teacher = gapi.hangout.data.getValue('teacher');
    lesson.student = gapi.hangout.data.getValue('student');
    lesson.price = gapi.hangout.data.getValue('price');
    lesson.ref = gapi.hangout.data.getValue('apiPath');

    create_ws();
  } else {    
    var startData = gapi.hangout.getStartData();
    lesson = JSON.parse(startData);

    gapi.hangout.data.setValue('lessonId', '' + lesson.id);
    gapi.hangout.data.setValue('title', '' +lesson.title);
    gapi.hangout.data.setValue('teacher', '' +lesson.teacher);
    gapi.hangout.data.setValue('student', '' +lesson.student);
    gapi.hangout.data.setValue('price', '' +lesson.price);
    gapi.hangout.data.setValue('ref', '' +lesson.ref);

    create_ws();
    shareRef();
  }
}

function shareRef () {
  var ref = gapi.hangout.getHangoutUrl();
  var les = { id: lesson.id, ref: ref }

  dispatcher.trigger('lesson.update', les, success_cb, error_cb);

  function success_cb(data){
    console.log('success_cb', data);
  }
  function error_cb(error){
    console.log('error_cb', error);
  }

  dispatcher.bind('mew_message', function(data) {
    console.log('new_message', data);
  })
}

function create_ws() {
  dispatcher = new WebSocketRails("wss://"+lesson.ref+":443/websocket/");

  dispatcher.on_open = function(data) {
    console.log('Connection has been established: ', data);
    // You can trigger new server events inside this callback if you wish.
  }
}

function createTag(tag, inner, styleClass, root) {
  var elem = document.createElement(tag);
  elem.className = styleClass;
  elem.innerHTML = inner;
  root.appendChild(elem);
}

function render() {
  var t_user = gapi.hangout.getEnabledParticipants()[0];
  if(gapi.hangout.getEnabledParticipants()[1]) {
    var s_user = gapi.hangout.getEnabledParticipants()[1];
  }

  var body = document.getElementById('container');

  var headerDiv = document.createElement('div');
  headerDiv.innerHTML =  "<img src='https://sharetribe.s3.amazonaws.com/" +
   "images/communities/wide_logos/5145/header/logo3.png?1423572255' " +
   "class='headerImage'>";

  var infoDiv = document.createElement('div');
  createTag('p', lesson.title, 'lesson', infoDiv);
  createTag('p', '(' + (lesson.price/100) + '$/hr)', 'lesson', infoDiv);

  var teacherDiv = document.createElement('div');
  teacherDiv.className = 'person';
  createTag('div', "<img src=" + t_user.person.image.url + " class='avatar'>",
    'avatardiv', teacherDiv);
  createTag('div', "<span>" + lesson.teacher + "</span>",
    'avatardiv', teacherDiv);
  infoDiv.appendChild(teacherDiv);
  if(gapi.hangout.getEnabledParticipants()[1]) {
    var studentDiv = document.createElement('div');
    studentDiv.className = 'person';
    createTag('div', "<img src=" + s_user.person.image.url + " class='avatar'>",
      'avatardiv', studentDiv);
    createTag('div', "<span>" + lesson.student + "</span>",
      'avatardiv', studentDiv);
    infoDiv.appendChild(studentDiv);
  }


  var timeDiv = document.createElement('div');
  createTag('p',"Lesson time: <p id='time'>0:00</p>", 'timeDiv', timeDiv);
  createTag('p', "Lesson cost: <p id='cost'>$0.00</p>", 'timeDiv', timeDiv);

  var controlDiv = document.createElement('div');
  controlDiv.innerHTML = '<button>Start lesson</button>';

  body.appendChild(headerDiv);
  body.appendChild(infoDiv);
  body.appendChild(timeDiv);
  body.appendChild(controlDiv);
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
      render();

      gapi.hangout.onParticipantsAdded.add(function(eventObj) {
        render();
      });

      gapi.hangout.onApiReady.remove(apiReady);
    }
  };

  gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
