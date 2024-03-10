/**
* Класс DocsPage представляет страницу документации, которая может быть отрендерена в HTML.
* @class
*/
class DocsPage {
  /**
  * Создает новый экземпляр страницы документации.
  * @param {HTMLElement} parent - Родительский элемент, в который будет вставлена страница.
  */
  constructor(parent) {
    this.parent = parent;
  }

  /**
  * Загружает содержимое файла `index.html` из папки `docs` и возвращает его в виде строки.
  * @returns {Promise<string>} Промис, который разрешается содержимым файла `index.html`.
  */
  async loadDocsContent() {
    const response = await fetch('/docs/index.html');
    if (!response.ok) {
      throw new Error('Не удалось загрузить документацию');
    }
    return response.text();
  }

  /**
  * Рендерит страницу документации в DOM.
  */
  async render() {
    try {
      const content = await this.loadDocsContent();
      this.parent.innerHTML = content;
    } catch (error) {
      console.error('Ошибка при загрузке документации:', error);
    }
  }
}

export default DocsPage;
