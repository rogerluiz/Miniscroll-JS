![Miniscroll](http://miniscroll.rogerluizm.com.br/img/logo.png)

### Adicione o miniscroll.js em sua página:

&lt;script src="miniscroll.js"&gt;&lt;/script&gt;

***

Marcação HTML:

> &lt;div class="scroller"&gt;
> // text here
> &lt;/div&gt;

***

### Marcação CSS:
> .scroller {
>     width: 400px;
>     height: 300px;
>     overflow: hidden;
> }

***

### Simples inicialização:
> new Miniscroll(".scroller", {
>     axis: "y",
>     size: 10,
>     sizethumb: "auto",
>     thumbColor: "#0e5066",
>     trackerColor: "#1a8bb2"
> });

***

### Adicione CSS:
> .miniscroll-thumb {
>     background-color: #0e5066 !important;
> }

> .miniscroll-tracker {
>     background-color: #1a8bb2 !important;
> }

***

### Adicione CSS para um scroll especifico:
> miniscroll-target .miniscroll-thumb {
>     background-color: #0e5066 !important;
> }

> miniscroll-target .miniscroll-tracker {
>     background-color: #1a8bb2 !important;
> }

***

### Parametros:
**axis:**
_eixo do scrollbar ex: "y" ou "x"_

**size:**
_a largura do scrollbar ex: 10_

**sizethumb:**
_o tamanho do thumb ex: 100 ou "auto"_

**thumbColor:**
_cor de fundo do thumb ex: "#0e5066"_

**trackerColor:**
_cor de fundo do tracker ex: "#1a8bb2"_

**scrollbarSize:**
_tamanho do scrollbar, você pode setar um tamanho fix para o scrollbar ex: 300 isso deixara o scrollbar com a altura de 300px_
