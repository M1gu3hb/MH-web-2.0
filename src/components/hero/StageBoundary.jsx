import { Component } from 'react';

/**
 * Red de seguridad de la escena 3D.
 *
 * `Suspense` espera promesas, pero no atrapa errores: si el modelo de la
 * laptop no llega —red mala, un 404, un contexto WebGL que se pierde a
 * mitad—, el fallo subía hasta la raíz y React desmontaba la aplicación
 * entera. El visitante se quedaba con la página en blanco por culpa de un
 * adorno.
 *
 * Con esto, un fallo de la escena solo cuesta la escena: se avisa hacia
 * arriba para que la web siga su curso sin laptop, que es justo el modo que
 * ya existe para los aparatos que no pueden con ella.
 */
export class StageBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { caido: false };
  }

  static getDerivedStateFromError() {
    return { caido: true };
  }

  componentDidCatch(error) {
    this.props.onFail?.(error);
  }

  render() {
    return this.state.caido ? null : this.props.children;
  }
}
