---
title: Descobri uma feature massa do vue, o @click.self
date: 2020-05-22
published: true
tags: ['Vue', 'Dev Experience', 'Bizu']
canonical_url: false
description: "Uma diretiva que ajuda muito ao fazer modais"
---

Estava eu hoje fazendo o componente de modal no meu amigo [Zilla](https://medium.com/techatquero/design-system-conectando-desenvolvedores-e-designers-51d2e5ac96d5) (Design System da [@queroedu](https://www.linkedin.com/company/queroedu)), eis que cheguei na parte interessante dos modais, o comportamento de fechar.

A "mágica" por trás dos modais. Quando se quer fechar um modal, normalmente, existem dois caminhos:

* Botão de fechar que fica no topo do modal: Ao clicar emite o evento de closed e voilà, o componente pai pode fechar o componente e fim do clico
* Click no overlay (a parte escura externa ao conteúdo do modal, também chamada de backdrop em alguns lugares): Quando o usuário clica no overlay, emite o evento de closed para o componente pai. Porém, é aqui que mora o
perigo... Vamos ver se é tão facil fazer quanto falar

Veja o código a seguir, praticamente resumindo que eu expliquei no segundo ponto da lista


```jsx
<template>
  <div
    class="ui-modal"
    :class="{ 'ui-modal--is-open': open }"
    @click="$emit('closed')"
  >
    <div class="ui-modal__dialog">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    open: {
      type: Boolean,
      default: false
    }
  }
};
</script>
```

Olhando assim, parece que vai funcionar, sem preocupações, certo?
Errado!

Vamos analisar o que esta acontecendo por trás dos panos

O @click vai colocar um EventListener de click para a div de class `ui-modal`.

Os EventListeners tem um comportamento peculiar e esse comportamento se chama bubbling.

O bubbling é um tipo de propagação de evento, quando é adicionado um evento a um elemento esse evento é acionado em todos os elementos filhos do elemento alvo. A propagação funciona do elemento mais interno até chegar no elemento alvo. É possivel parar a propagação do evento com a função `stopPropagation()` no objeto de evento

Veja o exemplo abaixo exemplo:

https://codesandbox.io/embed/loving-bhaskara-578cb?autoresize=1&fontsize=14&hidenavigation=1&moduleview=1&theme=dark

Ao clicar no elemento mais interno `P` ele emite o click até o elemento section, porém quando chega na section o evento chama
a função que eu mencionei antes, o `stopPropagation()`, isso fez com que o evento de click não chegasse no elemento body

Visto esse exemplo, já pensou qual o problema de fechar um modal ao clicar no overlay?

O overlay quase sempre é um elemento pai do conteúdo do modal, então ao clicar no conteúdo do modal vamos acabar emitindo o click para o overlay e o modal irá fechar, esse não é o comportamento previsto.

Formas que eu conheço de evitar isso:
* Dentro do elemento que engloba o conteúdo do modal podemos ter um handler de click que chama o stopPropagation e evita
que o event bubbling acabe chegando no overlay
* Dentro do click do overlay podemos fazer um if pra saber se o click foi especificamente no overlay com `event.target == overlayElement`

A diretiva @click.self do Vue segue o segundo ponto que eu passei, ele só emite o evento se o target for o proprio
elemento em que nós colocamos a diretiva.

Em vez de criarmos uma função para tratar essa regra a unica mudança no primeiro snippet que escrevi seria colocar o `.self`
no `@click`:
```diff
-@click="$emit('closed')"
+@click.self="$emit('closed')"
```

Exemplo do modal funcionando no Vue:

https://codesandbox.io/embed/weathered-feather-q08j9?autoresize=1&fontsize=14&hidenavigation=1&moduleview=1&theme=dark

Esse é meu primeiro artigo técnico, aceito feedbacks!
