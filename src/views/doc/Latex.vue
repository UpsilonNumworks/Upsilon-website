<template>
  <div class="doc-wrapper">
    <div id="latex-doc" class="doc">
      <h1>{{ t('doc.latex.reference') }}</h1>
      <p>
        {{ t('doc.latex.description') }}
      </p>
      <p>
        {{ t('doc.latex.symbolslisted') }}
      </p>
      <div id="latex-tables">
        <div class="latex-table">
          <h3 class="latex-table-title">{{ t('doc.latex.functions') }}</h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>

          <LatexView :latex="true" formula="\frac{ab}{cd}" />
          <LatexView :latex="true" formula="\sqrt[n]{x}" />
          <LatexView
            :latex="true"
            display="\ceil{x}"
            formula="\lceil x \rceil"
          />
          <LatexView
            :latex="true"
            display="\floor{x}"
            formula="\lfloor x \rfloor"
          />
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">{{ t('doc.latex.mathsymbols') }}</h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>
          <LatexView display="\times" output="×" />
          <LatexView display="\div" output="÷" />
          <LatexView display="\forall" output="∀" />
          <LatexView display="\exists" output="∃" />
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
        </div>
        <div class="latex-table force-break">
          <h3 class="latex-table-title">{{ t('doc.latex.arrows') }}</h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>
          <LatexView display="\Leftarrow" output="⇐" />
          <LatexView display="\Rightarrow" output="⇒" />
          <LatexView display="\Uparrow" output="⇑" />
          <LatexView display="\Downarrow" output="⇓" />
          <LatexView display="\leftarrow" output="←" />
          <LatexView display="\rightarrow" output="→" />
          <LatexView display="\uparrow" output="↑" />
          <LatexView display="\downarrow" output="↓" />
          <LatexView display="\leftrightarrow" output="↔" />
          <LatexView display="\updownarrow" output="↕" />
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">
            {{ t('doc.latex.greekcapitalletter') }}
          </h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>
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
            {{ t('doc.latex.greeksmallletter') }}
          </h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>
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
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import LatexView from '@/components/LatexView.vue'
export default {
  name: '',
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
