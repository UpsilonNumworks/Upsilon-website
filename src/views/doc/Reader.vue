<template>
  <div class="doc-wrapper">
    <div id="latex-doc" class="doc">
      <h1>{{ t("doc.reader.name") }}</h1>
      <p>
        {{ t("doc.reader.p1") }}
        <a
          href="http://upsilonnumworks.github.io/Upsilon-External"
          target="_blank"
          rel="noopener noreferrer"
          >Upsilon External</a
        >
      </p>
      <p>{{ t("doc.reader.p2") }}</p>
      <h2>{{ t("doc.reader.usingColor") }}</h2>
      <p>{{ t("doc.reader.colorsDesc") }}</p>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>{{ t("doc.reader.color") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>%xx%</code></td>
            <td>{{ t("doc.reader.colors.startColor") }}</td>
          </tr>
          <tr>
            <td><code>%\xx%</code></td>
            <td>{{ t("doc.reader.colors.lastColor") }}</td>
          </tr>
          <tr>
            <td><code>%r%</code></td>
            <td>{{ t("doc.reader.colors.red") }}</td>
          </tr>
          <tr>
            <td><code>%rl%</code></td>
            <td>{{ t("doc.reader.colors.lightRed") }}</td>
          </tr>
          <tr>
            <td><code>%m%</code></td>
            <td>{{ t("doc.reader.colors.magenta") }}</td>
          </tr>
          <tr>
            <td><code>%t%</code></td>
            <td>{{ t("doc.reader.colors.turquoise") }}</td>
          </tr>
          <tr>
            <td><code>%pk%</code></td>
            <td>{{ t("doc.reader.colors.pink") }}</td>
          </tr>
          <tr>
            <td><code>%pp%</code></td>
            <td>{{ t("doc.reader.colors.purple") }}</td>
          </tr>
          <tr>
            <td><code>%b%</code></td>
            <td>{{ t("doc.reader.colors.blue") }}</td>
          </tr>
          <tr>
            <td><code>%bl%</code></td>
            <td>{{ t("doc.reader.colors.lightBlue") }}</td>
          </tr>
          <tr>
            <td><code>%br%</code></td>
            <td>{{ t("doc.reader.colors.brown") }}</td>
          </tr>
          <tr>
            <td><code>%o%</code></td>
            <td>{{ t("doc.reader.colors.orange") }}</td>
          </tr>
          <tr>
            <td><code>%g%</code></td>
            <td>{{ t("doc.reader.colors.green") }}</td>
          </tr>
          <tr>
            <td><code>%gl%</code></td>
            <td>{{ t("doc.reader.colors.lightGreen") }}</td>
          </tr>
          <tr>
            <td><code>%c%</code></td>
            <td>{{ t("doc.reader.colors.Cyan") }}</td>
          </tr>
        </tbody>
      </table>

      <h2>{{ t("doc.latex.reference") }}</h2>
      <p>
        {{ t("doc.latex.symbolslisted") }}
      </p>
      <div id="latex-tables">
        <div class="latex-table">
          <h3 class="latex-table-title">{{ t("doc.latex.functions") }}</h3>
          <h4>{{ t("doc.latex.command") }}</h4>
          <h4>{{ t("doc.latex.output") }}</h4>

          <LatexView :latex="true" formula="\frac{ab}{cd}" />
          <LatexView :latex="true" formula="\sqrt[n]{x}" />
          <LatexView :latex="true" formula="X^n" />
          <LatexView :latex="true" formula="X_n" />
          <LatexView :latex="true" formula="\overrightarrow{AB}" />
          <LatexView :latex="true" formula="\overline{AB}" />
          <LatexView :latex="true" formula="\binom{p}{q}" />
          <LatexView :latex="true" display="\intset{1,n}" formula="\left[ 1,n \right]"/>
          <LatexView display="\ceil{x}" output="⌈x⌉"/>
          <LatexView display="\floor{x}" output="⌊x⌋"/>
          <LatexView :latex="true" display="\int{f(x)}{x}{a}{b}" formula="\int_{a}^{b}f(x)dx"/>
          <LatexView :latex="true" display="\sum{U_k}{k}{p}{n}" formula="\sum_{k=p}^{n}U_k"/>
          <LatexView :latex="true" display="\prod{U_k}{k}{p}{n}" formula="\prod_{k=p}^{n}U_k"/>
          <!--<LatexView
            :latex="true"
            display="\int{f(x)}^{x}{a}{b}"
            formula="\int_{a}^{b}f(x)"
          />-->
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">{{ t("doc.latex.arrows") }}</h3>
          <h4>{{ t("doc.latex.command") }}</h4>
          <h4>{{ t("doc.latex.output") }}</h4>
          <LatexView display="\Leftarrow" output="⇐" />
          <LatexView display="\Rightarrow" output="⇒" />
          <LatexView display="\Uparrow" output="⇑" />
          <LatexView display="\Downarrow" output="⇓" />
          <LatexView display="\leftarrow" output="←" />
          <LatexView display="\nwarrow" output="↖" />
          <LatexView display="\uparrow" output="↑" />
          <LatexView display="\nearrow" output="↗" />
          <LatexView display="\rightarrow" output="→" />
          <LatexView display="\searrow" output="↘" />
          <LatexView display="\downarrow" output="↓" />
          <LatexView display="\swarrow" output="↙" />
          <LatexView display="\leftrightarrow" output="↔" />
          <LatexView display="\updownarrow" output="↕" />
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">{{ t("doc.latex.mathsymbols") }}</h3>
          <h4>{{ t("doc.latex.command") }}</h4>
          <h4>{{ t("doc.latex.output") }}</h4>
          <LatexView display="\times" output="×" />
          <LatexView display="\div" output="÷" />
          <LatexView display="\forall" output="∀" />
          <LatexView display="\exists" output="∃" />
          <LatexView display="\nexists" output="∄" />
          <LatexView display="\partial" output="∂" />
          <LatexView display="\pm" output="±" />
          <LatexView display="\infinity" output="∞" />
          <LatexView display="\approx" output="≈" />
          <LatexView display="\sim" output="∼" />
          <LatexView display="\neq" output="≠" />
          <LatexView display="\equiv" output="≡" />
          <LatexView display="\leq" output="≤" />
          <LatexView display="\geq" output="≥" />
          <LatexView display="\left(" output="(" />
          <LatexView display="\right)" output=")" />
          <LatexView formula="\in" output="∊" />
          <LatexView formula="\In" output="∈" />
          <LatexView formula="\Notin" output="∉" />
          <LatexView formula="\subset" output="⊂" />
          <LatexView formula="\nsubset" output="⊄" />
          <LatexView formula="\cap" output="∩" />
          <LatexView formula="\cup" output="∪" />
          <LatexView formula="\Cap" output="⋂" />
          <LatexView formula="\Cup" output="⋃" />
          <LatexView formula="\cdot" output="⋅" />
          <LatexView formula="\cdots" output="⋯" />
          <LatexView formula="\ldots" output="…" />
          <LatexView :latex="true" display="\i" formula="\textit{i}" />
          <LatexView :latex="true" display="\f" formula="\textit{f}" />
          <LatexView formula="\space" output=" " />
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">
            {{ t("doc.latex.greekcapitalletter") }}
          </h3>
          <h4>{{ t("doc.latex.command") }}</h4>
          <h4>{{ t("doc.latex.output") }}</h4>
          <LatexView display="\Alpha" output="A" />
          <LatexView display="\Beta" output="B" />
          <LatexView display="\Gamma" output="Γ" />
          <LatexView display="\Delta" output="Δ" />
          <LatexView display="\Epsilon" output="E" />
          <LatexView display="\Zeta" output="Z" />
          <LatexView display="\Eta" output="H" />
          <LatexView display="\Theta" output="Θ" />
          <LatexView display="\Iota" output="I" />
          <LatexView display="\Kappa" output="K" />
          <LatexView display="\Lambda" output="Λ" />
          <LatexView display="\Mu" output="M" />
          <LatexView display="\Nu" output="N" />
          <LatexView display="\Xi" output="Ξ" />
          <LatexView display="\Omicron" output="O" />
          <LatexView display="\Pi" output="Π" />
          <LatexView display="\Rho" output="P" />
          <LatexView display="\Sigma" output="Σ" />
          <LatexView display="\Tau" output="T" />
          <LatexView display="\Upsilon" output="Υ" />
          <LatexView display="\Phi" output="Φ" />
          <LatexView display="\Chi" output="X" />
          <LatexView display="\Psi" output="Ψ" />
          <LatexView display="\Omega" output="Ω" />
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">
            {{ t("doc.latex.greeksmallletter") }}
          </h3>
          <h4>{{ t("doc.latex.command") }}</h4>
          <h4>{{ t("doc.latex.output") }}</h4>
          <LatexView display="\alpha" output="α" />
          <LatexView display="\beta" output="β" />
          <LatexView display="\gamma" output="γ" />
          <LatexView display="\delta" output="δ" />
          <LatexView display="\epsilon" output="ϵ" />
          <LatexView display="\zeta" output="ζ" />
          <LatexView display="\eta" output="η" />
          <LatexView display="\theta" output="θ" />
          <LatexView display="\iota" output="ι" />
          <LatexView display="\kappa" output="κ" />
          <LatexView display="\lambda" output="λ" />
          <LatexView display="\mu" output="μ" />
          <LatexView display="\nu" output="ν" />
          <LatexView display="\xi" output="ξ" />
          <LatexView display="\omicron" output="ο" />
          <LatexView display="\pi" output="π" />
          <LatexView display="\rho" output="ρ" />
          <LatexView display="\sigma" output="σ" />
          <LatexView display="\tau" output="τ" />
          <LatexView display="\upsilon" output="υ" />
          <LatexView display="\phi" output="ϕ" />
          <LatexView display="\chi" output="χ" />
          <LatexView display="\psi" output="ψ" />
          <LatexView display="\omega" output="ω" />
        </div>
      </div>
      <h2>{{ t('doc.reader.example.title') }}</h2>
      <p>{{ t('doc.reader.example.content') }}</p>
      <code class="urt">
        %pp%f(x)=%b%$\frac{\sqrt[4]{3x}}{10}$ <br />
        %pp%$\forall x \in R$,%pp% <br />
        f'(x)=%bl% $\frac{\frac{15}{2 \cdot \sqrt{3 \cdot x} \cdot \sqrt[4]{3
        \cdot x}}}{10^2}$
      </code>
      <img class="urt" src="~@/assets/Reader_screenshot.webp" alt="result" />
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import LatexView from '@/components/LatexView.vue'
export default {
  name: 'LatexPage',
  setup () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  },
  components: { LatexView }
}
</script>

