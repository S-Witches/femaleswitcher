function replaceTextNodes(node) {
	const { tagName } = node;
	if (tagName === 'SCRIPT' || tagName === 'STYLE') return;
	node.childNodes.forEach(function(el) {
		if (el.nodeType === 3){
			if (el.nodeValue.trim() !== "") {
				let newValue = processString(el.nodeValue)
				if(newValue) // jeśli false to nie ma co podmieniać 
					el.nodeValue = newValue;
			}
		} else {
			replaceTextNodes(el);
		}
	});
}

function matchCase(text, pattern) {
    var result = '';

    for(var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        var p = pattern.charCodeAt(i);

        if(p >= 65 && p < 65 + 26) {
            result += c.toUpperCase();
        } else {
            result += c.toLowerCase();
        }
    }

    return result;
}

var blacklist = new Set([ // te słowa pomijaj w zamianie bo nie mają sensu, tylko przykład
	"zgwałciłeś"
]);

function processWord(w){
	if(w in blacklist) return false;
	if(w.endsWith('łeś')) return w.replace(/łeś$/, 'łaś');
	return false;
}

function processString(s){
	var words = s.split(/[ \n]/);
	words = words.map(w => w.replace(/[.\,\/#!$%\^&\*;:{}=\-_`~()]/g,""));
	words = [...new Set(words)];
	
	console.log(words);
	
	var result = s;
	for(i in words){
		let word = words[i];
		let newWord = processWord(word);
		if(newWord)
			result = result.replace(word, match => matchCase(newWord, match)); // zachowaj wielkość liter
	}
	if(result == s) return false;
	return result;
}

function replacePronouns() {

	replaceTextNodes(document.body);
}



setTimeout(function (){
	var t0 = performance.now()
	replacePronouns();
	var t1 = performance.now()
	console.log("Script took " + (t1 - t0) + " milliseconds.")
}, 2000); // chwilowy hack na dynamiczny kontent, np fb
