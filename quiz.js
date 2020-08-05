//Quiz - web based quiz.  Randomize order of possible answers.
//keep track of correct/incorrect for each question.  As quiz progresses,
//stop asking questions for which user has reached some level of proficiency

//MVC: Model/View/Controller
//each major component enclosed in "IIFE" for data privacy

// Global secion
var daBug = 0;
var DOMstrings = {
    questionLabel:      '#question',
    optionLabel:        '#option',  // add '0' for Option0, etc.
    answerTitleLabel:   '#answerLabel',
    answerLabel:        '#answer',
    scoreLabel:         '#score',
    attemptsLabel:      '#attempts',
    correctBeep:        '#correctBeep',
    incorrectBeep:      '#incorrectBeep',
    masteredBeep:       '#masteredBeep'
};

function dPrint (s) {
    if (daBug > 0) console.log(s);
    return;
}

//shuffle is used to randomize the order of an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

// model
var modelController = (function(){

    var data = {
        proficiencyAchieved:        80,
        minimumScore:               2,
        questions:                  [],
        totalScore:                 0,
        totalAttempts:              0,
        currentQ:                   0,
        incorrect:                  0,
        correct:                    1,
        correctAndMastered:         2,
        incoorectBeep:              'x',
        correctBeep:                'x',
        masteredBeep:               'x',
        successBeep:                'x'
    };

    // shuffle is used to randomize the order of an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Constructor function (i.e. - prototype)
    function Qa (number,question,options,answer) {
        this.number     =   number,
        this.question   =   question,
        this.options    =   options,
        this.answer     =   answer,
        this.randomAnswer = answer,   // this will change as randomOptions shuffled
        this.randomOptions = options.slice(),   //mae a copy
        this.attempts   =   0
        this.score      =   0,
        this.percent    =   0,
        this.calcPercent    =   function () {
            if (this.attempts > 0 && this.score > 0) {
                this.percent = (this.score / this.attempts) * 100;
            } else this.percent = 0;
            return this.percent;
        }
    }

    // make 11 copies of the 'Constructor function'

    q0 = new Qa (0,'current virus',[
        'measles',
        'tb',
        'covid-19',
        'flu'
        ], 2);

    q1 = new Qa (1,'Speed of light in meters/s',[
        '100,000',
        '200,000',
        '300,000',
        '400,000'
        ], 2);

    q2 = new Qa (2,'Fundemental force without a corresponding particle found yet',[
        'Weak',
        'Gravity',
        'ElectoMagnetic',
        'Strong'
        ],1);


    q3 = new Qa (3,'Approximate age of the universe, in billion years',[
        '17',
        '15',
        '11',
        '13'
        ], 3);


    q4 = new Qa (4,'Power equals Volts times __ ?',[
        'Watts',
        'Amps',
        'Joules',
        'Ohms'
        ],1);


    q5 = new Qa (5,'Ruby is a neat language because it is ?',[
        'associated with Gems',
        'Procedural',
        'Object Oriented',
        'machine level'
        ], 2);


    q6 = new Qa (6,'Python is a fun language because ?',[
        'Dynamic & Lightweight',
        'Like ABC',
        'enforces strict typing',
        'compiles quickly'
        ],0);


    q7 = new Qa (7,'Salesforce is a ',[
        'a programming language',
        'A Marketing firm',
        'leading CRM',
        'A Sales company'
    ],2);

    q8 = new Qa (8,'Tesla has large factories called ?',[
    'Tesla Mega Factories',
    'Terra Machines',
    'MegaFactories',
    'GigaFactories'
    ],3);

    q9 = new Qa (9,'Metic is not fully adopted in the US and ?',[
        'Mexico',
        'Canada',
        'Myanmar',
        'New Zeland'
        ],2);

    q10 = new Qa (10,'Wire Guage number gets ? as the size gets smaller.',[
        'Smaller',
        'Stays the same',
        'Bigger',
        'irrelevant'
        ],2);


    q11 = new Qa (11,'The Black wire in US electrical wiring is ?',[
        'Hot',
        'Neutral',
        'Ground',
        'Common'
        ],0);

    //...and store them in an array
    data.questions = [q0,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11];

    // Public functions, exported from modelController for use elsewhere
    return {

        nextQuestion: function() {
            if (data.questions.length > 0) {
                //Select random question from the questions array
                selection = Math.floor(Math.random() * data.questions.length);
                q = data.questions[selection];
                return q;
            } else {
                return 0;
            }
        },

        findInArray:    function(obj,arr) {
            var index, obj, arr;
            index = arr.find(e => (e.id === obj.id && e.name === obj.name));
            if (index) {
                return index;
            } else {
                return false;
            };
        },

        correctBeep: function() {
            data.correctBeep.play();
        },

        incorrectBeep: function() {
            data.incorrectBeep.play();
        },

        masteredBeep: function() {
            data.masteredBeep.play();
        },

        successBeep: function() {
            data.successBeep.play();
        },

        setBeepFiles: function(c,i,m,s) {
            var c, i, m, s  // Correct, Incorrect, Mastered, Success
            data.correctBeep   = c;
            data.incorrectBeep = i;
            data.masteredBeep  = m;
            data.successBeep   = s;
        },

        evaluateResponse:   function(key) {
            var key, q, index;

            q = this.getCurrentQ();
            if (q === 0) return 0;  // if not q has been selected, forget it
            dPrint ("Key is " + key);
            dPrint ("randomAnswer is " + q.randomAnswer);
            if (key == q.randomAnswer) {
                q.score++;
                q.attempts++;
                data.totalScore++;
                data.totalAttempts++;
                dPrint("q.score    " + q.score);
                dPrint("q.attempts " + q.attempts);
                dPrint('q.calcPercent ' + q.calcPercent());
                  //exclude questions that have already been mastered
                if ((q.score > data.minimumScore) && (q.calcPercent() >= data.proficiencyAchieved)) {
                    //index is position of q in data.questions  // index of q in the questions array
                    index = this.findInArray(q,data.questions);
                    dPrint ("index was " + index);
                    if (index) {    // remove q from the questions array
                        data.questions.splice(index,1);
                        dPrint ('q removed');
                    };
                    dPrint("Correct & Mastered");
                    this.masteredBeep();
                    return data.correctAndMastered;  // code for 'Correct & Mastererd'
                } else {
                    dPrint('Correct');
                    this.correctBeep();
                    return data.correct;    // code for 'Correct'
                }
            }
            else {
                //document.querySelector(DOMstrings.answerTitleLabel).innerHTML = "Not correct";
                dPrint('Not correct');
                q.attempts++;
                data.totalAttempts++;
                this.incorrectBeep();
                return data.incorrect;  // code for incorrect
            }
        },

        selectQuestion: function() {
            var len, selection;

            len = data.questions.length;
            if (len < 1) {
                return null;
            } else {
                selection = Math.floor(Math.random() * len);
                var q = data.questions[selection];
                this.setCurrentQ(q);  // for later reference, by evaluate
                return q;        // for immediate reference, by displayQuestion
            }
        },

        getTotalScore: function() {
            return data.totalScore;
        },

        getTotalAttempts: function() {
            return data.totalAttempts;
        },

        getCurrentQ: function() {
            return data.currentQ;
        },

        setCurrentQ: function(q) {
            data.currentQ = q;
        }
    };


        

}) ();


