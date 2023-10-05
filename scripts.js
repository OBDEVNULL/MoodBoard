// Image Upload
document.getElementById('uploadImage').addEventListener('click', function() {
    document.getElementById('imageInput').click();
});

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === "image/jpeg") {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.onload = function() {
                img.classList.add('image-item', 'draggable');
                img.draggable = true;
                img.id = 'item-' + Date.now();
                img.addEventListener('dragstart', handleDragStart);
                document.getElementById('moodboard').appendChild(img);
                $(img).resizable();
                generateColorPalette(img);
            }
        }
        reader.readAsDataURL(file);
    } else {
        alert("Only JPG files are allowed.");
    }
});

// Text Addition
document.getElementById('addText').addEventListener('click', function() {
    const text = prompt("Enter your text:");
    if (text) {
        const div = document.createElement('div');
        div.textContent = text;
        div.classList.add('text-item', 'draggable');
        div.draggable = true;
        div.id = 'item-' + Date.now();
        div.addEventListener('dragstart', handleDragStart);
        document.getElementById('moodboard').appendChild(div);
        $(div).resizable();
    }
});

// Drag and Drop
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function handleDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target.closest('.moodboard');
    if (dropzone && draggableElement) {
        dropzone.appendChild(draggableElement);
    }
}

function handleDragOver(event) {
    event.preventDefault();
}

document.getElementById('moodboard').addEventListener('dragover', handleDragOver);
document.getElementById('moodboard').addEventListener('drop', handleDrop);

// Color Palette Generation
function generateColorPalette(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const positions = [
        { x: 0, y: 0 }, // top-left
        { x: Math.floor(img.width / 2), y: Math.floor(img.height / 2) }, // center
        { x: img.width - 1, y: img.height - 1 } // bottom-right
    ];

    positions.forEach(pos => {
        const data = ctx.getImageData(pos.x, pos.y, 1, 1).data;
        const rgb = { r: data[0], g: data[1], b: data[2] };
        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        colorBox.classList.add('color-box');
        document.getElementById('colorPalette').appendChild(colorBox);
    });
}

// Image Filters
document.getElementById('imageFilter').addEventListener('change', function(event) {
    const filterValue = event.target.value;
    const images = document.querySelectorAll('.image-item');
    images.forEach(img => {
        img.style.filter = filterValue;
    });
});

// Background Color and Image
document.getElementById('bgColorPicker').addEventListener('input', function(event) {
    document.getElementById('moodboard').style.backgroundColor = event.target.value;
});

document.getElementById('uploadBgImage').addEventListener('click', function() {
    document.getElementById('bgImageInput').click();
});

document.getElementById('bgImageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('moodboard').style.backgroundImage = `url(${e.target.result})`;
        }
        reader.readAsDataURL(file);
    }
});

// Export, Save, and Load
document.getElementById('exportMoodboard').addEventListener('click', function() {
    html2canvas(document.getElementById('moodboard')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'moodboard.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

document.getElementById('saveMoodboard').addEventListener('click', function() {
    const moodboardContent = document.getElementById('moodboard').innerHTML;
    const moodboardBg = document.getElementById('moodboard').style.background;
    localStorage.setItem('moodboardContent', moodboardContent);
    localStorage.setItem('moodboardBg', moodboardBg);
    alert('Mood board saved!');
});

document.getElementById('loadMoodboard').addEventListener('click', function() {
    const savedContent = localStorage.getItem('moodboardContent');
    const savedBg = localStorage.getItem('moodboardBg');
    if (savedContent && savedBg) {
        document.getElementById('moodboard').innerHTML = savedContent;
        document.getElementById('moodboard').style.background = savedBg;
    } else {
        alert('No saved mood board found!');
    }
});
