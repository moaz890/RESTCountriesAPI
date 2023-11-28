class IndexUI {

    constructor() {
        this.page = document.querySelector(".page");
        this.controlMode = document.querySelector(".control-mode");
        this.currentMode = document.querySelector(".current-mode");
        this.filterList = document.querySelector(".filter-list");
        this.swiperWrapper = document.querySelector(".content-wrapper");
    }

    modeControlling () {
        this.page.classList.toggle("dark-mode");
        this.currentMode.textContent = this.page.classList.contains("dark-mode") ? "Dark Mode" : "Light Mode";
    }
    expandFilterList() {
        this.filterList.classList.toggle("expand");
    }

    createSlide (dataItem, countryIndex) {

        var slide = document.createElement("a");
        slide.href = "detail_page.html"
        slide.classList.add("slide");
        slide.dataset.countryIndex = countryIndex; 
        slide.innerHTML = `
        <div class="image">
            <img src="${dataItem.flag}" alt="" srcset="">
        </div>
        <div class="info text-mini">
            <ul>
                <li>
                    <h3>${dataItem.name}</h3>
                    <ul>
                        <li class="flex"><h4>Population: </h4><span class="light-text">${dataItem.population}</span></li>
                        <li class="flex"><h4>Region: </h4><span class="light-text">${dataItem.region}</span></li>
                        <li class="flex"><h4>Capital: </h4><span class="light-text">${dataItem.capital}</span></li>
                    </ul>
                </li>
            </ul>
        </div>
        `
        this.swiperWrapper.appendChild(slide);
    }
    cleanWrapperContent() {
        this.swiperWrapper.innerHTML = "";
    }
}

class DetailUI {

    constructor() {
        this.page = document.querySelector(".page");
        this.controlMode = document.querySelector(".control-mode");
        this.currentMode = document.querySelector(".current-mode");
        this.contentWrapper = document.querySelector(".content");
    }

    modeControlling () {
        this.page.classList.toggle("dark-mode");
        this.currentMode.textContent = this.page.classList.contains("dark-mode") ? "Dark Mode" : "Light Mode";
    }

    createContent (dataItem) {
        console.log(dataItem.borders)
        this.contentWrapper.innerHTML = `
        <div class="image">
            <img src="${dataItem.flag}" alt="" srcset="">
        </div>
        <div class="info text-mini">
            <ul>
                <h1>${dataItem.name}</h1>
                <li class="flexbet">
                    <ul>
                        <li class="flex"><h4>Native Name: </h4><span class="light-text">${dataItem.nativeName}</span></li>
                        <li class="flex"><h4>Population: </h4><span class="light-text">${dataItem.population}</span></li>
                        <li class="flex"><h4>Region: </h4><span class="light-text">${dataItem.region}</span></li>
                        <li class="flex"><h4>Sub Region: </h4><span class="light-text">${dataItem.subregion}</span></li>
                        <li class="flex"><h4>Capital: </h4><span class="light-text">${dataItem.capital}</span></li>
                    </ul>
                    <ul>
                        <li class="flex"><h4>Top Level Domain: </h4><span class="light-text">${dataItem.topLevelDomain.join(", ")}</span></li>
                        <li class="flex"><h4>Currencies: </h4><span class="light-text">${dataItem.currencies.length > 0 ? dataItem.currencies.reduce((a, b, index) => index < dataItem.currencies.length - 1 ?  a + b.name : a + b.name + ", ", "" ):  dataItem.currencies[0]}</span></li>
                        <li class="flex"><h4>Languages: </h4><span class="light-text">${dataItem.languages.length > 0 ? dataItem.languages.reduce((a, b, index) => index < dataItem.languages.length - 1 ?  a + b.name : a + b.name + ", ", "" ):  dataItem.languages[0]}</span></li>
                    </ul>
                </li>
            </ul>
            
            <ul class="borders flex">
                <li><h3>Border Countries:</h3></li>
                ${dataItem.borders.length > 0 ? dataItem.borders.reduce((a, b, index) => index < dataItem.borders.length - 1 ?  a + b + `</li><li class="btn">` : a + b + "</li>", `<li class="btn">`):  dataItem.languages[0]}
            </ul>
        </div>
        `
    }

}


