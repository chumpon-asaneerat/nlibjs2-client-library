console.group('NDom Class')

console.log('TEST ==> NDom class.');

let dom1 = document.getElementById('dom1');

let ndom1 = new NDOM(dom1)
console.log('Set attribute showred....OK');
ndom1.attr('showred', true)
let child1 = ndom1.children[0];
console.log('Change background color to yellow....OK');
child1.style('background-color', 'yellow')
console.log('Toggle class blackpen....OK');
child1.class.toggle('blackpen')
console.log('Add padding 5px....OK');
ndom1.styles.padding('5px');
console.log('Add margin 5px....OK');
child1.styles.margin('5px')

let click = (e) => {
    console.log('click');
    e.preventDefault();
    e.stopPropagation();
}
console.log('Add click event....OK');
child1.event.add('click', click)

console.groupEnd()