<style scoped>
.urt {
  margin: 0.5em;
  padding: 0.5em;
  border-radius: 5px;
  border: solid var(--upsilon-1) 1pt;
  background: var(--upsilon-2);
  max-width: 800px;
}
th {
  font-weight: normal;
  text-align: center;
}
th,
td {
  padding: 0.5em;
}
table {
  background-color: var(--feature-bg-upsilon);
  margin: auto;
}
h3,
h4 {
  text-align: center;
}
#latex-doc {
  max-width: 1500px;
  width: 100%;
}

@media screen and (min-width: 1500px) {
  #latex-tables {
    column-count: 4;
  }
}
@media screen and (min-width: 1250px) and (max-width: 1500px) {
  #latex-tables {
    column-count: 3;
  }
}
@media screen and (min-width: 750px) and (max-width: 1250px) {
  #latex-tables {
    column-count: 2;
  }
}

.latex-table {
  margin-bottom: 30px;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 0;

  background: var(--feature-bg-upsilon); /*#ffffff20*/
  padding: 15px;
  display: grid;
  grid-template-columns: auto auto;
  min-width: 12em;
  flex-grow: 1;
  break-inside: avoid;
}
.latex-table > p {
  margin-top: 0;
}
.latex-table-title {
  grid-column-start: 1;
  grid-column-end: 3;
}
.force-break {
  break-after: column;
}
</style>
