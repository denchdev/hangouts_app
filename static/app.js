var serverPath = '//mejoprome-1.appspot.com/';

var forbiddenCharacters = /[^a-zA-Z!0-9_\- ]/;
function setText(element, text) {
  element.innerHTML = typeof text === 'string' ?
      text.replace(forbiddenCharacters, '') :
      '';
}

function updateStateUi(state) {
  console.log('updateStateUi');
  var countElement = document.getElementById('time');
  var stateCount = state['time'];
  console.log('stateCount');

}

function updateParticipantsUi(participants) {
  console.log('Participants count: ' + participants.length);
  var participantsListElement = document.getElementById('participants');
  setText(participantsListElement, participants.length.toString());
}

function startLesson() {
  console.log('Button clicked');
  var value =0;
  var time = gapi.hangout.data.getState()['time'];
  console.log('time', time);
  if (time) {
    value = parseInt(time);
  }
  gapi.hangout.data.submitDelta({'time': '' + (time + 1)});
}

function render() {
  var lesson = {};
  lesson.user = {};
  lesson.user.name = 'Peter';
  lesson.user.role = 'Student';
  lesson.subject = 'Antique Greece History';
  lesson.hourlyRate = 10.0;
  lesson.id = gapi.hangout.getStartData();

  var body = document.getElementById('body');
  var infoDiv = document.createElement('div');
  infoDiv.innerHTML = '<h4>' + lesson.subject + ' (' + lesson.hourlyRate + '$/hr)<h4>' +
  '<h5>' + lesson.user.name + ' ' + lesson.user.role + '</h5>' +
  '<h5>' + 'Denis' + ' ' + 'teacher' + '</h5>' +
  '<h4>Lesson time: <p id="time>"0:00</p> ($0.00)</h4>' +
  '<h1>lesson - ' + lesson.id + '</h1>';

  var controlDiv = document.createElement('div');
  controlDiv.innerHTML = '<button onClick="startLesson()">Start lesson</button>';

  body.appendChild(infoDiv);
  body.appendChild(controlDiv);

  gapi.hangout.data.setValue('time', '0');
}

// A function to be run at app initialization time which registers our callbacks
function init() {
  console.log('Init app.');

  var apiReady = function(eventObj) {
    if (eventObj.isApiReady) {
      gapi.hangout.data.onStateChanged.add(function(eventObj) {
        updateStateUi(eventObj.state);
      });
      gapi.hangout.onParticipantsChanged.add(function(eventObj) {
        updateParticipantsUi(eventObj.participants);
      });

      var start_data = gapi.hangout.getStartData();
      console.log('start data', start_data);
      console.log('start data', JSON.parse(start_data));
      render();

      gapi.hangout.onApiReady.remove(apiReady);
    }
  };

  // This application is pretty simple, but use this special api ready state
  // event if you would like to any more complex app setup.
  gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
