'use strict';
/* jshint expr: true */

const expect = require( 'chai' ).expect;

const ROOT_PATH = '../';

const MODULE_PATH = 'index.js';

const FULL_MODULE_PATH = ROOT_PATH + MODULE_PATH;

const isDeepFrozen = require( FULL_MODULE_PATH );

const subzero = require( 'subzero' );


describe( MODULE_PATH, function() {

    describe( 'checking if various javascript entities are deeply frozen', function() {

        it( 'string', function() {

            const result = isDeepFrozen( 'string' );

            expect( result ).to.eql( {} );
        });

        it( 'number', function() {

            const result = isDeepFrozen( 69 );

            expect( result ).to.eql( {} );
        });

        it( 'boolean', function() {

            const result = isDeepFrozen( true );

            expect( result ).to.eql( {} );
        });

        it( 'single object not frozen', function() {

            const controlObject = {};

            const result = isDeepFrozen( controlObject );

            expect( result.error.message ).to.include( 'property: inputValue, value: {}' );
        });

        it( 'single frozen object', function() {

            const controlObject = Object.freeze( {} );

            const result = isDeepFrozen( controlObject );

            expect( result ).to.eql( {} );
        });

        it( 'single function not frozen', function() {

            const controlFunction = function() {};

            const result = isDeepFrozen( controlFunction );

            expect( result.error.message ).to.include( 'property: inputValue, value: function () {}' );
            expect( result.error.message ).to.include( 'property: inputValue[ "prototype" ], value: {}' );
        });

        it( 'single frozen function (prototype also frozen)', function() {

            const controlFunction = function() {};

            Object.freeze( controlFunction );
            Object.freeze( controlFunction.prototype );

            const result = isDeepFrozen( controlFunction );

            expect( result ).to.eql( {} );
        });

        it( 'single class not frozen', function() {

            const controlClass = class {};

            const result = isDeepFrozen( controlClass );

            expect( result.error.message ).to.include( 'property: inputValue, value: class {}' );
            expect( result.error.message ).to.include( 'property: inputValue[ "prototype" ], value: {}' );
        });

        it( 'single arrow function not frozen', function() {

            const controlFunction = () => {};

            const result = isDeepFrozen( controlFunction );

            expect( result.error.message ).to.include( 'property: inputValue, value: () => {}' );
        });

        it( 'more complex object with nothing frozen', function() {

            const f = () => {};

            const g = () => {};

            const h = () => {};

            f.g = g;

            g.h = h;

            const x = () => {};

            const y = () => {}

            x.y = y;

            const a = {

                b: {

                    f
                },

                c: {

                    d: {

                        x
                    }
                },

                sixtyNine: 69
            };

            const result = isDeepFrozen( a );

            expect( result.error.message ).to.include( 'property: inputValue' );

            expect( result.error.message ).to.include( 'property: inputValue[ "b" ]' );
            expect( result.error.message ).to.include( 'property: inputValue[ "c" ]' );
            expect( result.error.message ).to.include( 'property: inputValue[ "c" ][ "d" ]' );

            expect( result.error.message ).to.include( 'property: inputValue[ "b" ][ "f" ], value: () => {}' );
            expect( result.error.message ).to.include( 'property: inputValue[ "b" ][ "f" ][ "g" ], value: () => {}' );
            expect( result.error.message ).to.include( 'property: inputValue[ "b" ][ "f" ][ "g" ][ "h" ], value: () => {}' );

            expect( result.error.message ).to.include( 'property: inputValue[ "c" ][ "d" ][ "x" ], value: () => {}' );
            expect( result.error.message ).to.include( 'property: inputValue[ "c" ][ "d" ][ "x" ][ "y" ], value: () => {}' );
        });

        it( 'more complex object with some stuff frozen (non frozen inside frozen)', function() {

            const f = () => {};

            const g = () => {};

            const h = function() {}

            f.g = g;

            g.h = h;

            h.prototype.hProto = true;

            Object.freeze( f );
            Object.freeze( g );

            const x = () => {};

            const y = () => {}

            x.y = y;

            Object.freeze( x );

            const a = Object.freeze({

                b: {

                    f
                },

                c: {

                    d: Object.freeze({

                        x
                    })
                },

                sixtyNine: 69
            });

            const result = isDeepFrozen( a );

            expect( result.error.message ).to.not.include( 'property: inputValue ' );

            expect( result.error.message ).to.include( 'property: inputValue[ "b" ]' );
            expect( result.error.message ).to.include( 'property: inputValue[ "c" ]' );
            expect( result.error.message ).to.not.include( 'property: inputValue[ "c" ][ "d" ] ' );

            expect( result.error.message ).to.not.include( 'property: inputValue[ "b" ][ "f" ], value: () => {}' );
            expect( result.error.message ).to.not.include( 'property: inputValue[ "b" ][ "f" ][ "g" ], value: () => {}' );
            expect( result.error.message ).to.include( 'property: inputValue[ "b" ][ "f" ][ "g" ][ "h" ], value: function () {}' );
            expect( result.error.message ).to.include( 'property: inputValue[ "b" ][ "f" ][ "g" ][ "h" ][ "prototype" ], value: {\n    "hProto": true\n}' );

            expect( result.error.message ).to.not.include( 'property: inputValue[ "c" ][ "d" ][ "x" ], value: () => {}' );
            expect( result.error.message ).to.include( 'property: inputValue[ "c" ][ "d" ][ "x" ][ "y" ], value: () => {}' );
        });

        it( 'more complex object with everything frozen', function() {

            const f = () => {};

            const g = () => {};

            const h = function() {}

            f.g = g;

            g.h = h;

            h.prototype.hProto = true;

            Object.freeze( f );
            Object.freeze( g );

            const x = () => {};

            const y = () => {};

            x.y = y;

            Object.freeze( x );

            const a = Object.freeze({

                b: {

                    f
                },

                c: {

                    d: Object.freeze({

                        x
                    })
                },

                sixtyNine: 69
            });

            const result = isDeepFrozen( subzero.megaFreeze( a ) );

            expect( result ).to.eql( {} );
        });
    });

    describe( 'other', function() {

        it( 'this module is deeply frozen (deeply frozen with subzero)', function() {

            const result = isDeepFrozen( isDeepFrozen );

            expect( result ).to.eql( {} );
        });

        it( 'README.md example test', function() {

            // readme contents
            const o = Object.freeze({ xxx: 69 });

            const passingResult = isDeepFrozen( o );

            // passingResult will be {}, indicating o is deeply frozen


            const f = function() {};

            f.a = Object.freeze({ b: {} });

            const failingResult = isDeepFrozen( f );

            // failingResult.notDeeplyFrozen will be set to true

            //COMMENTED OUT FOR SAKE OF TEST console.log( failingResult.error );


            // test stuff

            expect( passingResult ).to.eql({});

            expect( failingResult.notDeeplyFrozen ).to.be.true;

            expect( failingResult.error.message ).to.include( 'property: inputValue' );
            expect( failingResult.error.message ).to.include( 'property: inputValue[ "prototype" ]' );
            expect( failingResult.error.message ).to.include( 'property: inputValue[ "a" ][ "b" ]' );
        })
    });
});
