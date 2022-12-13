export function checkPosition(action) {
    // Нам потребуется знать высоту документа и высоту экрана:
    const height = document.body.offsetHeight;
    const screenHeight = window.innerHeight;
  
    // Они могут отличаться: если на странице много контента,
    // высота документа будет больше высоты экрана (отсюда и скролл).
  
    // Записываем, сколько пикселей пользователь уже проскроллил:
    const scrolled = window.scrollY;
  
    // Обозначим порог, по приближении к которому
    // будем вызывать какое-то действие.
    // В нашем случае — четверть экрана до конца страницы:
    const threshold = height - screenHeight / 4;
  
    // Отслеживаем, где находится низ экрана относительно страницы:
    const position = scrolled + screenHeight;
  
    if (position >= threshold) {
      // Если мы пересекли полосу-порог, вызываем нужное действие.
      // getImages(searchString);
      action();
    }
  }