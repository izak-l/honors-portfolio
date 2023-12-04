// automatically load gallery from img/ folder
document.addEventListener('DOMContentLoaded', function () {
  const galleryContainer = document.getElementById('gallery-container');
  const imgFoldername = "img/gallery"
  
  // img columns: https://codesandbox.io/p/sandbox/fast-sun-357ccd?file=%2Fstyle.css%3A14%2C1-16%2C2
  const column1 = document.createElement('div');
  column1.className = "column";
  const column2 = document.createElement('div');
  column2.className = "column";
  const column3 = document.createElement('div');
  column3.className = "column";
  
  // Fetch image filenames asynchronously
  fetchImageFilenames().then(filenames => {
    // Dynamically create image containers
    const counter = 0
    filenames.forEach((filename, index) => {
      const imageContainer = document.createElement('div');
      imageContainer.className = 'image-container';
      
      const img = document.createElement('img');
      img.src = imgFoldername + "/" + filename; 
      
      imageContainer.appendChild(img);
      // galleryContainer.appendChild(imageContainer);
      if(index%3 == 0) {
        column1.appendChild(imageContainer);
      } else if(index%3 == 1) {
        column2.appendChild(imageContainer);
      } else if(index%3 == 2) {
        column3.appendChild(imageContainer);
      }
      
      galleryContainer.appendChild(column1);
      galleryContainer.appendChild(column2);
      galleryContainer.appendChild(column3);
      
      imageContainer.addEventListener('click', function () {
        openLightbox(index, filenames);
      });
    });
  });
  
  // Function to fetch image filenames
  async function fetchImageFilenames() {
    const response = await fetch('img/gallery/');
    const body = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    const filenames = Array.from(doc.querySelectorAll('a'))
      .map(link => link.getAttribute('href'))
      .filter(href => href.endsWith('.jpg')); // Adjust file extensions as needed
      
      return filenames;
  }
  
  // Function to open lightbox
  function openLightbox(index, filenames) {    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    // Add navigation arrows
    const arrowsContainer = document.createElement('div');
    arrowsContainer.className = 'arrows-container';
    
    lightbox.appendChild(arrowsContainer);
    // Add left arrow
    const leftArrow = document.createElement('div');
    leftArrow.className = 'arrow left';
    leftArrow.innerHTML = '&lt;';
    arrowsContainer.appendChild(leftArrow);

    // Add right arrow
    const rightArrow = document.createElement('div');
    rightArrow.className = 'arrow right';
    rightArrow.innerHTML = '&gt;';
    arrowsContainer.appendChild(rightArrow);

    // Add gallery navigation event handlers
    leftArrow.addEventListener('click', function (event) {
      event.stopPropagation();
                console.log('left arrow clicked');
      navigate(-1, filenames);
    });

    rightArrow.addEventListener('click', function(event) {
      event.stopPropagation();
                console.log('right arrow clicked');
      navigate(1, filenames);

    });
    
    // Show/hide arrows based on gallery view
    lightbox.addEventListener('mouseenter', function () {
      arrowsContainer.style.opacity = 1;
      console.log('show!')
    });
    
    lightbox.addEventListener('mouseleave', function () {
      arrowsContainer.style.opacity = 0;
    });
    
    const lightboxImg = document.createElement('img');
    lightboxImg.src = 'img/gallery/' + filenames[index];
    
    // handle mobile users swiping between pictures
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Add touchstart event listener
    lightboxImg.addEventListener('touchstart', function (event) {
      touchStartX = event.touches[0].clientX;
      handleSwipe();
    });
    
    // Add touchend event listener
    lightboxImg.addEventListener('touchend', function (event) {
      touchEndX = event.changedTouches[0].clientX;
      handleSwipe();
    });
    
    lightbox.appendChild(lightboxImg);
    
    document.body.appendChild(lightbox);
    
    lightbox.addEventListener('click', function () {
      document.body.removeChild(lightbox);
    })
  }
  
  // Function to navigate between images
  function navigate(direction, filenames) {
    const lightbox = document.querySelector('.lightbox img');
    const currentIndex = filenames.indexOf(lightbox.src.split('/').pop());
    
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) {
      newIndex = filenames.length -1;
    } else if (newIndex >= filenames.length) {
      newIndex = 0;
    }
    
    lightbox.src = 'img/gallery/' + filenames[newIndex];
    console.log('lightbox src updated to: ' + lightbox.src);
  }
  
  function handleSwipe() {
    const swipeThreshold = 50; // adjust value to preference
    
    // Calculate the difference between touch start and touch end
    const swipeDistance = touchEndX - touchStartX;
    
    // Check if the swipe distance is greater than the threshold
    if (swipeDistance > swipeThreshold) {
      // Swipe to the right, navigate to previous image
      navigate (-1, filenames);
    } else if (swipeDistance < -swipeThreshold) {
      // Swipe to the left, navigate to next image
      navigate(1, filename);
    }
  }

});