//view
var viewController = (function(){

    var DOMstrings = {
        questionLabel:      '#question',
        optionLabel:        '#option',  // add '0' for Option0, etc.
        answerTitleLabel:   '#answerTitleLabel',
        answerLabel:        '#answerLabel',
        scoreLabel:         '#score',
        attemptsLabel:      '#attempts',
        correctBeep:        '#correctBeep',
        incorrectBeep:      '#incorrectBeep',
        masteredBeep:       '#masteredBeep',
        successBeep:        '#successBeep'
    };

    // Sample 'private' function within viewController

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // Public functions, exported from viewController for use elsewhere
    return {
        getDOMstrings: function() {
            return DOMstrings;
        },

        inputOff: function() {
            document.querySelector(DOMstrings.answerLabel).readOnly = true;
        },

        inputOn: function() {
            document.querySelector(DOMstrings.answerLabel).readOnly = false;
        },

        getBeepFiles: function() {
            var c, i, m, s  // Correct, Incorrect, Mastered
            c = document.querySelector(DOMstrings.correctBeep);
            i = document.querySelector(DOMstrings.incorrectBeep);
            m = document.querySelector(DOMstrings.masteredBeep);
            s = document.querySelector(DOMstrings.successBeep);
            dPrint ('c: ' + c);
            dPrint ('i: ' + i);
            dPrint ('m: ' + m);
            dPrint ('s: ' + s);
            return ([c,i,m,s]);
        },

        setFocus: function() {
            document.querySelector(DOMstrings.answerLabel).focus();
        },

        setLabel: function(newLabel) {
            document.querySelector(DOMstrings.answerTitleLabel).textContent = newLabel;
        },

        clearTextBox:   function() {
            document.querySelector(DOMstrings.answerLabel).value = '';  // clear TextBox
        },

        displayQuestion:    function(q) {
            // Display Question, options, and answer to screen
            document.querySelector(DOMstrings.questionLabel).innerHTML = q.question;
            q.randomOptions = [...q.options]; //make a new copy
            shuffle(q.randomOptions);    //randomize the order of the options
        
            // translate the answer pointer into the answer value (actualAnswer)
            var actualAnswer = q.options[q.answer];
            q.randomAnswer = q.randomOptions.indexOf(actualAnswer) + 1;
            if (q.randomAnswer === -1) {
                dPrint ("randomAnswer not found");
            } else {
                //dPrint ("randomAnswer is " + this.randomAnswer);
                //dPrint ("Q: " + this.randomOptions[this.randomAnswer]);
            }
            //Display the options, in a randomized order
            var nOptions = q.options.length;
            for (var i=0; i<nOptions; i++) {
                //dPrint (i + ' ' + this.randomOptions[i]);
                document.querySelector('#option'+i).innerHTML = (i+1) + ')  ' + q.randomOptions[i];
            };
        },

        resultFeedback:   function(result) {

            // for now, the result codes are hard coded, but should 
            // eventually be redone using the values in modelController.data (correct/incorrect,etc)
            var result;
            if (result === 2) {
                document.querySelector(DOMstrings.answerTitleLabel).innerHTML = "Correct & Mastered";
            } else if (result === 1) {
                document.querySelector(DOMstrings.answerTitleLabel).innerHTML = "Correct";
            } else {
                document.querySelector(DOMstrings.answerTitleLabel).innerHTML = "Incorrect";
            };
        },

        tooManyCharacters:  function() {
            // Note: This function does not yet work correctly.
            // It always finds no text (even when there is), a length of 0
            // and so always returns false
            var text, n;
            text = document.querySelector(DOMstrings.answerLabel).value;
            // seems cha not coutable until evnt function completes, so have to add 1
            n = text.length + 1;  //Kludge
            dPrint (text + ' and length is ' + n);
            if (n > 1) {
                return true;
            } else {
                return false;
            };
        },

        displayTotalScore: function(score) {
            var score;
            document.querySelector(DOMstrings.scoreLabel).innerHTML = score;
        },

        displayTotalAttempts: function(attempts) {
            var attempts;
            document.querySelector(DOMstrings.attemptsLabel).innerHTML = attempts;
        },

        displayFini: function() {
            this.setLabel("Fini");

        },
    };
}) ();


