(setInterval(() => {
    fetch('/poll')
        .then(response => response.json())
        .then(json => {
            console.log(json);
        })
}, 5000))()