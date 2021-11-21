<template>
  <div class="doc-wrapper">
    <div id="latex-doc" class="doc">
      <h2>{{ t('doc.latex.reference') }}</h2>
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

          <LatexView formula="\frac{ab}{cd}" />
          <LatexView formula="\sqrt[n]{x}" />
          <LatexView display="\ceil{x}" formula="\lceil x \rceil" />
          <LatexView display="\floor{x}" formula="\lfloor x \rfloor" />
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">{{ t('doc.latex.mathsymbols') }}</h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>
          <LatexView formula="\times" />
          <LatexView formula="\div" />
          <LatexView formula="\forall" />
          <LatexView formula="\exists" />
          <LatexView formula="\partial" />
          <LatexView formula="\pm" />
          <LatexView display="\infinity" formula="\infty" />
          <LatexView formula="\approx" />
          <LatexView formula="\sim" />
          <LatexView formula="\neq" />
          <LatexView formula="\equiv" />
          <LatexView formula="\leq" />
          <LatexView formula="\geq" />
          <LatexView display="\left(" formula="(" />

          <LatexView display="\right)" formula=")" />
        </div>
        <div class="latex-table force-break">
          <h3 class="latex-table-title">{{ t('doc.latex.arrows') }}</h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>
          <LatexView formula="\Leftarrow" />
          <LatexView formula="\Rightarrow" />
          <LatexView formula="\Uparrow" />
          <LatexView formula="\Downarrow" />
          <LatexView formula="\leftarrow" />
          <LatexView formula="\rightarrow" />
          <LatexView formula="\uparrow" />
          <LatexView formula="\downarrow" />
          <LatexView formula="\leftrightarrow" />
          <LatexView formula="\updownarrow" />
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">
            {{ t('doc.latex.greekcapitalletter') }}
          </h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>
          <LatexView display="\Alpha" formula="A" />
          <LatexView display="\Beta" formula="B" />
          <LatexView formula="\Gamma" />
          <LatexView formula="\Delta" />
          <LatexView display="\Epsilon" formula="E" />
          <LatexView display="\Zeta" formula="Z" />
          <LatexView display="\Eta" formula="H" />
          <LatexView formula="\Theta" />
          <LatexView display="\Iota" formula="I" />
          <LatexView display="\Kappa" formula="K" />
          <LatexView formula="\Lambda" />
          <LatexView display="\Mu" formula="M" />
          <LatexView display="\Nu" formula="N" />
          <LatexView formula="\Xi" />
          <LatexView display="\Omicron" formula="O" />
          <LatexView formula="\Pi" />
          <LatexView display="\Rho" formula="P" />
          <LatexView formula="\Sigma" />
          <LatexView display="\Tau" formula="T" />
          <LatexView formula="\Upsilon" />
          <LatexView formula="\Phi" />
          <LatexView display="\Chi" formula="X" />
          <LatexView formula="\Psi" />
          <LatexView formula="\Omega" />
        </div>
        <div class="latex-table">
          <h3 class="latex-table-title">
            {{ t('doc.latex.greeksmallletter') }}
          </h3>
          <h4>{{ t('doc.latex.command') }}</h4>
          <h4>{{ t('doc.latex.output') }}</h4>
          <LatexView formula="\alpha" />
          <LatexView formula="\beta" />
          <LatexView formula="\gamma" />
          <LatexView formula="\delta" />
          <LatexView formula="\epsilon" />
          <LatexView formula="\zeta" />
          <LatexView formula="\eta" />
          <LatexView formula="\theta" />
          <LatexView formula="\iota" />
          <LatexView formula="\kappa" />
          <LatexView formula="\lambda" />
          <LatexView formula="\mu" />
          <LatexView formula="\nu" />
          <LatexView formula="\xi" />
          <LatexView formula="\omicron" />
          <LatexView formula="\pi" />
          <LatexView formula="\rho" />
          <LatexView formula="\sigma" />
          <LatexView formula="\tau" />
          <LatexView formula="\upsilon" />
          <LatexView formula="\phi" />
          <LatexView formula="\chi" />
          <LatexView formula="\psi" />
          <LatexView formula="\omega" />
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

  background: var(--transparent-fg-1); /*#ffffff20*/
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
