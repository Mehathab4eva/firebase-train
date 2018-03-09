  // Initialize Firebase
 var config = {
    apiKey: "AIzaSyBQ4HcLk0k311xEH3wWIL72jUhg1MrB1Fo",
    authDomain: "fir-train-1eeaa.firebaseapp.com",
    databaseURL: "https://fir-train-1eeaa.firebaseio.com",
    projectId: "fir-train-1eeaa",
    storageBucket: "",
    messagingSenderId: "842201832366"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //creating the variable 
  let trainName ;
  let destination;
  let firstTrain;
  let frequency;

  //send data to database with .on("click")
  $("#submit").on("click", function(event) {
    event.preventDefault();
    // $("#tableData").empty();

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      firstTrain: firstTrain,
    });
  })

//append database data to table display
  database.ref().on("child_added", function(snapshot){
    
    var trainTime = snapshot.val().firstTrain;
    var frequency = parseInt(snapshot.val().frequency);

    var table = document.getElementById("trainData");
    var addedRow = table.insertRow(0);

    var trainCell = addedRow.insertCell(0);
    var destCell = addedRow.insertCell(1);
    var freqCell = addedRow.insertCell(2);
    var nextCell = addedRow.insertCell(3);
    var etaCell = addedRow.insertCell(4);

    var convertedTime = moment(trainTime, "HH:mm").subtract(1, "years");
  

  
    //how long its been since  the first train
      var diffTime = moment().diff(moment(convertedTime), "minutes");


    //how long since the last train left  
      var lastTrainLeft = diffTime % frequency;

    // the difference of the frequency and the lastTrainLeft will give the arival of the next train in mins
          var eta = frequency - lastTrainLeft;
      
      var x;
      
      // adding the eta to the current time will give the exact time of the next train
      var nextArrival = moment().add(eta, "minutes");
      
      var nextTrain = moment(nextArrival).format("HH:mm")

      function boarding() {
        etaCell.innerHTML = "Boarding Now";
      }
      function trainCount() {
        var minutes = eta--
           // Display the result in the etaCell
        etaCell.innerHTML = minutes;
          // If the count down is finished, write some text
        if (eta == 0) {
          clearInterval(x);
          startCountdown();
          boarding();
        }
      }
      // Update the count down every minute
      function startCountdown(){
        convertedTime = moment(trainTime, "hh:mm").subtract(1, "years");
        console.log(convertedTime, "This is our convertedTime");

        diffTime = moment().diff(moment(convertedTime), "minutes");

        remainder = diffTime % frequency;
        
        eta = frequency - remainder;
        nextArrival = moment().add(eta, "minutes");
        nextTrain = moment(nextArrival).format("HH:mm");
        nextCell.innerHTML = (nextTrain);
        etaCell.innerHTML = (eta);
        x = setInterval(trainCount, 60000);
      }
      startCountdown();

    trainCell.innerHTML = (snapshot.val().trainName);
    destCell.innerHTML = (snapshot.val().destination);
    freqCell.innerHTML = (snapshot.val().frequency);
    nextCell.innerHTML = (nextTrain);
    etaCell.innerHTML = (eta);
  })