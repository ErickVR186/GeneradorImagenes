const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;


const updateImageCard = (imgDataArray) => {

    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector("download-btn")
        
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
    }

const generateAIImages = async (userPrompt, userImgQuantity) => {
    try {
        //Enviar una respuesta a OpenAI API para generar imagenes basadas en la entrada del usuario
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: userImgQuantity,
                size: "512x512",
                response_format: "b64_json"
            })
        });
        if(!response.ok) throw new Error ("Error al generar imagenes! Por favor vuelva a intenarlo.");
        const {data} = await response.json(); // obtener datos desde la respuesta de la API
        updateImageCard([...data]);     
    } catch (error) {
        alert(error.message)
    }finally{
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) =>{
    e.preventDefault();
    if(isImageGenerating)return;
    isImageGenerating = true;

    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
    `<div class="img-card loaging">
        <img src="../GeneradorImagenes/image/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="../GeneradorImagenes/image/download.svg" alt="download icon">
        </a>
    </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAIImages(userPrompt, userImgQuantity);

}
generateForm.addEventListener("submit", handleFormSubmission);