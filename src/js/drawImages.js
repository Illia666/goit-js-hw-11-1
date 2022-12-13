import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

class SettingImageHeight {
  constructor(gallery) {
    this.gallery = gallery;
    this.imageHeight = 0;
    this.simple = {};
    this.isFirstLoad = true;
  }

  reset() {
    this.imageHeight = 0;
    this.gallery.innerHTML = '';
    this.isFirstLoad = true;
    this.simple = {};
  }
  //  Устанавливает всем картинкам одинаковые атрибуты height width
  // После загрузки массива карточек
  #ccHeight(inputWidth, inputHeight, factWidth = 0) {
    return (factWidth / inputWidth) * inputHeight;
  }

  #setHeight(imageHeight) {
    this.gallery
      .querySelectorAll('img')
      .forEach(el => el.setAttribute('height', imageHeight));
  }

  defineHeight(inputWidth, inputHeight) {
    if (!this.imageHeight) {
      this.gallery.querySelector('img').addEventListener(
        'load',
        e => {
          this.imageHeight = this.#ccHeight(
            inputWidth,
            inputHeight,
            e.target.clientWidth
          );

          this.#setHeight(this.imageHeight);
        },
        {
          once: true,
        }
      );
    } else {
      this.#setHeight(this.imageHeight);
    }
  }
  // Разметка
  markUpGallery = images => {
    const result = images
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" data-source=${largeImageURL}  href="${largeImageURL}"/>
  <div class="info">
    <p class="info-item">
      <b>Likes </b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</<span>
    </p>
  </div>
</div>`;
        }
      )
      .join('');
    return result;
  };
  // Добавляет визуальный эффект после загрузки изображения в карточке
  #setLoadedImage() {
    const images = this.gallery.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('load', e => {
        const card = e.currentTarget.closest('.photo-card');
        card.classList.add('loaded');
      });
    });
  }

  #addSimpleBox() {
    if (this.isFirstLoad) {
      this.simple = new SimpleLightbox(`.${this.gallery.classList[0]} img`, {
        /* options */
        sourceAttr: 'data-source',
      });
      this.isFirstLoad = false;
    } else {
      this.simple.refresh();
    }
  }

  // Make smooth page scrolling after the request and rendering each next group of images.
  #addSmoothScroll() {
    const { height: cardHeight } =
      this.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  draw(images) {
    // const isFirstLoad = this.gallery.innerHTML === '';
    this.gallery.insertAdjacentHTML('beforeend', this.markUpGallery(images));
    this.defineHeight(images[0].webformatWidth, images[0].webformatHeight);
    this.#setLoadedImage();
    this.#addSimpleBox();
    this.#addSmoothScroll();
    this.isFirstLoad = false;
  }
}

export default SettingImageHeight;