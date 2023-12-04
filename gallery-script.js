document.addEventListener('DOMContentLoaded', function () {
  const galleryContainer = document.getElementById('gallery-container');
  const isLocal = window.location.hostname === '127.0.0.1';
  const imgFoldername = isLocal ? 'img/gallery/' : '';
  
  // img columns: https://codesandbox.io/p/sandbox/fast-sun-357ccd?file=%2Fstyle.css%3A14%2C1-16%2C2
  const column1 = createColumn();
  const column2 = createColumn();
  const column3 = createColumn();
  
  const fetchFunction = isLocal ? fetchImageFilenames : fetchImageUrls;
  console.log(fetchFunction);
  
  fetchFunction().then(data => {
    const items = data;
    items.forEach((item, index) => {
      const imageContainer = createImageContainer(item);
      appendImageContainerToColumn(imageContainer, index % 3 === 0 ? column1 : (index % 3 === 1 ? column2 : column3));
      imageContainer.addEventListener('click', () => openLightbox(index, items));
    });
    
    appendColumnsToGalleryContainer(column1, column2, column3);
  });
  
  async function fetchImageFilenames() {
    const response = await fetch('img/gallery/');
    const body = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    return Array.from(doc.querySelectorAll('a'))
      .map(link => link.getAttribute('href'))
      .filter(href => href.endsWith('.jpg'));
  }
    
   async function fetchImageUrls() {
     const endpoint = 'https://api.github.com/repos/izak-l/honors-portfolio/contents/img/gallery';
     try {
       const response = await fetch(endpoint);
       const data = await response.json();
       return data.map(item => item.download_url).filter(url => url.endsWith('.jpg'));
     } catch (error) {
       console.error('Error fetching data:', error);
       return [];
     }
   }

   function createColumn() {
     const column = document.createElement('div');
     column.className = 'column';
     return column;
   }

   function createImageContainer(item) {
     const imageContainer = document.createElement('div');
     imageContainer.className = 'image-container';

     const img = document.createElement('img');
     img.src = imgFoldername + item;

     imageContainer.appendChild(img);
     return imageContainer;
   }

   function appendImageContainerToColumn(imageContainer, column) {
     column.appendChild(imageContainer);
   }

   function appendColumnsToGalleryContainer(column1, column2, column3) {
     galleryContainer.appendChild(column1);
     galleryContainer.appendChild(column2);
     galleryContainer.appendChild(column3);
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
      navigate(-1, filenames);
    });

    rightArrow.addEventListener('click', function(event) {
      event.stopPropagation();
      navigate(1, filenames);
    });
    
    // Show/hide arrows based on gallery view
    lightbox.addEventListener('mouseenter', function () {
      arrowsContainer.style.opacity = 1;
      // console.log('show!')
    });
    
    lightbox.addEventListener('mouseleave', function () {
      arrowsContainer.style.opacity = 0;
    });
    
    const lightboxImg = document.createElement('img');
    if(!isLocal) {
      lightboxImg.src = filenames[index];
    } else {
      lightboxImg.src = "img/gallery/" + filenames[index];
    }
    
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
    if(!isLocal) {
      currentIndex = filenames.indexOf(lightbox.src);
    } else {
      currentIndex = filenames.indexOf(lightbox.src.split('/').pop());
    }

    
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) {
      newIndex = filenames.length -1;
    } else if (newIndex >= filenames.length) {
      newIndex = 0;
    }
    
    if(!isLocal) {
      lightbox.src = filenames[newIndex];
    } else {
      lightbox.src = 'img/gallery/' + filenames[newIndex];
    }
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