//controller
var controller = (function(mCtrl,vCtrl){

    var setupEventListeners = function() {
        var DOM = vCtrl.getDOMstrings();
    
        //even listener for keypress
        document.addEventListener('keypress',function(event) {
            vCtrl.setFocus();
            if (event.key >= 1 && event.key <= 9) {
                if (vCtrl.tooManyCharacters()) {
                    vCtrl.setLabel("Invalid: Too many Characters entered");
                } else {
                    evaluate(event.key);  //evvaluate the answer entered
                };
            } else if (event.key === 'Enter') {
                enter();            // Handle the 'Enter' event
            } else {
                invalid();          // Handle an inValid enter
            };
        });
    };

    var invalid = function () {
        // Change label to invalid
        vCtrl.setLabel ('Invalid');
        vCtrl.setFocus();
    };

    var correct = function () {
        vCtrl.setLabel ('Correct');
        vCtrl.setFocus();
    };

    var enter = function() {
        vCtrl.clearTextBox();
        vCtrl.setLabel ('Enter');
        vCtrl.setFocus();
        nextQuestion();
    };

    var nextQuestion = function () {
        var q;

        // Clear out the textBox
        vCtrl.clearTextBox();
        vCtrl.setLabel('Answer');


        // If there are more questions, select one & display it
        q = mCtrl.selectQuestion();
        if (q) {
            vCtrl.displayQuestion(q);
            vCtrl.setFocus();
        } else {
            vCtrl.displayFini();    // change label of inut field to 'Fini'
            vCtrl.inputOff();       // disallow further input typing
            mCtrl.successBeep();    // sound of success
        }
    };

    var updateScoreAndAttempts = function() {
        // incomplete - mCtrl.getScore needs to have the current q
        var score, attempts;
        score    = mCtrl.getTotalScore();
        attempts = mCtrl.getTotalAttempts();
        vCtrl.displayTotalScore(score);
        vCtrl.displayTotalAttempts(attempts);
    };

    var setupBeepFiles = function () {
        var c, i, m, s, arr // Correct, Incorrect, Mastered, array
        arr = vCtrl.getBeepFiles();
        c   = arr[0];  // DOM Node for correctBeep
        i   = arr[1];  // DOM Node for incorrectBeep
        m   = arr[2];  // DOM Node for masteredBeep
        s   = arr[3];  // DOM Node for successBeep
        mCtrl.setBeepFiles(c,i,m,s);
    };

    var evaluate = function (key) {
        var key, result;

        result = mCtrl.evaluateResponse(key);
        vCtrl.resultFeedback(result);
        updateScoreAndAttempts();
        vCtrl.setFocus();
    };
 
    return {
        init: function() {
            dPrint ("Application has started");
            nextQuestion();
            vCtrl.setFocus();       // set cursor to text input box
            setupBeepFiles();       // save the DOM Nodes for the audio files for later use
            vCtrl.inputOn();              // allow text entry
            setupEventListeners();      // listen for the response                      // if there 
        }
    };
}) (modelController,viewController);

controller.init();
