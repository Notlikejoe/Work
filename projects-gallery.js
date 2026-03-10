/* Project gallery popup - loads images from images/Projects/{folder}/ */

(function() {
  const PROJECT_IMAGES = {
    'Golf view villa': [
      'bath 2.png', 'bathroom 1.png', 'ext.png', 'family room next to staircase.png',
      'formal living.png', 'kitchen 2.png', 'living dining pool 2.png', 'living dining pool.png',
      'living dining.png', 'living dinning 2.png', 'master bed 3.png', 'master bedroom.png',
      'mb 4.png', 'mb 5.png', 'study 2.png', 'study 3.png'
    ],
    'palatial concept': [
      '1.png', '2.png', '3.png', '4.png', '7.png', '8.png', '9.png', '10.png',
      'a.png', 'b.png', 'c.png', 'e.png', 'h.png'
    ],
    'Skylife': [
      '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png'
    ],
    'Villa Alpina': [
      '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png',
      '10.png', '11.png', '12.png', '13.png', '14.png'
    ],
    'Azure crest villa': [
      'bed 2.png', 'bedd.png', 'ext 1.png', 'ext 2.png', 'ext3.png', 'formal dining.png',
      'formal living.png', 'guest bed.png', 'gym.png', 'island kit.png', 'kids pool.png',
      'livinng cum dining.png', 'lobby.png', 'majlis.png', 'majlis2.png', 'master bed.png',
      'pool deck majlis.png', 'service kitchen.png', 'study.png', 'theatre.png'
    ]
  };

  function init() {
    const modal = document.getElementById('project-gallery-modal');
    const overlay = document.getElementById('project-gallery-overlay');
    const closeBtn = document.getElementById('project-gallery-close');
    const prevBtn = document.getElementById('project-gallery-prev');
    const nextBtn = document.getElementById('project-gallery-next');
    const mainImg = document.getElementById('project-gallery-main-img');
    const titleEl = document.getElementById('project-gallery-title');
    const counterEl = document.getElementById('project-gallery-counter');
    const thumbnails = document.getElementById('project-gallery-thumbnails');

    if (!modal || !mainImg) return;

    let currentIndex = 0;
    let images = [];
    let folder = '';
    let projectTitle = '';

    function getImageUrl(path) {
      return 'images/Projects/' + encodeURIComponent(folder) + '/' + encodeURIComponent(path);
    }

    function showImage(index) {
      if (images.length === 0) return;
      currentIndex = ((index % images.length) + images.length) % images.length;
      mainImg.src = getImageUrl(images[currentIndex]);
      mainImg.alt = projectTitle + ' - Image ' + (currentIndex + 1);
      if (counterEl) counterEl.textContent = (currentIndex + 1) + ' / ' + images.length;
      thumbnails.querySelectorAll('.project-gallery-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === currentIndex);
      });
    }

    function openGallery(folderName, title) {
      folder = folderName;
      projectTitle = title;
      images = PROJECT_IMAGES[folder] || [];
      if (images.length === 0) return;

      if (titleEl) titleEl.textContent = title;
      thumbnails.innerHTML = '';
      images.forEach((img, i) => {
        const thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.className = 'project-gallery-thumb' + (i === 0 ? ' active' : '');
        thumb.setAttribute('aria-label', 'View image ' + (i + 1));
        const thumbImg = document.createElement('img');
        thumbImg.src = getImageUrl(img);
        thumbImg.alt = '';
        thumb.appendChild(thumbImg);
        thumb.addEventListener('click', () => showImage(i));
        thumbnails.appendChild(thumb);
      });

      showImage(0);
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      prevBtn.onclick = () => showImage(currentIndex - 1);
      nextBtn.onclick = () => showImage(currentIndex + 1);
    }

    function closeGallery() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-project-gallery]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const folderName = this.getAttribute('data-project-folder');
        const title = this.getAttribute('data-project-title') || 'Project';
        if (folderName) openGallery(folderName, title);
      });
      el.addEventListener('keydown', function(e) {
        if ((e.key === 'Enter' || e.key === ' ') && this.getAttribute('data-project-gallery') !== null) {
          e.preventDefault();
          const folderName = this.getAttribute('data-project-folder');
          const title = this.getAttribute('data-project-title') || 'Project';
          if (folderName) openGallery(folderName, title);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeGallery);
    if (overlay) overlay.addEventListener('click', closeGallery);

    document.addEventListener('keydown', function(e) {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
