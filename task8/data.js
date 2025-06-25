
class A {
    constructor(naming) {
        this.name = naming;
    }
}

class B extends A {
    constructor(naming) {
        // super(naming);
        // this.name = 'B';
    }

    getName() {
        return this.name;
    }
}

const b = new B("asd");
console.log(b.getName()); // Outputs: 'A'