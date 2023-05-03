# React IPV4 Input

O React IPV4 Input é um componente React para permitir a entrada de endereços IPV4 (Internet Protocol Version 4).

O componente substitui um input normal por um que permite a digitação correta de um endereço IPV4, garantindo que cada octeto seja válido.

Instalação
Para instalar o React IPV4 Input em seu projeto, basta executar o seguinte comando:

```bash
npm install react-ipv4-input
```
## Uso

Para usar o componente em seu projeto, basta importá-lo e usá-lo como qualquer outro componente React. Veja um exemplo:

```jsx
import React from 'react';
import IPV4Input from 'react-ipv4-input';

function MyComponent() {
  return (
    <div>
      <label htmlFor="ipv4">Digite um endereço IPV4:</label>
      <IPV4Input id="ipv4" name="ipv4" />
    </div>
  );
}
```

O componente possui as seguintes propriedades:

### `props`

*   `name` (`string`, default: `''`)\
    O nome do input
*   `value` (`string` ou `array`, default: `''`)\
    O valor do input
*   `defaultValue` (`string` ou `array`, default: `''`)\
    O valor padrão do input
*   `onChange` (`(address)`, optional)\
    Função chamada sempre que um dos octetos for modificado
*   `isWrong` (`(address) => boolean?`, optional)\
    Função chamada para determinar se o valor atual válido ou não.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
