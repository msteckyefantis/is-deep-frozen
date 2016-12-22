'use strict';

const subzero = require( 'subzero' );

const INPUT_VALUE = 'inputValue';


const isDeepFrozen = subzero.megaFreeze( inputValue => {

    const nonFrozenPropertyDescriptors = [];

    addToNonFrozenPropertyDescriptorsIfNotFrozen( INPUT_VALUE, inputValue, nonFrozenPropertyDescriptors );

    const testedAlready = [ inputValue ];

    testFrozennessOfPropertiesRecursively( INPUT_VALUE, inputValue, nonFrozenPropertyDescriptors, testedAlready );

    const result = getResult( nonFrozenPropertyDescriptors );

    cleanUpArrays( nonFrozenPropertyDescriptors, testedAlready );

    return result;
});


const addToNonFrozenPropertyDescriptorsIfNotFrozen = subzero.megaFreeze( (fullPropertyName, property, nonFrozenPropertyDescriptors) => {

    if( !Object.isFrozen( property ) ) {

        const valueAsAString = JSON.stringify( property, null, 4 ) || property.toString();

        const descriptor = `property: ${ fullPropertyName }, value: ${ valueAsAString }`;

        nonFrozenPropertyDescriptors.push( descriptor );
    }
});


const testFrozennessOfPropertiesRecursively = subzero.megaFreeze( ( basePath, value, nonFrozenPropertyDescriptors, testedAlready ) => {

    for( const propertyName of Object.getOwnPropertyNames( value ) ) {

        const property = value[ propertyName ];

        const propertyIsAFunctionOrAClass = (typeof property === 'function');

        const propertyIsAnObject = (property !== null) && (typeof property === 'object');

        const propertyHasNotBeenTestedAlready = (testedAlready.indexOf( property ) < 0);

        if(
            (propertyIsAFunctionOrAClass || propertyIsAnObject) &&

            propertyHasNotBeenTestedAlready
        ) {

            const fullPropertyName = `${ basePath }[ "${ propertyName }" ]`;

            addToNonFrozenPropertyDescriptorsIfNotFrozen( fullPropertyName, property, nonFrozenPropertyDescriptors );

            testedAlready.push( property );

            testFrozennessOfPropertiesRecursively( fullPropertyName, property, nonFrozenPropertyDescriptors, testedAlready );
        }
    }
});


const getResult = subzero.megaFreeze( nonFrozenPropertyDescriptors => {

    const result = {};

    if( nonFrozenPropertyDescriptors.length > 0 ) {

        const error = new Error( nonFrozenPropertyDescriptors.join( '\n' ) );

        error.name = 'NotDeeplyFrozenError';

        result.error = error;

        result.notDeeplyFrozen = true;
    }

    return subzero.megaFreeze( result );
});


const cleanUpArrays = subzero.megaFreeze( ( array1, array2 ) => {

    for( const array of [ array1, array2 ] ) {

        array.length = 0;
        subzero.megaFreeze( array );
    }
});


module.exports = isDeepFrozen;