function indexEventListeners(e) {
    const swiperWrapper = document.querySelector(".content-wrapper");
    const form = document.querySelector(".form form");
    const input = form.querySelector("input");
    const filterList = document.querySelector(".filter-list");
    const controlMode = document.querySelector(".control-mode");
    const page = document.querySelector(".page");
    const currentMode = document.querySelector(".current-mode");
    
    // Initialize IndexIndexUI Instance
    const ui = new IndexUI();
    
    // Start Page
    fetch("data.json").then((data) => data.json()).then((data) => {
        if (sessionStorage.getItem("inputLastValue")){
            
            form.querySelector("input").value = sessionStorage.getItem("inputLastValue");
            var filteredData = data.filter((item) => {
                return item.name.toLowerCase().startsWith(sessionStorage.getItem("inputLastValue").toLowerCase()) || item.name.toLowerCase().includes(sessionStorage.getItem("inputLastValue").toLowerCase()); 
            });
            
            if (filteredData.length > 0) {

                ui.cleanWrapperContent();
                
                var i = 0
                while(filteredData.length > 0) {
                    ui.createSlide(filteredData[i], data.indexOf(filteredData[i]));
                    i++;
                }
            }
        }else {
            for (var i = 0; i < data.length; i++) {
                ui.createSlide(data[i], i);
            }
        }
    });

    // Control Mode Event
    controlMode.addEventListener("click", function (e) {
        ui.modeControlling();
        localStorage.setItem("mode", currentMode.textContent);
    });
    
    // Expand Filter List
    filterList.addEventListener("click", function (e) {
        e.preventDefault()
        sessionStorage.setItem("inputLastValue", form.querySelector("input").value);
        
        if(e.target.closest(".icon-small")){
            ui.expandFilterList();  
        }

        if(e.target.hasAttribute("data-region")){
            
            fetch("data.json").then((data) => data.json()).then((data) => {
                var filteredData = data.filter((item) => {
                    return (item.name.toLowerCase().startsWith(sessionStorage.getItem("inputLastValue").toLowerCase()) || item.name.toLowerCase().includes(sessionStorage.getItem("inputLastValue").toLowerCase())) && item.region === e.target.getAttribute("data-region");
                });
                

                ui.cleanWrapperContent();
                
                var i = 0
                while(filteredData.length > 0) {
                    ui.createSlide(filteredData[i], data.indexOf(filteredData[i]));
                    i++;
                }
            });
        }
    });


    document.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            form.submit();
        }
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        sessionStorage.setItem("inputLastValue", form.querySelector("input").value)
        fetch("data.json").then((data) => data.json()).then((data) => {
            var filteredData = data.filter((item) => {
                return item.name.toLowerCase().startsWith(input.value.toLowerCase()) || item.name.toLowerCase().includes(input.value.toLowerCase()); 
            });
            console.log(filteredData)
            if (filteredData.length > 0) {

                ui.cleanWrapperContent();
                
                var i = 0
                while(filteredData.length > 0) {
                    ui.createSlide(filteredData[i], data.indexOf(filteredData[i]));
                    i++;
                }
            }
        }).catch((e) => console.log(e.message));
    });

    swiperWrapper.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
            sessionStorage.setItem("countryIndex", e.target.closest("a").dataset.countryIndex);
        }
        if (form.querySelector("input").value) {
            sessionStorage.setItem("inputLastValue", form.querySelector("input").value);
        }
    });
    
    if (localStorage.getItem("mode")){
        localStorage.getItem("mode") === "Dark Mode" ? page.classList.add("dark-mode") : null;
    }
}

function detailEventListeners(e) {
    const controlMode = document.querySelector(".control-mode");
    const page = document.querySelector(".page");
    const currentMode = document.querySelector(".current-mode");
    
    // Initialize IndexIndexUI Instance
    const ui = new DetailUI();
    
    // Control Mode Event
    controlMode.addEventListener("click", function (e) {
        ui.modeControlling();
        localStorage.setItem("mode", currentMode.textContent);
    });
    
    fetch("data.json").then((data) => data.json())
    .then((data) => {
        let countryIndex = sessionStorage.getItem("countryIndex");
        ui.createContent(data[+countryIndex])
    });
    
    if (localStorage.getItem("mode")){
        localStorage.getItem("mode") === "Dark Mode" ? page.classList.add("dark-mode") : null;
    }
} 









