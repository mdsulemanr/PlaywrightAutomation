let name: string = 'Hello World';
console.log(name);

let age: number = 30;
console.log(age);

let isStudent: boolean = true;
console.log(isStudent);

let hobbies: string[] = ['Reading', 'Traveling', 'Cooking'];
console.log(hobbies);

let numArr: number[] = [1, 2, 3, 4, 5];
console.log(numArr);

interface Person {
    name: string;
    age: number;
}

let person: Person = {
    name: 'Alice',
    age: 25
};
console.log(person.age);

let sum = (a: number, b: number): number => {
    return a + b;
};
console.log(sum(5, 10));

function add(a: number, b: number): number {
    return a + b;
}
console.log(add(3, 7));