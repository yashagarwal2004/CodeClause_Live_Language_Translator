const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchage_Icon = document.querySelector(".exchange"),
select_Tag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("button"),

select_Tag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchage_Icon.addEventListener("click", () => {
    let tempText = fromText.value,
    tempLang = select_Tag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    select_Tag[0].value = select_Tag[1].value;
    select_Tag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = select_Tag[0].value,
    translateTo = select_Tag[1].value;
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let speaks;
            if(target.id == "from") {
                speaks = new SpeechSynthesisUtterance(fromText.value);
                speaks.lang = select_Tag[0].value;
            } else {
                speaks = new SpeechSynthesisUtterance(toText.value);
                speaks.lang = select_Tag[1].value;
            }
            speechSynthesis.speak(speaks);
        }
    });
});