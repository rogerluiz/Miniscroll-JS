<legend>Adicione o miniscroll.js em sua página:</legend>
<pre>
   &lt;script src="miniscroll.js"&gt;&lt;/script&gt;
</pre>

<legend>Marcação HTML:</legend>
<pre>
    &lt;div class="scroller"&gt;
    &lt;/divt&gt;
</pre>

<legend>Marcação CSS:</legend>
<pre>
   .scroller {
       width: 400px;
       height: 300px;
       overflow: hidden;
   }
</pre>

<legend>Simples inicialização:</legend>
<pre>
    new Miniscroll( ".scroller", {
        axis: "y",
        size: 10,
        sizethumb: "auto"
        thumbColor: "#0e5066",
        trackerColor: "#1a8bb2"
    });
</pre>

<legend>Mude a cor do thumb ou do tracker com css:</legend>
<pre>
    .miniscroll-thumb {
        background-color: #0e5066 !important;
    }
    .miniscroll-tracker {
       background-color: #1a8bb2 !important;
    }
</pre>

<legend>Parametros:</legend>
<pre>
    axis:<br /> eixo do scrollbar <span style="color: #d94436">ex: "y" ou "x"</span><br /><br />
    size:<br /> a largura do scrollbar <span style="color: #d94436">ex: 10</span><br /><br />
    sizethumb:<br /> o tamanho do thumb <span cstyle="color: #d94436">ex: 100 ou "auto"</span><br /><br />
    thumbColor:<br /> cor de fundo do thumb <span style="color: #d94436">ex: "#0e5066"</span><br /><br />
    trackerColor:<br /> cor de fundo do tracker <span style="color: #d94436">ex: "#1a8bb2"</span><br /><br />
    scrollbarSize:<br /> tamanho do scrollbar, você pode setar um tamanho fix para o scrollbar <span style="color: #d94436">ex: 300 isso deixara o scrollbar com a altura de 300px</span>
</pre>