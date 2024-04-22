import Base from '@components/Base/Base';
import template from '@templates/Logo.hbs';

/**
* Класс Logo представляет логотип, который может быть отрендерен в HTML.
* @class
*/
class Logo extends Base {
  constructor(parent: HTMLElement) {
    super(parent, template);
  }
}

export default Logo;
