
const term = new Terminal();
term.open(document.getElementById('terminal'));
term.prompt = () => term.write('\r\n$ ');

term.prompt();
let commandBuffer = '';

term.onKey(({ key, domEvent }) => {
  const char = domEvent.key;
  if (char === 'Enter') {
    const command = commandBuffer.trim();
    if (command) {
      fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      })
      .then(res => res.json())
      .then(data => {
        term.writeln(`\r\n${data.output}`);
        return fetch('http://localhost:5000/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command })
        });
      })
      .then(res => res.json())
      .then(data => {
        term.writeln(`\r\n[AI Explanation]: ${data.explanation}`);
        term.prompt();
      });
    } else {
      term.prompt();
    }
    commandBuffer = '';
  } else if (char === 'Backspace') {
    if (commandBuffer.length > 0) {
      commandBuffer = commandBuffer.slice(0, -1);
      term.write('\b \b');
    }
  } else {
    commandBuffer += key;
    term.write(key);
  }
});
