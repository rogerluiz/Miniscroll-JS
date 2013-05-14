<legend>Adicione o miniscroll.js em sua página:</legend>
<pre>
    <script src="miniscroll.js"></script>
</pre>

<legend>Marcação HTML:</legend>
<pre>
    <div class="scroller">
    </div>
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
    <span class="code-var">axis</span>:<br /> eixo do scrollbar <span class="code-attr">ex: "y" ou "x"</span><br /><br />
    <span class="code-var">size</span>:<br /> a largura do scrollbar <span class="code-attr">ex: 10</span><br /><br />
    <span class="code-var">sizethumb</span>:<br /> o tamanho do thumb <span class="code-attr">ex: 100 ou "auto"</span><br /><br />
    <span class="code-var">thumbColor</span>:<br /> cor de fundo do thumb <span class="code-attr">ex: "#0e5066"</span><br /><br />
    <span class="code-var">trackerColor</span>:<br /> cor de fundo do tracker <span class="code-attr">ex: "#1a8bb2"</span><br /><br />
    <span class="code-var">scrollbarSize</span>:<br /> tamanho do scrollbar, você pode setar um tamanho fix para o scrollbar <span class="code-attr">ex: 300 isso deixara o scrollbar com a altura de 300px</span>
</pre>