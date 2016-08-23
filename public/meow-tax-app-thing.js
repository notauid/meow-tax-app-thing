var states, state, squirrels, chipmunks, moles, fields;

/*
  
  Since calculations will change by state, this hashtable represents
  something much like a database that will allow you to change the
  calculation behavior.
  
*/

states = {
  "confusion": {
  /*
    
    The Great State of Confusion has a fair and balanced system in
    which chipmunks and squirrels are taxed evenly, and mole-catchers
    can take a modest 50 cents off for up to two moles.
    
  */
    "areSquirrelsTaxed": true,
    "squirrelTaxRate": .035,
    "chipmunkTaxRate": .045,
    "moleDeductionRate": 0.5,
    "moleDeductionLimit": 2
  },
  /*
    
    The Great State of Affairs has declined to tax squirrels, but only
    offers a mole deduction on a single mole. It makes almost all of
    its tax money on chipmunks.
    
  */
  "affairs": {
    "areSquirrelsTaxed": false,
    "chipmunkTaxRate": .095,
    "moleDeductionRate": 0.1,
    "moleDeductionLimit": 1
  },
  /*
    
    The State of Being brags the highest number of deductable moles
    in the land, but it offers a measily 25 cents per mole. It also
    taxes squirrels at a massive 45%!
    
  */
  "being": {
    "areSquirrelsTaxed": true,
    "squirrelTaxRate": .45,
    "chipmunkTaxRate": .065,
    "moleDeductionRate": 0.25,
    "moleDeductionLimit": 12
  }
};

/*
  
  On load, we gather up our fields.
  
  We put them into an array and run forEach, which runs
  a function on each of them.
  
*/

function handleOnLoad ( ) {
  state = document.getElementById ( 'state' );
  squirrels = document.getElementById ( 'squirrels' );
  chipmunks = document.getElementById ( 'chipmunks' );
  moles = document.getElementById ( 'moles' );
  [ state, squirrels, chipmunks, moles ].forEach ( listenToField );
}

/*
  
  The function we run on each field tells the field to listen for
  changes and key-ups (when a key is pressed and then released),
  and every time either of these happen, we run our calculation.
  
*/

function listenToField ( field ) {
  field.addEventListener( 'change', handleFieldChange );
  field.addEventListener( 'keyup', handleFieldChange );
}

/*

  If the user hasn't selected a state, we tell them to do so through
  an error.
  
  If they have, we run each of our calculations and hide the error.
  
*/

function handleFieldChange ( ) {
  if ( !hasUserSelectedAState() ) {
    showError ( 'You must select a state' );
  } else {
    selectedState = states[ state.value ];
    setMoneyValueOnField ( 'squirrel-tax', getSquirrelTax ( ) );
    setMoneyValueOnField ( 'chipmunk-tax-pre', getChipmunkTaxPreDeduction ( ) );
    setMoneyValueOnField ( 'chipmunk-tax-post', getChipmunkTaxPostDeduction ( ) );
    setMoneyValueOnField ( 'mole-tax-deduction', getMoleTaxDeduction ( ) );
    setValueOnField ( 'tax-deductable-moles', getDeductableNumberOfMoles ( ) );
    hideError ( );
  }
}

/*
  
  This helper function puts a value on an output field.
  
*/

function setValueOnField ( fieldId, value ) {
  document.getElementById ( fieldId ).value = value;
}

/*
  
  This extends the helper function above by formatting the
  result as money, using the function below it.
  
*/

function setMoneyValueOnField ( fieldId, value ) {
  setValueOnField ( fieldId, formatAsMoney ( value ) );
}

/*
  
  This is how results are formatted as money. toFixed accepts
  a number of digits and turns the number into a string, so
  that 2.2222 turns into '2.22' and 2.2 turns into '2.20'
  
*/

function formatAsMoney ( amount ) {
  return '$' + amount.toFixed ( 2 );
}

/*
  
  In reality, this doesn't show the error so much as populate
  the error container's content with HTML code.
  
*/

function showError ( errorMessage ) {
  document.getElementById ( 'error' ).innerHTML = errorMessage;
}

/*
  
  To hide the error, we simply populate it with empty HTML.
  
*/

function hideError ( ) {
  showError ( '' );
}

/*
  
  The [] after an value means "access a property by the value
  of this". Commonly used in arrays, it also works with objects.
  
    myObject.myPropertyName

  is equivalent to:

    myObject['myPropertyName']
  
  The typeof operator produces a string that describes a value's
  type. If the states "database" doesn't have an entry for the
  current value of the state select field (state.value), its type
  will produce undefined, and its type will be the string 'undefined'.
  
  By testing the type against that string, we can tell if the user
  has selected a state.
  
*/

function hasUserSelectedAState ( ) {
  return typeof states[ state.value ] !== 'undefined';
}

/*
  
  As we've put the current state data entry in the variable
  selectedState, we can now use its properties to determine
  how to use the state in calculations.
  
  Squirrels aren't taxed by some states, which means we
  must first check selectedState.areSquirrelsTaxed with
  an if statement.

*/

function getSquirrelTax ( ) {
  var numberOfSquirrels;
  if ( !selectedState.areSquirrelsTaxed ) {
    return 0;
  } else {
    numberOfSquirrels = getNumericFieldValue ( squirrels );
    return numberOfSquirrels * selectedState.squirrelTaxRate;
  }
}

function getChipmunkTaxPreDeduction ( ) {
  var numberOfChipmunks;
  numberOfChipmunks = getNumericFieldValue ( chipmunks );
  return numberOfChipmunks * selectedState.chipmunkTaxRate;
}

/*
  
  Some calculations are just going to be combinations of
  other calculations.
  
  Some programmers mix their user interface code and
  their algorithms. I recommend this way because it
  produces more easily-read, easily-changed code.
  
*/

function getChipmunkTaxPostDeduction ( ) {
  return getChipmunkTaxPreDeduction ( ) - getMoleTaxDeduction ( );
}

/*
  
  Math.min returns the smaller of the two values you give it.
  
  There's also a Math.max which returns the larger one.
  
*/

function getDeductableNumberOfMoles ( ) {
  var numberOfMoles, allowedMolesForDeduction;
  numberOfMoles = getNumericFieldValue ( moles );
  return Math.min ( selectedState.moleDeductionLimit, numberOfMoles );
}

function getMoleTaxDeduction ( ) {
  return getDeductableNumberOfMoles ( ) * selectedState.moleDeductionRate;
}

/*
  
  Since the user may be tempted to put in dollar signs, I
  wrote this helper function which replaces the dollar sign
  before turning the value into a number.
  
  .replace accepts a regular expression, and the regular
  expression /\$/g means:
  
    /   start a regular expression
    \   escape the next character (since $ has a special
        meaning in RegEx, and we mean a literal dollar sign,
        not that meaning)
    $   Our dollar sign
    /   end the regular expression and start the flags
    g   A flag meaning global, or find all. Not that we expect
        more than one dollar sign, but this will get rid of
        them if they're there.
  
*/

function getNumericFieldValue ( field ) {
  var value;
  value = +field.value.replace ( /\$/g, '' );
  if ( isNaN( value ) ) {
    return 0;
  } else {
    return +value;
  }
}

/*
  
  Finally, we wait for the page to load before we gather
  up fields or assign listeners to them.
  
*/

window.onload = handleOnLoad;