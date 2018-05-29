var NgRipple = require("nativescript-ng-ripple").NgRipple;
var ngRipple = new NgRipple();

describe("greet function", function() {
    it("exists", function() {
        expect(ngRipple.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(ngRipple.greet()).toEqual("Hello, NS");
    });
});