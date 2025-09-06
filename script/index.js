const createElement = (arr) =>{
    const htmlElement = arr.map((el) => `<span class="btn">${el}</span>`);
    return (htmlElement.join(" "));
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) =>{
    if (status == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }else{
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all") //promise of risponce
    .then((res) => res.json())  //promise of json data
    .then ((json) => displayLesson(json.data));
}

const removeActive = () =>{
    const lessonButton = document.querySelectorAll(".lesson-btn");
    lessonButton.forEach((btn) => btn.classList.remove("active"));
    
}

const loadLevelWords = (id) =>{
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((data) =>{
        removeActive(); //remove all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`);       
        clickBtn.classList.add("active")

        displayLavelWords(data.data);
    })
}

const loaWordDetail = async (id) =>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    // console.log(url)
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetail(details.data);
}

// {
//     "word": "Eager",
//     "meaning": "আগ্রহী",
//     "pronunciation": "ইগার",
//     "level": 1,
//     "sentence": "The kids were eager to open their gifts.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "enthusiastic",
//         "excited",
//         "keen"
//     ],
//     "id": 5
// }

const displayWordDetail = (word) =>{
    // console.log(word);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    <div class="">
        <h2>${word.word}(<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
    </div>

    <div class="">
        <h2>Meaning</h2>
        <p>${word.meaning}</p>
    </div>

    <div class="">
        <h2>Example</h2>
        <p>${word.sentence}</p>

    </div>

    <div class="">
        <h2>সমার্থক শব্দ গুলো</h2>
        <div class="">${createElement(word.synonyms)}</div>
                    
    </div>
    `;

    document.getElementById("Modal").showModal();

}

const displayLavelWords = (words) =>{
    // console.log(words);
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length == 0){
        wordContainer.innerHTML = `
        <div class="col-span-full text-center  py-10 rounded space-y-6 fond-bangla">
            <img src="./assets/alert-error.png" alt="alart" class="mx-auto">
            <p class="text-gray-400 text-xl font-medium ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। </p>
            <h3 class="font-bold text-4xl">নেক্সট Lesson এ যান</h3>
        </div>
        `;
    manageSpinner(false);    
    return;
    }

    words.forEach(word => {
        // console.log(word);

        const cart = document.createElement("div");
        cart.innerHTML = `
           <div class="bg-white text-center rounded-xl shadow-sm py-10 px-5 space-y-4">
                <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
                <p class="font-semibold">Meaning /Pronounciation</p>

                <div class="font-medium font-2xl font-bangla">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি "}/
                ${word.pronunciation ? word.pronunciation :"pronunciation পাওয়া যায়নি "}</div>

                <div class="flex justify-between items-center">
                   <button onclick="loaWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                   <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>`;
        wordContainer.append(cart);
    });

    manageSpinner(false);
}

const displayLesson = (Lessons) => {
    //1.get the container  & empty
    const lavelContainer = document.getElementById("lavel-container");
    lavelContainer.innerHTML = "";


    //2.get into every lesson
    for(Lesson of Lessons){

            //    3.create elemente
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML =`<Button id="lesson-btn-${Lesson.level_no}" 
                           onclick="loadLevelWords(${Lesson.level_no})" 
                           class="btn btn-outline btn-primary lesson-btn">
                                <i class="fa-solid fa-circle-question"></i>Lesson - ${Lesson.level_no}
                        </Button>`;

            //    4.append into container
    lavelContainer.append(btnDiv);
    }
    
}

loadLessons();


document.getElementById("btn-search").addEventListener("click" , ()=>{
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    // console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
        const allWord = data.data;


        const filterWords = allWord.filter((word) => word.word.toLowerCase().includes(searchValue))

        

        displayLavelWords(filterWords);
    });


})